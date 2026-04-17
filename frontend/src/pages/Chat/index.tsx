import { useState } from "react";
import { InputChat } from "./input-chat";
import { Response } from "./response";
import { useHandleSend } from "./hooks/use-handle-send";
import type { ChatMessage } from "./types/message";

export const Chat = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
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
