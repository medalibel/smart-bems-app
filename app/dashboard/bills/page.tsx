'use client';
import { useState,useEffect } from "react";
import {useRouter} from 'next/navigation'
import ChartCard from "@/components/chart-card";
export default function HistoryPage() {
  const router = useRouter()
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5001/api";
  const [quarter, setQuarter] = useState<string>('0');
  const [year, setYear] = useState<string>('');
  const [total_consumption, setTotalConsumption] = useState<number>(0);
  const [dailyAvg, setDailyAvg] = useState<number>(0);
  const [roomLabels, setRoomLabels] = useState<string[]>([]);
  const [roomData, setRoomData] = useState<number[]>([]);
  const [billsData, setBillsData] = useState<any[]>([]);
  const [error, setError] = useState<string>('');
  const [labels, setLabels] = useState<string[]>([]);
  const [energyData, setEnergyData] = useState<number[]>([]);
  const [costData, setCostData] = useState<number[]>([]);
  const [forecastQ, setForecastQ] = useState<string>(''); // Placeholder for next quarter forecast
  const [token,setToken] = useState('')

  const fetchBillsData = async () => {
    try {
      const t = localStorage.getItem('token');
      if (!t) {
        router.push('/login');
        return;
      }
      const response = await fetch(`${API_URL}/bills`,{
          headers: {
            Authorization: `Bearer ${t}`,
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
      let b:any = {};
      for (const item of result) {
        let y = item.month.split('-')[0];
        let m = item.month.split('-')[1];
        if (Number(m) <= 3){
          if (b[`Q1-${y}`]) {
            b[`Q1-${y}`].energy += Number(item.monthly_consumption);
          }
          else {
            b[`Q1-${y}`] = {
              energy: Number(item.monthly_consumption),
              period: `Jan–Mar ${y}`,
            };
          }
        }
        else if (Number(m) <= 6){
          if (b[`Q2-${y}`]) {
            b[`Q2-${y}`].energy += Number(item.monthly_consumption);
          }
          else {
            b[`Q2-${y}`] = {
              energy: Number(item.monthly_consumption),
              period: `Apr–Jun ${y}`,
            };
          }
        }
        else if (Number(m) <= 9){
          if (b[`Q3-${y}`]) {
            b[`Q3-${y}`].energy += Number(item.monthly_consumption);
          }
          else {
            b[`Q3-${y}`] = {
              energy: Number(item.monthly_consumption),
              period: `Jul–Sep ${y}`,
            };
          }
        }
        else {
          if (b[`Q4-${y}`]) {
            b[`Q4-${y}`].energy += Number(item.monthly_consumption);
          }
          else {
            b[`Q4-${y}`] = {
              energy: Number(item.monthly_consumption),
              period: `Oct–Dec ${y}`,
            };
          }
        }
      }
      let last = ''
      const billsArray = Object.entries(b).map(([key, value]: [any,any]) => {
        let delta = '-%'
        if(b[last])
        {
          let old = b[last].energy
          let difference = value.energy - old
          const percentageDifference = (difference / old) * 100;
          delta =  `${percentageDifference.toFixed(2)}%`
        }
        last = key
        return {
        quarter: key,
        period: value.period,
        energy: value.energy.toFixed(2),
        amount: (value.energy * 5.34).toFixed(2), // Assuming 5.34 DA per kWh
        delta, // Placeholder for percentage change
      }});
      let q = billsArray[billsArray.length - 1].quarter.split('-')[0];
      let y = billsArray[billsArray.length - 1].quarter.split('-')[1];
      let f = `Q${q === 'Q4' ? '1' : (Number(q.split('Q')[1]) + 1)} ${q === 'Q4' ? (Number(y)+1) : (y)}`;
      
      setForecastQ(f);
      setBillsData(billsArray);
    } catch (error) {
      console.error("Error fetching quarterly bills data:", error);
    }
  }

  const fetchQuarterlyData = async () => {
    
    try {
      const t = localStorage.getItem('token');
      if (!t) {
        router.push('/login');
        return;
      }
      const response = await fetch(`${API_URL}/consumption/quarter/${quarter}/${year}`,{
          headers: {
            Authorization: `Bearer ${t}`,
          },
        });
     if (!response.ok) {
        if(response.status === 401)
        {
          router.push('/login')
          return
        }
        const res = await response.json();
        setError(res.error || 'An error occurred while fetching data');
        return;
      }
      const result = await response.json();

      const rooms:Record<string, number> = {}
      let total_consumption = 0
      for (const item of result) {
        Object.entries(item).forEach(([key, value]) => {
          if (key === 'total_consumption') 
            total_consumption += Number(value);
          if (key !== 'day' && key !== 'total_consumption') {
            if (!rooms[key]) {
              rooms[key] = 0;
            }
            rooms[key]+= Number(value);
          }
        });
      }
      setLabels(result.map((item: any) => {
        const date = new Date(item.day);
        return `${date.getUTCDate().toString().padStart(2, '0')}-${(date.getUTCMonth() + 1).toString().padStart(2, '0')}`;
      }));
      setEnergyData(result.map((item: any) => Number(item.total_consumption)));
      setCostData(result.map((item: any) => (Number(item.total_consumption) * 5.34)));
      setRoomLabels(Object.keys(rooms));
      setRoomData(Object.values(rooms));
      setTotalConsumption(total_consumption);
      setDailyAvg(total_consumption / result.length);
      setError(''); // Clear any previous errors
      // Process the result as needed
    } catch (error) {
      console.error("Error fetching quarterly data:", error);
    }

  }

  useEffect(() => {
    fetchBillsData();
    const t = localStorage.getItem('token');
    setToken(t? t : '')
    
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center">
      <section className="w-full max-w-[1200px] p-5 bg-white rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-[#189ab4] mb-5">🗓️ Select Quarter</h2>
        <div className="flex gap-3 flex-wrap items-center">
          
          <select className="px-2 py-[6px] border border-[#ccc] rounded-md text-sm" value={quarter} onChange={e => setQuarter(e.target.value)}>
            <option value="0">Quarter</option>
            <option value="1">Q1</option>
            <option value="2">Q2</option>
            <option value="3">Q3</option>
            <option value="4">Q4</option>
          </select>
          <select className="px-2 py-[6px] border border-[#ccc] rounded-md text-sm" value={year} onChange={e => setYear(e.target.value)}>
            <option value="">Year</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
          </select>
            <button className="bg-[#0f6f89] text-white border-none px-4 py-[6px] rounded cursor-pointer text-sm" onClick={fetchQuarterlyData}>
            Load Bill
            </button>
          { error && (
            <p className="text-red-500 mt-2">{error}</p>)
          }
        </div>
      </section>

      <section className="w-full max-w-[1200px] p-5 bg-white rounded-xl shadow-md mt-5">
        <h2 className="text-2xl font-bold text-[#189ab4] mb-5">📚 Past Quarterly Bills</h2>
        <table className="w-full border-collapse mt-3">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2 text-center bg-[#e0f7fa] text-[#0f6f89]">Quarter</th>
              <th className="border border-gray-300 p-2 text-center bg-[#e0f7fa] text-[#0f6f89]">Period</th>
              <th className="border border-gray-300 p-2 text-center bg-[#e0f7fa] text-[#0f6f89]">Energy (kWh)</th>
              <th className="border border-gray-300 p-2 text-center bg-[#e0f7fa] text-[#0f6f89]">Amount (DA)</th>
              <th className="border border-gray-300 p-2 text-center bg-[#e0f7fa] text-[#0f6f89]">% Δ(prev)</th>
            </tr>
          </thead>
          <tbody>
            {billsData.map((row, index) => (
              <tr key={index}>
                <td className="border border-gray-300 p-2 text-center">{row.quarter}</td>
                <td className="border border-gray-300 p-2 text-center">{row.period}</td>
                <td className="border border-gray-300 p-2 text-center">{row.energy}</td>
                <td className="border border-gray-300 p-2 text-center">{row.amount}</td>
                <td className="border border-gray-300 p-2 text-center">{row.delta}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      
      <section className="w-full max-w-[1200px] p-5 bg-white rounded-xl shadow-md mt-5">
        <h2 className="text-2xl font-bold text-[#189ab4] mb-5">💳 Summary & Next-Quarter Forecast</h2>
        <div className="flex gap-5 mt-3 flex-wrap">
            <div className="flex-1 min-w-[180px] bg-[#f1fcff] border border-[#cde] rounded-lg p-3 text-center">
            <h3 className="my-1 text-[16px] text-[#0f6f89] font-bold">Current Quarterly Bill</h3>
            <p className="text-[20px] font-bold text-[#fdb750]">{(total_consumption* 5.34).toFixed(2)} DA</p>
            </div>
          <div className="flex-1 min-w-[180px] bg-[#f1fcff] border border-[#cde] rounded-lg p-3 text-center">
            <h3 className="my-1 text-[16px] text-[#0f6f89] font-bold">Avg Daily Cost</h3>
            <p className="text-[20px] font-bold text-[#fdb750]">{(dailyAvg* 5.34).toFixed(2)} DA</p>
          </div>
          <div className="flex-1 min-w-[180px] bg-[#f1fcff] border border-[#cde] rounded-lg p-3 text-center">
            <h3 className="my-1 text-[16px] text-[#0f6f89] font-bold">Forecast {forecastQ}</h3>
            <p className="text-[20px] font-bold text-[#fdb750]">- DA</p>
          </div>
        </div>
      </section>

      <section className="w-full max-w-[1200px] p-5 bg-white rounded-xl shadow-md mt-5">
        <h2 className="text-2xl font-bold text-[#189ab4] mb-5">📊 Cost Breakdown</h2>
        <div className="flex justify-center justify-self-center w-[600px]">
          <ChartCard 
          height={100}
          type='doughnut'
          labels={roomLabels}
          datasets={[{
          data:roomData,
          backgroundColor: roomLabels.map(() => `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`)
        }]}
        />
        </div>
      </section>

      <section className="w-full max-w-[1200px] p-5 bg-white rounded-xl shadow-md mt-5">
        <h2 className="text-2xl font-bold text-[#189ab4] mb-5">📈 Daily Cost & Alerts</h2>
        <div className="flex justify-center justify-self-center w-full">
          <ChartCard 
            type='line'
            labels={labels}
            datasets={[{
              label:'DA/day',
              data:costData,
              borderColor:'#0f6f89', fill:true,
              backgroundColor:'rgba(15,111,137,0.1)',
              pointRadius:5,
              pointBackgroundColor: (costData.map((v, i) =>
                v >= 200 ? '#FDB750':'#0F6F89'
              ))
            }]}
            options={
              {responsive:true, plugins:{legend:{display:false}},
              scales:{
                y:{beginAtZero:true,title:{display:true,text:'DA'}},
                x:{title:{display:true,text:'Day of Quarter'}}
              }}
            }
          />
        </div>
      </section>


      <section className="w-full max-w-[1200px] p-5 bg-white rounded-xl shadow-md mt-5">
        <h2 className="text-2xl font-bold text-[#189ab4] mb-5">📈 Cost Efficiency & Historical Trends</h2>
        <div className="flex w-full">
          <ChartCard 
          title="kWh vs. DA/day"
            type='line'
            labels={energyData.map(v => v.toFixed(2))}
            datasets={[{
              label:'Daily Efficiency',
              data:costData,
              backgroundColor:'#0f6f89'
            }]}
            options={
              {responsive:true,
              scales:{
                x:{title:{display:true,text:'kWh/day'}},
                y:{title:{display:true,text:'DA/day'}}
              }}
            }
          />
          {/* <ChartCard 
            title='Per-Unit Cost: Last 6 Quarters'
            type='line'
            labels={['Q3 24','Q4 24','Q1 25','Q2 25','Q3 25','Q4 25']}
            datasets={[{
              data:[5.8,5.6,5.95,6.1,5.9,6.2],
              borderColor:'#189AB4', fill:false, pointRadius:0, tension:0.4
            }]}
            options={
                {responsive:true,
                scales:{x:{display:false},y:{display:false}},
                plugins:{legend:{display:false},tooltip:{enabled:false}}}
              }
          /> */}
        </div>
      </section>

      <section className="w-full max-w-[1200px] p-5 bg-white rounded-xl shadow-md mt-5">
        <h2 className="text-2xl font-bold text-[#189ab4] mb-5">📥 Export & Share</h2>
        <div className="flex gap-4" >
          <button className="bg-[#06d6a0] text-[#034d3f] border-none px-4 py-2 rounded cursor-pointer mr-2" 
          >
            Download PDF
          </button>
          <button className="bg-[#06d6a0] text-[#034d3f] border-none px-4 py-2 rounded cursor-pointer mr-2" 
            onClick={async (e)=>{
              e.preventDefault();
              const res = await fetch(`${API_URL}/bills/download/${quarter}/${year}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });

              const blob = await res.blob();
              const url = window.URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.setAttribute('download', `bills_${quarter}_${year}.csv`);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              window.URL.revokeObjectURL(url);
            }}
          >
            Download CSV
          </button>
        </div>
      </section>
      
    </main>
  );
}