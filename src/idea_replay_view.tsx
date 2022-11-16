import { createEffect, Show } from 'solid-js'
import { Chessboard23 } from 'chessboard23'
import Chessreplay23 from 'chessreplay23'
import { onScrollHandlers, set_$ref } from 'solid-play'
import { _Chessideareplay23 } from './idea_replay_ctrl'
import Chessboardmove from './board_move'
import { FlatDoc } from 'lchessanalysis'

export default function (props: { shapes: string, nodes: FlatDoc }) {

  let ctrl = new _Chessideareplay23(props.nodes)
  onScrollHandlers(ctrl)


  return (<>
     <div class='chessideareplay23'>
       <div ref={set_$ref(ctrl.board_ref)} class='board-move-wrap'>
       <Chessboardmove shapes={props.shapes} fen={ctrl.board_fen} on_move={_ => { ctrl.on_move(_) }} allowed_ods={ctrl.allowed_ods}/>
       </div>
       <div class='replay-wrap'>
         <Chessreplay23 on_path={ctrl.path} on_click={_ => ctrl.on_click(_)} moves={ctrl.replay_moves}/>
       </div>
     </div>
   </>)
}
