import type { BranchChatNodeRecord } from "../../types";

import { MessageToolbar } from "@/components/ai-elements/message";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type SelectedNodePanelProps = {
  selectedNode: BranchChatNodeRecord;
  siblingBranches: BranchChatNodeRecord[];
  selectedSiblingIndex: number;
  onSelectSibling: (offset: number) => void;
};

export const SelectedNodePanel = ({
  selectedNode,
  siblingBranches,
  selectedSiblingIndex,
  onSelectSibling,
}: SelectedNodePanelProps) => {
  return (
    <div className="rounded-[24px] border border-border/70 bg-card p-4 text-left">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-muted-foreground text-xs uppercase tracking-[0.24em]">Selected Node</p>
          <h2 className="mt-2 text-xl font-medium text-foreground">{selectedNode.title}</h2>
        </div>
        <Badge variant="outline" className="border-border bg-muted text-foreground">
          {selectedNode.branchLabel}
        </Badge>
      </div>
      <p className="text-muted-foreground mt-3 text-sm leading-6">{selectedNode.summary}</p>
      <MessageToolbar className="mt-4 flex-wrap justify-between">
        <div className="flex items-center gap-2">
          <Button
            disabled={siblingBranches.length <= 1}
            onClick={() => onSelectSibling(-1)}
            size="sm"
            type="button"
            variant="outline"
          >
            Previous
          </Button>
          <Button
            disabled={siblingBranches.length <= 1}
            onClick={() => onSelectSibling(1)}
            size="sm"
            type="button"
            variant="outline"
          >
            Next
          </Button>
        </div>
        <span className="text-muted-foreground text-xs">
          {selectedSiblingIndex >= 0
            ? `${selectedSiblingIndex + 1} / ${siblingBranches.length}`
            : "Root"}
        </span>
      </MessageToolbar>
    </div>
  );
};
