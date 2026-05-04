import { useEffect, useState } from "react";
import { InputChat } from "./input-chat";
import { Response } from "./response";
import { useHandleSend } from "./hooks/use-handle-send";
import type { ChatMessage } from "./types/message";

const CHAT_MESSAGES_KEY = "amark-fr.chat.messages.v1";

function readStoredMessages(): ChatMessage[] {
    try {
        const raw = localStorage.getItem(CHAT_MESSAGES_KEY);
        if (!raw) return [];
        const data = JSON.parse(raw) as unknown;
        if (!Array.isArray(data)) return [];
        return data.filter(
            (m): m is ChatMessage =>
                m != null &&
                typeof m === "object" &&
                (m.role === "user" || m.role === "model") &&
                typeof m.text === "string",
        );
    } catch {
        return [];
    }
}

export const Chat = () => {
    const [messages, setMessages] = useState<ChatMessage[]>(readStoredMessages);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { handleSend } = useHandleSend({
        input,
        isLoading,
        messages,
        setMessages,
        setInput,
        setIsLoading,
        setError,
    });

    useEffect(() => {
        const t = window.setTimeout(() => {
            try {
                localStorage.setItem(CHAT_MESSAGES_KEY, JSON.stringify(messages));
            } catch {
                /* quota / private mode */
            }
        }, 200);
        return () => window.clearTimeout(t);
    }, [messages]);

    return (
        <div className="mx-auto flex h-[calc(100dvh-3.5rem)] w-full flex-col overflow-hidden border-x md:max-w-3xl">
            <div className="flex-1 min-h-0">
                <Response
                    messages={messages}
                    isLoading={isLoading}
                    error={error}
                />
            </div>

            <div className="screen-line-top screen-line-bottom p-2">
                <InputChat
                    input={input}
                    setInput={setInput}
                    onSend={handleSend}
                    isLoading={isLoading}
                />
            </div>
        </div>
    );
};
