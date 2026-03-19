import type { Node } from "@xyflow/react";

export type BranchChatNodeStatus = "seed" | "active" | "draft";

export interface BranchChatTurn {
  prompt: string;
  response: string;
}

export interface BranchChatPosition {
  x: number;
  y: number;
}

export interface BranchChatNodeRecord {
  id: string;
  parentId: string | null;
  title: string;
  summary: string;
  branchLabel: string;
  createdAt: string;
  status: BranchChatNodeStatus;
  position: BranchChatPosition;
  turn: BranchChatTurn;
}

export interface BranchChatNodeData extends Record<string, unknown> {
  record: BranchChatNodeRecord;
  childCount: number;
  depth: number;
  isSelected: boolean;
}

export type BranchChatFlowNode = Node<BranchChatNodeData, "conversationNode">;
