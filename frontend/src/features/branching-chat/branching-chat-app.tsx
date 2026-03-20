import ToggleThemeButton from "@/components/toggle-theme-button";
import { BranchFlowCanvas } from "./components/canvas/branch-flow-canvas";
import { BranchSidebar } from "./components/sidebar/branch-sidebar";
import { useBranchChatHandlers } from "./hooks/use-branch-chat-handlers";
import { useBranchChatState } from "./hooks/use-branch-chat-state";

export const BranchingChatApp = () => {
  const {
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
  } = useBranchChatState();

  const { selectSibling, handleNodeClick, handleSubmit } = useBranchChatHandlers({
    selectedNode,
    prompt,
    children,
    siblingBranches,
    selectedSiblingIndex,
    setConversationNodes,
    setSelectedNodeId,
    setPrompt,
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-425 flex-col gap-6 px-4 py-4 md:px-6 lg:px-8">
        <div className="grid min-h-0 flex-1 gap-6 xl:grid-cols-[minmax(0,1.65fr)_420px]">
          <BranchSidebar
            lineage={lineage}
            onPromptChange={setPrompt}
            onSelectNode={setSelectedNodeId}
            onSelectSibling={selectSibling}
            onSubmit={handleSubmit}
            prompt={prompt}
            selectedNode={selectedNode}
            selectedNodeId={selectedNodeId}
            selectedSiblingIndex={selectedSiblingIndex}
            siblingBranches={siblingBranches}
          />
          <BranchFlowCanvas
            flowEdges={flowEdges}
            flowNodes={flowNodes}
            onNodeClick={handleNodeClick}
            selectedNodeId={selectedNode.id}
          />
        </div>
        <ToggleThemeButton />
      </div>
    </div>
  );
};
