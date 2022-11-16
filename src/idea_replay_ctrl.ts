import { batch, Signal, createMemo, createSignal } from 'solid-js'
import { m_log, vec2_poss, Vec2, read, write, owrite, DragEvent, EventPosition, Memo, Ref, make_drag_from_ref, make_wheel_from_ref } from 'solid-play'
import { OD, UCI, Path, Board, MobileSituation, initial_fen } from 'lchessanalysis'
import { Shapes } from 'chessboard23'
import { init, FlatDoc, Node, FlatTree } from 'lchessanalysis'

const replay_convert = (d: FlatDoc) => {
  let [root, rest] = d
  return rest.map(_ => {
    let [path, node] = _
    let uci = node.uci
    let comment = ''
   return `${path} ${uci} {${comment}}` 
  })
}

export class _Chessideareplay23 {

  get on_nodes() {
    return FlatTree.apply(read(this._root))
  }

  get board_fen() {
    return this.m_node().fen
  }

  get allowed_ods() {
    return this.m_situation().ods
  }

  get replay_moves() {
    return this.m_replay_moves()
  }

  on_click(path: string) {
    owrite(this._path, path as Path)
  }

  on_move(uci: UCI) {
    let move = this.m_situation().od(uci as OD)

    if (move) {
      let [s] = move

      let new_node = Node.make_branch(s.fen, uci)
      let path = read(this._path)
      write(this._root, _ => path = _.add_node(new_node, path)!)
      owrite(this._path, path)

    }
  }

  get path() {
    return read(this._path)
  }

  onScroll() {
  }

  board_ref: Ref

  _path: Signal<Path | ''>
  _root: Signal<Node>

  m_node: Memo<Node>
  m_situation: Memo<MobileSituation>
  m_replay_moves: Memo<Array<string>>

  constructor(docs: FlatDoc, path: Path | '') {

    this._root = createSignal(FlatTree.read(docs), { equals: false })

    this._path = createSignal(path)

    this.m_node = createMemo(() => read(this._root).node_at_path_or_undefined(read(this._path))!)
    this.m_situation = createMemo(() => MobileSituation.from_fen(this.m_node().fen))

    this.m_replay_moves = createMemo(() => replay_convert(FlatTree.apply(read(this._root))))

    let board_ref = Ref.make
    this.board_ref = board_ref

    const on_wheel = (dir: number) => {
      if (dir < 0) {
        owrite(this._path, _ => init(_))
      } else {

        let _up = this.m_node().children[0]

        if (_up) {
          owrite(this._path, _ => _ + _up.id)
        }
      }
    }

    make_wheel_from_ref({ on_wheel }, board_ref)
  }

}
