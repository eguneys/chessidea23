import { batch, Signal, createMemo, createSignal } from 'solid-js'
import { m_log, vec2_poss, Vec2, read, write, owrite, DragEvent, EventPosition, Memo, Ref, make_drag_from_ref, make_wheel_from_ref } from 'solid-play'
import { Replay, Board, MobileSituation, initial_fen } from 'lchessanalysis'
import { Shapes } from 'chessboard23'

export type OD = string
function playMoves(situation: MobileSituation, moves: Array<OD>): MobileSituation {
  let move = moves.shift()

  if (move) {
    return playMoves(situation.od(move)[0], moves)
  }
  return situation
}

const make_replay_fen = (moves: string) => {
  let __ = moves.split('\n')
  return __.map(_ => {
    let [path, data] = _.split('_separator_')
    let [,_data] = data.match(/\{(.*)\}/)!
    let [_uci] = _data.split(' ')

    return [path, _uci].join(' ')
  })
}


export class _Chessideareplay23 {


  get fen() {
    let replay = read(this._replay)?.replay
    if (!replay) {
      return this.board_fen
    }

    return [this.board_fen, replay].join('__fen_replay__')
  }

  set fen(_: string) {
    let [fen, replay] = _.split('__fen_replay__')



    if (replay)  {
      batch(() => {
        owrite(this._replay, Replay.from_fen(replay))
        owrite(this._initial_fen, fen)
      })
    } else {
      owrite(this._initial_fen, fen)
    }


  }


  on_click(path: string) {
    owrite(this._path, path)
  }

  on_move(od: string) {
    let path
    owrite(this._replay, _ => {
      let _path = read(this._path)
      if (_) {
        if (_path) {
          path = _.play_ucis(_path, od)
        } else {
          let res = Replay.from_fen(od)
          path = res.root.path
          return res
        }
        return _
      } else {
        let res = Replay.from_fen(od)
        path = res.root.path
        return res
      }
    })
    if (path) {
      owrite(this._path, path)
    }
  }

  get path() {
    return read(this._path)
  }

  get board_fen() {
    return this.m_situation().board.fen
  }

  get allowed_ods() {
    return this.m_situation().ods.join(' ')
  }

  get replay_moves() {
    let replay = read(this._replay)?.replay

    if (replay) {
      return make_replay_fen(replay)
    }
    return []
  }

  onScroll() {
  }

  board_ref: Ref

  m_situation: Memo<MobileSituation>
  _replay: Signal<Replay | undefined>
  _path: Signal<string | undefined>
  _initial_fen: Signal<string>

  constructor() {
    let board_ref = Ref.make
    this.board_ref = board_ref

    let _path: Signal<string | undefined> = createSignal()
    this._path = _path

    let _replay: Signal<Replay | undefined> = createSignal(undefined, { equals: false })
    this._replay = _replay

    let m_moves = createMemo(() => {
      let path = read(_path)
      if (path) {
        return read(_replay)?.follow_path(path).reduce((acc, node) => !acc ? node.uci : [acc, node.uci].join(' '), '') || ''
      }
      return ''
    })

    let _initial_fen = createSignal(initial_fen)
    this._initial_fen = _initial_fen

    let m_situation = createMemo(() =>
      playMoves(MobileSituation.from_fen(read(_initial_fen)), m_moves().split(' '))
    )
    this.m_situation = m_situation

    const on_wheel = (dir: number) => {
      if (dir < 0) {
        owrite(_path, _ => !_ || _.length === 2 ? undefined : _.slice(0, -2))
      } else {
        owrite(_path, _ => {
          let replay = read(_replay)
          if (replay) {
            if (!_) {
              return replay.root.path
            }
            let extra =  replay.find_path(_)?.children[0]?.path
            if (extra) {
              return _ + extra
            } else {
              return _
            }
          } else {
            return undefined
          }
        })
      }
    }

    make_wheel_from_ref({ on_wheel }, board_ref)
  }

}
