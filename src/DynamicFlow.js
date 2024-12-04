import React, { useEffect } from "react";
import "@xyflow/react/dist/style.css";
import dagre from '@dagrejs/dagre';
import {
  ReactFlow,
  ConnectionLineType,
  useNodesState,
  useEdgesState,
  Background,
  Handle,
  Position
} from "@xyflow/react";

const parseJsonToFlow = (jsonData, options, parentId = null) => {
  const dynamicNodes = [];
  const dynamicEdges = [];

  // Generate a unique ID for the current node
  const nodeId = parentId ? `${parentId}-${jsonData.name || 'Node'}` : 'root';

  // Create the current node
  dynamicNodes.push({
    id: nodeId,
    data: { options: options, label: jsonData.label, size: jsonData.size, status: jsonData.status, conclusion: jsonData.conclusion, toolTip: jsonData.toolTip },
    position: { x: 0, y: 0 },
    type: parentId ? 'custom' : 'start',
  });

  // Connect the current node to its parent
  if (parentId) {
    dynamicEdges.push({
      id: `e-${parentId}-${nodeId}`,
      source: parentId,
      target: nodeId,
      animated: true,
    });
  }

  // Process children
  const children = Array.isArray(jsonData.childNode) ? jsonData.childNode : [jsonData.childNode];
  var counter = 0
  children.forEach((child) => {
    if (child && child.name) {
      counter = counter + 1;
      const childResult = parseJsonToFlow(child, options, nodeId);
      dynamicNodes.push(...childResult.dynamicNodes);
      dynamicEdges.push(...childResult.dynamicEdges);
    }
  });

  return { dynamicNodes, dynamicEdges };
};

const getLayoutedElements = (nodes, edges) => {
  const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: 'LR' });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: node.data.size * 1.5, height: node.data.size });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const newNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const newNode = {
      ...node,
      targetPosition: 'left',
      sourcePosition: 'right',
      position: {
        x: nodeWithPosition.x - node.data.size * 2,
        y: nodeWithPosition.y - node.data.size / 2,
      },
    };

    return newNode;
  });

  return { nodes: newNodes, edges };
};

const styles = {
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f5f5f5',
  },
  loadingSpinner: {
    display: 'inline-block',
    position: 'relative',
    width: '80px',
    height: '80px',
  },
  spinnerDiv: {
    boxSizing: 'border-box',
    display: 'block',
    position: 'absolute',
    width: '64px',
    height: '64px',
    margin: '8px',
    border: '8px solid #d4e157',
    borderRadius: '50%',
    animation: 'loadingSpinner 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite',
    borderColor: '#d4e157 transparent transparent transparent',
  },
  text: {
    fontFamily: 'Arial, sans-serif',
    fontSize: '1.2rem',
    color: '#333',
    marginTop: '16px',
  },
};

const keyframes = `
  @keyframes loadingSpinner {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const StartNode = ({ data, isConnectable }) => {
  return (
    <>
      <div title={data.toolTip} style={{
        ...data.options,
        height: `${data.size}px`,
        width: `${data.size}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        boxShadow: `0 0 2px 3px ${data.conclusion === 'success' ? data.options.successColor : data.conclusion === 'skip' ? data.options.skipColor : data.conclusion === 'cancel' ? data.options.cancelColor : data.options.failedColor}`,
        backgroundColor: `${data.conclusion === 'success' ? data.options.successColor : data.conclusion === 'skip' ? data.options.skipColor : data.conclusion === 'cancel' ? data.options.cancelColor : data.options.failedColor}`,
        background: `${data.conclusion === 'success' ? data.options.successBackground : data.conclusion === 'skip' ? data.options.skipBackground : data.conclusion === 'cancel' ? data.options.cancelBackground : data.options.failedBackground}`,
      }}>
        <strong>{data.label}</strong>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
      />
    </>
  );
};

const CustomNode = ({ data, isConnectable }) => {
  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        onConnect={(params) => console.log('handle onConnect', params)}
        isConnectable={isConnectable}
      />
      <div title={data.toolTip} style={{
        ...data.options,
        height: `${data.size}px`,
        width: `${data.size}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        boxShadow: `0 0 2px 3px ${data.conclusion === 'success' ? data.options.successColor : data.conclusion === 'skip' ? data.options.skipColor : data.conclusion === 'cancel' ? data.options.cancelColor : data.options.failedColor}`,
        backgroundColor: `${data.conclusion === 'success' ? data.options.successColor : data.conclusion === 'skip' ? data.options.skipColor : data.conclusion === 'cancel' ? data.options.cancelColor : data.options.failedColor}`,
        background: `${data.conclusion === 'success' ? data.options.successBackground : data.conclusion === 'skip' ? data.options.skipBackground : data.conclusion === 'cancel' ? data.options.cancelBackground : data.options.failedBackground}`,
      }}>
        <small>{data.label}</small>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
      />
    </>
  );
};

const nodeTypes = {
  start: StartNode,
  custom: CustomNode,
};

function DynamicFlow({ jsonData, options }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    if (jsonData) {
      const { dynamicNodes, dynamicEdges } = parseJsonToFlow(jsonData, options);
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
        dynamicNodes,
        dynamicEdges
      );
      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
    }
  }, [jsonData, options]);

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      {jsonData ? (
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          connectionLineType={ConnectionLineType.SmoothStep}
          fitView
        >
          <Background />
        </ReactFlow>
      ) : (
        <div style={styles.loadingContainer}>
          <div style={styles.loadingSpinner}>
            <div style={styles.spinnerDiv}></div>
            <div style={{ ...styles.spinnerDiv, animationDelay: '-0.45s' }}></div>
            <div style={{ ...styles.spinnerDiv, animationDelay: '-0.3s' }}></div>
            <div style={{ ...styles.spinnerDiv, animationDelay: '-0.15s' }}></div>
          </div>
          <p>Loading, please wait...</p>
        </div>
      )}
    </div>
  );
};

const styleSheet = document.createElement('style');
styleSheet.type = 'text/css';
styleSheet.innerText = keyframes;
document.head.appendChild(styleSheet);

export default DynamicFlow;
