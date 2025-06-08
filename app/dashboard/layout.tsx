import TopNav from "@/components/top-nav";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header>
        <div className="h-16 px-[30px] flex items-center justify-between bg-[#0f6589]">
          <img src="/logo.jpg" alt="Logo" className="w-12 h-12 mr-3" />
          <h1 className=" text-2xl text-white font-bold">SmartHome Energy Management System</h1>
          <div className="text-xl">🔔 👤</div>
        </div>
        <nav className="flex flex-wrap items-center justify-center gap-5 bg-[#188bb4] text-white p-3">
          <TopNav />
        </nav>
      </header>
      
      <main className="flex-grow p-4 md:overflow-y-auto md:p-5">{children}</main>
      
      <footer className='mt-8 p-4 bg-[#0f6f89] text-center text-white'>© 2025 SmartHome Energy Management System</footer>
    </>

  );
}