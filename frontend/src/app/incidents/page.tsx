import Link from 'next/link';

export default function IncidentsPage() {
  const incidents = [
    { id: '101', title: 'Suspicious Login from Unusual Geo', severity: 'Critical', status: 'In-Progress' },
    { id: '102', title: 'Multiple Failed Kerberos Tickets', severity: 'Medium', status: 'Pending' }
  ];

  return (
    <div className="p-8 w-full h-full text-white">
      <header className="mb-10">
        <h1 className="text-3xl font-semibold mb-2 shadow-soc-accent">Incident Management</h1>
        <p className="text-gray-400">View active cases and enter Virtual War Rooms.</p>
      </header>

      <div className="flex flex-col gap-4">
        {incidents.map((inc) => (
          <Link key={inc.id} href={`/incidents/${inc.id}`}>
            <div className="bg-soc-card p-6 border border-white/5 rounded-xl flex items-center justify-between hover:border-soc-accent transition cursor-pointer">
              <div>
                <span className="text-xs font-mono text-gray-500 mb-1 block">CASE ID: #{inc.id}</span>
                <span className="text-xl font-medium">{inc.title}</span>
              </div>
              <div className="flex items-center gap-6">
                 <span className={`text-sm ${inc.severity === 'Critical' ? 'text-soc-danger' : 'text-soc-warning'}`}>
                    {inc.severity}
                 </span>
                 <span className="bg-white/5 px-4 py-2 rounded-full text-xs">{inc.status}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
