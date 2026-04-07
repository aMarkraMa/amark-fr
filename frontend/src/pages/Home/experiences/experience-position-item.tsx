import {
    CodeXmlIcon,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { IntroItemIcon } from "../overview/intro-item";
import type { Position } from "../types/experience";
import { ProseMono } from "@/components/ui/typegraphy";
import { Markdown } from "@/components/markdown";
import {Tag} from "@/components/ui/tag"

export function ExperiencePositionItem({position}: {position: Position}) {
    return (
        <div className="flex flex-col">
            <div className="flex gap-3 items-center">
                <IntroItemIcon>
                    <CodeXmlIcon></CodeXmlIcon>
                </IntroItemIcon>
                <div className="font-medium">{position.positionTitle}</div>
                
            </div>

            <div className="felx flex-col gap-2 items-center pl-9">
                <div className="flex gap-0.5 text-sm items-center text-muted-foreground">
                    <span>{position.contractType}</span>
                    <span></span>
                    <Separator className="data-vertical:h-4 data-vertical:self-center" orientation="vertical"></Separator>
                    <span>{position.start}</span>
                    <span>-</span>
                    <span>{position.end}</span>
                </div>

                <div className="flex">
                    <ProseMono>
                        <Markdown>{position.description}</Markdown>
                    </ProseMono>
                </div>

                <ul className="flex flex-wrap gap-2">
                    {position.skills?.map((skill) => (
                        <li>
                            <Tag>{skill}</Tag>
                        </li>
                    ))}
                </ul>
                
            </div>
        </div>
    );
}
