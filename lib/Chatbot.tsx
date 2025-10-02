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
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ExternalLink, MessageSquare } from "lucide-react";
import { Response } from "@/components/ai-elements/response";
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

/** Props for the Chatbot component */
export type ChatbotProps = {
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

/**
 * AI-powered document search chatbot component.
 *
 * @param props.searchUrl - SQLite Cloud AI search endpoint URL
 * @param props.apiKey - Authentication token for API access
 *
 * @returns JSX.Element - Rendered chatbot interface
 */
export const Chatbot = ({
  searchUrl,
  apiKey,
  title,
  emptyState,
}: ChatbotProps) => {
  const [open, setOpen] = useState(false);
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
      <DialogTrigger asChild>
        <Button
          size="icon"
          className="fixed bottom-4 right-4 h-14 w-14 rounded-full shadow-lg cursor-pointer"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      </DialogTrigger>

      <DialogContent
        className={cn(
          "max-w-md w-[calc(100vw-2rem)] h-[min(600px,calc(100vh-7rem))] sm:max-w-[425px]",
          "flex flex-col p-0 fixed gap-0",
          "top-auto left-auto bottom-20 right-4",
          "translate-x-0 translate-y-0"
        )}
      >
        <div className="px-4 py-3 border-b bg-background rounded-lg flex-shrink-0">
          <h2 className="text-lg font-semibold">{title}</h2>
        </div>

        <Conversation className="relative w-full h-full overflow-hidden">
          {error && (
            <div className="absolute top-4 left-4 right-4 z-10">
              <Alert variant="destructive" className="shadow-lg">
                <AlertCircle className="h-4 w-4" />

                <AlertDescription className="pr-8">
                  {error.message || "Something went wrong. Please try again."}
                </AlertDescription>

                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-6 w-6 text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => clearError()}
                >
                  <X className="h-4 w-4" />
                </Button>
              </Alert>
            </div>
          )}

          <ConversationContent>
            {messages.length === 0 ? (
              emptyState ? (
                <ConversationEmptyState
                  icon={<MessageSquare className="size-12" />}
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
                      message.role === "assistant" ? "!max-w-full w-full" : ""
                    }
                  >
                    {message.parts.map((part) => {
                      switch (part.type) {
                        case "text":
                        case "reasoning": {
                          return (
                            <Response key={`${message.id}-part-${part.type}`}>
                              {part.text}
                            </Response>
                          );
                        }
                        case "source-url": {
                          const snippetLines = part.providerMetadata?.search
                            ?.snippet
                            ? [
                                (
                                  part.providerMetadata.search.snippet as string
                                ).slice(0, 200),
                              ]
                            : [];

                          return (
                            <Artifact key={part.sourceId}>
                              <ArtifactHeader
                                className="cursor-pointer hover:bg-muted/70 transition-colors"
                                onClick={() => window.open(part.url, "_blank")}
                              >
                                <ArtifactTitle>{part.title}</ArtifactTitle>
                                <ArtifactActions>
                                  <ArtifactAction
                                    icon={ExternalLink}
                                    tooltip="Go to source"
                                    className="cursor-pointer"
                                  />
                                </ArtifactActions>
                              </ArtifactHeader>

                              {snippetLines.length > 0 && (
                                <ArtifactContent>
                                  <div className="text-sm text-muted-foreground">
                                    <Response>
                                      {snippetLines.join("\n") + "..."}
                                    </Response>
                                  </div>
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

        <div className="px-4 py-2 border-t flex-shrink-0">
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
                className="min-h-8 max-h-32"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <PromptInputToolbar>
                <PromptInputTools></PromptInputTools>
                <PromptInputSubmit status={status} className="cursor-pointer" />
              </PromptInputToolbar>
            </PromptInputBody>
          </PromptInput>
        </div>
      </DialogContent>
    </Dialog>
  );
};
