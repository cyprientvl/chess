import { Color } from "../enums/color.enum";
import { PieceType } from "../enums/piece.enum";
import { Case } from "./case";
import { Bishop } from "./Piece/bishop";
import { King } from "./Piece/king";
import { Knight } from "./Piece/knight";
import { Pawn } from "./Piece/pawn";
import { Piece } from "./Piece/piece";
import { Queen } from "./Piece/queen";
import { Rook } from "./Piece/rook";


let listPiece: PieceType[] = [
    PieceType['ROOK'], PieceType['KNIGHT'], PieceType['BISHOP'], PieceType['QUEEN'],PieceType['KING'], PieceType['BISHOP'], PieceType['KNIGHT'], PieceType['ROOK']]

export class Game{

    private listCase: Case[][] = [];
    private pieceKilled: Piece[] = [];
    private userTurn: Color = Color.WHITE;
    
    private ownerColor: Color = Color.WHITE;
    private idInDB: number = 0;

    private pieceToPromote = {i: -1, j: -1, color: Color.WHITE};

    initGame(){
        this.listCase = []
        for(let i = 0; i < 8; i++){
            this.listCase.push([])
            let c = 0;
            if(i%2 == 0){
                c =  1;
            }
            for(let j = 0; j < 8; j++){
                let color = c%2;
                c++;

                let pieceColor = 1;
                if(i == 0 || i == 1){
                    pieceColor = 0
                }

                if(i == 0 || i == 7){
                    this.listCase[i].push(new Case(color, this.generatePiece(listPiece[j], pieceColor, i, j)))
                }else if(i == 1 || i == 6){
                    this.listCase[i].push(new Case(color, this.generatePiece(PieceType['PAWN'], pieceColor, i, j)))
                }else{
                    this.listCase[i].push(new Case(color))
                }
            }
        }
    }

    private generatePiece(type: PieceType, pieceColor: number, i: number, j: number){
        let p: Piece = new Pawn(type, pieceColor, i, j);

        switch (type) {
            case 'KING':
                p = new King(type, pieceColor, i, j)
                break;
            case 'BISHOP':
                p = new Bishop(type, pieceColor, i, j)
                break;
            case 'QUEEN':
                p = new Queen(type, pieceColor, i, j)
                break;
            case 'ROOK':
                p = new Rook(type, pieceColor, i, j)
                break;
            case 'KNIGHT':
                p = new Knight(type, pieceColor, i, j)
                break;
        }

        return p;
    }

    public getFormatedGame(){
        let result: string[] = [];

        this.getListCase().forEach(element=>{
            element.forEach(c =>{
                if(c.piece && c.piece.pieceType == 'KING'){
                    const r = King.checkKingStatus(this.getListCase(), c.piece);
                    result.push(r.status+":"+r.king.color);
                }
            })
        })

        return { listCase: this.listCase, 
            turn: this.userTurn, 
            pieceKilled: this.pieceKilled,
            result: result,
            ownerColor: this.ownerColor
        }
    }

    public isPieceToPromote(){
        return this.pieceToPromote.i != -1 && this.pieceToPromote.j != -1 
    }

    public getPieceToPromote(){
        return this.pieceToPromote
    }

    public setPieceToPromote(i: number, j: number, color: Color){
        this.pieceToPromote.i = i;
        this.pieceToPromote.j = j;
        this.pieceToPromote.color = color; 
    }

    public nextTurn(){
        console.log("fd");
        if(this.getUserTurn() == 'WHITE') return this.setUserTurn(Color['BLACK']);
        if(this.getUserTurn() == 'BLACK') return this.setUserTurn(Color['WHITE']);
    }

    public setOwnerColor(color: Color){
        this.ownerColor = color;
    }

    public setIdInBd(id: number){
        this.idInDB = id;
    }

    public getListCase(){
        return this.listCase;
    }

    public getPieceKilled(){
        return this.pieceKilled;
    }


    public getPieceKilledByColor(color: Color){
        return this.pieceKilled.filter(f => f.color == color);
    }

    public setPieceKilled(pieces: Piece[]){
        this.pieceKilled = pieces;
    }

    public getUserTurn(){
        return this.userTurn;
    }

    public setUserTurn(newUserTurn: Color){
        this.userTurn = newUserTurn;
    }

    public getOwnerColor(){
        return this.ownerColor;
    }

    public getIdInDB(){
        return this.idInDB;
    }
}












