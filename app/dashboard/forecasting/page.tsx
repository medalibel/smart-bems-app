'use client'

import ConsumptionOverview from "@/components/consumption-overview";
import ChartCard from "@/components/chart-card";
import { useState,useEffect } from "react";
import { useRouter } from "next/navigation";
export default function HistoryPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5001/api";
  const router = useRouter()
  const [horizon,setHorizon] = useState('7')
  const [labels,setLabels]=useState<string[]>([])
  const [historicalData,setHistoricalData] = useState<number[]>([])
  const [tempData,setTempData] = useState<number[]>([])
  const [forecast,setForecast] = useState<number[]>([])
  const [peakInfo,setPeakInfo] = useState('')
  let peakExpectaion = 'Peak expected on Thursday; 95% band ±0.25 kWh'
  
  const CONF_UPPER   = forecast.map(v=>v+0.25);
  const CONF_LOWER   = forecast.map(v=>v-0.25);
  const COSTS        = forecast.map(v=>(v*0.15).toFixed(2));

  const loadForecastData = async ()=>{
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }
      const response = await fetch(`${API_URL}/forecast/${horizon}`,{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
     if (!response.ok) {
        if(response.status === 401)
        {
          router.push('/login')
          return
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      let totalData = result.map((item: any) => Number(item.total_energy))
      const r = totalData.reduce((acc:{ max: number; index: number }, num:number, index:number) => {
        if (num > acc.max) {
          return { max: num, index };
        }
        return acc;
      }, { max: -Infinity, index: -1 });

      let lab = result.map((item: any) => {
        const date = new Date(item.date);
        return `${date.getUTCDate().toString().padStart(2, '0')}-${(date.getUTCMonth() + 1).toString().padStart(2, '0')}`;
      })
      

      setForecast(result.map((item: any) => Number(item.total_energy)));
      setLabels(result.map((item: any) => {
        const date = new Date(item.date);
        return `${date.getUTCDate().toString().padStart(2, '0')}-${(date.getUTCMonth() + 1).toString().padStart(2, '0')}`;
      }));
      setPeakInfo(`Highest consumption expected: ${lab[r.index]} – ${r.max} kWh`)

    } catch (error) {
      console.error("Error fetching weekly data:", error);
    }
  }
  const loadTempData = async () =>{
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }
      const response = await fetch(`${API_URL}/temp/${horizon}`,{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
     if (!response.ok) {
        if(response.status === 401)
        {
          router.push('/login')
          return
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();

      setTempData(result.map((item: any) => Number(item.avg_temp)));
      // Process weekly data here if needed
    } catch (error) {
      console.error("Error fetching weekly data:", error);
    }
  }
  const loadHistoricalData = async ()=>{
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }
      const response = await fetch(`${API_URL}/consumption/s/e?preset=${horizon}`,{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
     if (!response.ok) {
        if(response.status === 401)
        {
          router.push('/login')
          return
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      setHistoricalData(result.map((item: any) => Number(item.total_consumption)));
      // Process weekly data here if needed
    } catch (error) {
      console.error("Error fetching weekly data:", error);
    }
  }

  useEffect(()=>{
    loadHistoricalData()
    loadTempData()
    loadForecastData()
  },[])

  return (
    <main className="flex min-h-screen flex-col items-center">
      <section className="w-full max-w-[1200px] p-5 bg-white rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-[#189ab4] mb-5">📅 Forecast Horizon Selector</h2>
        <div className="flex gap-3 flex-wrap items-center">
          <label className="">Choose horizon:</label>
          <select className="bg-[#0f6f89] text-white border-none px-4 py-[6px] rounded cursor-pointer text-sm" value={horizon} onChange={(e)=>setHorizon(e.target.value)}>
            <option value="7">Next Week</option>
            <option value="14">Next Two Weeks</option>
            <option value="30">Next Month</option>
            <option value="90">Next 3 months</option>
          </select>
            <button className="bg-[#0f6f89] text-white border-none px-4 py-[6px] rounded cursor-pointer text-sm" 
            onClick={()=>{
              loadForecastData()
              loadHistoricalData()
              loadTempData()
            }}>
            Apply Forecast
            </button>
        </div>
      </section>

      <section className="w-full max-w-[1200px] p-5 bg-white rounded-xl shadow-md mt-5">
        <h2 className="text-2xl font-bold text-[#189ab4]">🔮 Forecasted vs Historical Usage</h2>
      
        <div className="flex gap-3 justify-center mb-5 w-full">
          <ChartCard height={150} type='line' 
            labels={labels} 
            datasets={ [{ label: 'Historical (kWh)', data: historicalData, borderColor: '#189AB4', fill: false },
              { label: 'Forecast (kWh)',   data: forecast,   borderColor: '#EF476F', fill: false },
              { label: 'Temp (°C)',         data: tempData, borderColor: '#06D6A0',
                yAxisID: 'y1', fill: false, borderDash: [5,5] }]}  
            options={{
                responsive: true,
                interaction: { mode: 'index', intersect: false },
                scales: {
                  y:  { type: 'linear', position: 'left',  title: { display: true, text: 'kWh'} },
                  y1: { type: 'linear', position: 'right', title: { display: true, text: '°C'},
                        grid: { drawOnChartArea: false } }
                }}}/>
          
          <ChartCard height={150} type='line' 
            labels={labels} 
            datasets={ [{ label: 'Upper 95%', data: CONF_UPPER, borderColor: 'rgba(231,76,60,0.3)', fill: false, pointRadius: 0 },
              { label: 'Lower 95%', data: CONF_LOWER, borderColor: 'rgba(231,76,60,0.3)', fill: '-1', pointRadius: 0 }
            ]}  
            options={{
              responsive: true,
              scales: { y: { beginAtZero: true, title: { display: true, text: 'kWh' } } }
            }}/>
        </div>
        
        <div className="flex gap-4" >
            <button className="px-4 py-1 bg-[#0f6f89] text-white border-none rounded-[6px] cursor-pointer text-sm">
            Download CSV
            </button>
          <button className="px-4 py-1 bg-[#0f6f89] text-white border-none rounded-[6px] cursor-pointer text-sm" >Download Excel</button>
        </div>
        
        <p className="mt-4 italic text-[#0f6f89]">{peakInfo}</p>
      </section>

      <section className="w-full max-w-[1200px] p-5 bg-white rounded-xl shadow-md mt-5">
        <h2 className="text-2xl font-bold text-[#189ab4]">📉 Predicted Cost by Day</h2>
      
        <div className="flex gap-3 justify-center mb-5 w-full">
          <ChartCard height={100} type='bar' 
            labels={labels} 
            datasets={ [{
              label: 'Predicted Cost (DZD)',
              data: forecast.map(item => (item*5.34)),
              backgroundColor: '#0F6F89'
            }]}  
            options={{
              responsive: true,
              scales: {
                y: { beginAtZero: true, title: { display: true, text: 'DZD' } }
              }
            }}/>
        </div>
    
      </section>
     
      
    </main>
  );
}