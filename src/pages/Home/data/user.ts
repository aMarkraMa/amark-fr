import type { User } from "@/pages/Home/types/user";
import photo from "/assets/profile/avatar.webp";

export const USER: User = {
    avatarUrl: photo,
    firstName: "Shengqi",
    lastName: "MA",
    flipSentences: [
        "Creating with code. Small details matter.",
        "Full Stack Engineer",
        "AI Engineer",
        "Born to be alive"
    ],
    address: "Paris, France",
    phone: "+33 06 03 65 47 71",
    site: "amark.fr",
    email: "kramashengqi@gmail.com",
    gender: "he/him",
    nationality: "Chinese",
    about: `
- **Full Stack Engineer** with 1.5 years of experience.
  - Skilled in **Python**, **React**, **TypeScript**, and **Data Engineering** technologies; building high-quality, user-centric web applications.
  - Passionate about building things from the ground up and understanding how systems work at a fundamental level
  - Enjoy breaking down complex problems, exploring underlying mechanisms, and turning ideas into functional, end-to-end solutions.
- Recent graduate from Université Paris Dauphine-PSL with a Master's degree in Decision Informatics.
- Provide one-on-one tutoring in computer science and mathematics.
  - Having supported 20+ students in mastering coursework and improving problem-solving abilities.

    
    <p class="text-muted-foreground">* Last update 2026/04.</p>
    `,
};
