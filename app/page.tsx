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
import { Tool } from "@/components/ui/tool";
import { CopyButton } from "@/src/components/copy-button";
import { cn } from "@/lib/utils";

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
        body: JSON.stringify({
          message: text,
          session_id: "1234",
          api_key: "dahl_4VmEw6mgJLiWyB9Co6ATkXUUWKgxc51Bx",
          model_provider: "dahl",
          model_name: "moonshotai/Kimi-K2.6",
          model_variant: "low",
          web: true,
        }),
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
              {
                type: "message",
                role: "assistant",
                content: data.text ?? "",
              },
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
            <div className="flex flex-col items-center justify-center flex-1 py-24 text-center gap-8">
              {/* CSS ornament — two hairlines + rotated square */}
              <div className="relative w-12 h-12 flex items-center justify-center mb-2">
                <div className="absolute w-full h-px bg-primary/30" />
                <div className="absolute h-full w-px bg-primary/30" />
                <div className="size-3 rotate-45 bg-primary/20" />
              </div>

              <div className="flex flex-col items-center gap-3">
                <h1 className="font-arabic text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
                  ما الذي تريد أن تتعلمه؟
                </h1>
                <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
                  اسأل عن آية أو حديث أو مسألة، وسأجيبك بمصادر من القرآن والسنة
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-2 w-full max-w-lg">
                {suggestedPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => setInput(prompt)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150 rounded-lg border border-border bg-card px-4 py-2.5 text-start hover:bg-secondary"
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
                  <div className={cn(msg.role === "user" && "flex justify-end")}>
                    <Message
                      from={msg.role}
                      key={i}
                      className={cn(
                        "group/message relative max-w-[70ch]",
                        msg.role === "user" && "bg-muted/60 rounded-xl px-5 py-3"
                      )}
                    >
                      <MessageContent>
                        <MessageResponse className={cn(msg.role === "assistant" && "text-foreground leading-relaxed")}>
                          {msg.content}
                        </MessageResponse>
                      </MessageContent>
                      {msg.role === "assistant" && (
                        <div className="mt-2 opacity-100 md:opacity-0 md:group-hover/message:opacity-100 transition-opacity duration-150">
                          <div className="absolute left-0">
                            <CopyButton
                              text={msg.content.trim()}
                              variant="ghost"
                              size="icon"
                            />
                          </div>
                        </div>
                      )}
                    </Message>
                  </div>
                )}
              </Fragment>
            ))
          )}
          {status === "loading" && (
            <div className="space-y-3 my-4 animate-pulse">
              <div className="h-4 bg-muted rounded-md w-3/4" />
              <div className="h-4 bg-muted rounded-md w-1/2" />
              <div className="h-20 bg-muted rounded-xl w-full border-r-2 border-primary/30" />
            </div>
          )}
        </ConversationContent>
        <ChatContainerScrollAnchor />
        <ConversationScrollButton />
      </Conversation>

      <div className="max-w-3xl mx-auto w-full px-4 pb-4 pt-2">
        <div className="bg-card rounded-2xl border border-input shadow-sm p-2">
          <PromptInput onSubmit={handleSubmit} className="relative w-full">
            <PromptInputTextarea
              value={input}
              placeholder="اكتب سؤالك هنا..."
              onChange={(e) => setInput(e.currentTarget.value)}
              className="pr-14 rounded-xl border-0 bg-transparent shadow-none resize-none min-h-[44px] max-h-[200px] placeholder:text-muted-foreground"
            />
            <PromptInputSubmit
              status={status === "loading" ? "submitted" : "ready"}
              disabled={!input.trim() || status === "loading"}
              className="absolute bottom-2 right-2 size-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:brightness-110 active:scale-[0.98] transition-all duration-150 disabled:opacity-50"
            />
          </PromptInput>
        </div>
        <p className="mt-2 text-center text-xs text-muted-foreground/60">
          قد يخطئ الذكاء الاصطناعي، تحقق من المصادر
        </p>
      </div>
    </main>
  );
}
