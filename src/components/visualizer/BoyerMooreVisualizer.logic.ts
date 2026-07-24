'use client'

import { useState, useRef, useCallback } from 'react'

export type CharState = 'default' | 'candidate' | 'active' | 'matched' | 'mismatch'
type StepType = 'preprocess' | 'compare' | 'shift' | 'match' | 'complete'

interface BMStep {
  stepType: StepType
  message: string
  subMessage: string
  isMajorStep: boolean
  textStates: Record<number, CharState>
  patternStates: Record<number, CharState>
  patternOffset: number
  matches: number[]
  badCharTable: Record<string, number>
  sortedChars: string[]
  highlightChar: string | null
}

function buildBadCharTable(pattern: string): Record<string, number> {
  const table: Record<string, number> = {}
  for (let i = 0; i < pattern.length; i++) {
    table[pattern[i]] = i
  }
  return table
}

function windowStates(
  offset: number,
  patternLen: number,
  textLen: number,
  matches: number[],
): Record<number, CharState> {
  const states: Record<number, CharState> = {}
  for (const pos of matches) {
    for (let k = pos; k < pos + patternLen; k++) states[k] = 'matched'
  }
  for (let k = offset; k < offset + patternLen && k < textLen; k++) {
    if (states[k] !== 'matched') states[k] = 'candidate'
  }
  return states
}

function buildAllSteps(text: string, pattern: string): BMStep[] {
  const steps: BMStep[] = []
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
      badCharTable: {}, sortedChars: [], highlightChar: null,
    })
    return steps
  }

  const badCharTable = buildBadCharTable(pattern)
  const sortedChars = Object.keys(badCharTable).sort()

  steps.push({
    stepType: 'preprocess',
    message: 'Boyer-Moore preprocessing: building bad character table',
    subMessage: 'For each character, record its rightmost index in the pattern. A mismatch shifts the pattern to align that character.',
    isMajorStep: true,
    textStates: {}, patternStates: {},
    patternOffset: 0, matches: [],
    badCharTable: {}, sortedChars: [], highlightChar: null,
  })

  const partialTable: Record<string, number> = {}
  for (let i = 0; i < m; i++) {
    const ch = pattern[i]
    const prev = partialTable[ch]
    partialTable[ch] = i
    steps.push({
      stepType: 'preprocess',
      message: prev === undefined
        ? `bad_char['${ch}'] = ${i} — '${ch}' first seen at index ${i}`
        : `bad_char['${ch}'] = ${i} — updated rightmost index (was ${prev})`,
      subMessage: `pattern[${i}] = '${ch}'`,
      isMajorStep: false,
      textStates: {},
      patternStates: { [i]: 'active' },
      patternOffset: 0, matches: [],
      badCharTable: { ...partialTable },
      sortedChars: Object.keys(partialTable).sort(),
      highlightChar: ch,
    })
  }

  steps.push({
    stepType: 'preprocess',
    message: `Bad character table complete — ${sortedChars.length} unique character${sortedChars.length !== 1 ? 's' : ''}`,
    subMessage: 'Now scanning text right-to-left — mismatches use the table to jump ahead',
    isMajorStep: true,
    textStates: {}, patternStates: {},
    patternOffset: 0, matches: [],
    badCharTable: { ...badCharTable }, sortedChars, highlightChar: null,
  })

  let s = 0
  while (s <= n - m) {
    const baseStates = windowStates(s, m, n, matches)

    steps.push({
      stepType: 'compare',
      message: `Aligning pattern at offset ${s} — comparing right to left`,
      subMessage: `Checking text[${s}..${s + m - 1}] against pattern`,
      isMajorStep: false,
      textStates: { ...baseStates },
      patternStates: {},
      patternOffset: s, matches: [...matches],
      badCharTable: { ...badCharTable }, sortedChars, highlightChar: null,
    })

    let j = m - 1
    let shifted = false

    while (j >= 0) {
      const textIdx = s + j
      const tChar = text[textIdx]
      const pChar = pattern[j]
      const isMatch = tChar === pChar

      const stepTextStates: Record<number, CharState> = { ...baseStates }
      const stepPatternStates: Record<number, CharState> = {}
      stepTextStates[textIdx] = isMatch ? 'active' : 'mismatch'
      stepPatternStates[j] = isMatch ? 'active' : 'mismatch'

      if (isMatch) {
        steps.push({
          stepType: 'compare',
          message: `text[${textIdx}]='${tChar}' matches pattern[${j}]='${pChar}'`,
          subMessage: j > 0 ? 'Continue comparing left' : 'All characters matched!',
          isMajorStep: false,
          textStates: stepTextStates,
          patternStates: stepPatternStates,
          patternOffset: s, matches: [...matches],
          badCharTable: { ...badCharTable }, sortedChars, highlightChar: null,
        })
        j--
      } else {
        const bcVal = badCharTable[tChar] !== undefined ? badCharTable[tChar] : -1
        const shift = Math.max(1, j - bcVal)

        steps.push({
          stepType: 'compare',
          message: `Mismatch: text[${textIdx}]='${tChar}' ≠ pattern[${j}]='${pChar}'`,
          subMessage: bcVal === -1
            ? `'${tChar}' not in pattern — shift by ${shift} (past the mismatch)`
            : `bad_char['${tChar}']=${bcVal} — shift by max(1, ${j}−${bcVal}) = ${shift}`,
          isMajorStep: false,
          textStates: stepTextStates,
          patternStates: stepPatternStates,
          patternOffset: s, matches: [...matches],
          badCharTable: { ...badCharTable }, sortedChars, highlightChar: tChar,
        })

        const afterStates: Record<number, CharState> = {}
        for (const pos of matches) {
          for (let k = pos; k < pos + m; k++) afterStates[k] = 'matched'
        }

        steps.push({
          stepType: 'shift',
          message: `Shifting pattern right by ${shift}`,
          subMessage: bcVal === -1
            ? `'${tChar}' not in pattern — shift past the mismatch`
            : `Align pattern's '${tChar}' (index ${bcVal}) under text's '${tChar}'`,
          isMajorStep: true,
          textStates: afterStates,
          patternStates: {},
          patternOffset: s + shift, matches: [...matches],
          badCharTable: { ...badCharTable }, sortedChars, highlightChar: null,
        })

        s += shift
        shifted = true
        break
      }
    }

    if (!shifted) {
      matches.push(s)
      const matchStates: Record<number, CharState> = {}
      for (const pos of matches) {
        for (let k = pos; k < pos + m; k++) matchStates[k] = 'matched'
      }

      steps.push({
        stepType: 'match',
        message: `Match found at index ${s}!`,
        subMessage: `text[${s}..${s + m - 1}] = "${pattern}"`,
        isMajorStep: true,
        textStates: matchStates,
        patternStates: {},
        patternOffset: s, matches: [...matches],
        badCharTable: { ...badCharTable }, sortedChars, highlightChar: null,
      })

      s += 1
    }
  }

  const finalStates: Record<number, CharState> = {}
  for (const pos of matches) {
    for (let k = pos; k < pos + m; k++) finalStates[k] = 'matched'
  }

  steps.push({
    stepType: 'complete',
    message: matches.length > 0
      ? `Boyer-Moore complete — ${matches.length} match${matches.length !== 1 ? 'es' : ''} at: [${matches.join(', ')}]`
      : 'Boyer-Moore complete — no matches found',
    subMessage: 'Bad character heuristic skips redundant alignments by jumping on mismatches',
    isMajorStep: true,
    textStates: finalStates,
    patternStates: {},
    patternOffset: 0, matches: [...matches],
    badCharTable: { ...badCharTable }, sortedChars, highlightChar: null,
  })

  return steps
}

