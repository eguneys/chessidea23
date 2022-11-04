import { For } from 'solid-js'
import { _Chessidea23 } from './ctrl'
import { Chessboard23 } from 'chessboard23'
import { Color, Role, color_long, role_long } from 'solid-play'
import { onScrollHandlers, set_$ref } from 'solid-play'

const active = (v: boolean) => v ? 'active': ''

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
           <div class='free-pieses'>
             <For each={ctrl.v_free_pieses}>{ ([color, role], i) =>
               <div onClick={_ => ctrl.i_free_piese = i()} class={[active(i() === ctrl.i_free_piese), 'selectable-piese'].join(' ')}>
                 <div class={['piese', color_long[color as Color], role_long[role as Role]].join(' ')}></div>
               </div>
             }</For>
             <For each={[...Array(12 - ctrl.v_free_pieses.length).keys()]}>{ _ =>
                <div class="piese"></div>
             }</For>
           </div>
       </div>
     </div>
   </>)
}
