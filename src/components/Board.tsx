import Cell from './Cell';
import type { BoardState } from './Game';

// 親から受け取るprops(データ)の型を定義
type BoardProps = {
  board: BoardState;
};

const Board = ({ board }: BoardProps) => {
  return (
    <div className="board">
      {/* board.flat() で8x8の二次元配列を64個の一列の配列に変換し、
        mapで全てのマスを直接生成します。
      */}
      {board.flat().map((cellState, index) => (
        <Cell
          key={index}
          state={cellState}
          // 将来のクリック処理のために行と列の情報を渡しておくと便利です
          // onClick={() => console.log(Math.floor(index / 8), index % 8)}
        />
      ))}
    </div>
  );
};

export default Board;

