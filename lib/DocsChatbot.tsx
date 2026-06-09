import { useEffect, useState, type CSSProperties } from "react";
import { useChat } from "@ai-sdk/react";
import { Message, MessageContent } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputBody,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
  PromptInputSubmit,
  type PromptInputMessage,
} from "@/components/ai-elements/prompt-input";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertCircle,
  ExternalLink,
  MessageSquare,
  RefreshCcw,
  X,
} from "lucide-react";
import { ResponseLight } from "@/components/response-light";
import { DefaultChatTransport } from "ai";
import { docSearch } from "@/services/docSearch";
import type { SendMessageRequest } from "@/types/chat";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Artifact,
  ArtifactAction,
  ArtifactActions,
  ArtifactContent,
  ArtifactHeader,
  ArtifactTitle,
} from "@/components/ai-elements/artifact";
import { cn } from "@/utils/cn";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

type DocsChatbotBaseProps = {
  searchUrl: string;
  apiKey: string;
  title: string;
  emptyState?: {
    title: string;
    description: string;
  };
  className?: string;
  style?: CSSProperties;
};

type DocsChatbotDefaultTriggerProps = DocsChatbotBaseProps & {
  variant?: "dialog";
  trigger?: "default";
  open?: never;
  onOpenChange?: never;
};

