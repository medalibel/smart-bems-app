import ConsumptionOverview from "@/components/consumption-overview";
import ChartCard from "@/components/chart-card";
export default function HistoryPage() {
  const labelsDaily = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  const dataDaily   = [4.2, 3.8, 4.0, 4.5, 4.1, 5.0, 4.8];

  const roomLabels = ["Kitchen","Living Room","Bedroom","Bathroom","HVAC"];
  const roomData   = [1.8,      1.2,           0.9,        0.7,        0.2   ]
  
  const usage = {
    labelsDaily,
    dataDaily
  }
  return (
    <main className="flex min-h-screen flex-col items-center">
      <section className="w-full max-w-[1200px] p-5 bg-white rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-[#189ab4] mb-5">📊 Custom Range Selector</h2>
        <div className="flex gap-3 flex-wrap items-center">
          <label className="">From: <input className="px-2 py-[6px] border border-[#ccc] rounded-md text-sm" type="date" id="startDate" /></label>
          <label>To:   <input className="px-2 py-[6px] border border-[#ccc] rounded-md text-sm" type="date" id="endDate" /></label>
          <select className="px-2 py-[6px] border border-[#ccc] rounded-md text-sm" id="preset">
            <option value="">— Preset Ranges —</option>
            <option value="1">Last Day</option>
            <option value="7">Last 7 Days</option>
            <option value="30">Last Month</option>
            <option value="90">Last Quarter</option>
            <option value="365">Last Year</option>
          </select>
            <button className="bg-[#0f6f89] text-white border-none px-4 py-[6px] rounded cursor-pointer text-sm">
            Apply
            </button>
        </div>
      </section>

      <ConsumptionOverview consumptionData={usage}/>

      <section className="w-full max-w-[1200px] p-5 bg-white rounded-xl shadow-md mt-5">
        <h2 className="text-2xl font-bold text-[#189ab4] mb-5">🧩 Usage by Room / Circuit</h2>
        <ChartCard height={100} type='bar' labels={roomLabels} 
          datasets={ [{
            label: "Usage by Room (kWh)",
            data: roomData,
            backgroundColor: ["#0F6F89","#189AB4","#FFD166","#06D6A0","#EF476F"]
          }]}  
          options={{
            responsive: true,
            scales: { y: { beginAtZero: true, title: { display:true, text:"kWh" } } }}}/>
        </section>

        <section className="w-full max-w-[1200px] p-5 bg-white rounded-xl shadow-md mt-5">
          <h2 className="text-2xl font-bold text-[#189ab4] mb-5">🧮 Download Data</h2>
          <div className="flex gap-4" >
            <button className="bg-[#06d6a0] text-[#034d3f] border-none px-4 py-2 rounded cursor-pointer mr-2">
              Download CSV
            </button>
            <button className="bg-[#06d6a0] text-[#034d3f] border-none px-4 py-2 rounded cursor-pointer mr-2" >Download Excel</button>
          </div>
        </section>
      
    </main>
  );
}