const DELAY_MAJOR = 900
const DELAY_MINOR = 500

export function useBoyerMoore() {
  const [textInput, setTextInput] = useState('ABAAABCD')
  const [patternInput, setPatternInput] = useState('ABC')
  const [frozenText, setFrozenText] = useState('')
  const [frozenPattern, setFrozenPattern] = useState('')
  const [currentStep, setCurrentStep] = useState<BMStep | null>(null)
  const [playing, setPlaying] = useState(false)
  const [started, setStarted] = useState(false)
  const [done, setDone] = useState(false)
  const [mainBtnLabel, setMainBtnLabel] = useState('Run Boyer-Moore')
  const [stepDim, setStepDim] = useState(true)
  const [resetDim, setResetDim] = useState(true)

  const stepsRef = useRef<BMStep[]>([])
  const stepIdxRef = useRef(0)
  const playingRef = useRef(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const doneRef = useRef(false)

  const updateButtons = useCallback((isPlaying: boolean, isStarted: boolean, isDone: boolean) => {
    if (!isStarted) {
      setMainBtnLabel('Run Boyer-Moore')
      setStepDim(true)
      setResetDim(true)
    } else if (isPlaying) {
      setMainBtnLabel('Pause')
      setStepDim(true)
      setResetDim(false)
    } else if (isDone) {
      setMainBtnLabel('Run Boyer-Moore')
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
