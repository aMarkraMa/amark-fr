import { useEffect, useRef } from "react";
import type { ChatMessage } from "../types/message";
import { Markdown } from "@/components/markdown";

type ResponseProps = {
    messages: ChatMessage[];
    isLoading: boolean;
    error: string | null;
};

export function Response({ messages, isLoading, error }: ResponseProps) {
    const endRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, [messages, isLoading]);

    return (
        <div className="h-full overflow-y-auto p-3">
            <div className="flex min-h-full flex-col gap-3">
                {messages.length === 0 ? null : (
                    messages.map((msg, index) => {
                        const isUser = msg.role === "user";
                        return (
                            <div
                                key={`${msg.role}-${index}`}
                                className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-[85%] rounded-2xl px-3 py-2 text-foreground ${
                                        isUser
                                            ? "whitespace-pre-wrap bg-secondary/70 text-sm"
                                            : "bg-muted/70 text-[13px] leading-[1.65]"
                                    }`}
                                >
                                    {isUser ? (
                                        msg.text
                                    ) : (
                                        <Markdown className="size-full [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                                            {msg.text || (isLoading ? "..." : "")}
                                        </Markdown>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}

                {error ? (
                    <p className="text-sm text-destructive">{error}</p>
                ) : null}
                <div ref={endRef} />
            </div>
        </div>
    );
}
