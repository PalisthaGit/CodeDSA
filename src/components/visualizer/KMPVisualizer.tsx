'use client'

import { useKMP } from './KMPVisualizer.logic'

const CELL_STEP = 54 // 48px cell + 6px gap

export function KMPVisualizer() {
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
  } = useKMP()

  const textChars = frozenText.split('')
  const patternChars = frozenPattern.split('')
  const hasStarted = frozenText.length > 0

  const isPreprocessing = currentStep?.stepType === 'preprocess'
  const patternOffset = currentStep?.patternOffset ?? 0
  const failure = currentStep?.failureFunction ?? []
  const computedUpTo = currentStep?.computedUpTo ?? -1

  return (
    <div className="visLayout">
      <div className="visualizerCard">
        <div className="visMain">
          <h2 className="visCardTitle">KMP — use the failure function to skip redundant comparisons</h2>

          {hasStarted && (
            <>
              {currentStep && (
                <div className={`kmpPhaseTag ${isPreprocessing ? 'kmpPhasePreprocess' : 'kmpPhaseSearch'}`}>
                  {isPreprocessing ? 'phase 1: building failure function' : 'phase 2: searching text'}
                </div>
              )}

              <div className="visArrayScroll kmpScrollArea">
                {/* Text row — dimmed during preprocessing */}
                <div className={`kmpRowGroup${isPreprocessing ? ' kmpRowDimmed' : ''}`}>
                  <div className="kmpRowLabel">text</div>
                  <div className="visPointerRow">
                    {textChars.map((_, k) => (
                      <div key={k} className={`visPointerCell${currentStep?.textStates[k] === 'active' ? ' hasLabel' : ''}`}>
                        {currentStep?.textStates[k] === 'active' ? 'i' : ''}
                      </div>
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

                {/* Pattern row — slides with offset during search */}
                <div className="kmpRowGroup">
                  <div className="kmpRowLabel">pattern</div>
                  <div style={{ marginLeft: isPreprocessing ? 0 : `${patternOffset * CELL_STEP}px`, transition: 'margin-left 0.3s ease' }}>
                    <div className="visPointerRow">
                      {patternChars.map((_, k) => (
                        <div key={k} className={`visPointerCell${currentStep?.patternStates[k] === 'active' ? ' hasLabel' : ''}`}>
                          {currentStep?.patternStates[k] === 'active' ? 'j' : ''}
                        </div>
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

              {/* Failure function table */}
              {patternChars.length > 0 && (
                <div className="kmpFailureSection">
                  <div className="kmpFailureLabel">failure function</div>
                  <div className="kmpFailureGrid">
                    <div className="kmpFailureLabelCol">
                      <div className="kmpFailureLabelCell">j</div>
                      <div className="kmpFailureLabelCell">char</div>
                      <div className="kmpFailureLabelCell">f[j]</div>
                    </div>
                    {patternChars.map((ch, k) => {
                      const isActive = k === computedUpTo && isPreprocessing
                      const isPending = k > computedUpTo
                      return (
                        <div key={k} className={`kmpFailureValCol${isActive ? ' kmpFailureActive' : ''}`}>
                          <div className="kmpFailureCell kmpFailureCellIdx">{k}</div>
                          <div className="kmpFailureCell kmpFailureCellChar">{ch}</div>
                          <div className={`kmpFailureCell kmpFailureCellVal${isPending ? ' kmpFailurePending' : ''}`}>
                            {isPending ? '?' : (failure[k] ?? 0)}
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
              {currentStep?.message ?? 'enter text and pattern above, then press run KMP'}
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
