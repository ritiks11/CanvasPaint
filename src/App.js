import React, { useState } from "react";
import Header from "./component/Header";
import Toolbar from "./component/Toolbar";
import Canvas from "./component/Canvas";
import "./App.css";

function App() {
  const [tool, setTool] = useState("brush");
  const [color, setColor] = useState("#000000");
  const [thickness, setThickness] = useState(5);
  const [fill, setFill] = useState("#ffffff");

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
          fill={fill}
          setFill={setFill}
        />
        <Canvas tool={tool} color={color} thickness={thickness} fill={fill} />
      </div>
    </div>
  );
}

export default App;
