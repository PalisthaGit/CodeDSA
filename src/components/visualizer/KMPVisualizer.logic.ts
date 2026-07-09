'use client'

import { useState, useRef, useCallback } from 'react'

export type CharState = 'default' | 'candidate' | 'active' | 'matched' | 'mismatch'
type StepType = 'preprocess' | 'compare' | 'shift' | 'match' | 'complete'

interface KMPStep {
  stepType: StepType
  message: string
  subMessage: string
  isMajorStep: boolean
  textStates: Record<number, CharState>
  patternStates: Record<number, CharState>
  patternOffset: number
  matches: number[]
  failureFunction: number[]
  computedUpTo: number
}

function buildStep(
  stepType: StepType,
  message: string,
  subMessage: string,
  offset: number,
  textLen: number,
  patternLen: number,
  activeTextIdx: number | null,
  activePatternIdx: number | null,
  mismatchIdx: number | null,
  matches: number[],
  failure: number[],
  computedUpTo: number,
  isMajorStep = false,
): KMPStep {
  const textStates: Record<number, CharState> = {}
  const patternStates: Record<number, CharState> = {}

  if (activePatternIdx !== null) {
    for (let i = offset; i < offset + activePatternIdx + 1 && i < textLen; i++) {
      textStates[i] = 'candidate'
    }
  }
  for (const m of matches) {
    for (let i = m; i < m + patternLen; i++) textStates[i] = 'matched'
  }
  if (activeTextIdx !== null) textStates[activeTextIdx] = 'active'
  if (activePatternIdx !== null) patternStates[activePatternIdx] = 'active'
  if (mismatchIdx !== null) {
    textStates[mismatchIdx] = 'mismatch'
    if (activePatternIdx !== null) patternStates[activePatternIdx] = 'mismatch'
  }

  return {
    stepType, message, subMessage, isMajorStep,
    textStates, patternStates,
    patternOffset: offset,
    matches: [...matches],
    failureFunction: [...failure],
    computedUpTo,
  }
}

function buildFailureSteps(pattern: string): { failure: number[]; steps: KMPStep[] } {
  const m = pattern.length
  const failure = new Array<number>(m).fill(0)
  const steps: KMPStep[] = []

  steps.push({
    stepType: 'preprocess',
    message: 'KMP preprocessing: building failure function (partial match table)',
    subMessage: 'failure[i] = length of longest proper prefix of pattern[0..i] that is also a suffix',
    isMajorStep: true,
    textStates: {}, patternStates: {},
    patternOffset: 0, matches: [],
    failureFunction: [...failure],
    computedUpTo: -1,
  })

  let len = 0
  let i = 1
  while (i < m) {
    if (pattern[i] === pattern[len]) {
      len++
      failure[i] = len
      steps.push({
        stepType: 'preprocess',
        message: `failure[${i}] = ${len} — pattern[${i}]='${pattern[i]}' matches pattern[${len - 1}]='${pattern[len - 1]}'`,
        subMessage: `Prefix "${pattern.slice(0, len)}" is also a suffix of "${pattern.slice(0, i + 1)}"`,
        isMajorStep: false,
        textStates: {},
        patternStates: { [i]: 'active', [len - 1]: 'candidate' },
        patternOffset: 0, matches: [],
        failureFunction: [...failure],
        computedUpTo: i,
      })
      i++
    } else if (len > 0) {
      len = failure[len - 1]
    } else {
      failure[i] = 0
      steps.push({
        stepType: 'preprocess',
        message: `failure[${i}] = 0 — no proper prefix/suffix match`,
        subMessage: `pattern[${i}]='${pattern[i]}' — resetting`,
        isMajorStep: false,
        textStates: {},
        patternStates: { [i]: 'mismatch' },
        patternOffset: 0, matches: [],
        failureFunction: [...failure],
        computedUpTo: i,
      })
      i++
    }
  }

  return { failure, steps }
}

