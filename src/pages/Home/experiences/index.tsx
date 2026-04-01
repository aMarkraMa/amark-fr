import { ExperienceItem } from "@/pages/Home/experiences/experience-item";
import { Panel, PanelContent, PanelHeader, PanelTitle } from "../panel/panel";
import {EXPERIENCE} from "@/pages/Home/data/experience"
export function Experience() {
    return (
        <Panel className="border-x">
            <PanelHeader>
                <PanelTitle>{"Experience"}</PanelTitle>
            </PanelHeader>
            <PanelContent>
                <div className="flex flex-col space-y-4">
                    {EXPERIENCE.map((item)=>(
                        <ExperienceItem key={item.companyName} experience={item}/>
                    ))}
                </div>
            </PanelContent>
        </Panel>
    );
}
