import { useEffect, useRef, useState } from "react";
import type { ChatMessage } from "../types/message";
import { Markdown } from "@/components/markdown";
import { Button } from "@/components/ui/button";
import { CheckIcon, CopyIcon } from "lucide-react";

type ResponseProps = {
    messages: ChatMessage[];
    isLoading: boolean;
    error: string | null;
};

export function Response({ messages, isLoading, error }: ResponseProps) {
    const endRef = useRef<HTMLDivElement | null>(null);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, [messages, isLoading]);

    const copyMessage = async (text: string, index: number) => {
        if (!text.trim()) return;
        await navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        window.setTimeout(() => setCopiedIndex(null), 1200);
    };

    return (
        <div className="h-full overflow-y-auto p-3">
            <div className="flex min-h-full flex-col gap-3">
                {messages.length === 0 ? null : (
                    messages.map((msg, index) => {
                        const isUser = msg.role === "user";
                        const isThinking =
                            !isUser && !msg.text && isLoading && index === messages.length - 1;
                        return (
                            <div
                                key={`${msg.role}-${index}`}
                                className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                            >
                                <div className={`group/message flex max-w-[85%] flex-col ${isUser ? "items-end" : "items-start"}`}>
                                    <div
                                        className={`rounded-2xl px-3 py-2 text-foreground ${
                                            isUser
                                                ? "whitespace-pre-wrap bg-secondary/70 text-sm"
                                                : "bg-muted/70 text-[13px] leading-[1.65]"
                                        }`}
                                    >
                                        {isUser ? (
                                            msg.text
                                        ) : isThinking ? (
                                            <div
                                                className="flex items-center gap-1 py-1.5"
                                                aria-label="Thinking"
                                                role="status"
                                            >
                                                <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
                                                <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
                                                <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground" />
                                            </div>
                                        ) : (
                                            <Markdown className="size-full [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                                                {msg.text}
                                            </Markdown>
                                        )}
                                    </div>
                                    {!isUser && msg.text.trim() ? (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="mt-1 h-7 gap-1 px-2 text-xs text-muted-foreground opacity-0 transition-opacity group-hover/message:opacity-100 focus-visible:opacity-100 hover:text-foreground"
                                            onClick={() => void copyMessage(msg.text, index)}
                                            aria-label="Copy response"
                                        >
                                            {copiedIndex === index ? (
                                                <>
                                                    <CheckIcon className="size-3.5" />
                                                    Copied
                                                </>
                                            ) : (
                                                <>
                                                    <CopyIcon className="size-3.5" />
                                                    Copy
                                                </>
                                            )}
                                        </Button>
                                    ) : null}
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
