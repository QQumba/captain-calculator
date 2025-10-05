import { create } from 'zustand';
import {
  type Node,
  type Edge,
  type Viewport,
  applyNodeChanges,
  applyEdgeChanges,
  type Connection,
  addEdge,
} from '@xyflow/react';

interface FlowState {
  nodes: Node[];
  edges: Edge[];
  viewport: Viewport;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  setViewport: (viewport: Viewport) => void;
  onNodesChange: (changes: Parameters<typeof applyNodeChanges>[0]) => void;
  onEdgesChange: (changes: Parameters<typeof applyEdgeChanges>[0]) => void;
  onConnect: (connection: Connection) => void;
  addNode: (partialNode?: Partial<Node>) => void;
}

export const useFlowStore = create<FlowState>((set, get) => ({
  nodes: [],
  edges: [],
  viewport: { x: 0, y: 0, zoom: 1 },
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  setViewport: (viewport) => set({ viewport }),

  // React Flow event handlers
  onNodesChange: (changes) =>
    set({ nodes: applyNodeChanges(changes, get().nodes) }),
  onEdgesChange: (changes) =>
    set({ edges: applyEdgeChanges(changes, get().edges) }),
  onConnect: (connection) =>
    set({
      edges: addEdge(
        { ...connection, animated: true }, // optional styling
        get().edges
      ),
    }),
  addNode: (partialNode = {}) => {
    const id = crypto.randomUUID(); // unique ID
    const defaultNode: Node = {
      id,
      position: { x: Math.random() * 400, y: Math.random() * 300 },
      data: { label: `Node ${id}` },
      ...partialNode, // allow overrides (e.g. type, position, data)
    };
    set({ nodes: [...get().nodes, defaultNode] });
  },
}));
