import { For } from 'solid-js'
import { _Chessidea23 } from './ctrl'
import Chessreplay23 from 'chessreplay23'
import { Chessboard23 } from 'chessboard23'
import { some_replay } from 'solid-play'
import { color_long, role_long } from 'solid-play'
import { onScrollHandlers, set_$ref } from 'solid-play'

export default function (props: {}) {


  let ctrl = new _Chessidea23()


    onScrollHandlers(ctrl)

  return (<>
      <div class='chessidea23'>
         <div class='editor'>
           <div ref={set_$ref(ctrl.ref_free)} class='free-pieses'>
             <For each={ctrl.frees}>{ ([color, role]) =>
               <div class={['piese', color_long[color], role_long[role]].join(' ')}></div>
             }</For>
           </div>
           <div ref={set_$ref(ctrl.ref_board)} class='board-wrap'>
             <Chessboard23 shapes={ctrl.shapes} drag={ctrl.m_drag()} fen={ctrl.fen}/>
           </div>
         </div>
         <div class='replay-wrap'>
           <Chessreplay23 moves={some_replay} />
         </div>
      </div>
      </>)
}
