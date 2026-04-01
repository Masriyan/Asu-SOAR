import WarRoom from '@/components/WarRoom';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function IncidentDetail({ params }: { params: { id: str } }) {
  return (
    <div className="h-full flex flex-col bg-soc-dark text-white">
      <header className="px-8 py-4 border-b border-white/5 flex items-center gap-4">
        <Link href="/incidents" className="text-gray-400 hover:text-soc-accent transition">
           <ArrowLeft className="w-5 h-5" />
        </Link>
        <span className="font-mono text-soc-accent">CASE #{params.id}</span>
        <h1 className="text-xl font-medium">Virtual War Room Dashboard</h1>
      </header>
      
      <div className="flex-1 flex overflow-hidden">
         {/* Left col: Timeline and Context */}
         <div className="w-1/2 border-r border-white/5 p-6 overflow-y-auto hidden md:block">
            <h2 className="text-sm text-gray-400 uppercase tracking-widest mb-4">Context Artifacts</h2>
            <div className="bg-soc-card rounded-xl p-4 border border-white/5 font-mono text-sm">
                <div className="text-soc-danger break-all">{`{"VirusTotal": {"Score": 90, "Verdict": "Malicious"}}`}</div>
            </div>
         </div>
         
         {/* Right col: Live ChatOps */}
         <div className="flex-1">
             <WarRoom incidentId={params.id} />
         </div>
      </div>
    </div>
  );
}
