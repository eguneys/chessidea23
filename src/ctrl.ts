import { Signal } from 'solid-js'
import { createSignal, createMemo } from 'solid-js'
import { Color, Role, colors, roles, initial_fen, dark_poss, light_poss } from 'solid-play'
import { Ref, make_drag_from_ref } from 'solid-play'
import { Vec2, vec2_poss } from 'solid-play'
import { Memo, write, read, owrite } from 'solid-play'
import { Shapes } from 'chessboard23'
import { DragEvent, EventPosition } from 'solid-play'
import { Board } from 'lchessanalysis'
import { m_log } from 'solid-play'


export class _Chessidea23 {

  onScroll() {
    this.ref_board.$clear_bounds()
    this.ref_free.$clear_bounds()
  }

  get fen() {
    return 'w ' + read(this._board).pieses.join(' ')
  }

  get shapes() {
    return read(this._shapes).shapes
  }

  ref_board: Ref
  ref_free: Ref

  _board: Signal<Board>
  _shapes: Signal<Shapes>
  frees: Array<[Color, Role]>

  m_drag: Memo<string | undefined>

  constructor() {

    let _board = createSignal(Board.empty)
    this._board = _board

    let ref_board = Ref.make
    let ref_free = Ref.make

    this.ref_board = ref_board
    this.ref_free = ref_free

    let _shapes: Signal<Shapes> = createSignal(Shapes.make(), { equals: false })
    this._shapes = _shapes

    let _drag_piece: Signal<[string, Vec2] | undefined> = createSignal()
    this.m_drag = createMemo(() => {
      let _ = read(_drag_piece)
      if (_) {
        let [piece, pos] = _
        return [piece, pos.vs.join(',')].join('@')
      }
      return undefined
    })

    let frees = colors .flatMap(color => 
                                (color === 'w' ? roles : 
                                 roles.slice(0).reverse())
                                .map(role => [color, role] as [Color, Role]))
    this.frees = frees

    const on_drag = (e: DragEvent, e0?: DragEvent) => {
      let e_board_pos = ref_board.get_normal_at_abs_pos(e.e)!.scale(8)

      if (e._right && !e0 && !e.m) {
        let _pos = vec2_poss(e_board_pos.floor)
        if (_pos) {
          write(_shapes, _ => _.drawing_circle('green', _pos))
        }
      }

      if (e._right) {
        if (e.m) {
          let _m_board_pos = ref_board.get_normal_at_abs_pos(e.m)!.scale(8)

          let _pos = vec2_poss(e_board_pos.floor)
          let _pos2 = vec2_poss(_m_board_pos.floor)
          if (_pos && _pos2 && _pos !== _pos2) {
            write(_shapes, _ => _.drawing_arrow('green', _pos, _pos2))

          }
        }
      } else {
        if (e.m) {

          let _m_board_pos = ref_board.get_normal_at_abs_pos(e.m)!.scale(8)

          if (!e0?.m) {
            let piece

            let _board_piece = read(this._board).on(vec2_poss(_m_board_pos.floor))
            if (_board_piece) {
              piece = _board_piece
            } else {
              let _ = ref_free.get_normal_at_abs_pos(e.m)!.scale(frees.length).floor
              piece = frees[_.x].join('')
            }

            owrite(_drag_piece, [piece, _m_board_pos])
          } else {
            owrite(_drag_piece, _ => _ && [_[0], _m_board_pos])
          }
        }
      }
    }


    const on_up = (e: EventPosition, right: boolean) => {
      let pos = this.ref_board.get_normal_at_abs_pos(e)!.scale(8).floor
      let piece = read(_drag_piece)?.[0]

      if (right) {
        write(this._shapes, _ => _.commit_drawing())
      }

      if (piece) {
        owrite(this._board, _ => _.clone.in([piece, vec2_poss(pos)].join('@')))
      }
      owrite(_drag_piece, undefined)
    }

    const on_click = (e: EventPosition, right: boolean) => {
      let pos = this.ref_board.get_normal_at_abs_pos(e)!.scale(8).floor

      if (right) {
        let _pos = vec2_poss(pos.floor)

      } else {

        owrite(this._board, _ => _.clone.out(vec2_poss(pos)))
        //owrite(this._shapes, Shapes.make())
      }
    }


    const on_context = () => {}


    make_drag_from_ref({ on_drag, on_up, on_click, on_context }, this.ref_board)
    make_drag_from_ref({ on_drag, on_up, on_context } , this.ref_free)
  }

}
