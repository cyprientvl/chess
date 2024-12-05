import config from '@/config.json';
export const ApiUrl = config.VUE_APP_API_BASE_URL;

export const ApiUrlConnection = `/auth/login`;
export const ApiUrlRegister = `/auth/register`;

// game
export const ApiUrlGame = '/game';
export const ApiUrlPieceMove = `/piece/move`;
export const ApiUrlPossibleMove = `/piece/possible-move`;
export const ApiUrlGameIDUser = '/current-game';
export const ApiUrlCreateGame = '/create';
