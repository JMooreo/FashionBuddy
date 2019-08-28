export interface Contest {
    id: string;
    createDateTimeUTC: string;
    closeDateTimeUTC: string;
    description: string;
    reportCount: number;
    options: Array<ContestOption>;
    style: string;
}

export interface ContestOption {
    id: string;
    imageUrl: string;
}
