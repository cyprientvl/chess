import { Game } from "./game";

let games = new Map<Number, Game>();

export function createGame(id: number): string{

    if(games.has(id)){
        return "ALREADEXIST";
    }

    let game: Game = new Game();
    game.initGame();
    games.set(id, game);

    return "CREATED"

}

export function getGame(id: number): Game | undefined{
    return games.get(id);
}

export function deleteGame(id: number){
    if(games.has(id)){
        games.delete(id);
    }
}