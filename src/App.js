import logo from "./logo.svg";
import "./App.css";
import { Canvas } from "./component/Dragable/Canvas";
import "./assets/theme.scss";
import { Card } from "./core-component/Card";
import { Table } from "./core-component/Table";

function App() {
  return (
    <div className="App">
      <Canvas />
    </div>
  );
}

export default App;
