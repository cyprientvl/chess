import config from '@/config.json';
export const ApiUrl = config.VUE_APP_API_BASE_URL;

export const API_URL_CONNECTION = `/auth/login`;
export const API_URL_REGISTER = `/users`;

// game
export const API_URL_GAME = '/games';
export const API_URL_PIECE_MOVE = `/piece/move`;
export const API_URL_POSSIBLE_MOVE = `/piece/possible-move`;
export const API_URL_GAME_ID_USER = '/current-game';
export const API_URL_CREATE_GAME = '/create';
export const API_URL_PROMOTE = '/piece/upgrade';
export const API_URL_REPLAY = '/replay';

// leaderboard
export const API_URL_LEADERBOARD = '/leaderboards';
export const API_URL_LEADERBOARD_HISTORY = '/history';
