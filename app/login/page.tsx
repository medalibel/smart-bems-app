'use client';
import { useState,useEffect, use } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5001/login";
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.token) {
        localStorage.setItem('token', data.token);
        router.push('/dashboard');
      } else {
        setError(data.error || 'Login failed');
      }
      } catch (err: any) {
        setError(err.message || 'Login failed');
      }
  };

  useEffect(()=>{
    const token = localStorage.getItem('token');
      if (token) {
        // check if the token is valid first
        //router.push('/dashboard');
        return;
      }
  },[])
  return (
    <div className='w-full flex justify-center p-8'>
      <div className='bg-white p-8 rounded-lg shadow-md md:w-[750px]'>
        <h1 className='font-extrabold text-4xl'>Welcome Back: </h1>
        <form className='mt-8' onSubmit={handleSubmit}>
          <div className=' mb-6 flex flex-col'>
            <label>Email:</label>
            <input
              className='p-2 bg-gray-100 border-b border-black focus:border-b-2 focus:border-[#FDB750] outline-none'
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className='relative mb-6 flex flex-col'>
            <label>Password:</label>
            <input
              className='p-2 bg-gray-100 border-b border-black focus:border-b-2 focus:border-[#FDB750] outline-none'
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button className='bg-[#189AB4] text-white py-2 px-6' type="submit" >Login</button>
        </form>
        {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
      
      </div>
    </div>
  );
}