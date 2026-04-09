import { Button } from "@/components/ui/button";
import { useState } from "react";

export function Response() {
    const [message, setMessage] = useState("");
    const [hello, setHello] = useState("");

    async function loadMessage() {
        loadHello();
        setMessage("");
        const res = await fetch("/api/chat/response");
        if (!res.ok || !res.body) {
            setMessage("request false");
            return;
        }
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const piece = decoder.decode(value, { stream: true });
            setMessage((prev) => prev + piece);
        }
        setMessage((prev) => prev + decoder.decode())        
    }
    async function loadHello() {
        const data = await fetch("/api/chat/hello").then((r) => r.json());
        setHello(data.message ?? "");
    }
    return (
        <div>
            <Button className="w-10 h-9" onClick={loadMessage}>
                Button
            </Button>

            <p>{message}</p>
            <p>{hello}</p>
        </div>
    );
}
