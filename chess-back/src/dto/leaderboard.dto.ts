
export interface LeaderboardDTO {
    list: LeaderboardEntryDTO[];
}

export interface LeaderboardEntryDTO {
    username: string;
    score: number;
    rank: number;
}
