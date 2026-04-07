import { Button } from "@/components/ui/button";
import { useState } from "react";

export function Response() {
    const [message, setMessage] = useState("");
    const [hello, setHello] = useState("");

    async function loadMessage() {
        loadHello();
        const data = await fetch("/api/chat/response").then((r) => r.json());
        setMessage(data.message ?? "");
        
    }
    async function loadHello(){
        const data = await fetch("/api/chat/hello").then((r) => r.json());
        setHello(data.message ?? "")
    }
    return (
        <div>
            <Button className="w-10 h-9" onClick={loadMessage}>Button</Button>
            
            <p>"this is a test"{message}</p>
            <p>{hello}</p>

        </div>
    );
}
