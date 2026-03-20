import type { Dispatch, FormEvent, SetStateAction } from "react";
import type { NodeMouseHandler } from "@xyflow/react";

import { createBranchNode } from "../data";
import type { BranchChatNodeRecord } from "../types";
import { createNodeId } from "../utils/node-id-generator";

type UseBranchChatHandlersParams = {
  selectedNode: BranchChatNodeRecord;
  prompt: string;
  children: BranchChatNodeRecord[];
  siblingBranches: BranchChatNodeRecord[];
  selectedSiblingIndex: number;
  setConversationNodes: Dispatch<SetStateAction<BranchChatNodeRecord[]>>;
  setSelectedNodeId: Dispatch<SetStateAction<string>>;
  setPrompt: Dispatch<SetStateAction<string>>;
};

export const useBranchChatHandlers = ({
  selectedNode,
  prompt,
  children,
  siblingBranches,
  selectedSiblingIndex,
  setConversationNodes,
  setSelectedNodeId,
  setPrompt,
}: UseBranchChatHandlersParams) => {
  const selectSibling = (offset: number) => {
    if (siblingBranches.length <= 1 || selectedSiblingIndex === -1) {
      return;
    }

    const nextIndex =
      (selectedSiblingIndex + offset + siblingBranches.length) % siblingBranches.length;
    setSelectedNodeId(siblingBranches[nextIndex].id);
  };

  const handleNodeClick: NodeMouseHandler = (_event, node) => {
    setSelectedNodeId(node.id);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextPrompt = prompt.trim();
    if (!nextPrompt) {
      return;
    }

    const nextNode = createBranchNode({
      id: createNodeId(),
      parent: selectedNode,
      prompt: nextPrompt,
      siblingCount: children.length,
    });

    setConversationNodes((currentNodes) => [...currentNodes, nextNode]);
    setSelectedNodeId(nextNode.id);
    setPrompt("");
  };

  return {
    selectSibling,
    handleNodeClick,
    handleSubmit,
  };
};
