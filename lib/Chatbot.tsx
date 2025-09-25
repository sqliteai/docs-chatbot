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

export const Chatbot = () => {
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "https://jsonplaceholder.typicode.com/posts",
    }),
  });

  const handleSubmit = (
    message: PromptInputMessage,
    event: React.FormEvent<HTMLFormElement>
  ) => {
    if (message.text?.trim()) {
      void sendMessage({ text: message.text });
      event.currentTarget.reset();
    }
  };

  return (
    <div className="flex flex-col h-96 max-w-md mx-auto border rounded-lg">
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
        <PromptInput onSubmit={handleSubmit}>
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
