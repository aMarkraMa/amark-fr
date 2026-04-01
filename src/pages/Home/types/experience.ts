export type Experience = {
    companyName: string 
    companyLogo: string;
    companyWebsite: string;
    postitions: Position[]    
}
export type Position = {
    positionTitle: string
    contractType?: string;
    start: string
    end?: string
    description?: string;
    skills?: string[]
}


