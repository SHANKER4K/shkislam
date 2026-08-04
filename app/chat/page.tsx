"use client";

import { Fragment, useState } from "react";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
  ConversationDownload,
} from "@/src/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/src/components/ai-elements/message";
import {
  PromptInput,
  type PromptInputMessage,
  PromptInputTextarea,
  PromptInputSubmit,
} from "@/src/components/ai-elements/prompt-input";
import { MessageSquare } from "lucide-react";
import {
  Task,
  TaskContent,
  TaskItem,
  TaskTrigger,
} from "@/src/components/ai-elements/task";

import { ChatContainerScrollAnchor } from "@/components/ui/chat-container";
import { Shimmer } from "@/src/components/ai-elements/shimmer";
import { Tool } from "@/components/ui/tool";

type ChatMessage =
  | {
      type: "tool";
      role: "assistant";
      name: string;
      callId: string;
      output?: string;
      desc?: string;
    }
  | { type: "message"; role: "user" | "assistant"; content: string };

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"idle" | "loading">("idle");

  const handleSubmit = async (message: PromptInputMessage) => {
    const text = message.text?.trim();
    if (!text) return;

    setMessages((prev) => [
      ...prev,
      { type: "message", role: "user", content: text },
    ]);
    setInput("");
    setStatus("loading");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, session_id: "1234" }),
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();

        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        const events = buffer.split("\n\n");
        buffer = events.pop() ?? "";

        for (const raw of events) {
          const [eventName, data] = parseEvent(raw);

          if (eventName === "tool") {
            const text = data.text.toLowerCase();
            const desc =
              text.includes("quran") || text.includes("aya")
                ? "Getting data from quran database"
                : text.includes("hadith")
                  ? "Getting data from hadith database"
                  : text.includes("aqeedah")
                    ? "Getting data from aqeedah books"
                    : "Getting data from tafsir books";
            setMessages((prev) => [
              ...prev,
              {
                type: "tool",
                role: "assistant",
                name: data.text,
                callId: data.tool_call_id,
                desc,
              },
            ]);
          } else if (eventName === "tool_result") {
            setMessages((prev) =>
              prev.map((m) =>
                m.type === "tool" && m.callId === data.tool_call_id
                  ? { ...m, output: data.text }
                  : m,
              ),
            );
          } else if (eventName === "message_start") {
            setMessages((prev) => [
              ...prev,
              { type: "message", role: "assistant", content: data.text ?? "" },
            ]);
          } else if (eventName === "text_delta") {
            setMessages((prev) => {
              const last = prev[prev.length - 1];
              if (!last || last.type !== "message") return prev;
              return [
                ...prev.slice(0, -1),
                { ...last, content: last.content + data.text },
              ];
            });
          }
          // message_end, done → no-op
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          type: "message",
          role: "assistant",
          content: "حدث خطأ في الاتصال. حاول مرة أخرى.",
        },
      ]);
    } finally {
      setStatus("idle");
    }
  };

  function parseEvent(raw: string): [string, any] {
    let eventName = "";
    let data = "";

    for (const line of raw.split("\n")) {
      if (line.startsWith("event:")) {
        eventName = line.slice(6).trim();
      }

      if (line.startsWith("data:")) {
        data += line.slice(5).trim();
      }
    }

    const json = data ? JSON.parse(data) : {};
    return [eventName, json];
  }

  return (
    <main className="flex flex-col max-w-3xl mx-auto w-full p-4 h-[calc(100dvh-3.5rem)]">
      <h1 className="font-arabic text-2xl font-bold mb-4 text-center">
        المحادثة
      </h1>
      <Conversation className="flex-1">
        <ConversationContent>
          {messages.length === 0 ? (
            <ConversationEmptyState
              icon={<MessageSquare className="size-12" />}
              title="ابدأ محادثة"
              description="اكتب سؤالك في الأسفل لبدء المحادثة"
            />
          ) : (
            messages.map((msg, i) => (
              <Fragment key={i}>
                {msg.type === "tool" ? (
                  <Tool
                    className="w-full max-w-md text-sm m-0"
                    toolPart={{
                      type: msg.name,
                      state: msg.output
                        ? "output-available"
                        : "input-streaming",
                      input: {
                        description: msg.desc,
                      },
                      output: msg.output ?? "",
                    }}
                  />
                ) : (
                  <Message from={msg.role} key={i}>
                    <MessageContent>
                      <MessageResponse>{msg.content}</MessageResponse>
                    </MessageContent>
                  </Message>
                )}
                <button
                  type="button"
                  onClick={async () => {
                    await navigator.clipboard.writeText(msg.content);
                  }}
                >
                  copy
                </button>
              </Fragment>
            ))
          )}
          {status == "loading" && (
            <Shimmer duration={3} spread={3}>
              سوف ادهشك!
            </Shimmer>
          )}
        </ConversationContent>
        <ChatContainerScrollAnchor />
        <ConversationScrollButton />
      </Conversation>

      <PromptInput onSubmit={handleSubmit} className="mt-4 w-full relative">
        <PromptInputTextarea
          value={input}
          placeholder="اكتب سؤالك هنا..."
          onChange={(e) => setInput(e.currentTarget.value)}
          className="pr-12"
        />
        <PromptInputSubmit
          status={status === "loading" ? "submitted" : "ready"}
          disabled={!input.trim() || status === "loading"}
          className="absolute bottom-1 right-1"
        />
      </PromptInput>
    </main>
  );
}
