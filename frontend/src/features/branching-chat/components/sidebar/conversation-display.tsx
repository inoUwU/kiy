import type { BranchChatNodeRecord } from "../../types";

import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type ConversationDisplayProps = {
  selectedNode?: BranchChatNodeRecord;
};

export const ConversationDisplay = ({ selectedNode }: ConversationDisplayProps) => {
  return (
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
  );
};
