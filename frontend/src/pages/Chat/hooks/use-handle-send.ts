import { useCallback } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { ChatMessage, ChatRequest } from "../types/message";

type UseHandleSendParams = {
  input: string;
  isLoading: boolean;
  messages: ChatMessage[];
  setMessages: Dispatch<SetStateAction<ChatMessage[]>>;
  setInput: Dispatch<SetStateAction<string>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setError: Dispatch<SetStateAction<string | null>>;
};

export function useHandleSend({
  input,
  isLoading,
  messages,
  setMessages,
  setInput,
  setIsLoading,
  setError,
}: UseHandleSendParams) {
  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    setError(null);
    setInput("");
    setIsLoading(true);

    const userMessage: ChatMessage = { role: "user", text };
    const nextMessages: ChatMessage[] = [
      ...messages,
      userMessage,
      { role: "model", text: "" },
    ];
    setMessages(nextMessages);

    try {
      const payload: ChatRequest = {
        messages: nextMessages.slice(0, -1),
      };

      const res = await fetch("/api/chat/response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok || !res.body) {
        throw new Error(`Request failed: ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });

        setMessages((prev) => {
          if (prev.length === 0) return prev;
          const cloned = [...prev];
          const lastIndex = cloned.length - 1;
          const last = cloned[lastIndex];
          if (last.role !== "model") return prev;

          cloned[lastIndex] = {
            ...last,
            text: last.text + chunk,
          };
          return cloned;
        });
      }

      const tail = decoder.decode();
      if (tail) {
        setMessages((prev) => {
          if (prev.length === 0) return prev;
          const cloned = [...prev];
          const lastIndex = cloned.length - 1;
          const last = cloned[lastIndex];
          if (last.role !== "model") return prev;

          cloned[lastIndex] = {
            ...last,
            text: last.text + tail,
          };
          return cloned;
        });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");

      setMessages((prev) => {
        if (prev.length === 0) return prev;
        const cloned = [...prev];
        const lastIndex = cloned.length - 1;
        const last = cloned[lastIndex];
        if (last.role !== "model") return prev;

        if (!last.text.trim()) {
          cloned[lastIndex] = {
            ...last,
            text: "Reqeust False，please try again later。",
          };
        }
        return cloned;
      });
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages, setError, setInput, setIsLoading, setMessages]);

  return { handleSend };
}
