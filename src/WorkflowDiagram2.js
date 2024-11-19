import React from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  Handle,
  Position,
  useNodesState,
  useEdgesState
} from "@xyflow/react";
import './styles.css';

import { AnimatedSVGEdge } from "./AnimatedSVGEdge";

const edgeTypes = {
  animatedSvg: AnimatedSVGEdge,
};

const CustomNode = ({ data, isConnectable }) => {
  return (
    <>
    <Handle
      type="target"
      position={Position.Top}
      onConnect={(params) => console.log('handle onConnect', params)}
      isConnectable={isConnectable}
    />
    <div style={{ padding: '10px', backgroundColor: '#d4e157', borderRadius: '5px' }}>
      <strong>{data.label}</strong>
    </div>
    <Handle
      type="source"
      position={Position.Bottom}
      isConnectable={isConnectable}
    />
    </>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

// Define the nodes and edges for the workflow
const initialNodes = [
  {
    id: '1',
    type: 'input', // input node
    data: { label: 'Start' },
    position: { x: 250, y: 5 },
  },
  {
    id: '2',
    type: 'custom', // using custom node type
    data: { label: 'Custom Step' },
    position: { x: 100, y: 100 },
  },
  {
    id: '3',
    data: { label: 'Step 2' },
    position: { x: 400, y: 100 },
  },
  {
    id: '4',
    type: 'output', // output node
    data: { label: 'End' },
    position: { x: 250, y: 200 },
  },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', type: "animatedSvg" },
  { id: 'e1-3', source: '1', target: '3', type: "animatedSvg" },
  { id: 'e2-4', source: '2', target: '4', animated: true },
  { id: 'e3-4', source: '3', target: '4', animated: true },
];

function WorkflowDiagram() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div style={{ height: '500px', width: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        edgeTypes={edgeTypes}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        attributionPosition="top-right"
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}

export default WorkflowDiagram;
