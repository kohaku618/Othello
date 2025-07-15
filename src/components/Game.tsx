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
    ])
    return (
        <div className="game">
            {/* Boardコンポーネントに盤面データ(board)を渡す */}
            <Board board={board} />
        </div>
    );
}

export default Game;
