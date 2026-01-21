export default function DarkLayout({ title, children }) {
  return (
    <div className="min-h-screen flex justify-center px-4 py-10">
      <div className="w-full max-w-5xl">
        <h1 className="text-3xl font-bold mb-8 text-white">
          {title}
        </h1>

        <div className="bg-[#111827] border border-white/10 rounded-xl p-6 shadow-xl">
          {children}
        </div>
      </div>
    </div>
  );
}
