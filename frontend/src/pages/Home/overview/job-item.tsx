import { BriefcaseBusinessIcon } from "lucide-react";
import { IntroItem, IntroItemContent, IntroItemIcon, IntroItemLink } from "./intro-item";

export function JobItem() {
    return (
        <div className="grid gap-x-4 gap-y-2.5 sm:grid-cols-1">
            <IntroItem>
                <IntroItemIcon>
                    <BriefcaseBusinessIcon />
                </IntroItemIcon>
                <IntroItemContent>
                    {"Full Stack Engineer "}
                    <IntroItemLink href="https://www.bpifrance.fr">
                        {"@Bpifrance"}
                    </IntroItemLink>
                </IntroItemContent>
            </IntroItem>
            <IntroItem>
                <IntroItemIcon>
                    <BriefcaseBusinessIcon />
                </IntroItemIcon>
                <IntroItemContent>
                    {"Data Engineer "}
                    <IntroItemLink href="https://fr.wikipedia.org/wiki/China_Unicom">
                        {"@ChinaUnicom"}
                    </IntroItemLink>
                </IntroItemContent>
            </IntroItem>
            <IntroItem>
                <IntroItemIcon>
                    <BriefcaseBusinessIcon />
                </IntroItemIcon>
                <IntroItemContent>
                    {"Software Engineer"}
                    <IntroItemLink href="https://fr.wikipedia.org/wiki/FAW_Group">
                        {" @First Auto Mobile"}
                    </IntroItemLink>
                </IntroItemContent>
            </IntroItem>
        </div>
    );
}
