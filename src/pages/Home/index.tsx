import { ProfileCover } from "./profile-cover"
import { ProfileHeader } from "./profile-header"
import { Separator } from "@/components/layout/Separator"
export const Home = () => {
    return (
    <div className="mx-auto md:max-w-3xl">
        <ProfileCover></ProfileCover>
        <ProfileHeader></ProfileHeader>
        <Separator></Separator>
    </div>
    )

}