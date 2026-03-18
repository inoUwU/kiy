import type { Edge } from "@xyflow/react";

import type { BranchChatFlowNode, BranchChatNodeRecord } from "./types";

const COLUMN_GAP = 380;
const ROW_GAP = 210;

export const initialBranchChatNodes: BranchChatNodeRecord[] = [
  {
    branchLabel: "Seed",
    createdAt: "09:00",
    id: "root-vision",
    parentId: null,
    position: { x: 0, y: 0 },
    status: "seed",
    summary: "PoCの目的と最初の体験を揃えた基点ノード",
    title: "PoCの起点",
    turn: {
      prompt: "React Flowで分岐できるAIチャットのPoCを作りたい。最初に何を固めるべき?",
      response:
        "最初に分岐単位を1往復=1ノードに固定し、キャンバス中心レイアウトと選択ノードから分岐を作る操作系を定義すると、その後の状態設計が崩れません。",
    },
  },
  {
    branchLabel: "A",
    createdAt: "09:08",
    id: "branch-ux",
    parentId: "root-vision",
    position: { x: COLUMN_GAP, y: -140 },
    status: "active",
    summary: "キャンバス優先の画面体験を整理した枝",
    title: "体験設計を先に決める",
    turn: {
      prompt: "まずUI体験を固めるなら、どんな画面構成が適切?",
      response:
        "中央をReact Flow、右を選択ノードの詳細と送信フォームにすると、探索と分岐作成が同じ視線移動で完結します。ノードには要約と最新応答の断片だけを載せるのが見やすいです。",
    },
  },
  {
    branchLabel: "B",
    createdAt: "09:12",
    id: "branch-data-model",
    parentId: "root-vision",
    position: { x: COLUMN_GAP, y: 160 },
    status: "draft",
    summary: "分岐状態の型を先に固めた枝",
    title: "状態モデルから組み立てる",
    turn: {
      prompt: "状態管理から着手するなら、最低限どのデータが必要?",
      response:
        "ノードID、親ID、座標、1往復の会話内容、要約、状態、作成時刻があればPoCは成立します。エッジは親子関係から導出できるので、永続化までは冗長な情報を増やし過ぎない方が安全です。",
    },
  },
  {
    branchLabel: "A-1",
    createdAt: "09:25",
    id: "branch-design-system",
    parentId: "branch-ux",
    position: { x: COLUMN_GAP * 2, y: -120 },
    status: "active",
    summary: "shadcnとReact Flowの見た目を揃える指針",
    title: "shadcnとの統合方針",
    turn: {
      prompt: "React Flowの見た目をshadcnと自然に揃えるには?",
      response:
        "ノードをshadcnのCardで包み、背景やリング色を既存トークンに寄せます。React Flowのデフォルト感は背景、選択リング、コントロールを調整して消し、ノード内の情報密度を一定に保つと馴染みます。",
    },
  },
];

const trimToSentence = (value: string, maxLength: number) => {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength - 1).trimEnd()}…`;
};

export const getChildNodes = (
  nodes: BranchChatNodeRecord[],
  parentId: string | null
) => nodes.filter((node) => node.parentId === parentId);

export const getDepth = (
  nodesById: Map<string, BranchChatNodeRecord>,
  nodeId: string
) => {
  let depth = 0;
  let current = nodesById.get(nodeId);

  while (current?.parentId) {
    depth += 1;
    current = nodesById.get(current.parentId);
  }

  return depth;
};

export const getLineage = (
  nodesById: Map<string, BranchChatNodeRecord>,
  nodeId: string
) => {
  const lineage: BranchChatNodeRecord[] = [];
  let current = nodesById.get(nodeId);

  while (current) {
    lineage.unshift(current);
    current = current.parentId ? nodesById.get(current.parentId) : undefined;
  }

  return lineage;
};

export const buildFlowNodes = (
  nodes: BranchChatNodeRecord[],
  selectedNodeId: string
): BranchChatFlowNode[] => {
  const nodesById = new Map(nodes.map((node) => [node.id, node]));

  return nodes.map((record) => ({
    data: {
      childCount: getChildNodes(nodes, record.id).length,
      depth: getDepth(nodesById, record.id),
      isSelected: record.id === selectedNodeId,
      record,
    },
    id: record.id,
    position: record.position,
    type: "conversationNode",
  }));
};

export const buildFlowEdges = (nodes: BranchChatNodeRecord[]): Edge[] =>
  nodes
    .filter((node) => node.parentId)
    .map((node) => ({
      id: `${node.parentId}-${node.id}`,
      source: node.parentId as string,
      target: node.id,
      type: "animated",
    }));

export const buildMockAssistantReply = (
  prompt: string,
  parent: BranchChatNodeRecord
) => {
  const shortenedPrompt = trimToSentence(prompt, 92);
  return [
    `親ノード「${parent.title}」を起点に、新しい探索枝として整理しました。`,
    `この枝では「${shortenedPrompt}」を主題に据え、UIと状態の両面から検証を進める前提です。`,
    "次の段階では、この枝に固有のUI差分や接続方法を追加し、他の枝と比較できるようにします。",
  ].join(" ");
};

export const createBranchNode = ({
  id,
  parent,
  prompt,
  siblingCount,
}: {
  id: string;
  parent: BranchChatNodeRecord;
  prompt: string;
  siblingCount: number;
}): BranchChatNodeRecord => {
  const branchIndex = siblingCount + 1;
  const direction = branchIndex % 2 === 0 ? 1 : -1;
  const verticalStep = Math.ceil(branchIndex / 2) * ROW_GAP;
  const timestamp = new Intl.DateTimeFormat("ja-JP", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());
  const promptSummary = trimToSentence(prompt, 42);

  return {
    branchLabel: `${parent.branchLabel}-${branchIndex}`,
    createdAt: timestamp,
    id,
    parentId: parent.id,
    position: {
      x: parent.position.x + COLUMN_GAP,
      y: parent.position.y + direction * verticalStep,
    },
    status: "draft",
    summary: trimToSentence(buildMockAssistantReply(prompt, parent), 90),
    title: promptSummary,
    turn: {
      prompt,
      response: buildMockAssistantReply(prompt, parent),
    },
  };
};