function buildAllSteps(text: string, pattern: string): KMPStep[] {
  const steps: KMPStep[] = []
  const n = text.length
  const m = pattern.length
  const matches: number[] = []

  if (m === 0 || m > n) {
    steps.push({
      stepType: 'complete',
      message: 'Pattern is empty or longer than text',
      subMessage: '',
      isMajorStep: true,
      textStates: {}, patternStates: {},
      patternOffset: 0, matches: [],
      failureFunction: [],
      computedUpTo: -1,
    })
    return steps
  }

  const { failure, steps: prepSteps } = buildFailureSteps(pattern)
  steps.push(...prepSteps)

  steps.push({
    stepType: 'preprocess',
    message: `Failure function complete: [${failure.join(', ')}]`,
    subMessage: 'Now scanning text — mismatches skip ahead using failure values',
    isMajorStep: true,
    textStates: {}, patternStates: {},
    patternOffset: 0, matches: [],
    failureFunction: [...failure],
    computedUpTo: m - 1,
  })

  let i = 0
  let j = 0

  while (i < n) {
    const offset = i - j

    steps.push(
      buildStep(
        'compare',
        `Comparing text[${i}]='${text[i]}' with pattern[${j}]='${pattern[j]}'`,
        text[i] === pattern[j]
          ? 'Match — advance both pointers'
          : `Mismatch — use failure[${j - 1}]=${j > 0 ? failure[j - 1] : 0} to skip`,
        offset, n, m,
        i, j,
        text[i] !== pattern[j] ? i : null,
        [...matches], failure, m - 1,
      )
    )

    if (text[i] === pattern[j]) {
      i++
      j++
    } else if (j > 0) {
      steps.push(
        buildStep(
          'shift',
          `Mismatch — jumping pattern to position ${failure[j - 1]} (saved ${j - failure[j - 1]} comparisons)`,
          `Skipping redundant comparisons using failure[${j - 1}]=${failure[j - 1]}`,
          i - failure[j - 1], n, m,
          i, failure[j - 1], null,
          [...matches], failure, m - 1, true,
        )
      )
      j = failure[j - 1]
    } else {
      i++
    }

    if (j === m) {
      const matchStart = i - j
      matches.push(matchStart)
      steps.push(
        buildStep(
          'match',
          `Match found at index ${matchStart}!`,
          `text[${matchStart}..${matchStart + m - 1}] = "${pattern}"`,
          matchStart, n, m,
          null, null, null,
          [...matches], failure, m - 1, true,
        )
      )
      j = failure[j - 1]
    }
  }

  steps.push(
    buildStep(
      'complete',
      matches.length > 0
        ? `KMP complete — ${matches.length} match${matches.length !== 1 ? 'es' : ''} at: [${matches.join(', ')}]`
        : 'KMP complete — no matches found',
      'KMP avoids redundant comparisons using the failure function',
      0, n, m,
      null, null, null,
      [...matches], failure, m - 1, true,
    )
  )

  return steps
}

const DELAY_MAJOR = 900
const DELAY_MINOR = 500

