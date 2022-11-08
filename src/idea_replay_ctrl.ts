import { Signal, createMemo, createSignal } from 'solid-js'
import { vec2_poss, Vec2, read, write, owrite, DragEvent, EventPosition, Memo, Ref, make_drag_from_ref } from 'solid-play'
import { Board, MobileSituation, initial_fen } from 'lchessanalysis'

export class _Chessideareplay23 {

  on_move(_: string) {
  }

  get fen() {
    return initial_fen
  }


  get allowed_ods() {
    return ""
  }

  get replay_moves() {
    return []
  }

  onScroll() {
  }

  constructor() {

  }

}
