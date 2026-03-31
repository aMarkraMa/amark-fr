import { ProfileCover } from "@/pages/Home/profile-cover/profile-cover"
import { ProfileHeader } from "@/pages/Home/profile-header/profile-header"
import { Separator } from "@/components/layout/Separator"
import { Overview } from "./overview"
import { About } from "./about"
import { SocialLinks } from "./social-links"
export const Home = () => {
    return (
    <div className="mx-auto md:max-w-3xl">
        <ProfileCover></ProfileCover>
        <ProfileHeader></ProfileHeader>
        <Separator></Separator>
        <Overview></Overview>
        
        <SocialLinks></SocialLinks>

        <Separator></Separator>
        
        <About></About>
    </div>
    )

}