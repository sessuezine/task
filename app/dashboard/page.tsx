export default function DashboardPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded shadow">
          <h2 className="font-bold mb-2">Tasks</h2>
          {/* Task content */}
        </div>
        <div className="p-4 bg-white rounded shadow">
          <h2 className="font-bold mb-2">Journal</h2>
          {/* Journal content */}
        </div>
        <div className="p-4 bg-white rounded shadow">
          <h2 className="font-bold mb-2">AI Chat</h2>
          {/* Chat content */}
        </div>
      </div>
    </div>
  );
} 