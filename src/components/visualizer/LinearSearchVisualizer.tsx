'use client'

import { useLinearSearch } from './LinearSearchVisualizer.logic'

export function LinearSearchVisualizer() {
  const {
    array,
    currentIndex,
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
    handleMain,
    doStep,
    fullReset,
  } = useLinearSearch()

  return (
    <div className="visLayout">
      <div className="visualizerCard">
        <div className="visMain">
          <h2 className="visCardTitle">linear search — check everything one by one</h2>

          <div className="visArrayScroll stretch">
            <div className="visPointerRow">
              {array.map((_, k) => (
                <div key={k} className="visPointerCell">
                  {k === currentIndex && !done ? 'i' : ''}
                </div>
              ))}
            </div>

            <div className="visArrayRow">
              {array.map((song, k) => (
                <div key={k} className="visCell">
                  <div className={getCellClass(k)}>
                    {song}
                  </div>
                  <div className="visCellIndex">[{k}]</div>
                </div>
              ))}
            </div>
          </div>

          <div className="visMetaRow">
            <div className="visMetaPill">size: <span className="visMetaValue">{array.length}</span></div>
            <div className="visMetaPill">index: <span className="visMetaValue">{currentIndex < 0 ? '—' : currentIndex}</span></div>
          </div>

          <div className="visLinearControls">
            <input
              className="visSearchInput"
              type="text"
              placeholder="target song..."
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
