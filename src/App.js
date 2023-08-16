import logo from "./logo.svg";
import "./App.css";
import { Canvas } from "./component/Dragable/Canvas";
import "./assets/theme.scss";
import EditorComponent from "./component/Dragable/Editor";

function App() {
  return (
    <div className="App">
      <Canvas />
      {/* <EditorComponent /> */}
    </div>
  );
}

export default App;
