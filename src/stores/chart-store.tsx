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
  setNodes: (updater: Node[] | ((nodes: Node[]) => Node[])) => void;
  setEdges: (updated: Edge[] | ((edges: Edge[]) => Edge[])) => void;
  setViewport: (viewport: Viewport) => void;
  onNodesChange: (changes: Parameters<typeof applyNodeChanges>[0]) => void;
  onEdgesChange: (changes: Parameters<typeof applyEdgeChanges>[0]) => void;
  onConnect: (connection: Connection) => void;
  addNode: (partialNode?: Partial<Node>) => void;
  removeNode: (id: string) => void;
}

export const useFlowStore = create<FlowState>((set, get) => ({
  nodes: [],
  edges: [],
  viewport: { x: 0, y: 0, zoom: 1 },
  setNodes: (updater) =>
    set((state) => ({
      nodes: typeof updater === 'function' ? updater(state.nodes) : updater,
    })),
  setEdges: (updater) =>
    set((state) => ({
      edges: typeof updater === 'function' ? updater(state.edges) : updater,
    })),
  setViewport: (viewport) => set({ viewport }),

  // React Flow event handlers
  onNodesChange: (changes) =>
    set({ nodes: applyNodeChanges(changes, get().nodes) }),
  onEdgesChange: (changes) =>
    set({ edges: applyEdgeChanges(changes, get().edges) }),

  onConnect: (connection) => {
    const { nodes, edges, setEdges, setNodes } = get();

    const sourceNode = nodes.find((n) => n.id === connection.source);
    const targetNode = nodes.find((n) => n.id === connection.target);
    if (!sourceNode || !targetNode) return;

    const sourceMaterial = connection.sourceHandle;
    const targetMaterial = connection.targetHandle;

    // ✅ Example validation: only same materials can connect
    if (sourceMaterial !== targetMaterial) {
      console.warn('❌ Connection blocked: materials do not match.');
      return;
    }

    // ✅ Prevent duplicate edges
    const exists = edges.some(
      (e) =>
        e.source === connection.source &&
        e.target === connection.target &&
        e.sourceHandle === connection.sourceHandle &&
        e.targetHandle === connection.targetHandle
    );
    if (exists) {
      console.warn('⚠️ Edge already exists.');
      return;
    }

    // ✅ Create new edge
    const newEdge: Edge = {
      id: `${connection.source}-${connection.target}-${sourceMaterial}`,
      ...connection,
      animated: true,
    };

    // ✅ Update edges
    setEdges((eds) => [...eds, newEdge]);

    // ✅ Optional: update material usage on target node
    // setNodes((nodes) =>
    //   nodes.map((n) => {
    //     if (n.id === targetNode.id) {
    //       const mat = targetMaterial ?? 'unknown';
    //       const used = n.data?.materials?.[mat] ?? 0;
    //       return {
    //         ...n,
    //         data: {
    //           ...n.data,
    //           materials: {
    //             ...n.data.materials,
    //             [mat]: used + 1,
    //           },
    //         },
    //       };
    //     }
    //     return n;
    //   })
    // );
  },

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

  removeNode: (id) => {
    const nodes = get().nodes.filter((n) => n.id !== id);
    const edges = get().edges.filter((e) => e.source !== id && e.target !== id);
    set({ nodes, edges });
  },
}));
