import ConsumptionOverview from "@/components/consumption-overview";
import ChartCard from "@/components/chart-card";
export default function HistoryPage() {
  let peakExpectaion = 'Peak expected on Thursday; 95% band ±0.25 kWh'
  const WEEK_LABELS  = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const HISTORICAL   = [1.0,1.2,1.1,1.5,1.4,1.3,1.6];
  const FORECAST     = [1.1,1.3,1.2,1.6,1.5,1.4,1.7];
  const TEMPERATURE  = [15,16,17,18,17,16,15];
  const CONF_UPPER   = FORECAST.map(v=>v+0.25);
  const CONF_LOWER   = FORECAST.map(v=>v-0.25);
  const COSTS        = FORECAST.map(v=>(v*0.15).toFixed(2));

  return (
    <main className="flex min-h-screen flex-col items-center">
      <section className="w-full max-w-[1200px] p-5 bg-white rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-[#189ab4] mb-5">📅 Forecast Horizon Selector</h2>
        <div className="flex gap-3 flex-wrap items-center">
          <label className="">Choose horizon:</label>
          <select className="bg-[#0f6f89] text-white border-none px-4 py-[6px] rounded cursor-pointer text-sm" id="preset">
            <option value="week">Next 7 days</option>
            <option value="quarter">Next 3 months</option>
          </select>
            <button className="bg-[#0f6f89] text-white border-none px-4 py-[6px] rounded cursor-pointer text-sm">
            Apply Forecast
            </button>
        </div>
      </section>

      <section className="w-full max-w-[1200px] p-5 bg-white rounded-xl shadow-md mt-5">
        <h2 className="text-2xl font-bold text-[#189ab4]">🔮 Forecasted vs Historical Usage</h2>
      
        <div className="flex gap-3 justify-center mb-5 w-full">
          <ChartCard height={150} type='line' 
            labels={WEEK_LABELS} 
            datasets={ [{ label: 'Historical (kWh)', data: HISTORICAL, borderColor: '#189AB4', fill: false },
              { label: 'Forecast (kWh)',   data: FORECAST,   borderColor: '#EF476F', fill: false },
              { label: 'Temp (°C)',         data: TEMPERATURE, borderColor: '#06D6A0',
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
            labels={WEEK_LABELS} 
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
        
        <p className="mt-4 italic text-[#0f6f89]">{peakExpectaion}</p>
      </section>

      <section className="w-full max-w-[1200px] p-5 bg-white rounded-xl shadow-md mt-5">
        <h2 className="text-2xl font-bold text-[#189ab4]">📉 Predicted Cost by Day</h2>
      
        <div className="flex gap-3 justify-center mb-5 w-full">
          <ChartCard height={100} type='bar' 
            labels={WEEK_LABELS} 
            datasets={ [{
              label: 'Predicted Cost ($)',
              data: COSTS,
              backgroundColor: '#0F6F89'
            }]}  
            options={{
              responsive: true,
              scales: {
                y: { beginAtZero: true, title: { display: true, text: '$' } }
              }
            }}/>
        </div>
    
      </section>
     
      
    </main>
  );
}