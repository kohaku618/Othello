import type { CellState } from './Game';

type CellProps = {
    state: CellState;
    // クリックイベントを受け取る型
    onClick: () => void;
}

const Cell = ({ state, onClick }: CellProps) => {
    // stateが0でなければ石を表示する（0は空マス）
    const piece = state !== 0 ? (
        // stateが1なら'black', 2なら'white'のクラス名を付けて色を分ける
        <div className={`piece ${state === 1 ? 'black' : 'white'}`}></div>
    ) : null;

    return (
        // マス本体のdivにonClickイベントを設定
        <div className='cell' onClick={onClick}>
            {piece}
        </div>
    );
}

export default Cell;
