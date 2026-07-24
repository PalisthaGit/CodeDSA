'use client'

import { useBoyerMoore } from './BoyerMooreVisualizer.logic'

const CELL_STEP = 54 // 48px cell + 6px gap

export function BoyerMooreVisualizer() {
  const {
    textInput, setTextInput,
    patternInput, setPatternInput,
    frozenText, frozenPattern,
    currentStep,
    playing,
    mainBtnLabel, stepDim, resetDim,
    statusVariant,
    getTextCellClass,
    getPatternCellClass,
    handleMain, doStep, fullReset,
  } = useBoyerMoore()

  const textChars = frozenText.split('')
  const patternChars = frozenPattern.split('')
  const hasStarted = frozenText.length > 0

  const isPreprocessing = currentStep?.stepType === 'preprocess'
  const patternOffset = currentStep?.patternOffset ?? 0
  const badCharTable = currentStep?.badCharTable ?? {}
  const sortedChars = currentStep?.sortedChars ?? []
  const highlightChar = currentStep?.highlightChar ?? null

  return (
    <div className="visLayout">
      <div className="visualizerCard">
        <div className="visMain">
          <h2 className="visCardTitle">Boyer-Moore — bad character heuristic skips redundant alignments</h2>

          {hasStarted && (
            <>
              {currentStep && (
                <div className={`kmpPhaseTag ${isPreprocessing ? 'kmpPhasePreprocess' : 'kmpPhaseSearch'}`}>
                  {isPreprocessing ? 'phase 1: building bad character table' : 'phase 2: searching text (right to left)'}
                </div>
              )}

              <div className="visArrayScroll kmpScrollArea">
                {/* Text row */}
                <div className={`kmpRowGroup${isPreprocessing ? ' kmpRowDimmed' : ''}`}>
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
                  <div style={{ marginLeft: isPreprocessing ? 0 : `${patternOffset * CELL_STEP}px`, transition: 'margin-left 0.3s ease' }}>
                    <div className="visPointerRow">
                      {patternChars.map((_, k) => (
                        <div key={k} className="visPointerCell" />
                      ))}
                    </div>
                    <div className="visArrayRow">
                      {patternChars.map((ch, k) => (
                        <div key={k} className="visCell">
                          <div className={getPatternCellClass(k)}>{ch}</div>
                          <div className="visCellIndex">[{k}]</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bad character table */}
              {sortedChars.length > 0 && (
                <div className="kmpFailureSection">
                  <div className="kmpFailureLabel">bad character table</div>
                  <div className="kmpFailureGrid">
                    <div className="kmpFailureLabelCol">
                      <div className="kmpFailureLabelCell">char</div>
                      <div className="kmpFailureLabelCell">last idx</div>
                    </div>
                    {sortedChars.map(ch => {
                      const isActive = ch === highlightChar && isPreprocessing
                      return (
                        <div key={ch} className={`kmpFailureValCol${isActive ? ' kmpFailureActive' : ''}`}>
                          <div className="kmpFailureCell kmpFailureCellChar">{ch}</div>
                          <div className="kmpFailureCell kmpFailureCellVal">
                            {badCharTable[ch] !== undefined ? badCharTable[ch] : '?'}
                          </div>
                        </div>
                      )
                    })}
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
                {!isPreprocessing && currentStep && (
                  <div className="visMetaPill">
                    offset: <span className="visMetaValue">{patternOffset}</span>
                  </div>
                )}
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
              {currentStep?.message ?? 'enter text and pattern above, then press run Boyer-Moore'}
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
