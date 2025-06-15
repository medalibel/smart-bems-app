'use client'
import ConsumptionOverview from "@/components/consumption-overview";
import ChartCard from "@/components/chart-card";
import {useState} from 'react'
import { useRouter } from "next/navigation";
export default function HistoryPage() {
  const router = useRouter()
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5001/api";

  const [date,setDate] = useState('')
  const [report,setReport] = useState<Record<string, string[]>>({})

  const hours = Array.from({length:24},(_,i)=>`${i}:00`);
    const hourlyData = [0.2,0.18,0.15,0.14,0.13,0.12,0.2,0.4,0.8,1.2,1.5,1.7,1.6,1.4,1.3,1.4,1.6,2.0,2.3,2.1,1.9,1.5,1.0,0.6];
    const pieLabels = ["Appliances","Lighting","HVAC"];
    const pieData   = [45,25,30];
  let h3Style = "my-2 font-bold text-[#0f6f89] text-[18px] border-b border-[#cde] pb-1"
  const loadReport = async ()=>{
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }
      const response = await fetch(`${API_URL}/report/${date}`,{
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
      const result = await response.text();
      
      const sectionRegex = /(\d+)\)\s*([^\->]+)->\s*\[(.*?)\](?=\s*\d+\)|\s*$)/gs;
      const r: Record<string, string[]> = {};
      let match: RegExpExecArray | null;

      while ((match = sectionRegex.exec(result)) !== null) {
        const title = match[2].trim();
        const itemsText = match[3];

        const itemRegex = /-\s*"([^"]+)"/g;
        let itemMatch: RegExpExecArray | null;
        const items: string[] = [];

        while ((itemMatch = itemRegex.exec(itemsText)) !== null) {
          items.push(itemMatch[1]);
        }

        r[title] = items;
      }

      console.log(r);
      setReport(r)

    } catch (error) {
      console.error("Error fetching weekly data:", error);
    }
  }
  return (
    <main className="flex min-h-screen flex-col items-center">
      <section className="w-full max-w-[1200px] p-5 bg-white rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-[#189ab4] mb-5">📆 Select Report Date</h2>
        <div className="flex gap-3 flex-wrap items-center">
            <input className="border border-solid p-1 rounded-[4px] border-[#ccc]" type="date" value={date} onChange={(e)=>setDate(e.target.value)} />
            <button className="bg-[#0f6f89] text-white border-none px-4 py-[6px] rounded cursor-pointer text-sm" 
              onClick={()=>loadReport()}
            >
            Load Report
            </button>
        </div>
      </section>

      <section className="w-full max-w-[1200px] p-5 bg-white rounded-xl shadow-md mt-5">
        <h2 className="text-2xl font-bold text-[#189ab4]">📄 Daily Report Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-3">
            <div className="bg-[#e0f7fa] border-2 border-[#cde] rounded-lg p-4 shadow-md">
              <h3 className={h3Style}>Breakdown</h3>
              {
                report?.Analysis?.map((item,i)=>(<p key={i} className=" mt-1 text-[#0f6f89]">• {item}</p>))
              }
            </div>
            <div className="bg-[#fff3e0] border-2 border-[#cde] rounded-lg p-4 shadow-md">
              <h3 className={h3Style}>Recommendations</h3>
              {
                report?.Recommendations?.map((item,i)=>(<p key={i} className=" mt-1 text-[#0f6f89]">• {item}</p>))
              }
            </div>
            <div className="bg-[#fdecea] border-2 border-[#cde] rounded-lg p-4 shadow-md">
            <h3 className={h3Style}>Alerts</h3>
              {
                report?.Alerts?.map((item,i)=>(<p key={i} className=" mt-1 text-[#0f6f89]">• {item}</p>))
              }
            </div>
            <div className="bg-[#f1f8e9] border-2 border-[#cde] rounded-lg p-4 shadow-md">
              <h3 className={h3Style}>Maintenance Tips</h3>
              {
                report?.Tips?.map((item,i)=>(<p key={i} className=" mt-1 text-[#0f6f89]">• {item}</p>))
              }
            </div>
        </div>
      </section>

      <section className="w-full max-w-[1200px] p-5 bg-white rounded-xl shadow-md mt-5">
        <h2 className="text-2xl font-bold text-[#189ab4]">🖼️ Charts Gallery</h2>
      
        <div className="flex gap-3 justify-center mb-5 w-full">
          <ChartCard height={100} type='line' 
            labels={hours} 
            datasets={ [{
              label:'kWh',
              data: hourlyData,
              borderColor:'#0f6f89',
              backgroundColor:'rgba(15,111,137,0.1)',
              fill:true, tension:0.3
            }]}  
            options={{
              responsive:true, scales:{y:{beginAtZero:true}}
              }}/>
          
          <ChartCard height={100} type='pie' 
            labels={pieLabels} 
            datasets={ [{
              data: pieData,
              backgroundColor:['#189AB4','#FFD166','#06D6A0']}
            ]}  
            options={{
              responsive: true,
            }}/>
        </div>
    
      </section>
     
     <section className="w-full max-w-[1200px] p-5 bg-white rounded-xl shadow-md mt-5">
        <h2 className="text-2xl font-bold text-[#189ab4] mb-5">📥 Actions</h2>
        <div className="flex gap-4" >
          <button className="bg-[#06d6a0] text-[#034d3f] border-none px-4 py-2 rounded cursor-pointer mr-2">
            Download PDF
          </button>
          <button className="bg-[#06d6a0] text-[#034d3f] border-none px-4 py-2 rounded cursor-pointer mr-2" >Share by Email</button>
        </div>
      </section>
      
    </main>
  );
}