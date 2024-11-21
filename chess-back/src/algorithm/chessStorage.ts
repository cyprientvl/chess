import { Game } from "./game";

let games = new Map<Number, Game>();

export function createGameStorage(id: number){

    if(games.has(id)){
        return undefined;
    }

    let game: Game = new Game();
    game.initGame();
    games.set(id, game);

    return game

}

export function getGameStorage(id: number): Game | undefined{
    return games.get(id);
}

export function deleteGameStorage(id: number){
    if(games.has(id)){
        games.delete(id);
    }
}