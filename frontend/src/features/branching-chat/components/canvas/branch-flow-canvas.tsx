import type { Edge, NodeMouseHandler } from "@xyflow/react";

import { Controls, MiniMap } from "@xyflow/react";
import { Canvas } from "@/components/ai-elements/canvas";

import { edgeTypes, nodeTypes } from "../conversation-flow-node";
import type { BranchChatFlowNode } from "../../types";

type BranchFlowCanvasProps = {
  flowNodes: BranchChatFlowNode[];
  flowEdges: Edge[];
  selectedNodeId: string;
  onNodeClick: NodeMouseHandler;
};

export const BranchFlowCanvas = ({
  flowNodes,
  flowEdges,
  selectedNodeId,
  onNodeClick,
}: BranchFlowCanvasProps) => {
  return (
    <section className="min-h-155 overflow-hidden rounded-[18px] border border-border/70 bg-card/60 shadow-xl backdrop-blur">
      <Canvas
        className="h-full w-full bg-transparent"
        edgeTypes={edgeTypes}
        edges={flowEdges}
        fitViewOptions={{ maxZoom: 1.1, padding: 0.18 }}
        nodeTypes={nodeTypes}
        nodes={flowNodes}
        onNodeClick={onNodeClick}
        proOptions={{ hideAttribution: true }}
      >
        <MiniMap
          className="bottom-5! left-5! h-28! w-44! overflow-hidden rounded-2xl border border-border bg-card/90"
          maskColor="var(--background)"
          nodeColor={(node) =>
            node.id === selectedNodeId ? "var(--foreground)" : "var(--muted-foreground)"
          }
          pannable
          zoomable
        />
        <Controls className="bottom-5! right-5! border-none! bg-card/90! shadow-lg! [&>button]:border-border! [&>button]:bg-transparent! [&>button]:text-foreground!" />
      </Canvas>
    </section>
  );
};
