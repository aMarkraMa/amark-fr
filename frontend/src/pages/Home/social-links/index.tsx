import { Panel } from "../panel/panel";
import { SocialLinkItem } from "./social-links-item";
import { SOCIAL_LINKS } from "@/pages/Home/data/social-links";

export function SocialLinks() {
    return (
        <Panel>
            <div className="relative">
                <div className="absolute inset-0 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 -z-1 gap-2">
                    <div className="border-r border-line"></div>
                    <div className="border-l border-line md:border-x"></div>
                    <div className="border-l border-line max-md:hidden"></div>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 md:grid-cols-3">
                    {SOCIAL_LINKS.map((link, index) => {
                        return <SocialLinkItem key={index} {...link} />;
                    })}
                </div>
            </div>
        </Panel>
    );
}
