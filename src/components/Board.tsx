import Cell from './Cell';
import type { BoardState } from './Game';

// 親から受け取るprops(データ)の型を定義
type BoardProps = {
  board: BoardState;
  // クリックイベントを受け取る型
  handleClick: (row: number, col: number) => void;
  // validMovesを受け取る
  validMoves: [number, number][];
};

const Board = ({ board, handleClick, validMoves }: BoardProps) => {
  return (
    <div className="board">
      {/* board.flat() で8x8の二次元配列を64個の一列の配列に変換し、
        mapで全てのマスを直接生成
      */}
      {board.flat().map((cellState, index) => {
        // 1次元配列のインデックスから行と列を計算
        const row = Math.floor(index / 8);
        const col = index % 8;
        // マスがヒント表示対象か判定
        const isHint = validMoves.some(move => move[0] === row && move[1] === col);

        return (
          <Cell
            key={index}
            state={cellState}
            // クリックされたら、そのマスの行と列をhandleClickに渡す
            onClick={() => handleClick(row, col)}
            isHint={isHint}
          />
        );
      })}
    </div>
  );
};

export default Board;

