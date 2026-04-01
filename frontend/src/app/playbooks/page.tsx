'use client';
import { Play } from 'lucide-react';
import PlaybookEditor from '@/components/PlaybookEditor';
import { useState } from 'react';

export default function PlaybooksPage() {
  const [editorOpen, setEditorOpen] = useState(false);

  // Mock list for visual demo format
  const mockPlaybooks = [
    { id: 1, name: 'Phishing Email Triage', active: true, nodes: 15 },
    { id: 2, name: 'Malware Isolate Endpoint', active: true, nodes: 4 },
    { id: 3, name: 'Ransomware Outbreak Protocol', active: false, nodes: 32 }
  ];

  if (editorOpen) {
    return <PlaybookEditor onClose={() => setEditorOpen(false)} />;
  }

  return (
    <div className="p-8 w-full h-full">
      <header className="mb-10 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold mb-2 shadow-soc-accent">Playbook Library</h1>
          <p className="text-gray-400">Manage and orchestrate automated workflows.</p>
        </div>
        <button 
          onClick={() => setEditorOpen(true)}
          className="bg-soc-accent text-soc-dark font-bold py-2 px-6 rounded-lg hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all flex items-center gap-2"
        >
          <span>+ Create Playbook</span>
        </button>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockPlaybooks.map((pb) => (
          <div key={pb.id} className="bg-soc-card border border-white/5 rounded-2xl p-6 hover:border-soc-accent/50 transition-colors cursor-pointer group flex flex-col justify-between h-48">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-medium">{pb.name}</h3>
              <div className={`px-2 py-1 text-xs rounded-md ${pb.active ? 'bg-soc-success/20 text-soc-success' : 'bg-gray-500/20 text-gray-400'}`}>
                {pb.active ? 'Active' : 'Draft'}
              </div>
            </div>
            
            <div className="flex justify-between items-end mt-4">
               <span className="text-gray-400 text-sm">Nodes: {pb.nodes}</span>
               <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-soc-accent group-hover:text-soc-dark transition-colors">
                  <Play className="w-4 h-4 ml-1" />
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
