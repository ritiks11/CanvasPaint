import React, { useRef, useState, useEffect } from "react";
import * as fabric from "fabric"; // v6
import "../../src/App.css";

function Canvas({ tool, color, thickness, canvasRef }) {
  const [fabricCanvas, setFabricCanvas] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasInput, setHasInput] = useState(false);

  useEffect(() => {
    if (!canvasRef.current || fabricCanvas) return;

    const canvasElement = canvasRef.current;
    const fabricCanvasInstance = new fabric.Canvas(canvasElement);
    setFabricCanvas(fabricCanvasInstance);

    const viewportWidth = window.outerWidth;
    const viewportHeight = window.outerHeight;
    let displayWidth, displayHeight;

    if (viewportWidth > 1024) {
      displayWidth = 1100;
      displayHeight = 550;
    } else if (viewportWidth > 768) {
      displayWidth = 1000;
      displayHeight = 500;
    } else {
      displayWidth = 345;
      displayHeight = 600;
    }

    fabricCanvasInstance.setWidth(displayWidth);
    fabricCanvasInstance.setHeight(displayHeight);
    fabricCanvasInstance.set("backgroundColor", "white");
    fabricCanvasInstance.renderAll();

    return () => {
      fabricCanvasInstance.dispose();
      setFabricCanvas(null);
    };
  }, [canvasRef]);

  useEffect(() => {
    if (!fabricCanvas) return;

    let shape;
    fabricCanvas.off("mouse:down");
    fabricCanvas.off("mouse:move");
    fabricCanvas.off("mouse:up");

    const addShape = (options) => {
      const pointer = fabricCanvas.getPointer(options.e);
      if (tool === "rectangle") {
        shape = new fabric.Rect({
          left: pointer.x,
          top: pointer.y,
          width: 0,
          height: 0,
          fill: "transparent", // No fill
          selectable: true,
          stroke: color,
          strokeWidth: thickness,
        });
      } else if (tool === "circle") {
        shape = new fabric.Circle({
          left: pointer.x,
          top: pointer.y,
          radius: 0,
          fill: "transparent", // No fill
          selectable: true,
          stroke: color,
          strokeWidth: thickness,
        });
      } else if (tool === "line") {
        shape = new fabric.Line([pointer.x, pointer.y, pointer.x, pointer.y], {
          stroke: color,
          strokeWidth: thickness,
          selectable: true,
        });
      }
      if (shape) {
        fabricCanvas.add(shape);
      }
    };

    const updateShape = (options) => {
      const pointer = fabricCanvas.getPointer(options.e);
      if (shape) {
        if (tool === "rectangle") {
          shape.set({
            width: pointer.x - shape.left,
            height: pointer.y - shape.top,
          });
        } else if (tool === "circle") {
          const radius = Math.sqrt(
            Math.pow(pointer.x - shape.left, 2) +
              Math.pow(pointer.y - shape.top, 2)
          );
          shape.set({ radius });
        } else if (tool === "line") {
          shape.set({ x2: pointer.x, y2: pointer.y });
        }
        fabricCanvas.renderAll();
      }
    };

    fabricCanvas.on("mouse:down", (options) => {
      const pointer = fabricCanvas.getPointer(options.e);

      if (tool === "text" && !hasInput) {
        addInput(pointer.x, pointer.y);
        return;
      }

      if (fabricCanvas.getActiveObject() || isDrawing) {
        return;
      }
      setIsDrawing(true);
      addShape(options);
      fabricCanvas.on("mouse:move", updateShape);
    });

    fabricCanvas.on("mouse:up", () => {
      setIsDrawing(false);
      shape = null;
      fabricCanvas.off("mouse:move", updateShape);
    });

    fabricCanvas.on("object:selected", () => {
      setIsDrawing(false);
    });

    // Brush tool
    if (tool === "brush") {
      fabricCanvas.isDrawingMode = true;
      if (!fabricCanvas.freeDrawingBrush) {
        fabricCanvas.freeDrawingBrush = new fabric.PencilBrush(fabricCanvas);
      }
      fabricCanvas.freeDrawingBrush.color = color;
      fabricCanvas.freeDrawingBrush.width = thickness;
    } else if (tool === "eraser") {
      fabricCanvas.isDrawingMode = true;
      if (!fabricCanvas.freeDrawingBrush) {
        fabricCanvas.freeDrawingBrush = new fabric.PencilBrush(fabricCanvas);
      }
      fabricCanvas.freeDrawingBrush.color = fabricCanvas.backgroundColor;
      fabricCanvas.freeDrawingBrush.width = thickness;
    } else {
      fabricCanvas.isDrawingMode = false;
    }
  }, [fabricCanvas, tool, color, thickness]);

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      const text = new fabric.Text(e.target.value, {
        left: parseFloat(e.target.style.left),
        top: parseFloat(e.target.style.top),
        fontSize: thickness,
        fill: color,
        selectable: true,
      });
      fabricCanvas.add(text);
      document.body.removeChild(e.target);
      setHasInput(false);
    }
  };

  const handleInput = (e) => {
    e.target.style.width = `${e.target.value.length + 1}ch`;
  };

  const addInput = (x, y) => {
    if (hasInput) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const input = document.createElement("input");

    input.type = "text";
    input.className = "canvas-input"; // Ensure this class is in your CSS
    input.style.position = "absolute";

    const inputX = rect.left + x;
    const inputY = rect.top + y;

    input.style.left = `${inputX}px`;
    input.style.top = `${inputY}px`;
    input.style.font = "25px 'Happy Monkey', system-ui";
    input.style.border = "1px solid #000";
    input.style.outline = "none";
    input.style.padding = "2px";
    input.style.margin = "0";
    input.style.background = "transparent";
    input.style.width = "50px";
    input.style.minWidth = "1ch";

    input.onkeydown = handleEnter;
    input.oninput = handleInput;

    document.body.appendChild(input);
    input.focus();

    setHasInput(true);
  };

  return (
    <div className="canvas-container" style={{ position: "relative" }}>
      <canvas id="myCanvas" className="canvasContainer" ref={canvasRef} />
    </div>
  );
}

export default Canvas;
