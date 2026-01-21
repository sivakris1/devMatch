export default function PageWrapper({ title, children }) {
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      <div className="w-full max-w-4xl p-6">
        <h1 className="text-2xl font-bold mb-6">{title}</h1>
        <div className="bg-white rounded-lg shadow p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
