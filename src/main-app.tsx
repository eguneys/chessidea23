import './wrap.css'
import Chessidea23 from './view'
import Chessideareplay23 from './idea_replay_view'
import { MobileSituation, TreeBuilder, FlatTree, initial_fen } from 'lchessanalysis'


const App = () => {

  let fen = '__fen_circles__'
 
  let replay_fen = `${initial_fen}__fen_replay__`

  let root = TreeBuilder.apply(MobileSituation.from_fen(initial_fen), ['e2e4', 'd7d5'])
  let flat_doc = FlatTree.apply(root)

  return (<>
    <div class='idea-wrap'>
      <Chessidea23 fen={fen} on_fen={_=> {}}/>
      <Chessideareplay23 shapes={''} nodes={flat_doc} path=''/>
    </div>
      </>)
}


export default App
