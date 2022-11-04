import { Chessboard23 } from 'chessboard23'
import Chessreplay23 from 'chessreplay23'
import { onScrollHandlers, set_$ref } from 'solid-play'
import { _Chessideareplay23 } from './idea_replay_ctrl'

export default function (props: {}) {

  let ctrl = new _Chessideareplay23()
  onScrollHandlers(ctrl)

  return (<>
     <div class='chessideareplay23'>
       <div ref={set_$ref(ctrl.ref_board)} class='board-wrap'>
         <Chessboard23 shapes={''} drag={ctrl.drag} fen={ctrl.fen}/>
       </div>
       <div class='replay-wrap'>
         <Chessreplay23 moves={ctrl.replay} />
       </div>
 
     </div>
      </>)
}
