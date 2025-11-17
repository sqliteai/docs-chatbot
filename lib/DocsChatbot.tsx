import { useState, useEffect } from "react";
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
import { ExternalLink, MessageSquare } from "lucide-react";
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
import { AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Base props shared by all variants */
type DocsChatbotBaseProps = {
  /** Edge function URL for the search functionality */
  searchUrl: string;
  /** Bearer token for edge function authentication */
  apiKey: string;
  /** Header title of the chatbot */
  title: string;
  /** Title and description for the empty state */
  emptyState?: {
    title: string;
    description: string;
  };
};

/** Props when using the default floating trigger button */
type DocsChatbotDefaultTriggerProps = DocsChatbotBaseProps & {
  /** Use the default floating trigger button */
  trigger?: "default";
  /** Not used with default trigger */
  open?: never;
  /** Not used with default trigger */
  onOpenChange?: never;
};

/** Props when using a custom trigger button (controlled) */
type DocsChatbotCustomTriggerProps = DocsChatbotBaseProps & {
  /** Use a custom trigger button - requires open and onOpenChange */
  trigger: "custom";
  /** Control the open state externally */
  open: boolean;
  /** Callback when the open state changes */
  onOpenChange: (open: boolean) => void;
};

/** Props for the Chatbot component */
export type DocsChatbotProps =
  | DocsChatbotDefaultTriggerProps
  | DocsChatbotCustomTriggerProps;

/**
 * AI-powered document search chatbot component.
 *
 * @param props.searchUrl - SQLite Cloud AI search endpoint URL
 * @param props.apiKey - Authentication token for API access
 *
 * @returns JSX.Element - Rendered chatbot interface
 */
export const DocsChatbot = ({
  searchUrl,
  apiKey,
  title,
  emptyState,
  ...props
}: DocsChatbotProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const isCustomTrigger = props.trigger === "custom";
  const open = isCustomTrigger ? props.open : internalOpen;
  const setOpen = (newOpen: boolean) => {
    if (isCustomTrigger) {
      props.onOpenChange(newOpen);
    } else {
      setInternalOpen(newOpen);
    }
  };

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
    if (error && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];

      if (lastMessage.role === "user") {
        const messageText = lastMessage.parts
          .filter((part) => part.type === "text")
          .map((part) => part.text)
          .join(" ");

        setMessages(messages.slice(0, -1));
        setInputValue(messageText);
      }
    }
  }, [error, messages, setMessages]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!isCustomTrigger && (
        <DialogTrigger asChild>
          <Button
            size="icon"
            className="dcb:fixed dcb:bottom-4 dcb:right-4 dcb:h-14 dcb:w-14 dcb:rounded-full dcb:shadow-lg dcb:cursor-pointer"
          >
            <MessageSquare className="dcb:h-6 dcb:w-6" />
          </Button>
        </DialogTrigger>
      )}

      <DialogContent
        className={cn(
          "dcb:max-w-md dcb:w-[calc(100vw-2rem)] dcb:h-[min(600px,calc(100vh-7rem))] sm:dcb:max-w-[425px]",
          "dcb:flex dcb:flex-col dcb:p-0 dcb:fixed dcb:gap-0",
          "dcb:top-auto dcb:left-auto dcb:right-4",
          isCustomTrigger ? "dcb:bottom-4" : "dcb:bottom-20",
          "dcb:translate-x-0 dcb:translate-y-0"
        )}
      >
        <DialogTitle>{title}</DialogTitle>

        <Conversation className="dcb:relative dcb:w-full dcb:h-full dcb:overflow-hidden">
          {error && (
            <div className="dcb:absolute dcb:top-4 dcb:left-4 dcb:right-4 dcb:z-10">
              <Alert variant="destructive" className="dcb:shadow-lg">
                <AlertCircle className="dcb:h-4 dcb:w-4" />

                <AlertDescription className="dcb:pr-8">
                  {error.message || "Something went wrong. Please try again."}
                </AlertDescription>

                <Button
                  variant="ghost"
                  size="icon"
                  className="dcb:absolute dcb:top-2 dcb:right-2 dcb:h-6 dcb:w-6 dcb:text-destructive hover:dcb:text-destructive hover:dcb:bg-destructive/10"
                  onClick={() => clearError()}
                >
                  <X className="dcb:h-4 dcb:w-4" />
                </Button>
              </Alert>
            </div>
          )}

          <ConversationContent>
            {messages.length === 0 ? (
              emptyState ? (
                <ConversationEmptyState
                  icon={<MessageSquare className="dcb:size-12" />}
                  title={emptyState.title}
                  description={emptyState.description}
                />
              ) : (
                <></>
              )
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
                        case "reasoning": {
                          return part.text;
                        }
                        case "source-url": {
                          return (
                            <Artifact key={part.sourceId}>
                              <ArtifactHeader
                                className="dcb:cursor-pointer hover:dcb:bg-muted/70 dcb:transition-colors"
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
                                    {
                                      part.providerMetadata.result
                                        .snippet as string
                                    }
                                  </ResponseLight>
                                </ArtifactContent>
                              )}
                            </Artifact>
                          );
                        }
                      }
                    })}
                  </MessageContent>
                </Message>
              ))
            )}
          </ConversationContent>

          <ConversationScrollButton />
        </Conversation>

        <div className="dcb:px-4 dcb:py-2 dcb:border-t dcb:flex-shrink-0">
          <PromptInput
            onSubmit={(message: PromptInputMessage) => {
              if (message.text?.trim()) {
                void sendMessage({ text: message.text });
                setInputValue("");
              }
            }}
          >
            <PromptInputBody>
              <PromptInputTextarea
                placeholder="Ask a question..."
                className="dcb:min-h-8 dcb:max-h-32"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <PromptInputToolbar>
                <PromptInputTools></PromptInputTools>
                <PromptInputSubmit
                  status={status}
                  className="dcb:cursor-pointer"
                />
              </PromptInputToolbar>
            </PromptInputBody>
          </PromptInput>
        </div>
      </DialogContent>
    </Dialog>
  );
};
