'use client';
import clsx from "clsx";
import { useState, } from "react";
import ChartCard from "./chart-card";


export default function ConsumptionOverview({consumptionData}:{consumptionData: {labelsDaily: string[], dataDaily: number[]}}) {
  const [selected,setSelected] = useState("daily");
  const {total, avg, peak} = updateStats(consumptionData.dataDaily);

  
  
  return (<section className="w-full max-w-[1200px] p-5 bg-white rounded-xl shadow-md mt-5">
        <h2 className="text-2xl font-bold text-[#189ab4] mb-5">📉 Consumption Overview</h2>

        <div className="flex gap-3 mb-5">
          <button className={clsx("  text-white border-none px-4 py-[6px] rounded cursor-pointer text-sm active:bg-[#0f6f89]",
                          {' bg-[#0f6f89]': selected === 'daily',},
                          {' bg-[#188bb4]': selected !== 'daily',}
                        )} data-view="daily"
                        onClick={() => setSelected('daily')}>Daily</button>
          <button className="bg-[#188bb4] text-white border-none px-4 py-[6px] rounded cursor-pointer text-sm active:bg-[#0f6f89]" data-view="weekly">Weekly</button>
          <button className="bg-[#188bb4] text-white border-none px-4 py-[6px] rounded cursor-pointer text-sm active:bg-[#0f6f89]" data-view="monthly">Monthly</button>
          <button className="bg-[#188bb4] text-white border-none px-4 py-[6px] rounded cursor-pointer text-sm active:bg-[#0f6f89]" data-view="quarterly">Quarterly</button>
          <button className="bg-[#188bb4] text-white border-none px-4 py-[6px] rounded cursor-pointer text-sm active:bg-[#0f6f89]" data-view="yearly">Yearly</button>
        </div>

        <ChartCard height={100} type='line' labels={consumptionData.labelsDaily} datasets={ [{
          label: "Daily Usage (kWh)",
          data: consumptionData.dataDaily,
          borderColor: "#189AB4",
          backgroundColor: "rgba(24,154,180,0.2)",
          fill: true,
          tension: 0.3
        }]}  options={{
              responsive: true,
              scales: { y: { beginAtZero: true, title: { display: true, text: "kWh" } } }}}/>

        <div className="flex gap-5 mt-3 flex-wrap">
            <div className="flex-1 min-w-[180px] bg-[#f1fcff] border border-[#cde] rounded-lg p-3 text-center">
            <h3 className="my-1 text-[16px] text-[#0f6f89] font-bold">Total Usage</h3>
            <p className="text-[20px] font-bold text-[#fdb750]">{total.toFixed(2)} kWh</p>
            </div>
          <div className="flex-1 min-w-[180px] bg-[#f1fcff] border border-[#cde] rounded-lg p-3 text-center">
            <h3 className="my-1 text-[16px] text-[#0f6f89] font-bold">Average</h3>
            <p className="text-[20px] font-bold text-[#fdb750]">{avg.toFixed(2)} kWh</p>
          </div>
          <div className="flex-1 min-w-[180px] bg-[#f1fcff] border border-[#cde] rounded-lg p-3 text-center">
            <h3 className="my-1 text-[16px] text-[#0f6f89] font-bold">Peak</h3>
            <p className="text-[20px] font-bold text-[#fdb750]">{peak.toFixed(2)} kWh</p>
          </div>
        </div>
      </section>)
}

function updateStats(data: number[]) {
  const total = data.reduce((acc, val) => acc + val, 0);
  const avg = total / data.length;
  const peak = Math.max(...data);
  return { total, avg, peak };
}