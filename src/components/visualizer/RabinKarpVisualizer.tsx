'use client'

import { useRabinKarp } from './RabinKarpVisualizer.logic'

const CELL_STEP = 54 // 48px cell + 6px gap

export function RabinKarpVisualizer() {
  const {
    textInput, setTextInput,
    patternInput, setPatternInput,
    frozenText, frozenPattern,
    currentStep,
    playing,
    mainBtnLabel, stepDim, resetDim,
    statusVariant,
    getTextCellClass,
    handleMain, doStep, fullReset,
  } = useRabinKarp()

  const textChars = frozenText.split('')
  const patternChars = frozenPattern.split('')
  const hasStarted = frozenText.length > 0

  const patternOffset = currentStep?.patternOffset ?? 0
  const meta = currentStep?.metadata
  const hashMatch = meta !== undefined && meta.windowHash === meta.patternHash

  return (
    <div className="visLayout">
      <div className="visualizerCard">
        <div className="visMain">
          <h2 className="visCardTitle">Rabin-Karp — rolling hash for O(1) window comparison</h2>

          {hasStarted && (
            <>
              <div className="kmpScrollArea visArrayScroll">
                {/* Text row */}
                <div className="kmpRowGroup">
                  <div className="kmpRowLabel">text</div>
                  <div className="visPointerRow">
                    {textChars.map((_, k) => (
                      <div key={k} className="visPointerCell" />
                    ))}
                  </div>
                  <div className="visArrayRow">
                    {textChars.map((ch, k) => (
                      <div key={k} className="visCell">
                        <div className={getTextCellClass(k)}>{ch}</div>
                        <div className="visCellIndex">[{k}]</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pattern row — slides with offset */}
                <div className="kmpRowGroup">
                  <div className="kmpRowLabel">pattern</div>
                  <div style={{ marginLeft: `${patternOffset * CELL_STEP}px`, transition: 'margin-left 0.3s ease' }}>
                    <div className="visPointerRow">
                      {patternChars.map((_, k) => (
                        <div key={k} className="visPointerCell" />
                      ))}
                    </div>
                    <div className="visArrayRow">
                      {patternChars.map((ch, k) => (
                        <div key={k} className="visCell">
                          <div className="visCellBox">{ch}</div>
                          <div className="visCellIndex">[{k}]</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Hash info panel */}
              {meta && (
                <div className="rkHashPanel">
                  <div className="rkHashLabel">rolling hash</div>
                  <div className="rkHashGrid">
                    <div className="rkHashRow">
                      <span className="rkHashKey">pattern hash</span>
                      <span className="rkHashVal">{meta.patternHash}</span>
                    </div>
                    <div className="rkHashRow">
                      <span className="rkHashKey">window hash</span>
                      <span className={`rkHashVal${hashMatch ? ' rkHashMatch' : ' rkHashNoMatch'}`}>
                        {meta.windowHash}
                      </span>
                    </div>
                    <div className="rkHashRow">
                      <span className="rkHashKey">spurious hits</span>
                      <span className={`rkHashVal${meta.spuriousHits > 0 ? ' rkHashSpurious' : ''}`}>
                        {meta.spuriousHits}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Meta pills */}
              <div className="visMetaRow">
                <div className="visMetaPill">
                  text: <span className="visMetaValue">{textChars.length}</span>
                </div>
                <div className="visMetaPill">
                  pattern: <span className="visMetaValue">{patternChars.length}</span>
                </div>
                <div className="visMetaPill">
                  matches: <span className="visMetaValue">{currentStep?.matches.length ?? 0}</span>
                </div>
                <div className="visMetaPill">
                  offset: <span className="visMetaValue">{patternOffset}</span>
                </div>
              </div>
            </>
          )}

          {/* Controls */}
          <div className="kmpControls">
            <input
              className="visSearchInput kmpInputText"
              type="text"
              placeholder="text..."
              value={textInput}
              onChange={e => setTextInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleMain()}
            />
            <input
              className="visSearchInput kmpInputPattern"
              type="text"
              placeholder="pattern..."
              value={patternInput}
              onChange={e => setPatternInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleMain()}
            />
            <button className="visMainBtn" onClick={handleMain}>
              {playing ? '⏸' : '▶'} {mainBtnLabel}
            </button>
            <button className={`visSecondaryBtn${stepDim ? ' dim' : ''}`} onClick={doStep}>Step →</button>
            <button className={`visSecondaryBtn${resetDim ? ' dim' : ''}`} onClick={fullReset}>Reset</button>
          </div>

          {/* Status box */}
          <div className={`visStatusBox kmpStatusBox ${statusVariant}`}>
            <div className="kmpStatusMsg">
              {currentStep?.message ?? 'enter text and pattern above, then press run'}
            </div>
            {currentStep?.subMessage && (
              <div className="kmpStatusSub">{currentStep.subMessage}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
