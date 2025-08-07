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
    // 盤面の履歴を配列として管理
    const [history, setHistory] = useState<BoardState[]>([initialBoard]);

    // 現在の手数を管理
    const [currentMove, setCurrentMove] = useState(0);

    // 履歴と手数から現在の盤面とプレイヤーを算出
    const board = history[currentMove];
    const currentPlayer = currentMove % 2 === 0 ? 1 : 2;

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

    // ★ [変更] ヒント機能は後で対応するため、一旦機能を停止
    const validMoves: [number, number][] = [];

    // ターンのたびにパスやゲーム終了を自動でチェック
    useEffect(() => {
        // 最新の手でないときやゲーム終了時は何も行わない
        if (isGameOver || history.length - 1 !== currentMove) return; 

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
                // パスの場合次の手を履歴に追加
                setHistory(prevHistory => [...prevHistory, board]); // 盤面変えずに手番を追加
                setCurrentMove(move => move + 1);
            } else {
                // どちらも置けないならゲーム終了
                setIsGameOver(true);
            }
        }
    }, [board, currentPlayer, isGameOver, history, currentMove]);

    // マスがクリックされたとき
    const handleClick = (row: number, col:number) => {
        // --- ルールチェック ---
        if (isGameOver || history.length - 1 !== currentMove) return;

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

        // 新しい盤面を履歴に追加して手数を進める
        const newHistory = [...history, newBoard];
        setHistory(newHistory);
        setCurrentMove(newHistory.length - 1);
    };

    // ゲームをリセットする関数
    const handleNewGame = () => {
        setHistory([initialBoard]);
        setCurrentMove(0);
        setIsGameOver(false);
    };

    // 一手戻す関数
    const handleUndo = () => {
        if (currentMove > 0) {
            setIsGameOver(false); // ゲームオーバー状態の解除
            setCurrentMove(move => move - 1);
        }
    }

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
                {/* Undoボタン */}
                <button onClick={handleUndo} disabled={currentMove === 0} style={{marginTop: '20px', marginLeft: '10px', padding: '10px 20px'}}>Undo</button>
            </div>
        </div>
    );
}

export default Game;
