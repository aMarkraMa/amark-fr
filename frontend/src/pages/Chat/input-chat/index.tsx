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
};

export function InputChat({ input, setInput, onSend, isLoading }: InputChatProps) {
  return (
    <Field className="shrink-0">
      <ButtonGroup>
        <Input
          id="input-button-group"
          placeholder="Type your message..."
          className="h-10"
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
        <Button variant="outline" className="h-10" onClick={() => void onSend()} disabled={isLoading}>
          {isLoading ? "Sending..." : "Send"}
        </Button>
      </ButtonGroup>
    </Field>
  );
}
