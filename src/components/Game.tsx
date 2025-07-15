// ゲーム全体の管理

import { useState } from "react";
import Board from './Board';

// マスの状態を定義（0: 空, 1: 黒, 2: 白）
export type CellState = 0 | 1 | 2;
export type BoardState = CellState[][];

const Game = () => {
    // useStateで盤面の状態を記憶させる
    const [board, setBoard] = useState<BoardState>([
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 2, 1, 0, 0, 0], // 2:白, 1:黒
        [0, 0, 0, 1, 2, 0, 0, 0], // 1:黒, 2:白
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
    ]);

    // 現在のプレイヤーを管理（1:黒, 2:白）
    const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);

    // マスがクリックされたとき
    const handleClick = (row: number, col:number) => {
        // すでに石があるときはなにもしない
        if (board[row][col] !== 0) {
            return;
        }
        // 新しい盤面データの作成
        const newBoard = board.map(r => [...r]);
        newBoard[row][col] = currentPlayer;
        setBoard(newBoard);

        // プレイヤーの交代
        setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
    };

    return (
        <div className="game">
            {/* Boardコンポーネントに盤面データ(board),handleClickを渡す */}
            <Board board={board} handleClick={handleClick} />

            {/* 現在のプレイヤーを表示する部分 */}
            <h2>Current Player: {currentPlayer === 1 ? '⚫️ Black' : '⚪️ White'}</h2>
        </div>
    );
}

export default Game;
