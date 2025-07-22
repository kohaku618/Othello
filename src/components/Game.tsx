// ゲーム全体の管理

import { useState, useMemo, useEffect } from "react";
import Board from './Board';

// マスの状態を定義（0: 空, 1: 黒, 2: 白）
export type CellState = 0 | 1 | 2;
export type BoardState = CellState[][];

// 初期盤面を定数化
const initialBoard: BoardState = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 2, 1, 0, 0, 0],
    [0, 0, 0, 1, 2, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
];

// 石をひっくり返すロジックを独立化
const getFlippableTiles = (board: BoardState, row: number, col: number, player: 1 | 2) => {
    // すでに石がある or 盤面外なら空のリストを返す
    if (board[row]?.[col] !== 0) {
        return [];
    }

    // 8方向のチェック（上下右左 + 斜め*4）
    const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1],           [0, 1],
            [1, -1], [1, 0], [1, 1],
    ];
    const opponent = player === 1 ? 2 :1;
    const tilesToFlip: [number, number][] = [];

    // 8方向をループチェック
    for (const [dr, dc] of directions) {
        let r = row + dr;
        let c = col + dc;
        const potentialFlips: [number, number][] = [];

        // 盤面の内側かつ隣が相手の石であるとき進む
        while (r >= 0 && r < 8 && c >= 0 && c < 8 && board[r][c] === opponent) {
                potentialFlips.push([r, c]);
                r += dr;
                c += dc;
            }
            
        // 進んだ先に自分の石がある＝＞挟んだ石はひっくり返る
        if (r >= 0 && r < 8 && c >= 0 && c < 8 && board[r][c] === player) {
                tilesToFlip.push(...potentialFlips);
            }
    }
    return tilesToFlip;
}

const Game = () => {
    // useStateの初期値を持ってくる
    const [board, setBoard] = useState<BoardState>(initialBoard);    
    
    // 現在のプレイヤーを管理（1:黒, 2:白）
    const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);

    // ゲームが終了したか管理する状態
    const [isGameOver, setIsGameOver] = useState(false);

    // useMemoを使いboardが変更されたときにスコアを再計算する
    const score = useMemo(() => {
        return board.flat().reduce(
            (acc, cell) => {
                if (cell === 1) acc.black++;
                else if (cell === 2) acc.white++;
                return acc;
            },
            { black: 0, white: 0}
        );
    }, [board]);

    // 現プレイヤーが置ける場所のリストを計算
    const validMoves = useMemo(() => {
        const moves: [number, number][] = [];
        // 盤面のマスを全部チェック
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                // そのマスに置くとひっくり返せるか
                if (getFlippableTiles(board, r, c, currentPlayer).length > 0) {
                    moves.push([r, c]);
                }
            }
        }
        return moves;
    }, [board, currentPlayer]);

    // ターンのたびにパスやゲーム終了を自動でチェック
    useEffect(() => {
        if (isGameOver) return; // ゲーム終了後は何もしない

        // 現在のプレイヤーが置ける場所があるかチェック
        const canCurrentPlayerMove = board.flat().some((_cell, i) =>
            getFlippableTiles(board, Math.floor(i / 8), i % 8, currentPlayer).length > 0
        );

        if (!canCurrentPlayerMove) {
            const opponent = currentPlayer === 1 ? 2 : 1;
            // 相手が置ける場所があるかチェック
            const canOpponentMove = board.flat().some((_cell, i) =>
                getFlippableTiles(board, Math.floor(i / 8), i % 8, opponent).length > 0
            );

            if (canOpponentMove) {
                // 相手だけおけるならパス
                alert((currentPlayer === 1 ? '黒' : '白') + 'は置ける場所がないためパスになります。');
                setCurrentPlayer(opponent);
            } else {
                // どちらも置けないならゲーム終了
                setIsGameOver(true);
            }
        }
    }, [board, currentPlayer, isGameOver]);

    // マスがクリックされたとき
    const handleClick = (row: number, col:number) => {
        // --- ルールチェック ---
        if (isGameOver) return;

        // 石を置けるのか、ひっくり返すのかを判定する（上記の関数を呼び出し）
        const tilesToFlip  = getFlippableTiles(board, row, col, currentPlayer);

        // ひっくり返せる石がないときはその手は無効
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
        setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
    };

    // ゲームをリセットする関数
    const handleNewGame = () => {
        setBoard(initialBoard);
        setCurrentPlayer(1);
        setIsGameOver(false);
    };

    // 勝者を判定する
    const winner = score.black === score.white ? 'Draw' : score.black > score.white ? '⚫️ Black' : '⚪️ White';

    return (
        <div className="game">
            {/* Boardコンポーネントに盤面データ(board),handleClickを渡す */}
            <Board board={board} handleClick={handleClick} validMoves={validMoves} />

            {/* 現在のプレイヤーを表示する部分 */}
            <div className="info">
                <h2>Score: ⚫️ Black {score.black} - ⚪️ White {score.white}</h2>

                {/*ゲーム終了時とプレイ中で表示を切り替える*/}
                {isGameOver ? (
                    <h2>Game Over! Winner: {winner}</h2>
                ) : (
                    <h2>Current Player: {currentPlayer === 1 ? '⚫️ Black' : '⚪️ White'}</h2>
                )}
                {/*リセットボタン*/}
                <button onClick={handleNewGame} style={{marginTop: '20px', padding: '10px 20px'}}>New Game</button>
            </div>
        </div>
    );
}

export default Game;
