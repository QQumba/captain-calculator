import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  Position,
  type Edge,
  type EdgeProps,
} from '@xyflow/react';

export type RecipeEdgeData = {
  amount: number;
};

export default function RecipeEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  label,
  data,
}: EdgeProps<Edge<RecipeEdgeData>>) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    targetPosition: Position.Left,
    sourcePosition: Position.Right,
  });

  return (
    <>
      <BaseEdge id={id} path={edgePath} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            background: 'rgba(0,0,0,0.7)',
            color: '#fff',
            borderRadius: 4,
            fontSize: 12,
          }}
          className="nodrag nopan px-1 py-0.5"
        >
          {data?.amount}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
