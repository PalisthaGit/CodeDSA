'use client'

import { useBinarySearch } from './BinarySearchVisualizer.logic'

export function BinarySearchVisualizer() {
  const {
    array,
    leftPtr,
    rightPtr,
    midPtr,
    done,
    playing,
    inputValue,
    setInputValue,
    mainBtnLabel,
    stepDim,
    resetDim,
    statusMessage,
    statusVariant,
    getCellClass,
    getPointerLabel,
    handleMain,
    doStep,
    fullReset,
  } = useBinarySearch()

  return (
    <div className="visLayout">
      <div className="visualizerCard">
        <div className="visMain">
          <h2 className="visCardTitle">binary search — cut it in half</h2>

          <div className="visArrayScroll">
            <div className="visPointerRow">
              {array.map((_, k) => (
                <div key={k} className={`visPointerCell${getPointerLabel(k) ? ' hasLabel' : ''}`}>
                  {getPointerLabel(k)}
                </div>
              ))}
            </div>

            <div className="visArrayRow">
              {array.map((num, k) => (
                <div key={k} className="visCell">
                  <div className={getCellClass(k)}>
                    {num}
                  </div>
                  <div className="visCellIndex">[{k}]</div>
                </div>
              ))}
            </div>
          </div>

          <div className="visMetaRow">
            <div className="visMetaPill">size: <span className="visMetaValue">{array.length}</span></div>
            <div className="visMetaPill">
              window: <span className="visMetaValue">
                {leftPtr < 0 ? '—' : leftPtr > rightPtr ? 'empty' : `[${leftPtr}..${rightPtr}]`}
              </span>
            </div>
            <div className="visMetaPill">
              mid: <span className="visMetaValue">{midPtr !== undefined ? midPtr : '—'}</span>
            </div>
          </div>

          <div className="visLinearControls">
            <input
              className="visSearchInput"
              type="text"
              inputMode="numeric"
              placeholder="try 24..."
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleMain()}
            />
            <button className="visMainBtn" onClick={handleMain}>
              {playing ? '⏸' : '▶'} {mainBtnLabel}
            </button>
            <button className={`visSecondaryBtn${stepDim ? ' dim' : ''}`} onClick={doStep}>Step →</button>
            <button className={`visSecondaryBtn${resetDim ? ' dim' : ''}`} onClick={fullReset}>Reset</button>
          </div>

          <div className={`visStatusBox ${statusVariant}`}>
            {statusMessage}
          </div>
        </div>
      </div>

    </div>
  )
}
