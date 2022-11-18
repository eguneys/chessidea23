import './wrap.css'
import Chessidea23 from './view'
import Chessideareplay23 from './idea_replay_view'
import { MobileSituation, TreeBuilder, FlatTree, initial_fen } from 'lchessanalysis'


const App = () => {

  let fen = '__fen_circles__'
    fen = '8/8/3N4/6q1/8/8/8/8__fen_circles__green-circle@d6 green-circle@e5 __fen_circles__wn@d6__piese_shapes__ green-arrow@d6,e6 green-arrow@e6,e5 green-arrow@e5,f4__shapes_by_pieses__bq@g5__piese_shapes__ green-arrow@g5,g4 green-arrow@g4,g3__fen_circles__1'
 
  let root = TreeBuilder.apply(MobileSituation.from_fen(initial_fen), ['e2e4', 'd7d5'])
  let flat_doc = FlatTree.apply(root)

  return (<>
    <div class='idea-wrap'>
      <Chessidea23 fen={fen} on_fen={_=> console.log(_)} on_rules = { _ => console.log(_)}/>
      <Chessideareplay23 on_path={_ => {}} on_nodes={_ => {} } shapes={''} nodes={flat_doc} path=''/>
    </div>
      </>)
}


export default App
