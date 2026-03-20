import type { FormEvent } from "react";

import type { BranchChatNodeRecord } from "../../types";

import { BranchCreationForm } from "./branch-creation-form";
import { ConversationDisplay } from "./conversation-display";
import { ConversationPath } from "./conversation-path";
import { SelectedNodePanel } from "./selected-node-panel";

type BranchSidebarProps = {
  selectedNode: BranchChatNodeRecord;
  selectedNodeId: string;
  siblingBranches: BranchChatNodeRecord[];
  selectedSiblingIndex: number;
  lineage: BranchChatNodeRecord[];
  prompt: string;
  onSelectSibling: (offset: number) => void;
  onSelectNode: (nodeId: string) => void;
  onPromptChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export const BranchSidebar = ({
  selectedNode,
  selectedNodeId,
  siblingBranches,
  selectedSiblingIndex,
  lineage,
  prompt,
  onSelectSibling,
  onSelectNode,
  onPromptChange,
  onSubmit,
}: BranchSidebarProps) => {
  return (
    <aside className="grid min-h-155 grid-rows-[auto_auto_minmax(0,1fr)_auto] gap-4 rounded-[32px] border border-border/60 bg-card/60 p-4 shadow-xl backdrop-blur md:p-5">
      <SelectedNodePanel
        onSelectSibling={onSelectSibling}
        selectedNode={selectedNode}
        selectedSiblingIndex={selectedSiblingIndex}
        siblingBranches={siblingBranches}
      />
      <ConversationPath
        lineage={lineage}
        onSelectNode={onSelectNode}
        selectedNodeId={selectedNodeId}
      />
      <ConversationDisplay selectedNode={selectedNode} />
      <BranchCreationForm
        onPromptChange={onPromptChange}
        onSubmit={onSubmit}
        prompt={prompt}
        selectedNode={selectedNode}
      />
    </aside>
  );
};
