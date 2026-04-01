
import type { Experience } from "../types/experience"
import { ExperiencePositionItem } from "./experience-position-item"
export function ExperienceItem({experience}: {experience: Experience}){
    return (
        <div className="screen-line-bottom space-y-4 pb-4 select-none">
            <div className="flex items-center gap-3">
                <div className="flex size-6 items-center justify-center select-none">
                    <img className="rounded-full" src={experience.companyLogo} alt={experience.companyName} />
                </div>
                <div className="font-semibold leading-snug text-lg">{experience.companyName}</div>
            </div>

            <div className="space-y-4">
                {experience.postitions.map((position)=>{
                    return (
                        <ExperiencePositionItem key={position.positionTitle} position={position}></ExperiencePositionItem>
                    )
                })}
            </div>

        </div>
    )
}