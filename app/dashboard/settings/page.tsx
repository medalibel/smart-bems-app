'use client'
import { useState,useEffect } from 'react';
import {useRouter} from 'next/navigation'
import ToggleSwitch from '@/components/toggle-switch';

interface User {
  username:string | undefined,
  email:string | undefined,
  phone_number:string | undefined,
    address:string | undefined,
    building_type:string | undefined,
    city:string | undefined,
    state:string | undefined,
    construction_year:string | undefined,
    first_floor_square_footage:string | undefined,
    total_square_footage:string | undefined,
}
export default function SettingsPage() {
  const router = useRouter()
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5001/api";
  const [kwh, setKwh] = useState('2000');
  const [threshold, setThreshold] = useState('90');
  const [updateStatus,setUpdateStatus] = useState('')
  const [userData,setUserData] = useState<User|null>(null)

  const handleSaveBudget = () => {
    // Logic to save the budget would go here
    console.log('Saving budget:', { kwh, threshold });
    alert(`Budget Saved!\nTarget kWh: ${kwh}\nAlert Threshold: ${threshold}%`);
  };

  const updateUserData = async () =>{
     try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }
      const response = await fetch(`${API_URL}/user/update`,{
          method:'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body:JSON.stringify({username:userData?.username, email:userData?.email, phone_number:userData?.phone_number}),
        });
      if (!response.ok) {
        if(response.status === 401)
        {
          router.push('/login')
          return
        }
        setUpdateStatus('error')
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      else
        setUpdateStatus('ok')
    } catch (error) {
      console.error("Error fetching weekly data:", error);
    }
  }
  const fetchUserData = async ()=> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }
      const response = await fetch(`${API_URL}/user`,{
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
      console.log(result)
      setUserData(result)
    } catch (error) {
      console.error("Error fetching weekly data:", error);
    }
  }

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

  useEffect(()=>{
    fetchUserData()
  },[])

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
              value={userData?.username || ''}
              onChange={(e)=> setUserData({...userData, username:e.target.value} as User)}
              className="mt-1.5 p-2 border border-gray-300 rounded text-sm text-black"
            />
          </label>
          <label className="flex-1 basis-[400px] flex flex-col text-sm text-[#0f6f89]">
            Email Address
            <input
              type="email"
              value={userData?.email || ''}
              onChange={(e)=> setUserData({...userData, email:e.target.value} as User)}
              className="mt-1.5 p-2 border border-gray-300 rounded text-sm text-black"
            />
          </label>
          <label className="flex-1 basis-[400px] flex flex-col text-sm text-[#0f6f89]">
            Phone Number
            <input
              type="tel"
              value={userData?.phone_number || ''}
              onChange={(e)=> setUserData({...userData, phone_number:e.target.value} as User)}
              className="mt-1.5 p-2 border border-gray-300 rounded text-sm text-black"
            />
          </label>
          <label className="flex-1 basis-[400px] flex flex-col text-sm text-[#0f6f89]">
            Home Address
            <input
              type="text"
              value={userData?.address || ''}
              readOnly
              className="mt-1.5 p-2 border border-gray-300 rounded text-sm text-black"
            />
          </label>
          <label className="flex-1 basis-[400px] flex flex-col text-sm text-[#0f6f89]">
            City
            <input
              type="text"
              value={userData?.city || ''}
              readOnly
              className="mt-1.5 p-2 border border-gray-300 rounded text-sm text-black"
            />
          </label>
          <label className="flex-1 basis-[400px] flex flex-col text-sm text-[#0f6f89]">
            State
            <input
              type="text"
              value={userData?.state || ''}
              readOnly
              className="mt-1.5 p-2 border border-gray-300 rounded text-sm text-black"
            />
          </label>
          <label className="flex-1 basis-[400px] flex flex-col text-sm text-[#0f6f89]">
            Building Type
            <input
              type="text"
              value={userData?.building_type || ''}
              readOnly
              className="mt-1.5 p-2 border border-gray-300 rounded text-sm text-black"
            />
          </label>
          
        </div>
        <button className="bg-[#0f6f89] text-white border-none px-4 py-[6px] rounded cursor-pointer text-sm" onClick={()=> updateUserData()}>
            Save Profile
        </button>
        <button className="bg-red-500 ml-4 text-white border-none px-4 py-[6px] rounded cursor-pointer text-sm" 
          onClick={()=> 
          {localStorage.removeItem('token');
            router.push('/login')}}>
            Logout
        </button>
        {updateStatus === 'error' && (<p className=' text-red-400'>{'Could not update user info'}</p>)}
        {updateStatus === 'ok' && (<p className=' text-green-400'>{'User info updated'}</p>)}
      </section>
    </main>
  );
}