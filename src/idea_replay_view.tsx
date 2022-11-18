import { batch, createEffect, Show } from 'solid-js'
import { Chessboard23 } from 'chessboard23'
import Chessreplay23 from 'chessreplay23'
import { onScrollHandlers, set_$ref } from 'solid-play'
import { _Chessideareplay23 } from './idea_replay_ctrl'
import Chessboardmove from './board_move'
import { FlatDoc, Path } from 'lchessanalysis'

export default function (props: { on_path: (_: Path | '') => void, shapes: string, on_nodes: (_: FlatDoc) => void, nodes: FlatDoc, path: Path | '' }) {

  let ctrl = new _Chessideareplay23(props.nodes, props.path)
  onScrollHandlers(ctrl)

  createEffect(() => {
    props.on_path(ctrl.path)
      })

  createEffect(() => {
      batch(() => {
          ctrl.nodes = props.nodes
          ctrl.path = props.path
          })
      })
  createEffect(() => props.on_nodes(ctrl.on_nodes))

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
