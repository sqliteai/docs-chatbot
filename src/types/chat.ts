import type { UIMessage } from "ai";

/**
 * Request payload sent to the chat transport when a user submits a message
 * or triggers a message regeneration.
 */
export type SendMessageRequest = {
  /** Unique identifier for this chat request */
  id: string;
  /** Array of all chat messages including the user's last message */
  messages: UIMessage[];
  /** The action that triggered this request */
  trigger: "submit-message" | "regenerate-message";
};

/**
 * A single document search result returned by the AI search API.
 * Contains the document content, location, and relevance scoring.
 */
export type DocumentSearchResult = {
  /** Unique identifier for this document chunk */
  id: string;
  /** File path or URL to the source document */
  uri: string;
  /** Relevant text excerpt from the document */
  snippet: string;
  /** The title of the document */
  title: string;
};

/**
 * Response from the document search API containing search results and metadata.
 */
export type SearchResponse = {
  data: {
    /** Array of matching documents */
    search: DocumentSearchResult[];
  };
};
