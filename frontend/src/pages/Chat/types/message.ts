export type ChatMessage = {
    role: "user" | "model";
    text: string;
}
export type ChatRequest = {
    messages: ChatMessage[];
}