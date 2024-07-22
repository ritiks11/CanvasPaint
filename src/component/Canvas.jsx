import React, { useRef, useState, useEffect } from "react";

function Canvas({ tool, color, thickness, fill }) {
  const width = thickness;
  const widthHalf = width ? width / 2 : 0;

  const cursor = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="%23000000" opacity="0.3" height="${width}" viewBox="0 0 ${width} ${width}" width="${width}"><circle cx="${widthHalf}" cy="${widthHalf}" r="${widthHalf}" fill="%23000000" /></svg>') ${widthHalf} ${widthHalf}, auto`;

  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [text, setText] = useState("");

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
  }, []);

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
    // } else if (tool === "fill") {
    //   const ctx = canvas.getContext("2d");
    //   const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    //   const startPos =
    //     (Math.floor(e.clientY - rect.top) * canvas.width +
    //       Math.floor(e.clientX - rect.left)) *
    //     4;
    //   const floodFill = (data, x, y, fillColor) => {
    //     const width = canvas.width;
    //     const height = canvas.height;
    //     const stack = [];
    //     const targetColor = data[(y * width + x) * 4];

    //     stack.push([x, y]);

    //     while (stack.length) {
    //       const [sx, sy] = stack.pop();
    //       let offset = (sy * width + sx) * 4;

    //       while (sy >= 0 && data[offset] === targetColor) {
    //         sy -= 1;
    //         offset -= width * 4;
    //       }

    //       offset += width * 4;
    //       sy += 1;
    //       let reachLeft = false;
    //       let reachRight = false;

    //       while (sy < height && data[offset] === targetColor) {
    //         data[offset] = fillColor[0];
    //         data[offset + 1] = fillColor[1];
    //         data[offset + 2] = fillColor[2];
    //         data[offset + 3] = fillColor[3];

    //         if (sx > 0) {
    //           if (data[offset - 4] === targetColor) {
    //             if (!reachLeft) {
    //               stack.push([sx - 1, sy]);
    //               reachLeft = true;
    //             }
    //           } else if (reachLeft) {
    //             reachLeft = false;
    //           }
    //         }

    //         if (sx < width - 1) {
    //           if (data[offset + 4] === targetColor) {
    //             if (!reachRight) {
    //               stack.push([sx + 1, sy]);
    //               reachRight = true;
    //             }
    //           } else if (reachRight) {
    //             reachRight = false;
    //           }
    //         }

    //         sy += 1;
    //         offset += width * 4;
    //       }
    //     }
    //   };

    //   floodFill(
    //     imgData.data,
    //     Math.floor(e.clientX - rect.left),
    //     Math.floor(e.clientY - rect.top),
    //     [
    //       parseInt(fill.slice(1, 3), 16),
    //       parseInt(fill.slice(3, 5), 16),
    //       parseInt(fill.slice(5, 7), 16),
    //       255,
    //     ]
    //   );
    //   ctx.putImageData(imgData, 0, 0);
    // }
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
      ctx.clearRect(
        e.clientX - rect.left,
        e.clientY - rect.top,
        thickness,
        thickness
      );
    }
  };

  const handleMouseUp = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (tool === "rectangle" || tool === "circle" || tool === "line") {
      ctx.strokeStyle = color;
      ctx.lineWidth = thickness;
      ctx.fillStyle = fill;

      if (tool === "rectangle") {
        ctx.strokeRect(
          startX,
          startY,
          e.clientX - canvas.getBoundingClientRect().left - startX,
          e.clientY - canvas.getBoundingClientRect().top - startY
        );
        // ctx.fillRect(
        //   startX,
        //   startY,
        //   e.clientX - canvas.getBoundingClientRect().left - startX,
        //   e.clientY - canvas.getBoundingClientRect().top - startY
        // );
      }

      if (tool === "circle") {
        const radius = Math.sqrt(
          Math.pow(
            e.clientX - canvas.getBoundingClientRect().left - startX,
            2
          ) +
            Math.pow(e.clientY - canvas.getBoundingClientRect().top - startY, 2)
        );
        ctx.beginPath();
        ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
        ctx.stroke();
        // ctx.fill();
      }

      if (tool === "line") {
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(
          e.clientX - canvas.getBoundingClientRect().left,
          e.clientY - canvas.getBoundingClientRect().top
        );
        ctx.stroke();
      }
    }

    ctx.beginPath();
    setIsDrawing(false);
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
      {/* <button onClick={exportPDF}>Export as PDF</button>
      {tool === "text" && (
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
