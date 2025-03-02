import React from 'react';

interface Node {
  id: string;
  type: string;
  label: string;
  status: string;
}

interface Link {
  source: string;
  target: string;
  status: string;
}

interface TopologyData {
  nodes: Node[];
  links: Link[];
}

interface NetworkTopologyProps {
  data: {
    result: TopologyData;
  };
}

const NetworkTopology: React.FC<NetworkTopologyProps> = ({ data }) => {
  if (!data?.result) return null;
  
  const { nodes, links } = data.result;

  return (
    <div className="h-96 border rounded-md p-4">
      <div className="grid grid-cols-2 gap-4">
        {nodes.map((node) => (
          <div 
            key={node.id}
            className={`p-4 rounded-lg border ${
              node.status === 'active' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
            }`}
          >
            <div className="font-medium">{node.label}</div>
            <div className="text-sm text-gray-500">{node.type}</div>
          </div>
        ))}
      </div>
      <div className="mt-4 text-sm text-gray-500">
        {links.length} active connections
      </div>
    </div>
  );
};

export default NetworkTopology; 