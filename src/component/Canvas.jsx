import React, { useRef, useState, useEffect } from "react";
import brush from "../../src/assets/paintbrush-solid.svg";
import eraser from "../../src/assets/eraser-solid.svg";
import plus from "../../src/assets/plus-solid.svg";

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
      displayWidth = 1200;
      displayHeight = 600;
    } else if (viewportWidth > 768) {
      // Medium screens
      displayWidth = 1000;
      displayHeight = 500;
    } else {
      // Small screens
      displayWidth = 300;
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
      // newCursor = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="%23000000" opacity="0.3" height="${width}" viewBox="0 0 ${width} ${width}" width="${width}"><circle cx="${widthHalf}" cy="${widthHalf}" r="${widthHalf}" fill="%23000000" /></svg>') ${widthHalf} ${widthHalf}, auto`;
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

  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    setStartX(e.clientX - rect.left);
    setStartY(e.clientY - rect.top);
    setIsDrawing(true);

    if (tool === "text") {
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = color;
      ctx.font = `${thickness * 2}px Arial`;
      ctx.fillText(text, e.clientX - rect.left, e.clientY - rect.top);
    }
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext("2d");

    if (tool === "brush") {
      ctx.strokeStyle = color;
      ctx.lineWidth = thickness;
      ctx.lineCap = "round";

      ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    } else if (tool === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.strokeStyle = "rgba(0,0,0,1)";
      ctx.lineWidth = thickness;

      ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
      ctx.globalCompositeOperation = "source-over";
    }
  };

  const handleMouseUp = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const endX = e.clientX - rect.left;
    const endY = e.clientY - rect.top;

    if (tool === "rectangle" || tool === "circle" || tool === "line") {
      ctx.strokeStyle = color;
      ctx.lineWidth = thickness;

      if (tool === "rectangle") {
        const width = endX - startX;
        const height = endY - startY;
        ctx.strokeRect(startX, startY, width, height);
        // ctx.fillRect(startX, startY, width, height);
      }

      if (tool === "circle") {
        const radius = Math.sqrt(
          Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2)
        );
        ctx.beginPath();
        ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
        ctx.stroke();
        // ctx.fill();
      }

      if (tool === "line") {
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      }
    }

    ctx.beginPath();
    setIsDrawing(false);

    // Save the current canvas drawing
    const savedImage = canvas.toDataURL();
    setSavedImage(savedImage);
  };

  return (
    <div className="canvas-container">
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ cursor }}
      />
      {/* {tool === "text" && (
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text"
        />
      )} */}
    </div>
  );
}

export default Canvas;
