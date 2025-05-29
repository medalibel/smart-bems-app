import ConsumptionOverview from "@/components/consumption-overview";
import ChartCard from "@/components/chart-card";
export default function HistoryPage() {
  const donutLabels = ['Appliances','Lighting','HVAC','Standby']
  const donutData = [35,20,30,15]


  const data = [
    {
      quarter: 'Q1 2025',
      period: 'Jan–Mar 2025',
      energy: '1 714.00',
      amount: '10 198.96',
      delta: '+8.7 %',
    },
    {
      quarter: 'Q4 2024',
      period: 'Oct–Dec 2024',
      energy: '1 680.00',
      amount: '9 385.00',
      delta: '–2.3 %',
    },
    {
      quarter: 'Q3 2024',
      period: 'Jul–Sep 2024',
      energy: '1 590.00',
      amount: '9 616.00',
      delta: '+5.1 %',
    },
  ];

  return (
    <main className="flex min-h-screen flex-col items-center">
      <section className="w-full max-w-[1200px] p-5 bg-white rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-[#189ab4] mb-5">🗓️ Select Quarter</h2>
        <div className="flex gap-3 flex-wrap items-center">
          
          <select className="px-2 py-[6px] border border-[#ccc] rounded-md text-sm" id="preset">
            <option value="">Quarter</option>
            <option value="1">Q1</option>
            <option value="2">Q2</option>
            <option value="3">Q3</option>
            <option value="4">Q4</option>
          </select>
          <select className="px-2 py-[6px] border border-[#ccc] rounded-md text-sm" id="preset">
            <option value="">Year</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
          </select>
            <button className="bg-[#0f6f89] text-white border-none px-4 py-[6px] rounded cursor-pointer text-sm">
            Load Bill
            </button>
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
            {data.map((row, index) => (
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
            <p className="text-[20px] font-bold text-[#fdb750]">10 198.96 DA</p>
            </div>
          <div className="flex-1 min-w-[180px] bg-[#f1fcff] border border-[#cde] rounded-lg p-3 text-center">
            <h3 className="my-1 text-[16px] text-[#0f6f89] font-bold">Avg Daily Cost</h3>
            <p className="text-[20px] font-bold text-[#fdb750]">110.97 DA</p>
          </div>
          <div className="flex-1 min-w-[180px] bg-[#f1fcff] border border-[#cde] rounded-lg p-3 text-center">
            <h3 className="my-1 text-[16px] text-[#0f6f89] font-bold">Forecast Q2 2025</h3>
            <p className="text-[20px] font-bold text-[#fdb750]">11 250 DA</p>
          </div>
        </div>
      </section>

      <section className="w-full max-w-[1200px] p-5 bg-white rounded-xl shadow-md mt-5">
        <h2 className="text-2xl font-bold text-[#189ab4] mb-5">📊 Cost Breakdown</h2>
        <div className="flex justify-center justify-self-center w-[600px]">
          <ChartCard 
          height={100}
          type='doughnut'
          labels={donutLabels}
          datasets={[{
          data:[35,20,30,15],
          backgroundColor:['#189AB4','#FFD166','#06D6A0','#F07167']
        }]}
        />
        </div>
      </section>

      <section className="w-full max-w-[1200px] p-5 bg-white rounded-xl shadow-md mt-5">
        <h2 className="text-2xl font-bold text-[#189ab4] mb-5">📈 Daily Cost & Alerts</h2>
        <div className="flex justify-center justify-self-center w-full">
          <ChartCard 
            type='line'
            labels={['Day 1','Day 2','Day 3','Day 4','Day 5','Day 6','Day 7','Day 8','Day 9','Day 10']}
            datasets={[{
              label:'DA/day',
              data:[110,115,108,120,130,125,118,122,128,135],
              borderColor:'#0f6f89', fill:true,
              backgroundColor:'rgba(15,111,137,0.1)',
              pointRadius:5,
              pointBackgroundColor: ([110,115,108,120,130,125,118,122,128,135].map((v, i) =>
                v >= 130 ? '#FDB750':'#0F6F89'
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
            type='scatter'
            labels={[]}
            datasets={[{
              label:'Daily Efficiency',
              data:[
                {x:20, y:110},{x:22, y:115},{x:18, y:108},
                {x:24, y:120},{x:26, y:130},{x:25, y:125},
                {x:23, y:118},{x:24, y:122},{x:27, y:128},
                {x:28, y:135}
              ],
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
          <ChartCard 
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
          />
        </div>
      </section>

      <section className="w-full max-w-[1200px] p-5 bg-white rounded-xl shadow-md mt-5">
        <h2 className="text-2xl font-bold text-[#189ab4] mb-5">📥 Export & Share</h2>
        <div className="flex gap-4" >
          <button className="bg-[#06d6a0] text-[#034d3f] border-none px-4 py-2 rounded cursor-pointer mr-2">
            Download PDF
          </button>
          <button className="bg-[#06d6a0] text-[#034d3f] border-none px-4 py-2 rounded cursor-pointer mr-2" >Export CSV</button>
        </div>
      </section>
      
    </main>
  );
}