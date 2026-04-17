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
                                    className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm text-foreground ${
                                        isUser ? "bg-secondary/70" : "bg-muted/70"
                                    }`}
                                >
                                    {isUser ? (
                                        msg.text
                                    ) : (
                                        <div className="prose prose-sm max-w-none text-foreground dark:prose-invert prose-p:text-foreground prose-headings:text-foreground prose-strong:text-foreground prose-li:text-foreground prose-a:text-foreground prose-code:text-foreground">
                                            <Markdown>
                                                {msg.text || (isLoading ? "..." : "")}
                                            </Markdown>
                                        </div>
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
