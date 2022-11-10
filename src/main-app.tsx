import './wrap.css'
import Chessidea23 from './view'
import Chessideareplay23 from './idea_replay_view'
import { initial_fen } from 'lchessanalysis'


const App = () => {

  let fen = '__fen_circles__'
 
  let replay_fen = `${initial_fen}__fen_replay__`

  return (<>
    <div class='idea-wrap'>
      <Chessidea23 fen={fen} on_fen={_=> {console.log(_)}}/>
      <Chessideareplay23 shapes={''} fen={replay_fen} on_fen={_ => { console.log(_) }}/>
    </div>
      </>)
}


export default App
