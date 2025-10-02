import type { SearchResponse, SendMessageRequest } from "@/types/chat";
import { createUIMessageStream, createUIMessageStreamResponse } from "ai";
import { nanoid } from "nanoid";

/**
 * Performs document search using SQLite Cloud AI search API and streams results back to the chat.
 *
 * Extracts the user's query from the chat messages, calls the search endpoint,
 * and streams formatted search results including document titles, URLs, and excerpts.
 *
 * @param params.request - Chat request containing user messages and metadata
 * @param params.searchUrl - URL of the SQLite Cloud AI search endpoint
 * @param params.apiKey - Bearer token for API authentication
 *
 * @returns Promise<Response> - Streaming response with search results formatted for the chat UI
 *
 * @throws {Error} When no query is found in user message or API call fails
 */
export async function docSearch({
  request,
  searchUrl,
  apiKey,
}: {
  request: SendMessageRequest;
  searchUrl: URL;
  apiKey: string;
}) {
  try {
    const messages = request.messages;

    const lastUserMessage = messages[messages.length - 1];
    let query = "";

    if (lastUserMessage.role === "user" && lastUserMessage.parts.length > 0) {
      query = lastUserMessage.parts
        .filter((part) => part.type === "text")
        .map((part) => part.text)
        .join(" ");
    }

    if (!query.trim()) {
      throw new Error(
        "Your message appears to be empty. Please type a question or search term."
      );
    }

    searchUrl.searchParams.set("query", query.trim());

    const searchResponse = await fetch(searchUrl.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (!searchResponse.ok) {
      throw new Error(
        `Failed to complete the search. Please check your connection and try again.`
      );
    }

    const searchResult = (await searchResponse.json()) as SearchResponse;

    return createUIMessageStreamResponse({
      status: 200,
      statusText: "OK",
      stream: createUIMessageStream({
        execute({ writer }) {
          if (searchResult.data.search.length > 0) {
            const searchResults = searchResult.data.search;

            const summaryId = nanoid();
            writer.write({
              type: "text-start",
              id: summaryId,
            });
            writer.write({
              type: "text-delta",
              id: summaryId,
              delta: `I found ${searchResults.length} relevant result(s) for your query:`,
            });
            writer.write({
              type: "text-end",
              id: summaryId,
            });

            searchResults.map((result) =>
              writer.write({
                type: "source-url",
                sourceId: result.id,
                title: result.title,
                url: result.url,
                providerMetadata: {
                  search: {
                    snippet: result.snippet,
                  },
                },
              })
            );
          } else {
            const fallbackId = nanoid();

            writer.write({
              type: "text-start",
              id: fallbackId,
            });

            writer.write({
              type: "text-delta",
              id: fallbackId,
              delta: "I couldn't find any relevant information for your query.",
            });

            writer.write({
              type: "text-end",
              id: fallbackId,
            });
          }
        },
      }),
    });
  } catch (error) {
    return new Response(
      error instanceof Error ? error.message : "Unknown error",
      {
        status: 500,
        statusText: "Internal Server Error",
      }
    );
  }
}
