'use client';
import {useState, useEffect } from 'react';
import { Mulish,Lusitana } from 'next/font/google';
import StatCard  from '@/components/stat-card';
import ChartCard from '@/components/chart-card';
const mulish = Mulish({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function Page() {
  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5001/api";
  const [data, setData] = useState<any>(null);
  const [todayTotal, setTodayTotal] = useState<number>(0);
  const [todayConsumption, setTodayConsumption] = useState<number[]>([]);
  const [peakInfo, setPeakInfo] = useState<string>('');
  const [datasets, setDatasets] = useState<any[]>([]);
  const [categoryLabels, setCategoryLabels] = useState<string[]>([]);
  const [categoryData, setCategoryData] = useState<number[]>([]);
  const [weeklyLabels, setWeeklyLabels] = useState<string[]>([]);
  const [weeklyData, setWeeklyData] = useState<number[]>([]);
  
  const getPeakUsage = (totalData: number[],hours: string[], rooms: Record<string, number[]>)=> {
    // let peakIdx = totalData.reduce((maxI, v, i, a) => (v > a[maxI] ? i : maxI),0 );
    const result = totalData.reduce((acc, num, index) => {
      if (num > acc.max) {
        return { max: num, index };
      }
      return acc;
    }, { max: -Infinity, index: -1 });
    // let peakTime = hours[peakIdx]
    // let peakVal = totalData[peakIdx];

    // let peakInfo = `Highest consumption today: ${peakTime} – ${peakVal.toFixed(2)} kWh`
    let peakInfo = `Highest consumption today: ${hours[result.index]} – ${result.max} kWh`;
          // build datasets
          const datasets :any[] = [
            {
              label: "Total",
              data: totalData,
              borderColor: "#0F6F89",
              backgroundColor: "rgba(15,111,137,0.1)",
              fill: true,
              pointRadius: 4,
              pointBackgroundColor: totalData.map((_, i) =>
                i === result.index ? "#FDB750" : "rgba(15,111,137,0.6)"
              ),
            },
          ];

          const palette = ["#189AB4", "#06D6A0", "#EF476F", "#FFD166", "#118AB2", "#073B4C", "#FF9F1C"];
          Object.entries(rooms).forEach(([name, data], idx) => {
            datasets.push({
              label: name,
              data,
              borderDash: [5, 5],
              borderColor: palette[idx % palette.length],
              pointRadius: 0,
              fill: false,
            });
          });
          console.log("get peak usage called");
          console.log("Peak datasets:", datasets);
        console.log("Peak info:", peakInfo);
    return { p:peakInfo, d:datasets };
  }
  const fetchData = async () => {
    try {
      const response = await fetch(`${API_URL}/consumption/today`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      
      let total = 0;
      let roomsData :Record<string, number[]> = {
        bathroom1: [],
        bedroom1: [],
        bedroom2: [],
        garage1: [],
        kitchen1: [],
        livingroom1: [],
        office1: [],
      };
      let categoryData: Record<string, number> = {}
      result.forEach((item: any) => {
        total += Number(item.total_energy);
        roomsData.bathroom1.push(Number(item.bathroom1));
        roomsData.bedroom1.push(Number(item.bedroom1));
        roomsData.bedroom2.push(Number(item.bedroom2));
        roomsData.garage1.push(Number(item.garage1));
        roomsData.kitchen1.push(Number(item.kitchen1));
        roomsData.livingroom1.push(Number(item.livingroom1));
        roomsData.office1.push(Number(item.office1));
        for (const [key, value] of Object.entries(item)) {
          if (key !== 'total_energy' && key !== 'date_time' && key !== 'house_id') {
            if (!categoryData[key]) {
              categoryData[key] = 0;
            }
            categoryData[key] += Number(value);
          }
        }
      }
      );
      
      
      let todayCons = result.map((item: any) => item.total_energy)

      console.log('calling getPeakUsage with:', todayCons, hours, roomsData);
      let { p, d } = getPeakUsage(todayCons, hours, roomsData);

      setData(result);
      setTodayTotal(total);
      setTodayConsumption(todayCons);
      setPeakInfo(p);
      setDatasets(d);
      setCategoryLabels(Object.keys(categoryData));
      setCategoryData(Object.values(categoryData));
    } catch (error) { 
      console.error("Error fetching data:", error);
    }
  };

  const fetchWeeklyData = async () => {
    try {
      const response = await fetch(`${API_URL}/consumption/lastweek`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setWeeklyLabels(result.map((item: any) => item.day.split(',')[0]));
      setWeeklyData(result.map((item: any) => Number(item.total_consumption)));
      // Process weekly data here if needed
    } catch (error) {
      console.error("Error fetching weekly data:", error);
    }
  }

  useEffect(() => {
    fetchData();
    fetchWeeklyData();
  }, []);


  return (
    <main className="flex min-h-screen flex-col items-center">
      <div className='flex flex-wrap md:flex-nowrap w-full max-w-[1200px] justify-center gap-5'>
        <StatCard title="Today's Total Consumption" info={todayTotal.toFixed(3)+' KWh'} /> 
        <StatCard title="Daily Cost" info={(todayTotal*5.34).toFixed(2)+' DZD'} /> 
        <StatCard title="Savings This Day" info="5% / $1.12" /> 
        <StatCard title="Yesterday’s Consump & Cost" info={(weeklyData.length > 0? weeklyData[weeklyData.length-2]:0) + " kWh / "+(weeklyData.length > 0? (weeklyData[weeklyData.length-2]*5.34).toFixed(2):0)+' DZD'} />  
      </div>

      <div className=" w-full max-w-[1200px] grid grid-cols-1 md:[grid-template-columns:repeat(2,minmax(300px,1fr))] gap-5 mt-8">

        <ChartCard title='Real-Time Usage' type='line' labels={hours}  datasets={ [
        {
          label: "kW",
          data: todayConsumption,
          borderColor: "#FDB750",
          backgroundColor: "rgba(253,183,80,0.3)",
          fill: true,
          tension: 0.3,
        }, ]}
          options={{ responsive: true, scales: { y: { beginAtZero: true } } }}
        />

          <ChartCard title='Consumption - Last 7 Days' type='bar' labels={weeklyLabels}  datasets={ [
        {
          label: "kWh",
          data: weeklyData,
          backgroundColor: "#0F6F89",
        },]}
         options={{ responsive: true, scales: { y: { beginAtZero: true } } }}/>

          <ChartCard title='Peak Usage Today' type='line' labels={hours} peak={peakInfo}  datasets={ datasets} options={{
        responsive: true,
        plugins: { legend: { position: "bottom" } },
        scales: {
          x: { title: { display: true, text: "Hour of Day" } },
          y: { title: { display: true, text: "kWh" }, beginAtZero: true },
        },
          }}/>

          <ChartCard title='Category Breakdown' type='pie' labels={categoryLabels}  datasets={ [
        {
          data: categoryData,
          backgroundColor: categoryLabels.map(() => `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`),
        },
          ]} options= { {responsive: true }}/>
      </div>
    </main>
  );
}

