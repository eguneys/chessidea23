import { createEffect } from 'solid-js'
import { Chessboard23 } from 'chessboard23'
import { onScrollHandlers, set_$ref } from 'solid-play'
import { _Chessboardmove } from './board_move_ctrl'


export default function (props: { shapes: string, fen: string, on_move: (_: string) => void, allowed_ods: string }) {

  let ctrl = new _Chessboardmove({
    on_move: (_: string) => {
    props.on_move(_)
    }
  })
  onScrollHandlers(ctrl)

  createEffect(() => { ctrl.fen = props.fen })
  createEffect(() => { ctrl.allowed_ods = props.allowed_ods })

  return (<>
      <div ref={set_$ref(ctrl.ref_board)} class='board-wrap'>
        <Chessboard23 shapes={props.shapes} drag={ctrl.drag} fen={ctrl.fen}/>
      </div>
</>)
}
