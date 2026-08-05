"use client";

import { Fragment, useState } from "react";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
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
import { ChatContainerScrollAnchor } from "@/components/ui/chat-container";
import { Shimmer } from "@/src/components/ai-elements/shimmer";
import { Tool } from "@/components/ui/tool";
import { CopyButton } from "@/src/components/copy-button";
import Logo from "@/assets/logo.png";
import Image from "next/image";

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

const suggestedPrompts = [
  "ما حكم صيام الست من شوال؟",
  "آيات عن الصبر",
  "أحاديث عن بر الوالدين",
  "ما هي ليلة القدر؟",
];

export default function HomePage() {
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
    <main className="flex h-svh flex-col">
      <Conversation className="flex-1">
        <ConversationContent className="max-w-3xl mx-auto w-full px-4 py-8">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 py-24 text-center gap-10">
              <div className="flex flex-col items-center gap-4">
                <Image
                  src={Logo}
                  alt="SHK Islam"
                  width={56}
                  height={56}
                  className="rounded-md opacity-90"
                />
                <h1 className="font-arabic text-3xl font-bold tracking-tight">
                  كيف يمكنني مساعدتك؟
                </h1>
                <p className="text-muted-foreground text-sm max-w-md">
                  اسأل عن أي آية أو حديث أو مسألة، وسأجيبك مع ذكر المصادر من
                  القرآن والسنة
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
                {suggestedPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => {
                      setInput(prompt);
                    }}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors rounded-xl border border-border bg-card/50 px-4 py-3 text-start hover:bg-card"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
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
                      output: msg.output ? { text: msg.output } : undefined,
                    }}
                  />
                ) : (
                  <Message
                    from={msg.role}
                    key={i}
                    className="group/message relative"
                  >
                    <MessageContent>
                      <MessageResponse>{msg.content}</MessageResponse>
                    </MessageContent>
                    {msg.role === "assistant" && (
                      <div className="mt-2 opacity-0 group-hover/message:opacity-100 transition-opacity">
                        <CopyButton text={msg.content} variant="ghost" size="icon" />
                      </div>
                    )}
                  </Message>
                )}
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

      <div className="max-w-3xl mx-auto w-full px-4 pb-4 pt-2">
        <PromptInput onSubmit={handleSubmit} className="relative w-full">
          <PromptInputTextarea
            value={input}
            placeholder="اكتب سؤالك هنا..."
            onChange={(e) => setInput(e.currentTarget.value)}
            className="pr-12 rounded-2xl border bg-card shadow-none"
          />
          <PromptInputSubmit
            status={status === "loading" ? "submitted" : "ready"}
            disabled={!input.trim() || status === "loading"}
            className="absolute bottom-1 right-1"
          />
        </PromptInput>
        <p className="mt-2 text-center text-xs text-muted-foreground/70">
          قد يخطئ الذكاء الاصطناعي، تحقق من المصادر
        </p>
      </div>
    </main>
  );
}
