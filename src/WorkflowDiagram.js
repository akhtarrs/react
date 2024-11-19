import React from "react";
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  Background,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { AnimatedSVGEdge } from "./AnimatedSVGEdge";

const initialNodes = [
  { id: "11", position: { x: -50, y: -50 }, data: { label: "A" } },
  { id: "22", position: { x: 50, y: 50 }, data: { label: "B" } },
  { id: "33", position: { x: 150, y: 150 }, data: { label: "C" } },
];

const edgeTypes = {
  animatedSvg: AnimatedSVGEdge,
};

const initialEdges = [
  {
    id: "1>2",
    type: "animatedSvg",
    source: "11",
    target: "22",
  },
  {
    id: "2>3",
    type: "animatedSvg",
    source: "22",
    target: "33",
  },
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
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            fitView
            >
            <Background />
        </ReactFlow>
    </div>
  );
}

export default WorkflowDiagram;
