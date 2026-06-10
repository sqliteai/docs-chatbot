import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
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
import { DefaultChatTransport, type UIMessage } from "ai";
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
import type { DocumentSearchResult } from "@/types/chat";

export type DocsChatbotSearch = {
  url: string;
  apiKey: string;
};

export type DocsChatbotPersistence = {
  key: string;
  storage?: "session" | "local";
};

export type DocsChatbotHeader = {
  showClearButton?: boolean;
  icon?: ReactNode;
  label?: ReactNode;
  closeButtonIcon?: ReactNode;
  onClose?: () => void;
};

export type DocsChatbotResults = {
  onSelect?: (result: DocumentSearchResult) => void;
  snippetMaxLines?: number;
  snippetMaxChars?: number;
};

export type DocsChatbotDialogDefault = {
  trigger?: "default";
};

export type DocsChatbotDialogCustom = {
  trigger: "custom";
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type DocsChatbotSharedProps = {
  search: DocsChatbotSearch;
  title: string;
  emptyState?: {
    title: string;
    description: string;
  };
  persistence?: DocsChatbotPersistence;
  header?: DocsChatbotHeader;
  results?: DocsChatbotResults;
  className?: string;
  style?: CSSProperties;
};

type DocsChatbotDialogDefaultProps = DocsChatbotSharedProps & {
  variant?: "dialog";
  dialog?: DocsChatbotDialogDefault;
};

type DocsChatbotDialogCustomProps = DocsChatbotSharedProps & {
  variant?: "dialog";
  dialog: DocsChatbotDialogCustom;
};

type DocsChatbotEmbeddedProps = DocsChatbotSharedProps & {
  variant: "embedded";
  dialog?: never;
};

export type DocsChatbotProps =
  | DocsChatbotDialogDefaultProps
  | DocsChatbotDialogCustomProps
  | DocsChatbotEmbeddedProps;

type DocsChatbotPanelProps = DocsChatbotSharedProps & {
  variant: "dialog" | "embedded";
  onRequestClose?: () => void;
};

const DEFAULT_EMPTY_STATE = {
  title: "Ask a question",
  description: "Search your indexed documentation and review relevant results.",
};

type PersistedConversationState = {
  inputValue: string;
  messages: UIMessage[];
};

const EMPTY_PERSISTED_CONVERSATION: PersistedConversationState = {
  inputValue: "",
  messages: [],
};

function getPersistenceStorage(
  persistence?: DocsChatbotPersistence
): Storage | null {
  if (typeof window === "undefined" || !persistence) {
    return null;
  }

  try {
    return persistence.storage === "local"
      ? window.localStorage
      : window.sessionStorage;
  } catch {
    return null;
  }
}

function loadPersistedConversation(
  persistence?: DocsChatbotPersistence
): PersistedConversationState {
  const storage = getPersistenceStorage(persistence);

  if (!storage || !persistence?.key) {
    return EMPTY_PERSISTED_CONVERSATION;
  }

  try {
    const raw = storage.getItem(persistence.key);

    if (!raw) {
      return EMPTY_PERSISTED_CONVERSATION;
    }

    const parsed = JSON.parse(raw) as Partial<PersistedConversationState>;

    return {
      inputValue:
        typeof parsed.inputValue === "string" ? parsed.inputValue : "",
      messages: Array.isArray(parsed.messages) ? parsed.messages : [],
    };
  } catch {
    return EMPTY_PERSISTED_CONVERSATION;
  }
}

function persistConversation(
  persistence: DocsChatbotPersistence | undefined,
  state: PersistedConversationState
) {
  const storage = getPersistenceStorage(persistence);

  if (!storage || !persistence?.key) {
    return;
  }

  try {
    storage.setItem(persistence.key, JSON.stringify(state));
  } catch {
    // Ignore storage quota and serialization issues.
  }
}

function truncateSnippet(snippet: string, maxChars?: number) {
  if (
    typeof maxChars !== "number" ||
    !Number.isFinite(maxChars) ||
    maxChars <= 0 ||
    snippet.length <= maxChars
  ) {
    return snippet;
  }

  return `${snippet.slice(0, Math.max(0, maxChars - 1)).trimEnd()}…`;
}

const DocsChatbotPanel = ({
  search,
  title,
  emptyState = DEFAULT_EMPTY_STATE,
  persistence,
  header,
  results,
  className,
  style,
  variant,
  onRequestClose,
}: DocsChatbotPanelProps) => {
  const initialPersistedConversation = loadPersistedConversation(
    persistence
  );
  const persistenceId = persistence
    ? `${persistence.storage ?? "session"}:${persistence.key}`
    : null;
  const showClearButton = header?.showClearButton ?? false;
  const headerIcon = header?.icon ?? (
    <MessageSquare className="dcb:h-4 dcb:w-4 dcb:text-primary" />
  );
  const headerLabel = header?.label ?? title;
  const closeButtonIcon = header?.closeButtonIcon ?? (
    <X className="dcb:h-4 dcb:w-4" />
  );
  const onClose = header?.onClose ?? onRequestClose;
  const onResultSelect = results?.onSelect;
  const resultSnippetMaxLines = results?.snippetMaxLines;
  const resultSnippetMaxChars = results?.snippetMaxChars;

  const [inputValue, setInputValue] = useState(
    initialPersistedConversation.inputValue
  );
  const [hydratedPersistenceId, setHydratedPersistenceId] =
    useState<string | null>(persistenceId);
  const lastLoadedPersistenceId = useRef<string | null>(persistenceId);

  const { messages, sendMessage, status, error, clearError, setMessages } =
    useChat({
      messages: initialPersistedConversation.messages,
      transport: new DefaultChatTransport({
        fetch: (_, init) =>
          docSearch({
            request: JSON.parse(init?.body as string) as SendMessageRequest,
            searchUrl: new URL(search.url),
            apiKey: search.apiKey,
          }),
      }),
    });

  useEffect(() => {
    if (persistenceId === lastLoadedPersistenceId.current) {
      return;
    }

    const persistedConversation =
      loadPersistedConversation(persistence);

    lastLoadedPersistenceId.current = persistenceId;
    setHydratedPersistenceId(persistenceId);
    clearError();
    setInputValue(persistedConversation.inputValue);
    setMessages(persistedConversation.messages);
  }, [clearError, persistence, persistenceId, setMessages]);

  useEffect(() => {
    if (!persistence || hydratedPersistenceId !== persistenceId) {
      return;
    }

    persistConversation(persistence, {
      inputValue,
      messages,
    });
  }, [
    persistence,
    hydratedPersistenceId,
    inputValue,
    messages,
    persistenceId,
  ]);

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

  const handleResultSelect = (result: DocumentSearchResult) => {
    if (onResultSelect) {
      onResultSelect(result);
      return;
    }

    window.open(result.url, "_blank");
  };

  return (
    <div
      className={cn(
        "dcb:flex dcb:w-full dcb:min-h-0 dcb:flex-col dcb:overflow-hidden dcb:text-foreground",
        variant === "embedded"
          ? "dcb:h-full dcb:bg-background"
          : "dcb:h-full",
        className
      )}
      style={style}
    >
      <div className="dcb:flex dcb:items-center dcb:justify-between dcb:gap-3 dcb:border-b dcb:border-border/80 dcb:bg-background dcb:px-3.5 dcb:py-3">
        <div className="dcb:min-w-0">
          <div className="dcb:flex dcb:items-center dcb:gap-2 dcb:text-sm dcb:font-semibold dcb:font-sans">
            {headerIcon}
            <span className="dcb:truncate">{headerLabel}</span>
          </div>
          {emptyState.description ? (
            <p className="dcb:mt-1 dcb:text-[11px] dcb:leading-4 dcb:text-muted-foreground dcb:font-sans">
              {emptyState.description}
            </p>
          ) : null}
        </div>

        <div className="dcb:flex dcb:items-center dcb:gap-2">
          {showClearButton && messages.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={clearConversation}
              disabled={status !== "ready"}
              className="dcb:h-8 dcb:cursor-pointer dcb:border-border/70 dcb:px-2.5 dcb:text-xs dcb:text-muted-foreground dcb:shadow-none hover:dcb:text-foreground"
              aria-label="Clear conversation"
            >
              <RefreshCcw className="dcb:h-4 dcb:w-4" />
              Clear
            </Button>
          )}
          {onClose && (
            <>
              <Button
                variant="ghost"
                size="sm"
                type="button"
                onClick={onClose}
                className="dcb:h-8 dcb:w-8 dcb:cursor-pointer dcb:p-0 dcb:text-muted-foreground hover:dcb:text-foreground"
                aria-label="Close chatbot"
              >
                {closeButtonIcon}
              </Button>
            </>
          )}
        </div>
      </div>

      <Conversation className="dcb:relative dcb:w-full dcb:flex-1 dcb:overflow-hidden">
        {error && (
          <div className="dcb:absolute dcb:left-3 dcb:right-3 dcb:top-3 dcb:z-10">
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
                      case "source-url": {
                        const rawMetadata = part.providerMetadata?.result;
                        const metadata =
                          rawMetadata &&
                          typeof rawMetadata === "object" &&
                          !Array.isArray(rawMetadata)
                            ? (rawMetadata as DocumentSearchResult)
                            : undefined;
                        const resultTitle = part.title ?? "Untitled Document";
                        const resultSnippet =
                          typeof metadata?.snippet === "string"
                            ? metadata.snippet
                            : "";
                        const displayedSnippet = truncateSnippet(
                          resultSnippet,
                          resultSnippetMaxChars
                        );
                        const result: DocumentSearchResult = {
                          ...(metadata ?? {}),
                          id: part.sourceId,
                          title: resultTitle,
                          url: part.url,
                          snippet: resultSnippet,
                        };

                        return (
                          <Artifact
                            key={part.sourceId}
                            aria-label={`Open result ${resultTitle}`}
                            className="dcb:cursor-pointer dcb:transition-colors hover:dcb:border-primary/40"
                            onClick={() => handleResultSelect(result)}
                            onKeyDown={(event) => {
                              if (
                                event.key === "Enter" ||
                                event.key === " "
                              ) {
                                event.preventDefault();
                                handleResultSelect(result);
                              }
                            }}
                            role="button"
                            tabIndex={0}
                          >
                            <ArtifactHeader className="dcb:transition-colors hover:dcb:bg-muted/70">
                              <ArtifactTitle>{resultTitle}</ArtifactTitle>
                              <ArtifactActions>
                                <ArtifactAction
                                  icon={ExternalLink}
                                  tooltip="Open result"
                                />
                              </ArtifactActions>
                            </ArtifactHeader>

                            {displayedSnippet && (
                              <ArtifactContent>
                                <ResponseLight
                                  className="dcb:text-xs dcb:leading-5 dcb:[&_p]:mb-2"
                                  style={
                                    typeof resultSnippetMaxLines === "number" &&
                                    Number.isFinite(resultSnippetMaxLines) &&
                                    resultSnippetMaxLines > 0
                                      ? {
                                          display: "-webkit-box",
                                          overflow: "hidden",
                                          WebkitBoxOrient: "vertical",
                                          WebkitLineClamp: resultSnippetMaxLines,
                                        }
                                      : undefined
                                  }
                                >
                                  {displayedSnippet}
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

      <div className="dcb:border-t dcb:border-border/80 dcb:bg-background dcb:px-3.5 dcb:py-3 dcb:flex-shrink-0">
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
              className="dcb:max-h-32"
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
  const { search, title, emptyState, persistence, header, results, className } =
    props;
  const [internalOpen, setInternalOpen] = useState(false);
  const basePanelProps: DocsChatbotPanelProps = {
    search,
    title,
    emptyState,
    persistence,
    header,
    results,
    className,
    style: props.style,
    variant: props.variant ?? "dialog",
  };

  if (props.variant === "embedded") {
    return <DocsChatbotPanel {...basePanelProps} />;
  }

  const customDialog =
    props.dialog?.trigger === "custom" ? props.dialog : undefined;
  const isCustomTrigger = customDialog !== undefined;
  const open = customDialog?.open ?? internalOpen;

  const setOpen = (nextOpen: boolean) => {
    if (customDialog) {
      customDialog.onOpenChange(nextOpen);
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
        showOverlay={false}
        onInteractOutside={(event) => event.preventDefault()}
        className={cn(
          "dcb:fixed dcb:bottom-20 dcb:left-auto dcb:right-4 dcb:top-auto dcb:h-[min(600px,calc(100vh-7rem))] dcb:w-[calc(100vw-2rem)] dcb:max-w-md dcb:translate-x-0 dcb:translate-y-0 dcb:gap-0 dcb:overflow-hidden dcb:border-border dcb:ring-1 dcb:ring-border/70 dcb:p-0 sm:dcb:max-w-[425px]",
          isCustomTrigger ? "dcb:bottom-4" : "dcb:bottom-20"
        )}
      >
        <DialogTitle className="dcb:sr-only dcb:rounded-none dcb:border-0 dcb:bg-transparent dcb:p-0">
          {title}
        </DialogTitle>
        <DocsChatbotPanel
          {...basePanelProps}
          onRequestClose={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};
