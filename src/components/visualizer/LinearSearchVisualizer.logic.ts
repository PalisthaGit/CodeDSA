'use client'

import { useState, useRef, useCallback } from 'react'

const SONGS = [
  'Blinding Lights',
  'Levitating',
  'Stay',
  'Heat Waves',
  'Peaches',
  'Watermelon Sugar',
  'Bad Guy',
  'Sunflower',
]

const CHECK_DELAY = 1000
const PASS_DELAY = 600

type StepType = 'init' | 'check' | 'passed' | 'found' | 'not_found'
type Step = { type: StepType; i?: number }

function buildSteps(target: string): Step[] {
  const steps: Step[] = [{ type: 'init' }]
  for (let i = 0; i < SONGS.length; i++) {
    steps.push({ type: 'check', i })
    if (SONGS[i] === target) {
      steps.push({ type: 'found', i })
      return steps
    }
    steps.push({ type: 'passed', i })
  }
  steps.push({ type: 'not_found' })
  return steps
}

function delayFor(step: Step): number {
  return step.type === 'check' ? CHECK_DELAY : PASS_DELAY
}

export function useLinearSearch() {
  const [inputValue, setInputValue] = useState('')
  const [currentIndex, setCurrentIndex] = useState(-1)
  const [passedUntil, setPassedUntil] = useState<number | undefined>(undefined)
  const [foundIndex, setFoundIndex] = useState(-1)
  const [statusMessage, setStatusMessage] = useState('type a song above and press search')
  const [statusVariant, setStatusVariant] = useState('')
  const [activeLines, setActiveLines] = useState<number[]>([])
  const [playing, setPlaying] = useState(false)
  const [started, setStarted] = useState(false)
  const [done, setDone] = useState(false)
  const [mainBtnLabel, setMainBtnLabel] = useState('Search')
  const [stepDim, setStepDim] = useState(true)
  const [resetDim, setResetDim] = useState(true)

  const stepsRef = useRef<Step[]>([])
  const stepIdxRef = useRef(0)
  const playingRef = useRef(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const targetRef = useRef('')
  const doneRef = useRef(false)

  const getCellClass = useCallback((k: number): string => {
    if (foundIndex === k) return 'visCellBox found'
    if (k === currentIndex && foundIndex === -1) return 'visCellBox checking'
    if (passedUntil !== undefined && k < passedUntil) return 'visCellBox passed'
    return 'visCellBox'
  }, [currentIndex, passedUntil, foundIndex])

  const updateButtons = useCallback((isPlaying: boolean, isStarted: boolean, isDone: boolean) => {
    if (!isStarted) {
      setMainBtnLabel('Search')
      setStepDim(true)
      setResetDim(true)
    } else if (isPlaying) {
      setMainBtnLabel('Pause')
      setStepDim(true)
      setResetDim(false)
    } else if (isDone) {
      setMainBtnLabel('Search')
      setStepDim(true)
      setResetDim(false)
    } else {
      setMainBtnLabel('Play')
      setStepDim(false)
      setResetDim(false)
    }
  }, [])

  const applyStep = useCallback((step: Step) => {
    const n = SONGS.length
    if (step.type === 'init') {
      setCurrentIndex(-1)
      setPassedUntil(0)
      setFoundIndex(-1)
      setActiveLines([0, 1])
      setStatusMessage('starting — checking from the beginning')
      setStatusVariant('info')
    } else if (step.type === 'check') {
      setCurrentIndex(step.i!)
      setPassedUntil(step.i)
      setFoundIndex(-1)
      setActiveLines([2, 3])
      setStatusMessage(`checking [${step.i}] — is "${SONGS[step.i!]}" == "${targetRef.current}" ?`)
      setStatusVariant('checking')
    } else if (step.type === 'passed') {
      setCurrentIndex(-1)
      setPassedUntil(step.i! + 1)
      setFoundIndex(-1)
      setActiveLines([2])
      setStatusMessage(`"${SONGS[step.i!]}" is not it — moving to [${step.i! + 1}]`)
      setStatusVariant('')
    } else if (step.type === 'found') {
      doneRef.current = true
      setDone(true)
      setCurrentIndex(-1)
      setPassedUntil(step.i)
      setFoundIndex(step.i!)
      setActiveLines([4])
      setStatusMessage(`found "${SONGS[step.i!]}" at index [${step.i}] — return ${step.i}`)
      setStatusVariant('found')
    } else if (step.type === 'not_found') {
      doneRef.current = true
      setDone(true)
      setCurrentIndex(-1)
      setPassedUntil(n)
      setFoundIndex(-1)
      setActiveLines([5])
      setStatusMessage(`went through all ${n} — "${targetRef.current}" not found — return -1`)
      setStatusVariant('notFound')
    }
  }, [])

  const stopPlay = useCallback((isStarted: boolean, isDone: boolean) => {
    playingRef.current = false
    setPlaying(false)
    if (timerRef.current) clearTimeout(timerRef.current)
    updateButtons(false, isStarted, isDone)
  }, [updateButtons])

  const runNext = useCallback(() => {
    if (!playingRef.current || doneRef.current || stepIdxRef.current >= stepsRef.current.length) {
      stopPlay(true, doneRef.current)
      return
    }
    const step = stepsRef.current[stepIdxRef.current++]
    applyStep(step)
    if (!doneRef.current && stepIdxRef.current < stepsRef.current.length) {
      timerRef.current = setTimeout(runNext, delayFor(step))
    } else {
      stopPlay(true, doneRef.current)
    }
  }, [applyStep, stopPlay])

  const startPlay = useCallback(() => {
    if (doneRef.current || stepIdxRef.current >= stepsRef.current.length) return
    playingRef.current = true
    setPlaying(true)
    updateButtons(true, true, false)
    runNext()
  }, [runNext, updateButtons])

  const kickoff = useCallback((target: string) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    playingRef.current = false
    doneRef.current = false
    targetRef.current = target
    stepsRef.current = buildSteps(target)
    stepIdxRef.current = 0
    setCurrentIndex(-1)
    setPassedUntil(undefined)
    setFoundIndex(-1)
    setActiveLines([])
    setDone(false)
    setStarted(true)
    updateButtons(true, true, false)
    playingRef.current = true
    setPlaying(true)
    runNext()
  }, [runNext, updateButtons])

  const handleMain = useCallback(() => {
    if (!started || done) {
      const t = inputValue.trim()
      if (!t) {
        setStatusMessage('type a song name to search for')
        setStatusVariant('')
        return
      }
      kickoff(t)
    } else if (playingRef.current) {
      stopPlay(true, false)
    } else {
      startPlay()
    }
  }, [started, done, inputValue, kickoff, stopPlay, startPlay])

  const doStep = useCallback(() => {
    if (!started || done || playingRef.current || stepIdxRef.current >= stepsRef.current.length) return
    const step = stepsRef.current[stepIdxRef.current++]
    applyStep(step)
    if (doneRef.current || stepIdxRef.current >= stepsRef.current.length) {
      doneRef.current = true
      setDone(true)
      updateButtons(false, true, true)
    }
  }, [started, done, applyStep, updateButtons])

  const fullReset = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    playingRef.current = false
    doneRef.current = false
    stepsRef.current = []
    stepIdxRef.current = 0
    targetRef.current = ''
    setInputValue('')
    setCurrentIndex(-1)
    setPassedUntil(undefined)
    setFoundIndex(-1)
    setActiveLines([])
    setPlaying(false)
    setStarted(false)
    setDone(false)
    setStatusMessage('type a song above and press search')
    setStatusVariant('')
    updateButtons(false, false, false)
  }, [updateButtons])

  return {
    array: SONGS,
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
    activeLines,
    getCellClass,
    handleMain,
    doStep,
    fullReset,
  }
}
