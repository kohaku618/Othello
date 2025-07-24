import type { CellState } from './Game';

type CellProps = {
    state: CellState;
    // クリックイベントを受け取る型
    onClick: () => void;
    isHint: boolean;
}

const Cell = ({ state, onClick, isHint }: CellProps) => {
    // stateが0でなければ石を表示する（0は空マス）
    // 石を表裏ある構造として設定
    const piece = state !== 0 ? (
        // 回転させるコンテナ「stateが2(白)の時、is－flippedクラスを付与」
        <div className={`piece-container ${state === 2 ? 'is-flipped' : ''}`}>
            <div className='piece-front'></div> {/* 表（黒） */}
            <div className='piece-back'></div>  {/* 裏（白）*/}
        </div>
    ) : null;

    return (
        // マス本体のdivにonClickイベントを設定
        <div className='cell' onClick={onClick}>
            {piece}
            {/* isHintがtrueの場合ヒントマーカーを表示 */}
            {isHint && <div className='hint-marker'>🤡</div>}
        </div>
    );
}

export default Cell;
