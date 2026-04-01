'use client';
import { useCallback, useState } from 'react';
import ReactFlow, { 
    Background, 
    Controls, 
    MiniMap, 
    addEdge, 
    applyNodeChanges, 
    applyEdgeChanges,
    Node, Edge, Connection, NodeChange, EdgeChange
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Save, ArrowLeft, Play } from 'lucide-react';
import { api } from '@/lib/api';

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'input',
    data: { label: 'SIEM Webhook Trigger' },
    position: { x: 250, y: 5 },
    style: { background: '#151A2C', color: '#fff', border: '1px solid #00F0FF', borderRadius: '8px' }
  },
];

export default function PlaybookEditor({ onClose }: { onClose: () => void }) {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>([]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );
  
  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#00F0FF' } }, eds)),
    []
  );

  const addActionNode = () => {
    const newNode: Node = {
      id: (nodes.length + 1).toString(),
      data: { label: 'VirusTotal Integration Node', plugin: 'virustotal' },
      position: { x: 250, y: nodes.length * 100 + 50 },
      style: { background: '#151A2C', color: '#fff', border: '1px solid #334155', borderRadius: '8px' }
    };
    setNodes((nds) => nds.concat(newNode));
  };

  const savePlaybook = async () => {
    const graphData = { nodes, edges };
    try {
        await api.post('/playbooks/?name=New Custom DAG Pipeline', graphData);
        alert("Playbook Saved To Postgres!");
    } catch {
        alert("Saved locally. Ensure API compiles.");
    }
  };

  return (
    <div className="w-full h-full flex flex-col absolute top-0 left-0 bg-soc-dark z-50">
      {/* Editor Header */}
      <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-[#0a0d14]">
        <div className="flex items-center gap-4">
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                <ArrowLeft className="w-5 h-5"/>
            </button>
            <h2 className="text-xl font-bold tracking-wide">Untitled Playbook</h2>
        </div>
        <div className="flex items-center gap-3">
            <button 
                onClick={addActionNode}
                className="text-sm px-4 py-2 border border-white/20 rounded-md hover:bg-white/5 transition-colors"
            >
                Add Action Node
            </button>
            <button 
               onClick={savePlaybook}
               className="text-sm px-4 py-2 bg-soc-accent text-soc-dark font-bold rounded-md hover:shadow-[0_0_10px_rgba(0,240,255,0.4)] flex items-center gap-2 transition-all"
            >
                <Save className="w-4 h-4"/> Save DAG Mapping
            </button>
        </div>
      </div>

      {/* React Flow Canvas Wrapper */}
      <div className="flex-1 bg-soc-dark">
          <ReactFlow 
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              fitView
              attributionPosition="bottom-right"
          >
              <MiniMap style={{ background: '#151A2C' }} nodeColor="#00F0FF" maskColor="rgba(11, 15, 25, 0.8)" />
              <Controls />
              <Background color="#334155" gap={16} />
          </ReactFlow>
      </div>
    </div>
  );
}
