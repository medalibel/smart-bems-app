'use client';
import clsx from "clsx";
import { useState, } from "react";
import ChartCard from "./chart-card";


export default function ConsumptionOverview({labels, data}: {labels: string[], data: number[]}) {
  const [selected,setSelected] = useState("daily");
  const [groupedLabels,setGroupedLabels] = useState(labels)
  const [groupedData,setGroupedData] = useState(data)
  const {total, avg, peak} = updateStats(data);

  const group=(len:number)=>{
    let i = 0
    let total = 0
    let label = ''
    let newData:number[] = []
    let newLabels:string[] = []
    data.forEach(item=>{
      if(i<len){
        total += item
        i++
      }
      else{
        newData.push(total)
        total = item
        i=1
      }
    })
    if(i>0 && i<=len){
      newData.push(total)
      i=0
    }
    let lastlabel=''
    labels.forEach(item=>{
      i++
      lastlabel = item
      if(i===1){
        label = item
    
      }
      if(i===len){
        label += ' to '+item
        newLabels.push(label)
        i = 0
        label=''
      }
    })
    if(i===1)
      newLabels.push(label)
    if(i>1 && i<=len){
      label += ' to '+lastlabel
      newLabels.push(label)
      i=0
    }

    setGroupedData(newData)
    setGroupedLabels(newLabels)
  }
  
  return (<section className="w-full max-w-[1200px] p-5 bg-white rounded-xl shadow-md mt-5">
        <h2 className="text-2xl font-bold text-[#189ab4] mb-5">📉 Consumption Overview</h2>

        <div className="flex gap-3 mb-5">
          <button className={clsx("  text-white border-none px-4 py-[6px] rounded cursor-pointer text-sm active:bg-[#0f6f89]",
                          {' bg-[#0f6f89]': selected === 'daily',},
                          {' bg-[#188bb4]': selected !== 'daily',}
                        )} data-view="daily"
                        onClick={() => {
                          if(selected==='daily')
                            return
                          setGroupedData(data)
                          setGroupedLabels(labels)
                          setSelected('daily')}}>Daily</button>
          <button className={clsx("  text-white border-none px-4 py-[6px] rounded cursor-pointer text-sm active:bg-[#0f6f89]",
                          {' bg-[#0f6f89]': selected === 'weekly',},
                          {' bg-[#188bb4]': selected !== 'weekly',}
                        )} data-view="weekly"
                        onClick={()=>
                        {
                          if(selected==='weekly' || data.length === 0 )
                            return
                          group(7)
                          setSelected('weekly')
                        }}>Weekly</button>
          <button className={clsx("  text-white border-none px-4 py-[6px] rounded cursor-pointer text-sm active:bg-[#0f6f89]",
                          {' bg-[#0f6f89]': selected === 'monthly',},
                          {' bg-[#188bb4]': selected !== 'monthly',}
                        )} data-view="monthly"
                        onClick={()=>{
                          if(selected==='monthly')
                            return
                          group(30)
                          setSelected('monthly')
                        }}
                        >Monthly</button>
          {/* <button className="bg-[#188bb4] text-white border-none px-4 py-[6px] rounded cursor-pointer text-sm active:bg-[#0f6f89]" data-view="quarterly">Quarterly</button>
          <button className="bg-[#188bb4] text-white border-none px-4 py-[6px] rounded cursor-pointer text-sm active:bg-[#0f6f89]" data-view="yearly">Yearly</button> */}
        </div>

        <ChartCard height={100} type='line' labels={selected ==='daily'?labels:groupedLabels} datasets={ [{
          label: "Daily Usage (kWh)",
          data: (selected ==='daily'?data:groupedData),
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