'use client'
import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

type ChartCardProps = {
  title?: string;
  type: "line" | "bar" | "pie" | "doughnut" | "radar" | "polarArea" | "bubble" | "scatter";
  labels: string[];
  datasets:any;
  height?: number;
  peak?: string;
  options?: any;
};

export default function ChartCard({
  title,
  type,
  labels,
  datasets,
  peak,
  options,
  height
}: Readonly<ChartCardProps>) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart | null>(null);


  useEffect(() => {
    if (canvasRef.current) {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
      chartRef.current = new Chart(canvasRef.current, {
        type,
         data: {
          labels,
          datasets,
        },
        options,
      });
    }
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [type, labels,datasets, options]);

  return (
    <div className="flex items-center flex-col rounded-lg w-full bg-white p-5">
      {title ? <h2 className="text-lg font-semibold mb-3 text-[#189ab4]">{title}</h2> : null}
      {peak? <div className="text-xl text-[#0f6f89] mb-3">{peak}</div> : null}
      { height ? (<canvas height={height} ref={canvasRef}></canvas>) : (<canvas ref={canvasRef}></canvas>)}
    </div>
  );
}