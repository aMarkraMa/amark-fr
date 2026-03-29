import { ProfileCover } from "./profile-cover"
import { ProfileHeader } from "./profile-header"

export const Home = () => {
    return (
    <div className="mx-auto md:max-w-3xl">
        <ProfileCover></ProfileCover>
        <ProfileHeader></ProfileHeader>
    </div>
    )

}