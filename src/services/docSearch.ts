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
    console.warn("docSearch request: ", JSON.stringify(request, null, 2));
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
      throw new Error("No query found in user message");
    }

    searchUrl.searchParams.set("query", query.trim());

    const searchResponse = await fetch(searchUrl.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (!searchResponse.ok) {
      throw new Error(`Search API failed: ${searchResponse.statusText}`);
    }

    const searchResult = (await searchResponse.json()) as SearchResponse;

    return createUIMessageStreamResponse({
      status: 200,
      statusText: "OK",
      headers: {
        "Content-Type": "application/json",
      },
      stream: createUIMessageStream({
        execute({ writer }) {
          if (searchResult.data.search.length > 0) {
            const searchResults = searchResult.data.search;

            const textId = nanoid();
            writer.write({
              type: "text-start",
              id: textId,
            });

            writer.write({
              type: "text-delta",
              id: textId,
              delta: `I found ${searchResults.length} relevant result(s) for your query:\n\n`,
            });

            writer.write({
              type: "text-end",
              id: textId,
            });

            searchResults.forEach((result) => {
              const partId1 = nanoid();
              writer.write({
                type: "text-start",
                id: partId1,
              });
              writer.write({
                type: "text-delta",
                id: partId1,
                delta: result.title,
              });
              writer.write({
                type: "text-end",
                id: partId1,
              });

              const partId2 = nanoid();
              writer.write({
                type: "text-start",
                id: partId2,
              });
              writer.write({
                type: "text-delta",
                id: partId2,
                delta: `🔗 ${result.uri}`,
              });
              writer.write({
                type: "text-end",
                id: partId2,
              });

              const partId3 = nanoid();
              writer.write({
                type: "text-start",
                id: partId3,
              });
              writer.write({
                type: "text-delta",
                id: partId3,
                delta: `📝 ${result.snippet}`,
              });
              writer.write({
                type: "text-end",
                id: partId3,
              });
            });
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
    return createUIMessageStreamResponse({
      status: 500,
      statusText: "Internal Server Error",
      headers: {
        "Content-Type": "application/json",
      },
      stream: createUIMessageStream({
        execute({ writer }) {
          const errorId = nanoid();

          writer.write({
            type: "text-start",
            id: errorId,
          });

          writer.write({
            type: "text-delta",
            id: errorId,
            delta: `Sorry, there was an error processing your request: ${
              error instanceof Error ? error.message : "Unknown error"
            }`,
          });

          writer.write({
            type: "text-end",
            id: errorId,
          });
        },
      }),
    });
  }
}
