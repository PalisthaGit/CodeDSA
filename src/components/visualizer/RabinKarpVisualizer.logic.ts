'use client'

import { useState, useRef, useCallback } from 'react'

export type CharState = 'default' | 'candidate' | 'active' | 'matched' | 'mismatch'
type StepType = 'preprocess' | 'compare' | 'shift' | 'match' | 'mismatch' | 'complete'

interface RKMetadata {
  patternHash: number
  windowHash: number
  base: number
  mod: number
  spuriousHits: number
}

interface RKStep {
  stepType: StepType
  message: string
  subMessage: string
  isMajorStep: boolean
  textStates: Record<number, CharState>
  patternStates: Record<number, CharState>
  patternOffset: number
  matches: number[]
  metadata: RKMetadata
}

const BASE = 31
const MOD = 1_000_000_007

function charCode(c: string): number {
  return c.charCodeAt(0) - 96
}

function buildStep(
  stepType: StepType,
  message: string,
  subMessage: string,
  offset: number,
  textLen: number,
  patternLen: number,
  activeIndices: number[],
  mismatchIndices: number[],
  matches: number[],
  patternHash: number,
  windowHash: number,
  spuriousHits: number,
  isMajorStep = false,
): RKStep {
  const textStates: Record<number, CharState> = {}
  const patternStates: Record<number, CharState> = {}

  for (let i = offset; i < offset + patternLen && i < textLen; i++) {
    textStates[i] = 'candidate'
  }
  for (const m of matches) {
    for (let i = m; i < m + patternLen; i++) textStates[i] = 'matched'
  }
  for (const i of activeIndices) textStates[i] = 'active'
  for (const i of mismatchIndices) textStates[i] = 'mismatch'

  return {
    stepType,
    message,
    subMessage,
    isMajorStep,
    textStates,
    patternStates,
    patternOffset: offset,
    matches: [...matches],
    metadata: { patternHash, windowHash, base: BASE, mod: MOD, spuriousHits },
  }
}

function buildAllSteps(text: string, pattern: string): RKStep[] {
  const steps: RKStep[] = []
  const n = text.length
  const m = pattern.length
  const matches: number[] = []

  if (m === 0 || m > n) {
    steps.push({
      stepType: 'complete',
      message: 'Pattern is empty or longer than text',
      subMessage: '',
      isMajorStep: true,
      textStates: {},
      patternStates: {},
      patternOffset: 0,
      matches: [],
      metadata: { patternHash: 0, windowHash: 0, base: BASE, mod: MOD, spuriousHits: 0 },
    })
    return steps
  }

  let h = 1
  for (let i = 0; i < m - 1; i++) h = (h * BASE) % MOD

  let patternHash = 0
  let windowHash = 0
  for (let i = 0; i < m; i++) {
    patternHash = (patternHash * BASE + charCode(pattern[i])) % MOD
    windowHash = (windowHash * BASE + charCode(text[i])) % MOD
  }

  steps.push(
    buildStep(
      'preprocess',
      `Initial hashes computed — pattern hash = ${patternHash}`,
      `BASE=${BASE}, MOD=${MOD}. Rolling hash slides the window in O(1).`,
      0, n, m, [], [], [],
      patternHash, windowHash, 0, true,
    ),
  )

  let spuriousHits = 0

  for (let i = 0; i <= n - m; i++) {
    const hashMatch = windowHash === patternHash

    steps.push(
      buildStep(
        'compare',
        `Window [${i}..${i + m - 1}]: hash=${windowHash} vs pattern hash=${patternHash}`,
        hashMatch
          ? 'Hash match — verifying character by character'
          : 'Hash mismatch — skip window',
        i, n, m,
        hashMatch ? Array.from({ length: m }, (_, k) => i + k) : [],
        [],
        [...matches],
        patternHash, windowHash, spuriousHits,
      ),
    )

    if (hashMatch) {
      let verified = true
      for (let j = 0; j < m; j++) {
        if (text[i + j] !== pattern[j]) {
          verified = false
          break
        }
      }

      if (verified) {
        matches.push(i)
        steps.push(
          buildStep(
            'match',
            `Match confirmed at index ${i}!`,
            'Hash matched AND character verification passed',
            i, n, m, [], [], [...matches],
            patternHash, windowHash, spuriousHits, true,
          ),
        )
      } else {
        spuriousHits++
        steps.push(
          buildStep(
            'mismatch',
            `Spurious hit at ${i} — hash collision! Characters don't match`,
            `Spurious hits so far: ${spuriousHits}`,
            i, n, m,
            [],
            Array.from({ length: m }, (_, k) => i + k),
            [...matches],
            patternHash, windowHash, spuriousHits, true,
          ),
        )
      }
    }

    if (i < n - m) {
      windowHash =
        (BASE * (windowHash - ((charCode(text[i]) * h) % MOD) + MOD) +
          charCode(text[i + m])) %
        MOD

      steps.push(
        buildStep(
          'shift',
          `Rolling: remove '${text[i]}', add '${text[i + m]}' → new hash=${windowHash}`,
          'O(1) hash update via rolling hash formula',
          i + 1, n, m, [], [], [...matches],
          patternHash, windowHash, spuriousHits,
        ),
      )
    }
  }

  steps.push(
    buildStep(
      'complete',
      matches.length > 0
        ? `Rabin-Karp complete — ${matches.length} match${matches.length !== 1 ? 'es' : ''} at: [${matches.join(', ')}]`
        : 'Rabin-Karp complete — no matches found',
      `${spuriousHits} spurious hit${spuriousHits !== 1 ? 's' : ''} (hash collisions requiring verification)`,
      0, n, m, [], [], [...matches],
      patternHash, windowHash, spuriousHits, true,
    ),
  )

  return steps
}

const DELAY_MAJOR = 900
const DELAY_MINOR = 500

export function useRabinKarp() {
  const [textInput, setTextInput] = useState('ababcababcabab')
  const [patternInput, setPatternInput] = useState('ababcabab')
  const [frozenText, setFrozenText] = useState('')
  const [frozenPattern, setFrozenPattern] = useState('')
  const [currentStep, setCurrentStep] = useState<RKStep | null>(null)
  const [playing, setPlaying] = useState(false)
  const [started, setStarted] = useState(false)
  const [done, setDone] = useState(false)
  const [mainBtnLabel, setMainBtnLabel] = useState('Run Rabin-Karp')
  const [stepDim, setStepDim] = useState(true)
  const [resetDim, setResetDim] = useState(true)

  const stepsRef = useRef<RKStep[]>([])
  const stepIdxRef = useRef(0)
  const playingRef = useRef(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const doneRef = useRef(false)

  const updateButtons = useCallback((isPlaying: boolean, isStarted: boolean, isDone: boolean) => {
    if (!isStarted) {
      setMainBtnLabel('Run Rabin-Karp')
      setStepDim(true)
      setResetDim(true)
    } else if (isPlaying) {
      setMainBtnLabel('Pause')
      setStepDim(true)
      setResetDim(false)
    } else if (isDone) {
      setMainBtnLabel('Run Rabin-Karp')
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

  const statusVariant = (() => {
    if (!currentStep) return ''
    switch (currentStep.stepType) {
      case 'preprocess': return 'info'
      case 'compare':
        return currentStep.metadata.windowHash === currentStep.metadata.patternHash
          ? 'checking'
          : ''
      case 'shift': return ''
      case 'match': return 'found'
      case 'mismatch': return 'notFound'
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
    handleMain, doStep, fullReset,
  }
}
