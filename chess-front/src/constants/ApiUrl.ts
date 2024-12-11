import config from '@/config.json';
export const ApiUrl = config.VUE_APP_API_BASE_URL;

export const ApiUrlConnection = `/auth/login`;
export const ApiUrlRegister = `/users`;

// game
export const ApiUrlGame = '/games';
export const ApiUrlPieceMove = `/piece/move`;
export const ApiUrlPossibleMove = `/piece/possible-move`;
export const ApiUrlGameIDUser = '/current-game';
export const ApiUrlCreateGame = '/create';
export const ApiUrlPromote = '/piece/upgrade';

// leaderboard
export const ApiUrlLeaderboard = '/leaderboards';
export const ApiUrlLeaderboardHistory = '/history';
