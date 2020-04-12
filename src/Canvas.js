// Tutorial from https://dev.to/ankursheel/react-component-to-fraw-on-a-page-using-hooks-and-typescript-2ahp#sandbox

import React, { useRef, useState, useEffect, useCallback } from "react";

const Canvas = ({ width, height }) => {
  const canvasRef = useRef(null);
  const [isPainting, setIsPainting] = useState(false);
  const [mousePosition, setMousePosition] = useState(undefined);
  const [count, setCount] = useState(0);

  const getCoordinates = event => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    return {
      x: event.pageX - canvas.offsetLeft,
      y: event.pageY - canvas.offsetTop
    };
  };

  // wrap startPaint function in useCallback so we
  //can use it in a useEffect
  const startPaint = useCallback(event => {
    const coordinates = getCoordinates(event);
    if (coordinates) {
      setIsPainting(true);
      setMousePosition(coordinates);
    }
  }, []);

  const exitPaint = useCallback(() => {
    console.log("hello");
    setIsPainting(false);
    setCount(count + 1);
  }, [count]);

  const paint = useCallback(
    event => {
      console.log("isPainting", isPainting);
      if (isPainting) {
        const newMousePosition = getCoordinates(event);
        if (mousePosition && newMousePosition) {
          drawLine(mousePosition, newMousePosition);
          setMousePosition(newMousePosition);
        }
      }
    },
    [isPainting, mousePosition]
  );

  const drawLine = (originalMousePosition, newMousePosition) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.strokeStyle = "blue";
      ctx.lineJoin = "round";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(originalMousePosition.x, originalMousePosition.y);
      ctx.lineTo(newMousePosition.x, newMousePosition.y);
      ctx.closePath();
      ctx.stroke();
    }
  };

  // startPaint on mousedown
  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    const canvas = canvasRef.current;
    canvas.addEventListener("mousedown", startPaint);

    return () => {
      canvas.removeEventListener("mousedown", startPaint);
    };
  }, [startPaint]);

  // paint on mousemove
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.addEventListener("mousemove", paint);

    return () => {
      canvas.removeEventListener("mousemove", paint);
    };
  }, [paint]);

  // exitPaint on mouseup
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    canvas.addEventListener("mouseup", exitPaint);
    canvas.addEventListener("mouseleave", exitPaint);

    return () => {
      canvas.removeEventListener("mouseup", exitPaint);
      canvas.removeEventListener("mouseleave", exitPaint);
    };
  }, [exitPaint]);

  return (
    <React.Fragment>
      <canvas height={height} width={width} ref={canvasRef} />
      <div> Count is {count} </div>
    </React.Fragment>
  );
};

Canvas.defaultProps = {
  width: window.innerWidth,
  height: window.innerHeight
};

export default Canvas;