type DocsChatbotCustomTriggerProps = DocsChatbotBaseProps & {
  variant?: "dialog";
  trigger: "custom";
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type DocsChatbotEmbeddedProps = DocsChatbotBaseProps & {
  variant: "embedded";
  trigger?: never;
  open?: never;
  onOpenChange?: never;
};

export type DocsChatbotProps =
  | DocsChatbotDefaultTriggerProps
  | DocsChatbotCustomTriggerProps
  | DocsChatbotEmbeddedProps;

type DocsChatbotPanelProps = DocsChatbotBaseProps & {
  variant: "dialog" | "embedded";
  onRequestClose?: () => void;
};

const DEFAULT_EMPTY_STATE = {
  title: "Ask a question",
  description: "Search your indexed documentation and review relevant results.",
};

const DocsChatbotPanel = ({
  searchUrl,
  apiKey,
  title,
  emptyState = DEFAULT_EMPTY_STATE,
  className,
  style,
  variant,
  onRequestClose,
}: DocsChatbotPanelProps) => {
  const [inputValue, setInputValue] = useState("");

  const { messages, sendMessage, status, error, clearError, setMessages } =
    useChat({
      transport: new DefaultChatTransport({
        fetch: (_, init) =>
          docSearch({
            request: JSON.parse(init?.body as string) as SendMessageRequest,
            searchUrl: new URL(searchUrl),
            apiKey,
          }),
      }),
    });

  useEffect(() => {
    if (!error || messages.length === 0) {
      return;
    }

    const lastMessage = messages[messages.length - 1];

    if (lastMessage.role !== "user") {
      return;
    }

    const messageText = lastMessage.parts
      .filter((part) => part.type === "text")
      .map((part) => part.text)
      .join(" ");

    setMessages(messages.slice(0, -1));
    setInputValue(messageText);
  }, [error, messages, setMessages]);

  const clearConversation = () => {
    clearError();
    setInputValue("");
    setMessages([]);
  };

  return (
    <div
      className={cn(
        "dcb:flex dcb:w-full dcb:min-h-0 dcb:flex-col dcb:overflow-hidden dcb:text-foreground",
        variant === "embedded"
          ? "dcb:h-[600px] dcb:rounded-lg dcb:border dcb:bg-background dcb:shadow-sm"
          : "dcb:h-full",
        className
      )}
      style={style}
    >
      <div className="dcb:flex dcb:items-start dcb:justify-between dcb:gap-3 dcb:border-b dcb:bg-background dcb:px-4 dcb:py-3">
        <div className="dcb:min-w-0">
          <div className="dcb:flex dcb:items-center dcb:gap-2 dcb:text-sm dcb:font-semibold dcb:font-sans">
            <MessageSquare className="dcb:h-4 dcb:w-4 dcb:text-primary" />
            <span className="dcb:truncate">{title}</span>
          </div>
          <p className="dcb:mt-1 dcb:text-xs dcb:text-muted-foreground dcb:font-sans">
            {emptyState.description}
          </p>
        </div>

        <div className="dcb:flex dcb:items-center dcb:gap-2">
          {messages.length > 0 && (
            <Button
              variant="ghost"
              size="icon"
              type="button"
              onClick={clearConversation}
              disabled={status !== "ready"}
              className="dcb:cursor-pointer"
              aria-label="Clear conversation"
            >
              <RefreshCcw className="dcb:h-4 dcb:w-4" />
            </Button>
          )}
          {onRequestClose && (
            <Button
              variant="ghost"
              size="icon"
              type="button"
              onClick={onRequestClose}
              className="dcb:cursor-pointer"
              aria-label="Close chatbot"
            >
              <X className="dcb:h-4 dcb:w-4" />
            </Button>
          )}
        </div>
      </div>

      <Conversation className="dcb:relative dcb:w-full dcb:flex-1 dcb:overflow-hidden">
        {error && (
          <div className="dcb:absolute dcb:left-4 dcb:right-4 dcb:top-4 dcb:z-10">
            <Alert variant="destructive" className="dcb:shadow-lg">
              <AlertCircle className="dcb:h-4 dcb:w-4" />

              <AlertDescription className="dcb:pr-8">
                {error.message || "Something went wrong. Please try again."}
              </AlertDescription>

              <Button
                variant="ghost"
                size="icon"
                className="dcb:absolute dcb:right-2 dcb:top-2 dcb:h-6 dcb:w-6 dcb:text-destructive hover:dcb:bg-destructive/10 hover:dcb:text-destructive"
                onClick={() => clearError()}
              >
                <X className="dcb:h-4 dcb:w-4" />
              </Button>
            </Alert>
          </div>
        )}

        <ConversationContent>
          {messages.length === 0 ? (
            <ConversationEmptyState
              icon={<MessageSquare className="dcb:size-12" />}
              title={emptyState.title}
              description={emptyState.description}
            />
          ) : (
            messages.map((message) => (
              <Message key={message.id} from={message.role}>
                <MessageContent
                  className={
                    message.role === "assistant"
                      ? "!dcb:max-w-full dcb:w-full"
                      : ""
                  }
                >
                  {message.parts.map((part) => {
                    switch (part.type) {
                      case "text":
                      case "reasoning":
                        return part.text;
                      case "source-url":
                        return (
                          <Artifact key={part.sourceId}>
                            <ArtifactHeader
                              className="dcb:cursor-pointer dcb:transition-colors hover:dcb:bg-muted/70"
                              onClick={() => window.open(part.url, "_blank")}
                            >
                              <ArtifactTitle>{part.title}</ArtifactTitle>
                              <ArtifactActions>
                                <ArtifactAction
                                  icon={ExternalLink}
                                  tooltip="Go to source"
                                  className="dcb:cursor-pointer"
                                />
                              </ArtifactActions>
                            </ArtifactHeader>

                            {part.providerMetadata?.result && (
                              <ArtifactContent>
                                <ResponseLight>
                                  {part.providerMetadata.result.snippet as string}
                                </ResponseLight>
                              </ArtifactContent>
                            )}
                          </Artifact>
                        );
                    }
                  })}
                </MessageContent>
              </Message>
            ))
          )}
        </ConversationContent>

        <ConversationScrollButton />
      </Conversation>

      <div className="dcb:border-t dcb:bg-background dcb:px-4 dcb:py-2 dcb:flex-shrink-0">
        <PromptInput
          onSubmit={(message: PromptInputMessage) => {
            if (!message.text?.trim()) {
              return;
            }

            void sendMessage({ text: message.text });
            setInputValue("");
          }}
        >
          <PromptInputBody>
            <PromptInputTextarea
              placeholder="Ask a question..."
              className="dcb:max-h-32 dcb:min-h-8"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <PromptInputToolbar>
              <PromptInputTools />
              <PromptInputSubmit
                status={status}
                className="dcb:cursor-pointer"
              />
            </PromptInputToolbar>
          </PromptInputBody>
        </PromptInput>
      </div>
    </div>
  );
};

export const DocsChatbot = (props: DocsChatbotProps) => {
  const {
    searchUrl,
    apiKey,
    title,
    emptyState,
    className,
    style,
  } = props;
  const [internalOpen, setInternalOpen] = useState(false);

  if (props.variant === "embedded") {
    return (
      <DocsChatbotPanel
        variant="embedded"
        searchUrl={searchUrl}
        apiKey={apiKey}
        title={title}
        emptyState={emptyState}
        className={className}
        style={style}
      />
    );
  }

  const isCustomTrigger = props.trigger === "custom";
  const open = isCustomTrigger ? props.open : internalOpen;

  const setOpen = (nextOpen: boolean) => {
    if (isCustomTrigger) {
      props.onOpenChange(nextOpen);
      return;
    }

    setInternalOpen(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!isCustomTrigger && (
        <DialogTrigger asChild>
          <Button
            size="icon"
            className="dcb:fixed dcb:bottom-4 dcb:right-4 dcb:h-14 dcb:w-14 dcb:rounded-full dcb:cursor-pointer dcb:shadow-lg"
          >
            <MessageSquare className="dcb:h-6 dcb:w-6" />
          </Button>
        </DialogTrigger>
      )}

      <DialogContent
        showCloseButton={false}
        className={cn(
          "dcb:fixed dcb:bottom-20 dcb:left-auto dcb:right-4 dcb:top-auto dcb:h-[min(600px,calc(100vh-7rem))] dcb:w-[calc(100vw-2rem)] dcb:max-w-md dcb:translate-x-0 dcb:translate-y-0 dcb:gap-0 dcb:p-0 sm:dcb:max-w-[425px]",
          isCustomTrigger ? "dcb:bottom-4" : "dcb:bottom-20"
        )}
      >
        <DialogTitle className="dcb:sr-only dcb:rounded-none dcb:border-0 dcb:bg-transparent dcb:p-0">
          {title}
        </DialogTitle>
        <DocsChatbotPanel
          variant="dialog"
          searchUrl={searchUrl}
          apiKey={apiKey}
          title={title}
          emptyState={emptyState}
          className={className}
          style={style}
          onRequestClose={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};
