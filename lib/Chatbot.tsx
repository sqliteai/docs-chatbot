import { useChat } from "@ai-sdk/react";
import { Message, MessageContent } from "../src/components/ai-elements/message";
import {
  PromptInput,
  PromptInputBody,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
  PromptInputSubmit,
  type PromptInputMessage,
} from "../src/components/ai-elements/prompt-input";
import { Source } from "../src/components/ai-elements/sources";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../src/components/ui/collapsible";
import { ChevronDownIcon, MessageSquare } from "lucide-react";
import { Response } from "../src/components/ai-elements/response";
import { DefaultChatTransport } from "ai";
import { docSearch } from "@/services/docSearch";
import type { SendMessageRequest } from "@/types/chat";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";

/** Props for the Chatbot component */
export type ChatbotProps = {
  /** Edge function URL for the search functionality */
  searchUrl: string;
  /** Bearer token for edge function authentication */
  apiKey: string;
};

/**
 * AI-powered document search chatbot component.
 *
 * @param props.searchUrl - SQLite Cloud AI search endpoint URL
 * @param props.apiKey - Authentication token for API access
 *
 * @returns JSX.Element - Rendered chatbot interface
 */
export const Chatbot = ({ searchUrl, apiKey }: ChatbotProps) => {
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      fetch: (_, init) =>
        docSearch({
          request: JSON.parse(init?.body as string) as SendMessageRequest,
          searchUrl: new URL(searchUrl),
          apiKey,
        }),
    }),
  });

  return (
    <div className="flex flex-col h-[800px] mt-5 max-w-xl mx-auto border rounded-lg">
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        <Conversation className="relative w-full" style={{ height: "620px" }}>
          <ConversationContent>
            {messages.length === 0 ? (
              <ConversationEmptyState
                icon={<MessageSquare className="size-12" />}
                title="Ask questions about SQLite Cloud"
                description="Get help with SQLite Cloud documentation"
              />
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
                          return (
                            <Collapsible key={part.sourceId}>
                              <CollapsibleTrigger className="flex items-center justify-between w-full p-3 text-left border rounded-md hover:bg-muted/50 transition-colors group">
                                <span className="font-medium text-sm">
                                  {part.title}
                                </span>
                                <ChevronDownIcon className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                              </CollapsibleTrigger>

                              <CollapsibleContent className="mt-2 p-3 border rounded-md bg-muted/25">
                                {part.providerMetadata?.search?.snippet && (
                                  <div className="text-sm text-muted-foreground mb-3">
                                    <Response>
                                      {
                                        part.providerMetadata.search
                                          .snippet as string
                                      }
                                    </Response>
                                  </div>
                                )}

                                <Source href={part.url} title={"Read more"} />
                              </CollapsibleContent>
                            </Collapsible>
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
      </div>

      <div className="p-4 border-t">
        <PromptInput
          onSubmit={(
            message: PromptInputMessage,
            event: React.FormEvent<HTMLFormElement>
          ) => {
            if (message.text?.trim()) {
              void sendMessage({ text: message.text });
              event.currentTarget.reset();
            }
          }}
        >
          <PromptInputBody>
            <PromptInputTextarea placeholder="Ask a question..." />
            <PromptInputToolbar>
              <PromptInputTools></PromptInputTools>
              <PromptInputSubmit status={status} />
            </PromptInputToolbar>
          </PromptInputBody>
        </PromptInput>
      </div>
    </div>
  );
};
