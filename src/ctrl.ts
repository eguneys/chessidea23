import { Signal } from 'solid-js'
import { on, createEffect, mapArray, createSignal, createMemo } from 'solid-js'
import { colors, roles, initial_fen, dark_poss, light_poss } from 'solid-play'
import { Ref, make_drag_from_ref } from 'solid-play'
import { Vec2, vec2_poss } from 'solid-play'
import { Memo, write, read, owrite } from 'solid-play'
import { Shapes } from 'chessboard23'
import { DragEvent, EventPosition } from 'solid-play'
import { Color, Role, Board } from 'lchessanalysis'
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
    return [read(this._shapes).shapes, read(this._circles).shapes].join(' ')
  }

  get v_free_pieses() {
    return read(this._board).pieses
  }

  get i_free_piese() {
    return read(this._i_piece_on_board)
  }

  set i_free_piese(v: number) {
    owrite(this._i_piece_on_board, v)
  }

  ref_board: Ref
  ref_free: Ref

  _board: Signal<Board>
  _shapes: Signal<Shapes>
  _circles: Signal<Shapes>
  frees: Array<[Color, Role]>

  m_drag: Memo<string | undefined>

  _i_piece_on_board: Signal<number>

  constructor() {

    let _board = createSignal(Board.empty)
    this._board = _board


    let ref_board = Ref.make
    let ref_free = Ref.make

    this.ref_board = ref_board
    this.ref_free = ref_free

    let _shapes: Signal<Shapes> = createSignal(Shapes.make(), { equals: false })
    this._shapes = _shapes

    let _circles: Signal<Shapes> = createSignal(Shapes.make(), { equals: false })
    this._circles = _circles


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
          write(_circles, _ => _.drawing_circle('green', _pos))
        }
      }

      if (e._right) {
        if (e.m) {
          let _m_board_pos = ref_board.get_normal_at_abs_pos(e.m)!.scale(8)

          let _pos = vec2_poss(e_board_pos.floor)
          let _pos2 = vec2_poss(_m_board_pos.floor)
          if (_pos && _pos2 && _pos !== _pos2) {
            write(_shapes, _ => _.drawing_arrow('green', _pos, _pos2))
            write(_circles, _ => _.drawing_cancel())

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
        write(this._circles, _ => _.commit_drawing())
        write(this._shapes, _ => _.commit_drawing())
      }

      if (piece) {
        let piese = [piece, vec2_poss(pos)].join('@')
        owrite(this._board, _ => {
          if (_.pieses.length === 12) {
            return _
          }
          return _.clone.in(piese)
        })

        owrite(this._i_piece_on_board, read(this._board).pieses.indexOf(piese))
      }
      owrite(_drag_piece, undefined)
    }

    const on_click = (e: EventPosition, right: boolean) => {
      let pos = this.ref_board.get_normal_at_abs_pos(e)!.scale(8).floor

      if (right) {
        let _pos = vec2_poss(pos.floor)

      } else {

        owrite(this._board, _ => _.clone.out(vec2_poss(pos)))
      }
    }


    const on_context = () => {}

    make_drag_from_ref({ on_drag, on_up, on_click, on_context }, this.ref_board)
    make_drag_from_ref({ on_drag, on_up, on_context } , this.ref_free)

    let _i_piece_on_board: Signal<number> = createSignal(0)
    this._i_piece_on_board = _i_piece_on_board


    let m_piece_on_board = createMemo(() => {
      let _i = read(_i_piece_on_board)

      let pieses = read(this._board).pieses

      return pieses[_i]
    })

    let m_shapes_by_pieses: Memo<Array<[string, Shapes]>> = 
      createMemo(mapArray(() => read(this._board).pieses, _ => [_, Shapes.make()] as [string, Shapes]))

    let m_current_shapes = createMemo(() => {
      let _piece_on_board = m_piece_on_board()
      return m_shapes_by_pieses().find(_ => _[0] === _piece_on_board)
    })


    createEffect(on(m_current_shapes, m => {
      if (m) {
        owrite(_shapes, m[1])
      }
    }))


    let m_rules_by_pieses: Memo<Array<string>> = () => {
      read(_shapes)
      let circles = read(_circles)
      let pieses = read(_board).pieses
      return m_shapes_by_pieses().map(([piese, shapes]) =>
        make_rules(piese, pieses, shapes.arrow_shapes, circles.circle_shapes))
    }

    m_log(m_rules_by_pieses)
  }

}

const make_rules = (piese: string, pieses: Array<string>, arrows: string, circles: string) => {

  let [base_piese, base_pos] = piese.split('@')

  let _circles = circles === '' ? [] : circles.split(' ').map(_ => _.split('@')[1])
  let _ps = pieses.map(_ => _.split('@'))
  let _as = arrows === '' ? [] : arrows.split(' ').map(_ => _.split('@')[1].split(','))


  let _p_map = new Map<string, string>([
    ..._circles.map((pos, i) => [pos, `f_${i}`] as [string, string]),
    ..._ps.map(([wn, pos], i) => [pos, `${wn}_${i}`] as [string, string])
  ])

  let _first = _as.filter(_ => _[0] === base_pos)

  let _second = _first.flatMap(_ => _as.filter(_a => _a[0] === _[1]))
  let _third = _second.flatMap(_ => _as.filter(_a => _a[0] === _[1]))


  let _only_second = _second.filter(_ => !_third.find(_t => _t[0] === _[1]))
  let _only_first = _first.filter(_ => !_second.find(_t => _t[0] === _[1]))

  let _full_only_second = _only_second.map(_ => [_first.find(_f => _f[1] === _[0])![0], ..._])

  let _full_second = _second.map(_ => [_first.find(_f => _f[1] === _[0])![0], ..._])
  let _full_third = _third.map(_ => [..._full_second.find(_f => _f[2] === _[0])!.slice(0, 2), ..._])

  let _first_rules = _only_first.flatMap(([_a, _b]) => {
    let a = _p_map.get(_a),
      b = _p_map.get(_b)

    if (a && b) {
      return [[a, b]]
    }
    return []
  })


  let _second_rules = _full_only_second.flatMap(([_a, _b, _c]) => {
    let a = _p_map.get(_a),
      b = _p_map.get(_b),
      c = _p_map.get(_c)

    if (a && b && c) {
      return [[a, b, c]]
    }
    return []
  })

  let _third_rules = _full_third.flatMap(([_a, _b, _c, _d]) => {
    let a = _p_map.get(_a),
      b = _p_map.get(_b),
      c = _p_map.get(_c),
      d = _p_map.get(_d)

    if (a && b && c && d) {
      return [[a, b, c, d]]
    }
    return []
  })

  return [
    ..._first_rules.map(_ => _.join('->')), 
    ..._second_rules.map(_ => _.join('->')), 
    ..._third_rules.map(_ => _.join('->'))].join(' ')
}
