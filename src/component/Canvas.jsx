import React, { useRef, useState, useEffect } from "react";
import brush from "../../src/assets/paintbrush-solid.svg";
import eraser from "../../src/assets/eraser-solid.svg";
import plus from "../../src/assets/plus-solid.svg";
import "../../src/App.css";

function Canvas({ tool, color, thickness }) {
  const width = thickness;
  const widthHalf = width ? width / 2 : 0;
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [text, setText] = useState("");
  const [cursor, setCursor] = useState("");
  const [savedImage, setSavedImage] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const viewportWidth = window.outerWidth;
    const viewportHeight = window.outerHeight;

    let displayWidth, displayHeight;

    if (viewportWidth > 1024) {
      // Large screens
      displayWidth = 1100;
      displayHeight = 550;
    } else if (viewportWidth > 768) {
      // Medium screens
      displayWidth = 1000;
      displayHeight = 500;
    } else {
      // Small screens
      displayWidth = 345;
      displayHeight = 600;
    }
    canvas.width = displayWidth; // For high-DPI displays
    canvas.height = displayHeight; // For high-DPI displays
    canvas.style.width = `${displayWidth}px`;
    canvas.style.height = `${displayHeight}px`;
    canvas.style.border = `8px solid #000000`;
    canvas.style.background = `white`;
    let newCursor = "";

    if (tool === "brush") {
      newCursor = `url(${brush}) 0 0, auto`;
    } else if (tool === "eraser") {
      newCursor = `url(${eraser}) 0 0, auto`;
    } else {
      newCursor = `url(${plus}) 0 0, auto`;
    }
    setCursor(newCursor);

    // Restore the saved image if there is one
    const ctx = canvas.getContext("2d");
    if (savedImage) {
      const img = new Image();
      img.src = savedImage;
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
        ctx.drawImage(img, 0, 0); // Draw the saved image
      };
    }
  }, [tool, thickness, width, widthHalf, savedImage]);

  const startDrawing = (x, y) => {
    setStartX(x);
    setStartY(y);
    setIsDrawing(true);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (tool === "text") {
      ctx.fillStyle = color;
      ctx.font = `${thickness * 2}px Arial`;
      ctx.fillText(text, x, y);
      saveCanvasState();
    }
  };

  const draw = (x, y) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (tool === "brush") {
      ctx.strokeStyle = color;
      ctx.lineWidth = thickness;
      ctx.lineCap = "round";

      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y);
    } else if (tool === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.strokeStyle = "rgba(0,0,0,1)";
      ctx.lineWidth = thickness;

      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.globalCompositeOperation = "source-over";
    }
  };

  const stopDrawing = (x, y) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (isDrawing) {
      if (tool === "rectangle" || tool === "circle" || tool === "line") {
        ctx.strokeStyle = color;
        ctx.lineWidth = thickness;

        if (tool === "rectangle") {
          const width = x - startX;
          const height = y - startY;
          ctx.strokeRect(startX, startY, width, height);
        }

        if (tool === "circle") {
          const radius = Math.sqrt(
            Math.pow(x - startX, 2) + Math.pow(y - startY, 2)
          );
          ctx.beginPath();
          ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
          ctx.stroke();
        }

        if (tool === "line") {
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.lineTo(x, y);
          ctx.stroke();
        }
      }
      setIsDrawing(false);
      ctx.beginPath();
      saveCanvasState();
    }
  };

  const saveCanvasState = () => {
    const canvas = canvasRef.current;
    const savedImage = canvas.toDataURL();
    setSavedImage(savedImage);
  };

  return (
    <div className="canvas-container">
      <canvas
        ref={canvasRef}
        onMouseDown={(e) => {
          const rect = canvasRef.current.getBoundingClientRect();
          startDrawing(e.clientX - rect.left, e.clientY - rect.top);
        }}
        onMouseMove={(e) => {
          const rect = canvasRef.current.getBoundingClientRect();
          draw(e.clientX - rect.left, e.clientY - rect.top);
        }}
        onMouseUp={(e) => {
          const rect = canvasRef.current.getBoundingClientRect();
          stopDrawing(e.clientX - rect.left, e.clientY - rect.top);
        }}
        onTouchStart={(e) => {
          e.preventDefault(); // Prevent scrolling
          const rect = canvasRef.current.getBoundingClientRect();
          const touch = e.touches[0];
          startDrawing(touch.clientX - rect.left, touch.clientY - rect.top);
        }}
        onTouchMove={(e) => {
          e.preventDefault(); // Prevent scrolling
          const rect = canvasRef.current.getBoundingClientRect();
          const touch = e.touches[0];
          draw(touch.clientX - rect.left, touch.clientY - rect.top);
        }}
        onTouchEnd={(e) => {
          e.preventDefault(); // Prevent scrolling
          const rect = canvasRef.current.getBoundingClientRect();
          const touch = e.changedTouches[0];
          stopDrawing(touch.clientX - rect.left, touch.clientY - rect.top);
        }}
        style={{ cursor }}
      />
      {tool === "text" && (
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text"
        />
      )}
    </div>
  );
}

export default Canvas;
