"use client";

import { useState } from "react";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
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
import { MessageSquare } from "lucide-react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"idle" | "loading">("idle");

  const handleSubmit = async (message: PromptInputMessage) => {
    const text = message.text?.trim();
    if (!text) return;

    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setStatus("loading");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.response },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "حدث خطأ في الاتصال. حاول مرة أخرى." },
      ]);
    } finally {
      setStatus("idle");
    }
  };

  return (
    <main className="flex-1 flex flex-col max-w-3xl mx-auto w-full p-4 h-[calc(100vh-3.5rem)]">
      <h1 className="font-arabic text-2xl font-bold mb-4 text-center">المحادثة</h1>
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
              <Message from={msg.role} key={i}>
                <MessageContent>
                  <MessageResponse>{msg.content}</MessageResponse>
                </MessageContent>
              </Message>
            ))
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <PromptInput
        onSubmit={handleSubmit}
        className="mt-4 w-full relative"
      >
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
