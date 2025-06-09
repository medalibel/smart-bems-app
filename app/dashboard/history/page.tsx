'use client'
import ConsumptionOverview from "@/components/consumption-overview";
import ChartCard from "@/components/chart-card";
import {useState, useEffect } from 'react';
import { useRouter } from "next/navigation";

export default function HistoryPage() {
  const router = useRouter()
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5001/api";
  const labelsDaily = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  const [labels, setLabels] = useState<string[]>(labelsDaily);
  const [data, setData] = useState<number[]>([]);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [roomLabels, setRoomLabels] = useState<string[]>([]);
  const [roomData, setRoomData] = useState<number[]>([]);
  const [preset, setPreset] = useState<string>(''); // default to weekly
  const [token,setToken] = useState('')
  

  const fetchWeeklyData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }
      const response = await fetch(`${API_URL}/consumption/lastweek`,{
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

      const startDate = new Date(result[0].day);
      const year = startDate.getUTCFullYear();
      const month = (startDate.getUTCMonth() + 1).toString().padStart(2, '0'); // months are 0-indexed, padStart ensures two digits
      const day = startDate.getUTCDate().toString().padStart(2, '0'); // padStart ensures two digits

      const endDate = new Date(result[result.length - 1].day);
      const endYear = endDate.getUTCFullYear();
      const endMonth = (endDate.getUTCMonth() + 1).toString().padStart(2, '0');
      const endDay = endDate.getUTCDate().toString().padStart(2, '0'); // padStart ensures two digits

      const rooms:Record<string, number> = {}
      for (const item of result) {
        Object.entries(item).forEach(([key, value]) => {
          if (key !== 'day' && key !== 'total_consumption') {
            if (!rooms[key]) {
              rooms[key] = 0;
            }
            rooms[key]+= Number(value);
          }
        });
      }
      setRoomLabels(Object.keys(rooms));
      setRoomData(Object.values(rooms));
      setEndDate(`${endYear}-${endMonth}-${endDay}`);
      setStartDate(`${year}-${month}-${day}`);
      setLabels(result.map((item: any) => {
        const date = new Date(item.day);
        return `${date.getUTCDate().toString().padStart(2, '0')}-${(date.getUTCMonth() + 1).toString().padStart(2, '0')}`;
      }));
      setData(result.map((item: any) => Number(item.total_consumption)));
      // Process weekly data here if needed
    } catch (error) {
      console.error("Error fetching weekly data:", error);
    }
  }

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }
      const response = await fetch(`${API_URL}/consumption/${startDate}/${endDate}?preset=${preset}`,{
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

      const start = new Date(result[0].day);
      const year = start.getUTCFullYear();
      const month = (start.getUTCMonth() + 1).toString().padStart(2, '0'); // months are 0-indexed, padStart ensures two digits
      const day = start.getUTCDate().toString().padStart(2, '0'); // padStart ensures two digits

      const end = new Date(result[result.length - 1].day);
      const endYear = end.getUTCFullYear();
      const endMonth = (end.getUTCMonth() + 1).toString().padStart(2, '0');
      const endDay = end.getUTCDate().toString().padStart(2, '0'); // padStart ensures two digits

      const rooms:Record<string, number> = {}
      for (const item of result) {
        Object.entries(item).forEach(([key, value]) => {
          if (key !== 'day' && key !== 'total_consumption') {
            if (!rooms[key]) {
              rooms[key] = 0;
            }
            rooms[key]+= Number(value);
          }
        });
      }
      setRoomLabels(Object.keys(rooms));
      setRoomData(Object.values(rooms));
      setEndDate(`${endYear}-${endMonth}-${endDay}`);
      setStartDate(`${year}-${month}-${day}`);
      setLabels(result.map((item: any) => {
        const date = new Date(item.day);
        return `${date.getUTCDate().toString().padStart(2, '0')}-${(date.getUTCMonth() + 1).toString().padStart(2, '0')}`;
      }));
      setData(result.map((item: any) => Number(item.total_consumption)));
      // Process weekly data here if needed
    } catch (error) {
      console.error("Error fetching weekly data:", error);
    }
  }


  useEffect(() => {
    fetchWeeklyData();
    const t = localStorage.getItem('token');
    setToken(t? t : '')
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center">
      <section className="w-full max-w-[1200px] p-5 bg-white rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-[#189ab4] mb-5">📊 Custom Range Selector</h2>
        <div className="flex gap-3 flex-wrap items-center">
          <label className="">From: <input className="px-2 py-[6px] border border-[#ccc] rounded-md text-sm" type="date" value={startDate} onChange={e=> {
            console.log('Start date changed:', e.target.value);
            setStartDate(e.target.value)}} /></label>
          <label>To:   <input className="px-2 py-[6px] border border-[#ccc] rounded-md text-sm" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} /></label>
          <select className="px-2 py-[6px] border border-[#ccc] rounded-md text-sm" value={preset} onChange={e => {setPreset(e.target.value);}}>
            <option>— Preset Ranges —</option>
            <option value="1">Last Day</option>
            <option value="7">Last 7 Days</option>
            <option value="30">Last Month</option>
            <option value="90">Last Quarter</option>
            <option value="365">Last Year</option>
          </select>
            <button className="bg-[#0f6f89] text-white border-none px-4 py-[6px] rounded cursor-pointer text-sm" 
            onClick={() => {
              console.log('Fetching data with:', startDate, endDate, preset);
              fetchData();
            }}
            >
            Apply
            </button>
        </div>
      </section>

      <ConsumptionOverview labels={labels} data={data}/>

      <section className="w-full max-w-[1200px] p-5 bg-white rounded-xl shadow-md mt-5">
        <h2 className="text-2xl font-bold text-[#189ab4] mb-5">🧩 Usage by Room / Circuit</h2>
        <ChartCard height={100} type='bar' labels={roomLabels} 
          datasets={ [{
            label: "Usage by Room (kWh)",
            data: roomData,
            backgroundColor: roomLabels.map(() => `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`)
          }]}  
          options={{
            responsive: true,
            scales: { y: { beginAtZero: true, title: { display:true, text:"kWh" } } }}}/>
        </section>

        <section className="w-full max-w-[1200px] p-5 bg-white rounded-xl shadow-md mt-5">
          <h2 className="text-2xl font-bold text-[#189ab4] mb-5">🧮 Download Data</h2>
          <div className="flex gap-4" >
            <button className="bg-[#06d6a0] text-[#034d3f] border-none px-4 py-2 rounded cursor-pointer mr-2" 
            onClick={async (e)=>{
              e.preventDefault();
              const res = await fetch(`${API_URL}/consumption/download/${startDate}/${endDate}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });

              const blob = await res.blob();
              const url = window.URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.setAttribute('download', `history_${startDate}_${endDate}.csv`);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              window.URL.revokeObjectURL(url);
            }}
          >
            Download
          </button>
          </div>
        </section>
      
    </main>
  );
}