export default function StatCard({
  title,
  info,
}: {
  title: string;
  info: string | number;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl bg-white p-6 shadow-md flex-1 basis-[400px] ">
      <h3 className="text-lg font-semibold text-[#189ab4] text-center my-2">{title}</h3>
      <p className="text-[26px] font-bold text-[#FDB750] my-1">{info}</p>
    </div>
  );
}