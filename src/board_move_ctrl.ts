import { Signal, createSignal, createMemo } from 'solid-js'
import { Memo, read, write, owrite } from 'solid-play'
import { m_log, Vec2, DragEvent, EventPosition, Ref, make_drag_from_ref, vec2_poss, vec2_orientation } from 'solid-play'
import { UCI, BoardFen, Pos, Piese, Color, initial_fen, MobileSituation, Board } from 'lchessanalysis'

export type Hooks = {
  on_move: (_: UCI) => void
}

export class _Chessboardmove {

  set allowed_ods(_: Array<UCI>) {
    owrite(this._allowed_ods, _)
  }

  get drag() {
    return this.m_drag()
  }

  set fen(_: string) {
    owrite(this._board, Board.from_fen(_ as BoardFen))
  }

  get fen() {
    let _pieses = this.m_board().pieses

    let orig = this.m_drag_piese()

    if (orig) {
      let i = _pieses.findIndex(_ => _ === orig)
      if (i !== -1) {
        let [piece, at] = orig.split('@')
        let ghost = [[piece, 'ghost'].join(','), at].join('@')
        _pieses.splice(i, 1, ghost)
      }
    }

    return [this.m_orientation(), ..._pieses].join(' ')
  }

  onScroll() {
    this.ref_board.$clear_bounds()
  }


  ref_board: Ref

  m_drag: Memo<string | undefined>
  m_board: Memo<Board>
  m_orientation: Memo<Color>
  m_drag_piese: Memo<string| undefined>

  _board: Signal<Board>
  _allowed_ods: Signal<Array<UCI>>

  constructor(hooks: Hooks) {
    let ref_board = Ref.make
    this.ref_board = ref_board

    let _orientation: Signal<Color> = createSignal('w')
    let m_orientation = createMemo(() => read(_orientation))
    this.m_orientation = m_orientation

    let _board = createSignal(Board.empty, { equals: false })
    let m_board = () => read(_board)
    this._board = _board
    this.m_board = m_board

    let _allowed_ods: Signal<Array<UCI>> = createSignal([])
    this._allowed_ods = _allowed_ods
    let m_allowed_ods: Memo<Array<UCI>> = createMemo(() => read(_allowed_ods))

    let _drag_piece: Signal<[string, Vec2] | undefined> = createSignal(undefined, { equals: false })
    this.m_drag = createMemo(() => {
      let _ = read(_drag_piece)
      if (_) {
        let [piese, pos] = _
        return [piese.split('@')[0], pos.vs.join(',')].join('@')
      }
      return undefined
    })

    this.m_drag_piese = createMemo(() => read(_drag_piece)?.[0])


    const on_drag = (e: DragEvent, e0?: DragEvent) => {
      let e_board_pos = ref_board.get_normal_at_abs_pos(e.e)!.scale(8)
      if (e.m) {
        let _m_board_pos = ref_board.get_normal_at_abs_pos(e.m)!.scale(8)

        if (!e0?.m) {
          let orig = vec2_poss(e_board_pos.floor) as Pos
          let _board_piece = m_board().on(orig)

          if (_board_piece) {
            owrite(_drag_piece, [[_board_piece, orig].join('@'), _m_board_pos])
          }
        } else {
          write(_drag_piece, _ => {
            if (_) {
              _[1] = _m_board_pos
            }
          })
        }
      }
    }


    const on_up = (e: EventPosition, right: boolean) => {
      let pos = this.ref_board.get_normal_at_abs_pos(e)!.scale(8).floor
      let piese = read(_drag_piece)?.[0]

      if (piese) {
        let orig = piese.split('@')[1] as Pos
        let dest = vec2_poss(vec2_orientation(pos, m_orientation()))
        let piece = piese.split('@')[0]
        if (dest) {
          let od = `${orig}${dest}` as UCI

          if (m_allowed_ods().includes(od)) {
            hooks.on_move(od)
            let in_piese = [piece, dest].join('@')
            write(_board, _ => {
              _.out(orig as Pos)
              .in(in_piese as Piese)
            })
          }
        }
      }

      owrite(_drag_piece, undefined)
    }

    const on_context = () => {}

    make_drag_from_ref({ on_drag,
                       on_up,
                       on_context }, this.ref_board)


  }

}