export function useKMP() {
  const [textInput, setTextInput] = useState('ABABCABABCABAB')
  const [patternInput, setPatternInput] = useState('ABABCABAB')
  const [frozenText, setFrozenText] = useState('')
  const [frozenPattern, setFrozenPattern] = useState('')
  const [currentStep, setCurrentStep] = useState<KMPStep | null>(null)
  const [playing, setPlaying] = useState(false)
  const [started, setStarted] = useState(false)
  const [done, setDone] = useState(false)
  const [mainBtnLabel, setMainBtnLabel] = useState('Run KMP')
  const [stepDim, setStepDim] = useState(true)
  const [resetDim, setResetDim] = useState(true)

  const stepsRef = useRef<KMPStep[]>([])
  const stepIdxRef = useRef(0)
  const playingRef = useRef(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const doneRef = useRef(false)

  const updateButtons = useCallback((isPlaying: boolean, isStarted: boolean, isDone: boolean) => {
    if (!isStarted) {
      setMainBtnLabel('Run KMP')
      setStepDim(true)
      setResetDim(true)
    } else if (isPlaying) {
      setMainBtnLabel('Pause')
      setStepDim(true)
      setResetDim(false)
    } else if (isDone) {
      setMainBtnLabel('Run KMP')
      setStepDim(true)
      setResetDim(false)
    } else {
      setMainBtnLabel('Play')
      setStepDim(false)
      setResetDim(false)
    }
  }, [])

  const stopPlay = useCallback((isStarted: boolean, isDone: boolean) => {
    playingRef.current = false
    setPlaying(false)
    if (timerRef.current) clearTimeout(timerRef.current)
    updateButtons(false, isStarted, isDone)
  }, [updateButtons])

  const runNext = useCallback(() => {
    if (!playingRef.current || stepIdxRef.current >= stepsRef.current.length) {
      stopPlay(true, doneRef.current)
      return
    }
    const step = stepsRef.current[stepIdxRef.current++]
    setCurrentStep(step)
    if (step.stepType === 'complete') {
      doneRef.current = true
      setDone(true)
      stopPlay(true, true)
      return
    }
    if (stepIdxRef.current < stepsRef.current.length && playingRef.current) {
      const delay = step.isMajorStep ? DELAY_MAJOR : DELAY_MINOR
      timerRef.current = setTimeout(runNext, delay)
    } else {
      stopPlay(true, doneRef.current)
    }
  }, [stopPlay])

  const startPlay = useCallback(() => {
    if (doneRef.current || stepIdxRef.current >= stepsRef.current.length) return
    playingRef.current = true
    setPlaying(true)
    updateButtons(true, true, false)
    runNext()
  }, [runNext, updateButtons])

  const kickoff = useCallback((text: string, pattern: string) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    playingRef.current = false
    doneRef.current = false
    stepsRef.current = buildAllSteps(text, pattern)
    stepIdxRef.current = 0
    setFrozenText(text)
    setFrozenPattern(pattern)
    setCurrentStep(null)
    setDone(false)
    setStarted(true)
    updateButtons(true, true, false)
    playingRef.current = true
    setPlaying(true)
    runNext()
  }, [runNext, updateButtons])

  const handleMain = useCallback(() => {
    if (!started || done) {
      const t = textInput.trim()
      const p = patternInput.trim()
      if (!t || !p) return
      kickoff(t, p)
    } else if (playingRef.current) {
      stopPlay(true, false)
    } else {
      startPlay()
    }
  }, [started, done, textInput, patternInput, kickoff, stopPlay, startPlay])

  const doStep = useCallback(() => {
    if (!started || done || playingRef.current || stepIdxRef.current >= stepsRef.current.length) return
    const step = stepsRef.current[stepIdxRef.current++]
    setCurrentStep(step)
    if (step.stepType === 'complete' || stepIdxRef.current >= stepsRef.current.length) {
      doneRef.current = true
      setDone(true)
      updateButtons(false, true, true)
    }
  }, [started, done, updateButtons])

  const fullReset = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    playingRef.current = false
    doneRef.current = false
    stepsRef.current = []
    stepIdxRef.current = 0
    setFrozenText('')
    setFrozenPattern('')
    setCurrentStep(null)
    setPlaying(false)
    setStarted(false)
    setDone(false)
    updateButtons(false, false, false)
  }, [updateButtons])

  const getTextCellClass = useCallback((i: number): string => {
    if (!currentStep) return 'visCellBox'
    const state = currentStep.textStates[i]
    if (state === 'matched') return 'visCellBox found'
    if (state === 'active') return 'visCellBox checking'
    if (state === 'mismatch') return 'visCellBox kmpMismatch'
    if (state === 'candidate') return 'visCellBox kmpCandidate'
    return 'visCellBox'
  }, [currentStep])

  const getPatternCellClass = useCallback((i: number): string => {
    if (!currentStep) return 'visCellBox'
    const state = currentStep.patternStates[i]
    if (state === 'active') return 'visCellBox checking'
    if (state === 'mismatch') return 'visCellBox kmpMismatch'
    if (state === 'candidate') return 'visCellBox kmpCandidate'
    return 'visCellBox'
  }, [currentStep])

  const statusVariant = (() => {
    if (!currentStep) return ''
    switch (currentStep.stepType) {
      case 'preprocess': return 'info'
      case 'compare':
        return Object.values(currentStep.textStates).includes('mismatch') ? 'notFound' : 'checking'
      case 'shift': return 'info'
      case 'match': return 'found'
      case 'complete': return currentStep.matches.length > 0 ? 'found' : 'notFound'
      default: return ''
    }
  })()

  return {
    textInput, setTextInput,
    patternInput, setPatternInput,
    frozenText, frozenPattern,
    currentStep,
    playing, started, done,
    mainBtnLabel, stepDim, resetDim,
    statusVariant,
    getTextCellClass,
    getPatternCellClass,
    handleMain, doStep, fullReset,
  }
}
