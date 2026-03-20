import type { FormEvent } from "react";

import type { BranchChatNodeRecord } from "../../types";

import { SparklesIcon, SendIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

type BranchCreationFormProps = {
  selectedNode: BranchChatNodeRecord;
  prompt: string;
  onPromptChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export const BranchCreationForm = ({
  selectedNode,
  prompt,
  onPromptChange,
  onSubmit,
}: BranchCreationFormProps) => {
  return (
    <form className="rounded-[24px] border border-border/70 bg-card p-4" onSubmit={onSubmit}>
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
        onChange={(event) => onPromptChange(event.currentTarget.value)}
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
  );
};
