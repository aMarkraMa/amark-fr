import { Panel, PanelContent } from "@/pages/Home/panel/panel";
import {
    IntroItem,
    IntroItemContent,
    IntroItemIcon,
    IntroItemLink,
} from "./intro-item";
import {
    LinkIcon,
    MapPinIcon,
    MarsIcon,
    PhoneIcon,
    MailIcon,
    BriefcaseBusinessIcon,
} from "lucide-react";

import { USER } from "@/pages/Home/data/user";
export const Overview = () => {
    return (
        <Panel className="after:content-none">
            <PanelContent className="space-y-2.5">
               
                <div className="grid gap-x-4 gap-y-2.5 sm:grid-cols-2 ">
                    <IntroItem>
                        <IntroItemIcon>
                            <MapPinIcon />
                        </IntroItemIcon>
                        <IntroItemContent>
                            <IntroItemLink
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(USER.address)}`}
                                aria-label={`Location: ${USER.address}`}
                            >
                                {USER.address}
                            </IntroItemLink>
                        </IntroItemContent>
                    </IntroItem>

                    <IntroItem>
                        <IntroItemIcon>
                            <LinkIcon />
                        </IntroItemIcon>
                        <IntroItemContent>{USER.site}</IntroItemContent>
                    </IntroItem>

                    <IntroItem>
                        <IntroItemIcon>
                            <MarsIcon />
                        </IntroItemIcon>
                        <IntroItemContent>{USER.gender}</IntroItemContent>
                    </IntroItem>
                    <IntroItem>
                        <IntroItemIcon>
                            <MailIcon />
                        </IntroItemIcon>
                        <IntroItemContent>{USER.email}</IntroItemContent>
                    </IntroItem>
                    <IntroItem>
                        <IntroItemIcon>
                            <BriefcaseBusinessIcon/>
                        </IntroItemIcon>
                        <IntroItemContent>{"Freelancer"}</IntroItemContent>
                    </IntroItem>
                    <IntroItem>
                        <IntroItemIcon>
                            <PhoneIcon />
                        </IntroItemIcon>
                        <IntroItemContent>{USER.phone}</IntroItemContent>
                    </IntroItem>
                </div>
            </PanelContent>
        </Panel>
    );
};
