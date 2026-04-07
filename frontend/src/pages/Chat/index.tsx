import { Separator } from "@/components/layout/Separator"
import { Overview } from "../Home/overview"
import { Response } from "./response"

export const Chat = () => {
    return (
        <div className="mx-auto md:max-w-3xl">
            <Separator></Separator>
            <Overview></Overview>
            <Response></Response>

        </div>
    )
}