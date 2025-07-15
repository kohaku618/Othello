import type { CellState } from './Game';

type CellProps = {
    state: CellState;
}

const Cell = ({ state }: CellProps) => {
    // stateが0でなければ石を表示する（0は空マス）
    const piece = state !== 0 ? (
        // stateが1なら'black', 2なら'white'のクラス名を付けて色を分ける
        <div className={`piece ${state === 1 ? 'black' : 'white'}`}></div>
    ) : null;

    return (
        <div className='cell'>
            {piece}
        </div>
    );
}

export default Cell;
