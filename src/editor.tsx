import { Component } from 'solid-js'
import { Chessboard23 } from 'chessboard23'
import { _Chesseditor23 } from './editor_ctrl'


const Editor23: Component<{}> = (props) => {

  let ctrl = new _Chesseditor23()


  return (<>
     <div class='chesseditor23'>
       <div class='free-pieses'>
       </div>
       <div class='board-wrap'>
       </div>
     </div>
      </>)
}

export default Editor23
