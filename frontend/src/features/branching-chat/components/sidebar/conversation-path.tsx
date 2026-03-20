import type { BranchChatNodeRecord } from "../../types";

import { GitBranchIcon, MoveRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

type ConversationPathProps = {
  lineage: BranchChatNodeRecord[];
  selectedNodeId: string;
  onSelectNode: (nodeId: string) => void;
};

export const ConversationPath = ({
  lineage,
  selectedNodeId,
  onSelectNode,
}: ConversationPathProps) => {
  return (
    <div className="rounded-[24px] border border-border/70 bg-card p-4">
      <div className="text-muted-foreground flex items-center gap-2 text-sm">
        <GitBranchIcon className="size-4" />
        <span>Conversation Path</span>
      </div>
      <ScrollArea className="mt-3 whitespace-nowrap">
        <div className="flex min-h-10 items-center gap-2 pb-1">
          {lineage.map((node, index) => (
            <div className="flex items-center gap-2" key={node.id}>
              <Button
                className={cn(
                  "max-w-45 rounded-full border-border bg-muted/40 text-muted-foreground hover:bg-muted",
                  node.id === selectedNodeId &&
                    "bg-primary text-primary-foreground hover:bg-primary/90",
                )}
                onClick={() => onSelectNode(node.id)}
                size="sm"
                type="button"
                variant="outline"
              >
                <span className="truncate">{node.branchLabel}</span>
              </Button>
              {index < lineage.length - 1 && (
                <MoveRightIcon className="text-muted-foreground size-3" />
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
