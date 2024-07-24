import React from "react";
import "../../src/App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowTurnDown } from "@fortawesome/free-solid-svg-icons";
import { jsPDF } from "jspdf";

function Toolbar({
  tool,
  setTool,
  color,
  setColor,
  thickness,
  setThickness,
  canvasRef,
}) {
  const exportPDF = () => {
    const canvas = canvasRef.current;
    if (canvas) {
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
    } else {
      console.error("Canvas reference is not defined.");
    }
  };

  return (
    <aside className="toolContainer">
      <div className="colorPickerText">
        <div>
          choose your color!{" "}
          <FontAwesomeIcon icon={faArrowTurnDown} className="arrowIcons" />
        </div>

        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="colorPickerBox"
        />
      </div>

      <div className="tools">
        <div className="colorPickerText">
          <div>
            use these tools{" "}
            <FontAwesomeIcon icon={faArrowTurnDown} className="arrowIcons" />
          </div>
          <select
            className="dropDown"
            value={tool}
            onChange={(e) => setTool(e.target.value)}
          >
            <option value="brush">Brush</option>
            <option value="rectangle">Rectangle</option>
            <option value="circle">Circle</option>
            <option value="line">Line</option>
            <option value="eraser">Eraser</option>
          </select>
        </div>
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
