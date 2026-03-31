import { ProseMono } from "@/components/ui/typegraphy"
import { Panel, PanelContent, PanelHeader, PanelTitle } from "../panel/panel"
import { Markdown } from "@/components/markdown"

import {USER} from "@/pages/Home/data/user"
export const About = () => {
    return (
        <Panel>
            <PanelHeader>
                <PanelTitle>
                    {"About"}
                </PanelTitle>
            </PanelHeader>
            <PanelContent>
                <ProseMono>
                    <Markdown>{USER.about}</Markdown>
                </ProseMono>
            </PanelContent>
        </Panel>
    )
}