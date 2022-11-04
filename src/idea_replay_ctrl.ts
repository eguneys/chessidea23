import { Signal, createMemo, createSignal } from 'solid-js'
import { vec2_poss, Vec2, read, write, owrite, DragEvent, EventPosition, Memo, Ref, make_drag_from_ref } from 'solid-play'
import { Board, MobileSituation, initial_fen } from 'lchessanalysis'

export class _Chessideareplay23 {

  onScroll() {
  }

  ref_board: Ref

  get drag() {
    return this.m_drag()
  }

  get fen() {
    return this.m_board().pieses.join(' ')
  }

  get replay() {
    return []
  }

  m_board: Memo<Board>
  m_drag: Memo<string | undefined>

  constructor() {
    let ref_board = Ref.make
    this.ref_board = ref_board

    let _drag_piece: Signal<[string, Vec2] | undefined> = createSignal()
    this.m_drag = createMemo(() => {
      let _ = read(_drag_piece)
      if (_) {
        let [piece, pos] = _
        return [piece, pos.vs.join(',')].join('@')
      }
      return undefined
    })



    let m_situation = createMemo(() => MobileSituation.from_fen(initial_fen))
    this.m_board = createMemo(() => m_situation().board)

    const on_drag = (e: DragEvent, e0?: DragEvent) => {
      let e_board_pos = ref_board.get_normal_at_abs_pos(e.e)!.scale(8)
      if (e.m) {
        let _m_board_pos = ref_board.get_normal_at_abs_pos(e.m)!.scale(8)

        if (!e0?.m) {
          let _board_piece = this.m_board().on(vec2_poss(_m_board_pos.floor))

          if (_board_piece) {
            owrite(_drag_piece, [_board_piece, _m_board_pos])
          }
        } else {
          owrite(_drag_piece, _ => _ && [_[0], _m_board_pos])
        }
      }
    }


    const on_up = (e: EventPosition, right: boolean) => {
      let pos = this.ref_board.get_normal_at_abs_pos(e)!.scale(8).floor
      let piece = read(_drag_piece)?.[0]

      if (piece) {
      }

      owrite(_drag_piece, undefined)
    }

    const on_context = () => {}

    make_drag_from_ref({ on_drag,
                       on_up,
                       on_context }, this.ref_board)


  }
}
