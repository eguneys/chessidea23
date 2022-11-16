import { batch, Signal, createMemo, createSignal } from 'solid-js'
import { m_log, vec2_poss, Vec2, read, write, owrite, DragEvent, EventPosition, Memo, Ref, make_drag_from_ref, make_wheel_from_ref } from 'solid-play'
import { UCI, Path, Board, MobileSituation, initial_fen } from 'lchessanalysis'
import { Shapes } from 'chessboard23'
import { FlatDoc, Node, FlatTree } from 'lchessanalysis'


export class _Chessideareplay23 {


  get board_fen() {
    return ''
  }

  get allowed_ods() {
    return []
  }

  get replay_moves() {
    return []
  }

  on_click(path: string) {
    owrite(this._path, path as Path)
  }

  on_move(uci: UCI) {
  }

  get path() {
    return read(this._path)
  }

  onScroll() {
  }

  board_ref: Ref

  _path: Signal<Path | ''>
  _root: Signal<Node>

  constructor(docs: FlatDoc) {

    this._root = createSignal(FlatTree.read(docs), { equals: false })

    this._path = createSignal('')

    let board_ref = Ref.make
    this.board_ref = board_ref

    const on_wheel = (dir: number) => {
    }

    make_wheel_from_ref({ on_wheel }, board_ref)
  }

}
