'use client'
import { useState } from 'react';
import ToggleSwitch from '@/components/toggle-switch';
export default function SettingsPage() {
  const [kwh, setKwh] = useState('2000');
  const [threshold, setThreshold] = useState('90');
  const handleSaveBudget = () => {
    // Logic to save the budget would go here
    console.log('Saving budget:', { kwh, threshold });
    alert(`Budget Saved!\nTarget kWh: ${kwh}\nAlert Threshold: ${threshold}%`);
  };

  let devicesData = [
    {
      deviceName:'Air Conditioner',
      location:'Living Room',
      status:true,
    },
    {
      deviceName:'Refrigerator',
      location:'Kitchen',
      status:true,
    },
    {
      deviceName:'Washing Machine',
      location:'Laundry Room',
      status:false,
    },
  ]
  return (
    <main className="flex min-h-screen flex-col items-center">
      <section className="w-full max-w-[1200px] p-5 bg-white rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-[#189ab4] mb-5">💸 Quarterly Energy Budget</h2>
        <div className="flex flex-wrap gap-4 mb-4">
          <label htmlFor="budget_kwh" className="flex-1 basis-[400px] flex flex-col text-sm text-[#0f6f89]">
            Target kWh per quarter
            <input
              type="number"
              id="budget_kwh"
              value={kwh}
              onChange={(e) => setKwh(e.target.value)}
              min="0"
              className="mt-1.5 p-2 border border-gray-300 rounded text-sm text-black"
            />
          </label>
          <label htmlFor="budget_thresh" className="flex-1 basis-[400px] flex flex-col text-sm text-[#0f6f89]">
            Alert threshold (%)
            <select
              id="budget_thresh"
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
              className="mt-1.5 p-2 border border-gray-300 rounded text-sm bg-white text-black" // Added bg-white for select arrow visibility
            >
              <option value="75">75%</option>
              <option value="90">90%</option>
              <option value="100">100%</option>
            </select>
          </label>
          <button
            id="saveBudget"
            onClick={handleSaveBudget}
            className="self-end bg-[#0f6f89] text-white border-none px-4 py-[6px] rounded cursor-pointer hover:bg-[#0d5c71]"
          >
            Save Budget
          </button>
        </div>
      </section>
      <section className="w-full max-w-[1200px] p-5 bg-white rounded-xl shadow-md mt-5">
        <h2 className="text-2xl font-bold text-[#189ab4] mb-5">⚙️ Manage Devices</h2>
        <table className="w-full border-collapse mt-3">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2 text-left bg-[#e0f7fa] text-[#0f6f89]">Device</th>
              <th className="border border-gray-300 p-2 text-left bg-[#e0f7fa] text-[#0f6f89]">Location</th>
              <th className="border border-gray-300 p-2 text-left bg-[#e0f7fa] text-[#0f6f89]">IoT Status</th>
            </tr>
          </thead>
          <tbody>
            {devicesData.map((row, index) => (
              <tr key={index}>
                <td className="border border-gray-300 p-2 ">{row.deviceName}</td>
                <td className="border border-gray-300 p-2 ">{row.location}</td>
                <td className="border border-gray-300 p-2 "><ToggleSwitch initialChecked={row.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="bg-[#0f6f89] text-white border-none px-4 py-[6px] rounded cursor-pointer text-sm mt-5">
          Add New Device
        </button>
      </section>
      <section className="w-full max-w-[1200px] p-5 bg-white rounded-xl shadow-md mt-5">
        <h2 className="text-2xl font-bold text-[#189ab4] mb-5">👤 Profile & Home Info</h2>
        <div className="flex flex-wrap gap-4 mb-4">
          <label className="flex-1 basis-[400px] flex flex-col text-sm text-[#0f6f89]">
            Full Name
            <input
              type="text"
              value={'John Doe'}
              className="mt-1.5 p-2 border border-gray-300 rounded text-sm text-black"
            />
          </label>
          <label className="flex-1 basis-[400px] flex flex-col text-sm text-[#0f6f89]">
            Email Address
            <input
              type="email"
              value={'john.doe@example.com'}
              className="mt-1.5 p-2 border border-gray-300 rounded text-sm text-black"
            />
          </label>
          <label className="flex-1 basis-[400px] flex flex-col text-sm text-[#0f6f89]">
            Phone Number
            <input
              type="tel"
              value={'+213698877654'}
              className="mt-1.5 p-2 border border-gray-300 rounded text-sm text-black"
            />
          </label>
          <label className="flex-1 basis-[400px] flex flex-col text-sm text-[#0f6f89]">
            Home Address
            <input
              type="text"
              value={'123 Palm St, Algiers'}
              className="mt-1.5 p-2 border border-gray-300 rounded text-sm text-black"
            />
          </label>
          
        </div>
        <button className="bg-[#0f6f89] text-white border-none px-4 py-[6px] rounded cursor-pointer text-sm">
            Save Profile
        </button>
      </section>
    </main>
  );
}