import { create } from 'zustand';
import {
  type Node,
  type Edge,
  type Viewport,
  applyNodeChanges,
  applyEdgeChanges,
  type Connection,
} from '@xyflow/react';
import type { RecipeNodeData } from '@/components/recipe-node';
import type { RecipeEdgeData } from '@/components/recipe-edge';

type RecipeNode = Node<RecipeNodeData>;

interface FlowState {
  nodes: RecipeNode[];
  edges: Edge[];
  viewport: Viewport;
  setNodes: (
    updater: RecipeNode[] | ((nodes: RecipeNode[]) => RecipeNode[])
  ) => void;
  setEdges: (updated: Edge[] | ((edges: Edge[]) => Edge[])) => void;
  setViewport: (viewport: Viewport) => void;
  onNodesChange: (
    changes: Parameters<typeof applyNodeChanges<RecipeNode>>[0]
  ) => void;
  onEdgesChange: (changes: Parameters<typeof applyEdgeChanges>[0]) => void;
  onConnect: (connection: Connection) => void;
  addNode: (partialNode?: Partial<RecipeNode>) => void;
  removeNode: (id: string) => void;
  removeEdge: (id: string) => void;
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
    if (!sourceNode || !targetNode) {
      return;
    }

    const sourceMaterial = connection.sourceHandle!;
    const targetMaterial = connection.targetHandle!;

    // check if two same materials are connected
    if (sourceMaterial !== targetMaterial) {
      return;
    }

    // check for duplicate edges
    const exists = edges.some(
      (e) =>
        e.source === connection.source &&
        e.target === connection.target &&
        e.sourceHandle === connection.sourceHandle &&
        e.targetHandle === connection.targetHandle
    );
    if (exists) {
      return;
    }

    // update material usage on both nodes
    const targetMaterialData = nodes
      .find((n) => n.id === targetNode.id)!
      .data.materials.find(
        (m) => m.type === 'input' && m.materialId === targetMaterial
      )!;

    const materialRequired =
      targetMaterialData.amountTotal - targetMaterialData.amountUsed;

    const sourceMaterialData = nodes
      .find((n) => n.id === sourceNode.id)!
      .data.materials.find(
        (m) => m.type === 'output' && m.materialId === sourceMaterial
      )!;

    const materialAvailable =
      sourceMaterialData.amountTotal - sourceMaterialData.amountUsed;

    if (materialAvailable <= 0) {
      return;
    }

    const materialUsed = Math.min(materialAvailable, materialRequired);

    // create new edge
    const newEdge: Edge<RecipeEdgeData> = {
      id: `${connection.source}-${connection.target}-${sourceMaterial}`,
      ...connection,
      animated: true,
      type: 'recipe',
      label: materialUsed,
      labelStyle: { color: 'red' },
      data: { amount: materialUsed },
    };

    setEdges((eds) => [...eds, newEdge]);

    setNodes((nodes) =>
      nodes.map((n) => {
        if (n.id === sourceNode.id) {
          const materials = n.data.materials.map((x) => {
            if (x.type === 'output' && x.materialId === sourceMaterial) {
              return {
                ...x,
                amountUsed: x.amountUsed + materialUsed,
              };
            }

            return x;
          });

          return {
            ...n,
            data: {
              ...n.data,
              materials,
            },
          };
        }

        if (n.id === targetNode.id) {
          const materials = n.data.materials.map((x) => {
            if (x.type === 'input' && x.materialId === targetMaterial) {
              return {
                ...x,
                amountUsed: x.amountUsed + materialUsed,
              };
            }

            return x;
          });

          return {
            ...n,
            data: {
              ...n.data,
              materials,
            },
          };
        }
        return n;
      })
    );
  },

  addNode: (partialNode = {}) => {
    const id = crypto.randomUUID(); // unique ID
    const defaultNode: RecipeNode = {
      id,
      position: { x: Math.random() * 400, y: Math.random() * 300 },
      data: {
        recipeId: '',
        materials: [],
      },
      ...partialNode, // allow overrides (e.g. type, position, data)
    };
    set({ nodes: [...get().nodes, defaultNode] });
  },

  removeNode: (id) => {
    const nodes = get().nodes.filter((n) => n.id !== id);
    const edges = get().edges.filter((e) => e.source !== id && e.target !== id);
    set({ nodes, edges });
  },

  removeEdge: (id) => {
    const edges = get().edges.filter((e) => e.id !== id);
    set({ edges });
  },
}));
