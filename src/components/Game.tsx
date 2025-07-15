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
        // --- ルールチェック ---
        // 1.すでに石があるときはなにもしない
        if (board[row][col] !== 0) {
            return;
        }
        // 2.石をひっくり返すロジック
        // ８方向のチェック（上下左右 + 斜め*4）
        const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1],           [0, 1],
            [1, -1], [1, 0], [1, 1],
        ];

        const tilesToFlip: [number, number][] = [];
        const opponent = currentPlayer === 1 ? 2 : 1;

        // 8方向をループでチェック
        for (const [dr, dc] of directions) {
            let r = row + dr;
            let c = col + dc;
            const potentialFlips: [number, number][] = [];

            // 盤面の内側、かつ隣が相手の石であるときその方向に進む
            while (r >= 0 && r < 8 && c >= 0 && c < 8 && board[r][c] === opponent) {
                potentialFlips.push([r, c]);
                r += dr;
                c += dc;
            }

            // 進んだ先に自分の石がある=>挟んだ石はひっくり返る
            if (r >= 0 && r < 8 && c >= 0 && c < 8 && board[r][c] === currentPlayer) {
                tilesToFlip.push(...potentialFlips);
            }
        }

        // 3.ひっくり返せる石がないときはその手は無効
        if (tilesToFlip.length === 0) {
            return;
        }

        // --- 盤面の更新 ---
        const newBoard = board.map(r => [...r]);
        // クリックした場所に新たな石を配置
        newBoard[row][col] = currentPlayer;
        // ひっくり返すリストにある石をすべて自分の色に変換
        tilesToFlip.forEach(([r, c]) => {
            newBoard[r][c] = currentPlayer;
        });

        setBoard(newBoard);

        // プレイヤーの交代
        setCurrentPlayer(opponent);
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
