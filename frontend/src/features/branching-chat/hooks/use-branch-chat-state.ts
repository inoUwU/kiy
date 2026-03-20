import { useMemo, useState } from "react";

import {
  buildFlowEdges,
  buildFlowNodes,
  getChildNodes,
  getLineage,
  initialBranchChatNodes,
} from "../data";

export const useBranchChatState = () => {
  const [conversationNodes, setConversationNodes] = useState(initialBranchChatNodes);
  const [selectedNodeId, setSelectedNodeId] = useState(initialBranchChatNodes.at(-1)?.id ?? "");
  const [prompt, setPrompt] = useState("");

  const nodesById = useMemo(
    () => new Map(conversationNodes.map((node) => [node.id, node])),
    [conversationNodes],
  );

  const selectedNode = nodesById.get(selectedNodeId) ?? conversationNodes[0];
  const flowNodes = useMemo(
    () => buildFlowNodes(conversationNodes, selectedNode.id),
    [conversationNodes, selectedNode.id],
  );
  const flowEdges = useMemo(() => buildFlowEdges(conversationNodes), [conversationNodes]);
  const lineage = useMemo(
    () => getLineage(nodesById, selectedNode.id),
    [nodesById, selectedNode.id],
  );
  const children = useMemo(
    () => getChildNodes(conversationNodes, selectedNode.id),
    [conversationNodes, selectedNode.id],
  );
  const siblingBranches = useMemo(
    () => getChildNodes(conversationNodes, selectedNode.parentId),
    [conversationNodes, selectedNode.parentId],
  );
  const selectedSiblingIndex = siblingBranches.findIndex((node) => node.id === selectedNode.id);

  return {
    conversationNodes,
    selectedNode,
    selectedNodeId,
    prompt,
    flowNodes,
    flowEdges,
    lineage,
    children,
    siblingBranches,
    selectedSiblingIndex,
    setConversationNodes,
    setSelectedNodeId,
    setPrompt,
  };
};
