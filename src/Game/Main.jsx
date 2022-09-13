import React, { useEffect, useState } from "react";
import {Howl} from "howler";
import "./Style.css";


const DEFAULT_BOARD = [[0,0,0,0],
                       [0,0,0,0], 
                       [0,0,0,0], 
                       [0,0,0,0]];
                     
const DIRECTION = {
    LEFT : "Left",
    RIGHT : "Right",
    UP : "Up",
    DOWN : "Down"
}
export default function Main(){
    const [gameOver, setGameOver] = useState(false);
    let [board, setBoard] = useState(DEFAULT_BOARD);
    const [msg, setMsg] = useState(true);
    let [score, setScore] = useState(0);

    const moveSound = new Howl({
        src : ["http://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/alien_shoot.wav"],
        html5 : true
    })
    const newGameSound = new Howl({
        src : ["http://commondatastorage.googleapis.com/codeskulptor-demos/riceracer_assets/music/start.ogg"],
        html5 : true
    })
    const gameOverSound = new Howl({
        src : ["https://www.soundjay.com/buttons/beep-05.mp3"],
        html5 : true
    })

    function randomNumber(board){
        const choice = [2,4];
        let random = Math.floor(Math.random()*choice.length);

        // check blank spaces in board
        const blankCoordinates = [];
        for(let i = 0; i < board.length; i++){
            for(let j = 0; j < board.length; j++){
                if(board[i][j] === 0)
                blankCoordinates.push([i, j]);
            }
        }
        // put a random coordinates..
        if(blankCoordinates.length > 0){
            let randomCoordinate = Math.floor(Math.random()*blankCoordinates.length);
            board[blankCoordinates[randomCoordinate][0]][blankCoordinates[randomCoordinate][1]] = choice[random]
            return board;
        }else{
            setGameOver(true);
            setMsg(true);
            gameOverSound.play();
            return board;
        }
    }

    function gameInit(){
        board = JSON.parse(JSON.stringify(DEFAULT_BOARD));
        // let board1 = randomNumber(board);   
        // let board2 = randomNumber(board1);
        // setBoard(board2);

        setBoard(randomNumber(randomNumber(board)));
        setGameOver(false);
        setScore(0);
        setMsg(false);
        newGameSound.play();
    }

    function move(direction){
        if(direction === DIRECTION.RIGHT){
            if(!gameOver){
                setBoard(randomNumber(rightPressed(board)));
                moveSound.play();
            }
            else{
                gameOverSound.play();
            }
        }
        else if(direction === DIRECTION.LEFT){
            if(!gameOver){
                setBoard(randomNumber(leftPressed(board)));
                (!gameOver && moveSound.play());
            }
            else{
                gameOverSound.play();
            }
        }
        else if(direction === DIRECTION.UP){
            if(!gameOver){
                setBoard(randomNumber(upPressed(board)));
                moveSound.play();  
            }
            else{
                gameOverSound.play();
            }            
        }
        else if(direction === DIRECTION.DOWN){
            if(!gameOver){
                setBoard(randomNumber(downPressed(board)));
                (moveSound.play());
            }
            else{
                gameOverSound.play();
            }            
        }

    }

    function rightPressed(board){
        const n = board.length;
        let newBoard = [];

        for(let row = 0; row < n; row++){
            
            // moving to right side
            let newRow = [];
            for(let col = 0; col < n; col++){
                if(board[row][col] === 0){
                    newRow.unshift(0);
                }else{
                    newRow.push(board[row][col]);
                }
            }

            // adding numbers
            for(let col = n-1; col > 0; col--){
                if(newRow[col] === newRow[col-1]){
                    score = score + newRow[col] + newRow[col-1];
                    setScore(score);
                    newRow[col] += newRow[col-1];
                    newRow[col-1] = 0;
                }
            }

            // moving to right side
            let newRow1 = [];
            for(let col = 0; col < n; col++){
                if(newRow[col] === 0){
                    newRow1.unshift(0);
                }else{
                    newRow1.push(newRow[col]);
                }
            }
            newBoard[row] = newRow1;
        }
        return newBoard;
    }

    function leftPressed(board){
        const n = board.length;
        let newBoard = [];

        for(let row = 0; row < n; row++){
            
            // moving to right side
            let newRow = [];
            for(let col = n-1; col >= 0; col--){
                if(board[row][col] === 0){
                    newRow.push(0);
                }else{
                    newRow.unshift(board[row][col]);
                }
            }

            // adding numbers
            for(let col = 0; col < n-1; col++){
                if(newRow[col] === newRow[col+1]){
                    score = score + newRow[col] + newRow[col+1];
                    setScore(score);
                    newRow[col] += newRow[col+1];
                    newRow[col+1] = 0;
                }
            }

            // moving to right side
            let newRow1 = [];
            for(let col = n-1; col >= 0; col--){
                if(newRow[col] === 0){
                    newRow1.push(0);
                }else{
                    newRow1.unshift(newRow[col]);
                }
            }
            newBoard[row] = newRow1;
        }
        return newBoard;
    }

    function upPressed(board){
        return rotateBoardInAntiClock(rightPressed(rotateBoardInClock(board)));
    }

    function downPressed(board){
        return rotateBoardInAntiClock(leftPressed(rotateBoardInClock(board)));
    }

    function rotateBoardInClock(board){
        const n = board.length;
        for(let i = 0; i < n; i++){
            for(let j = i; j < n; j++){
                if(j !== i){
                    let temp = board[i][j];
                    board[i][j] = board[j][i];
                    board[j][i] = temp;
                }
            }
        }

        for(let i = 0; i < n; i++){
            for(let j = 0; j < n/2; j++){
                let temp = board[i][j];
                board[i][j] = board[i][n-j-1];
                board[i][n-j-1] = temp;
            }
        }
        return board;
    }

    function rotateBoardInAntiClock(board){
        const n = board.length;
        for(let i = 0; i < n; i++){
            for(let j = 0; j < n/2; j++){
                let temp = board[i][j];
                board[i][j] = board[i][n-j-1];
                board[i][n-j-1] = temp;
            }
        }

        for(let i = n-1; i >= 0; i--){
            for(let j = i; j >= 0; j--){
                if(i !== j){
                    let temp = board[i][j];
                    board[i][j] = board[j][i];
                    board[j][i] = temp;
                }
            }
        }

        return board;
    }

    return(
        <>
            <h2>Game 2048</h2>
            {msg && <p>Press New Game for continue...</p>}
            <div className="main-container">
                <div className="sub-container1">
                    <div className="container text-center">   
                    <div className="mb-3 newgame-score">
                        <button className="btn btn-outline-light" onClick={gameInit}>New Game</button>
                        <h4>score : {score}</h4>
                    </div>
                    <div className=" game-over">
                        {gameOver && <img className="image" src={require("./gameOver.png")} />}
                    </div> 
                        {board.map((elem, index)=>{
                            return(
                                <div className="row row-cols-4" key={index}>
                                    {elem.map((subElem, index)=>{
                                        return(
                                            <div className="col" key={index}>
                                                {subElem === 0 ? "" : subElem}
                                            </div>
                                        )
                                    })}
                                </div>
                            )
                        })}
                    </div>
                    <div className="mb-3">
                        <button className="btn btn-outline-light mx-2" onClick={(e)=>{move(DIRECTION.LEFT)}}>{DIRECTION.LEFT}</button>
                        <button className="btn btn-outline-light mx-2" onClick={(e)=>{move(DIRECTION.RIGHT)}}>{DIRECTION.RIGHT}</button>
                        <button className="btn btn-outline-light mx-2" onClick={(e)=>{move(DIRECTION.UP)}}>{DIRECTION.UP}</button>
                        <button className="btn btn-outline-light mx-2" onClick={(e)=>{move(DIRECTION.DOWN)}}>{DIRECTION.DOWN}</button>
                    </div>
                </div>
            </div>
        </>
    )
}

