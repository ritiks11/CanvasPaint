import React, { useState } from "react";
import Header from "./component/Header";
import Toolbar from "./component/Toolbar";
import Canvas from "./component/Canvas";
import "./App.css";

function App() {
  const [tool, setTool] = useState("brush");
  const [color, setColor] = useState("#000000");
  const [thickness, setThickness] = useState(5);

  return (
    <div className="App">
      <Header />
      <div className="toolCanvas">
        <Toolbar
          tool={tool}
          setTool={setTool}
          color={color}
          setColor={setColor}
          thickness={thickness}
          setThickness={setThickness}
        />
        <Canvas tool={tool} color={color} thickness={thickness} />
      </div>
    </div>
  );
}

export default App;
