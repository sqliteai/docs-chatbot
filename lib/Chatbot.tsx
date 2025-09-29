import { useChat } from "@ai-sdk/react";
import {
  Message,
  MessageContent,
  MessageAvatar,
} from "../src/components/ai-elements/message";
import {
  PromptInput,
  PromptInputBody,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
  PromptInputSubmit,
  type PromptInputMessage,
} from "../src/components/ai-elements/prompt-input";
import { DefaultChatTransport } from "ai";
import { docSearch } from "@/services/docSearch";
import type { SendMessageRequest } from "@/types/chat";

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
    <div className="flex flex-col h-[800px] mt-5 max-w-md mx-auto border rounded-lg">
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((message) => (
          <Message key={message.id} from={message.role}>
            <MessageAvatar
              src={
                message.role === "user" ? "/user-avatar.png" : "/bot-avatar.png"
              }
              name={message.role === "user" ? "DY" : "Assistant"}
            />
            <MessageContent>
              {message.parts.map((part) => (
                <span key={`${message.id}-part-${part.type}`}>
                  {part.type === "text" || part.type === "reasoning"
                    ? part.text
                    : part.type === "file"
                    ? `[File: ${part.mediaType}]`
                    : `[${part.type}]`}
                </span>
              ))}
            </MessageContent>
          </Message>
        ))}

        {status === "streaming" && (
          <Message from="assistant">
            <MessageAvatar src="/bot-avatar.png" name="Assistant" />
            <MessageContent>
              <div className="animate-pulse">Typing...</div>
            </MessageContent>
          </Message>
        )}
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
