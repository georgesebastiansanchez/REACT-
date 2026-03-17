import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const ChartBox = ({ title, data, options, chartId }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current && data) {
      new Chart(canvasRef.current, {
        type: 'bar',
        data,
        options,
      });
    }
  }, [data, options]);

  return (
    <div className="grafico-box">
      <h3>{title}</h3>
      <canvas id={chartId} ref={canvasRef}></canvas>
    </div>
  );
};

export default ChartBox;
