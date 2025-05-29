import BemsLogo from '@/components/bems-logo';
import {ArrowRightIcon} from '@heroicons/react/24/solid';
import { Mulish,Lusitana } from 'next/font/google';
import Link from 'next/link';
import Image from 'next/image'
import StatCard  from '@/components/stat-card';
import { ST } from 'next/dist/shared/lib/utils';
import ChartCard from '@/components/chart-card';
const mulish = Mulish({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function Page() {
  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);

  let realTimeLabels = ["00:00","02:00","04:00", "06:00","08:00","10:00","12:00","14:00","16:00","18:00","20:00","22:00",]
  let realTimeData = [0.8, 1.1, 0.9, 1.3, 1.8, 2.1, 1.9, 2.0, 2.2, 2.3, 2.0, 1.7,]
  
  let weeklyLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  let weeklyData = [4.2, 3.8, 4.0, 4.5, 4.1, 5.0, 4.8]

  let categoryLabels = ["Appliances", "Lighting", "HVAC"];
  let categoryData = [45, 25, 30];

  let totalData = [
          0.8, 1.1, 0.9, 1.3, 1.8, 2.1, 1.9, 2.0, 2.2, 2.3, 2.0, 1.7, 1.5, 1.2,
          1.4, 1.6, 1.7, 1.8, 2.0, 1.9, 1.6, 1.4, 1.2, 1.0,
        ];
  let roomsData = {
    Bathroom: [
      0.1, 0.2, 0.1, 0.1, 0.1, 0.2, 0.3, 0.2, 0.2, 0.2, 0.2, 0.1 /*…*/,
    ],
    Bedroom1: [
      0.1, 0.1, 0.1, 0.2, 0.2, 0.3, 0.2, 0.2, 0.2, 0.3, 0.2, 0.1 /*…*/,
    ],
    Kitchen: [
      0.2, 0.3, 0.2, 0.3, 0.4, 0.5, 0.4, 0.5, 0.5, 0.6, 0.5, 0.4 /*…*/,
    ],
    // add more if needed
  };
  let { peakInfo, datasets } = getPeakUsage(totalData, hours, roomsData);
  return (
    <main className="flex min-h-screen flex-col items-center">
      <div className='flex gap-5'>
        <StatCard title="Today's Total Consumption" value="3.54 kWh" /> 
        <StatCard title="Daily Cost" value="$4.28" /> 
        <StatCard title="Savings This Day" value="5% / $1.12" /> 
        <StatCard title="Yesterday’s Consump & Cost" value="7.12 kWh / $8.60" />  
      </div>
      <div className=" w-full max-w-[1280px] grid grid-cols-1 md:[grid-template-columns:repeat(2,minmax(300px,1fr))] gap-5 mt-8">

        <ChartCard title='Real-Time Usage' type='line' labels={realTimeLabels}  datasets={ [
            {
              label: "kW",
              data: realTimeData,
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
              backgroundColor: ["#189AB4", "#FFD166", "#06D6A0"],
            },
          ]} options= { {responsive: true }}/>
      </div>
    </main>
  );
}

function getPeakUsage(totalData: number[],hours: string[], rooms: Record<string, number[]>) {
  let peakIdx = totalData.reduce((maxI, v, i, a) => (v > a[maxI] ? i : maxI),0 );
  let peakTime = hours[peakIdx]
  let peakVal = totalData[peakIdx];

  let peakInfo = `Highest consumption today: ${peakTime} – ${peakVal.toFixed(2)} kWh`
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
              i === peakIdx ? "#FDB750" : "rgba(15,111,137,0.6)"
            ),
          },
        ];

        const palette = ["#189AB4", "#06D6A0", "#EF476F", "#FFD166"];
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
  return { peakInfo, datasets };
}