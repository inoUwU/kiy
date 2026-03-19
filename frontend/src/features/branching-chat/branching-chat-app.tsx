import type { FormEvent } from "react";
import type { NodeProps as FlowNodeProps } from "@xyflow/react";

import { Controls, MiniMap, type NodeMouseHandler } from "@xyflow/react";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Canvas } from "@/components/ai-elements/canvas";
import { Edge } from "@/components/ai-elements/edge";
import {
  Message,
  MessageContent,
  MessageResponse,
  MessageToolbar,
} from "@/components/ai-elements/message";
import {
  Node as BranchNodeCard,
  NodeContent,
  NodeDescription,
  NodeFooter,
  NodeHeader,
  NodeTitle,
} from "@/components/ai-elements/node";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { GitBranchIcon, MoveRightIcon, SendIcon, SparklesIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import {
  buildFlowEdges,
  buildFlowNodes,
  createBranchNode,
  getChildNodes,
  getLineage,
  initialBranchChatNodes,
} from "./data";
import type { BranchChatFlowNode } from "./types";
import ToggleThemeButton from "@/components/toggle-theme-button";

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

const nodeTypes = {
  conversationNode: ConversationFlowNode,
};

const edgeTypes = {
  animated: Edge.Animated,
};

const createNodeId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `branch-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const BranchingChatApp = () => {
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

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-425 flex-col gap-6 px-4 py-4 md:px-6 lg:px-8">
        {/* TODO:サイドバーにプロジェクトを切り替えるUIを追加する。プロジェクトごとに会話の木構造を切り替えられるようにする。 */}

        {/* <header className="grid gap-4 rounded-[28px] border border-white/10 bg-white/6 p-5 text-left shadow-2xl shadow-black/20 backdrop-blur md:grid-cols-[minmax(0,1fr)_320px] md:items-end">
          <div className="space-y-3">
            <Badge className="bg-white/12 text-white hover:bg-white/12" variant="secondary">
              React Flow x shadcn/ui
            </Badge>
            <div className="space-y-2">
              <h1 className="font-semibold text-3xl tracking-tight text-white">
                Branching Chat Workspace
              </h1>
              <p className="max-w-3xl text-sm leading-6 text-slate-300 md:text-base">
                会話を1往復ごとのノードとして扱い、選択中ノードから別の探索枝をそのまま生成できるPoCです。中央で分岐を俯瞰し、右ペインで文脈を確認しながら次の枝を作れます。
              </p>
            </div>
          </div>
          <div className="grid gap-3 rounded-[24px] border border-white/10 bg-black/20 p-4 text-sm text-slate-200">
            <div className="flex items-center justify-between gap-3">
              <span>Total nodes</span>
              <span className="font-medium text-white">{conversationNodes.length}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span>Branches from selection</span>
              <span className="font-medium text-white">{children.length}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span>Current branch</span>
              <span className="font-medium text-white">{selectedNode.branchLabel}</span>
            </div>
          </div>
        </header> */}

        <div className="grid min-h-0 flex-1 gap-6 xl:grid-cols-[minmax(0,1.65fr)_420px]">
          <aside className="grid min-h-155 grid-rows-[auto_auto_minmax(0,1fr)_auto] gap-4 rounded-[32px] border border-border/60 bg-card/60 p-4 shadow-xl backdrop-blur md:p-5">
            <div className="rounded-[24px] border border-border/70 bg-card p-4 text-left">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-muted-foreground text-xs uppercase tracking-[0.24em]">
                    Selected Node
                  </p>
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
                    onClick={() => selectSibling(-1)}
                    size="sm"
                    type="button"
                    variant="outline"
                  >
                    Previous
                  </Button>
                  <Button
                    disabled={siblingBranches.length <= 1}
                    onClick={() => selectSibling(1)}
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
                          node.id === selectedNode.id &&
                            "bg-primary text-primary-foreground hover:bg-primary/90",
                        )}
                        onClick={() => setSelectedNodeId(node.id)}
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

            <div className="min-h-0 overflow-hidden rounded-[24px] border border-border/70 bg-card/70">
              <Conversation className="h-full">
                <ConversationContent className="gap-6 p-4 md:p-5">
                  {selectedNode ? (
                    <>
                      <Message from="user">
                        <div className="flex items-start gap-3">
                          <Avatar className="mt-1 border border-border bg-muted" size="sm">
                            <AvatarFallback>U</AvatarFallback>
                          </Avatar>
                          <MessageContent>
                            <MessageResponse>{selectedNode.turn.prompt}</MessageResponse>
                          </MessageContent>
                        </div>
                      </Message>
                      <Message from="assistant">
                        <div className="flex items-start gap-3">
                          <Avatar className="mt-1 border border-border bg-primary/10" size="sm">
                            <AvatarFallback>AI</AvatarFallback>
                          </Avatar>
                          <MessageContent className="rounded-2xl border border-border bg-card px-4 py-3 text-foreground">
                            <MessageResponse>{selectedNode.turn.response}</MessageResponse>
                          </MessageContent>
                        </div>
                      </Message>
                    </>
                  ) : (
                    <ConversationEmptyState
                      description="ノードを選択すると内容を表示します。"
                      title="No conversation selected"
                    />
                  )}
                </ConversationContent>
                <ConversationScrollButton />
              </Conversation>
            </div>

            <form
              className="rounded-[24px] border border-border/70 bg-card p-4"
              onSubmit={handleSubmit}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                  <SparklesIcon className="size-4" />
                  <span>Branch from {selectedNode.branchLabel}</span>
                </div>
                <Badge variant="outline" className="border-border bg-muted text-muted-foreground">
                  Mock reply
                </Badge>
              </div>
              <Textarea
                className="mt-3 min-h-28"
                onChange={(event) => setPrompt(event.currentTarget.value)}
                placeholder="選択中ノードの続きを、別の仮説や別の仕様案として分岐させます。"
                value={prompt}
              />
              <Separator className="my-4" />
              <div className="flex items-center justify-between gap-3">
                <p className="text-muted-foreground text-xs leading-5">
                  送信すると現在の選択ノードを親にして、新しい枝を追加します。AI接続は未実装のため、assistant応答はモックです。
                </p>
                <Button disabled={!prompt.trim()} size="sm" type="submit">
                  <SendIcon className="size-4" />
                  Add branch
                </Button>
              </div>
            </form>
          </aside>
          <section className="min-h-155 overflow-hidden rounded-[18px] border border-border/70 bg-card/60 shadow-xl backdrop-blur">
            <Canvas
              className="h-full w-full bg-transparent"
              edgeTypes={edgeTypes}
              edges={flowEdges}
              fitViewOptions={{ maxZoom: 1.1, padding: 0.18 }}
              nodeTypes={nodeTypes}
              nodes={flowNodes}
              onNodeClick={handleNodeClick}
              proOptions={{ hideAttribution: true }}
            >
              <MiniMap
                className="bottom-5! left-5! h-28! w-44! overflow-hidden rounded-2xl border border-border bg-card/90"
                maskColor="var(--background)"
                nodeColor={(node) =>
                  node.id === selectedNode.id ? "var(--foreground)" : "var(--muted-foreground)"
                }
                pannable
                zoomable
              />
              <Controls className="bottom-5! right-5! border-none! bg-card/90! shadow-lg! [&>button]:border-border! [&>button]:bg-transparent! [&>button]:text-foreground!" />
            </Canvas>
          </section>
        </div>
        <ToggleThemeButton />
      </div>
    </div>
  );
};
