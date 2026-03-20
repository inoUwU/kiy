import type { NodeProps as FlowNodeProps } from "@xyflow/react";

import { Edge } from "@/components/ai-elements/edge";
import {
  Node as BranchNodeCard,
  NodeContent,
  NodeDescription,
  NodeFooter,
  NodeHeader,
  NodeTitle,
} from "@/components/ai-elements/node";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import type { BranchChatFlowNode } from "../types";

const ConversationFlowNode = ({ data }: FlowNodeProps<BranchChatFlowNode>) => {
  const { childCount, depth, isSelected, record } = data;

  return (
    <BranchNodeCard
      className={cn(
        "w-82.5 border border-border/70 bg-card/95 shadow-lg shadow-foreground/5 backdrop-blur-sm transition-all",
        isSelected && "ring-2 ring-primary/70 ring-offset-2 ring-offset-background",
      )}
      handles={{ source: true, target: record.parentId !== null }}
    >
      <NodeHeader className="gap-3 bg-muted/70">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1 text-left">
            <div className="flex items-center gap-2">
              <Badge variant={record.status === "active" ? "default" : "outline"}>
                {record.branchLabel}
              </Badge>
              <span className="text-muted-foreground text-xs">Depth {depth}</span>
            </div>
            <NodeTitle className="line-clamp-1 text-sm">{record.title}</NodeTitle>
          </div>
          <span className="text-muted-foreground text-xs">{record.createdAt}</span>
        </div>
      </NodeHeader>
      <NodeContent className="space-y-3 text-left">
        <NodeDescription className="line-clamp-2 text-sm leading-6">
          {record.summary}
        </NodeDescription>
        <div className="rounded-xl border border-border/60 bg-background/70 p-3">
          <p className="text-muted-foreground text-[11px] uppercase tracking-[0.18em]">
            Latest Reply
          </p>
          <p className="mt-2 line-clamp-3 text-sm leading-6">{record.turn.response}</p>
        </div>
      </NodeContent>
      <NodeFooter className="flex items-center justify-between gap-3 bg-muted/40 text-xs text-muted-foreground">
        <span>
          {childCount} branch{childCount === 1 ? "" : "es"}
        </span>
        <span>{record.parentId ? "Selected branch root available" : "Conversation seed"}</span>
      </NodeFooter>
    </BranchNodeCard>
  );
};

export const nodeTypes = {
  conversationNode: ConversationFlowNode,
};

export const edgeTypes = {
  animated: Edge.Animated,
};
