export default function DashboardPanel({ title, action, children }) {
  return (
    <section className="flex min-w-0 flex-col overflow-hidden rounded-md border border-line bg-card shadow-card">
      <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
        <h2 className="text-sm font-bold">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}
