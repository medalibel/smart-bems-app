export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (

    <main className="min-h-screen flex items-center justify-center bg-[#A5DCEC]">
      {children}
    </main>

  );
}