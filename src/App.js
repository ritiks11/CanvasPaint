import React, { useState, useRef } from "react";
import Header from "./component/Header";
import Toolbar from "./component/Toolbar";
import Canvas from "./component/Canvas";
import "./App.css";

function App() {
  const [tool, setTool] = useState("brush");
  const [color, setColor] = useState("#000000");
  const [thickness, setThickness] = useState(3);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const canvasRef = useRef(null);

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
          canvasRef={canvasRef}
          setIsModalOpen={setIsModalOpen}
        />
        <Canvas
          tool={tool}
          color={color}
          thickness={thickness}
          canvasRef={canvasRef}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      </div>
    </div>
  );
}

export default App;
