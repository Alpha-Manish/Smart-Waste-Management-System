

export function Dashboard() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Welcome to the Smart Urban Waste Management System.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Placeholder cards to show layout */}
        {[1, 2, 3, 4].map((i) => (
          <div 
            key={i} 
            className="p-6 rounded-xl bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border shadow-sm"
          >
            <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 mb-4"></div>
            <div className="h-4 w-1/2 bg-slate-200 dark:bg-dark-border rounded mb-2"></div>
            <div className="h-6 w-3/4 bg-slate-200 dark:bg-dark-border rounded"></div>
          </div>
        ))}
      </div>

      <div className="h-96 rounded-xl bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border shadow-sm p-6 flex items-center justify-center text-slate-400 dark:text-slate-500">
        AI Prediction Chart Placeholder
      </div>
    </div>
  );
}
