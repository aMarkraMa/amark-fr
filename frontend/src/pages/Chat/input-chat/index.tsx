import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { Dispatch, SetStateAction } from "react";

type InputChatProps = {
  input: string;
  setInput: Dispatch<SetStateAction<string>>;
  onSend: () => void | Promise<void>;
  isLoading: boolean;
  className?: string;
};

export function InputChat({
  input,
  setInput,
  onSend,
  isLoading,
  className = "",
}: InputChatProps) {
  return (
    <Field className={`shrink-0 ${className}`}>
      <ButtonGroup className="w-full">
        <Input
          id="input-button-group"
          placeholder="Type your message..."
          className="h-11 px-4"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              void onSend();
            }
          }}
          disabled={isLoading}
        />
        <Button variant="outline" className="h-11 px-4" onClick={() => void onSend()} disabled={isLoading}>
          {isLoading ? "Sending..." : "Send"}
        </Button>
      </ButtonGroup>
    </Field>
  );
}
