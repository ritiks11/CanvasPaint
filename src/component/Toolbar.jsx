import React, { useState, useRef } from "react";
import "../../src/App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowTurnDown } from "@fortawesome/free-solid-svg-icons";
import { faPaintBrush } from "@fortawesome/free-solid-svg-icons";
import { jsPDF } from "jspdf";

function Toolbar({ tool, setTool, color, setColor, thickness, setThickness }) {
  const canvasRef = useRef(null);

  const canvas = canvasRef.current;
  const exportPDF = () => {
    const pdf = new jsPDF("landscape");
    pdf.addImage(
      canvas.toDataURL("image/png"),
      "PNG",
      0,
      0,
      pdf.internal.pageSize.width,
      pdf.internal.pageSize.height
    );
    pdf.save("canvas.pdf");
  };
  return (
    <aside className="toolContainer">
      <p className="colorPickerText">
        choose your color!{" "}
        <FontAwesomeIcon icon={faArrowTurnDown} className="arrowIcons" />
      </p>
      <input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        className="colorPickerBox"
      />
      <div className="tools">
        <p className="colorPickerText">
          use these tools{" "}
          <FontAwesomeIcon icon={faArrowTurnDown} className="arrowIcons" />
        </p>
        <select
          className="dropDown"
          value={tool}
          onChange={(e) => setTool(e.target.value)}
        >
          <option value="brush">Brush</option>
          <option value="rectangle">Rectangle</option>
          <option value="circle">Circle</option>
          <option value="line">Line</option>
          <option value="text">Text</option>
          <option value="eraser">Eraser</option>
        </select>
      </div>

      <div className="thickness">
        <p className="colorPickerText">
          Thickness{" "}
          <FontAwesomeIcon icon={faArrowTurnDown} className="arrowIcons" />
        </p>
        <input
          type="range"
          min="1"
          max="50"
          value={thickness}
          onChange={(e) => setThickness(e.target.value)}
          className="thicknessbar"
        />
      </div>

      <div className="exportBtn">
        <button onClick={exportPDF} className="btnTitle">
          Export as PDF
        </button>
      </div>
    </aside>
  );
}

export default Toolbar;
