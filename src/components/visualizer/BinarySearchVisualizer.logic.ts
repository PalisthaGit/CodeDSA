'use client'

import { useState, useRef, useCallback } from 'react'

const NUMBERS = [3, 7, 12, 19, 24, 31, 38, 45, 52, 61, 74, 88]

const STEP_DELAY: Record<string, number> = {
  init: 700,
  check_mid: 1100,
  go_left: 800,
  go_right: 800,
}

type StepType = 'init' | 'check_mid' | 'found' | 'go_left' | 'go_right' | 'not_found'

type Step = {
  type: StepType
  left: number
  right: number
  mid?: number
}

function buildSteps(target: number): Step[] {
  const arr = NUMBERS
  const n = arr.length
  const steps: Step[] = []
  let left = 0
  let right = n - 1

  steps.push({ type: 'init', left, right })

  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2)
    steps.push({ type: 'check_mid', left, right, mid })

    if (arr[mid] === target) {
      steps.push({ type: 'found', left, right, mid })
      return steps
    } else if (arr[mid] > target) {
      right = mid - 1
      steps.push({ type: 'go_left', left, right, mid })
    } else {
      left = mid + 1
      steps.push({ type: 'go_right', left, right, mid })
    }
  }

  steps.push({ type: 'not_found', left, right })
  return steps
}

export function useBinarySearch() {
  const [inputValue, setInputValue] = useState('')
  const [leftPtr, setLeftPtr] = useState(-1)
  const [rightPtr, setRightPtr] = useState(-1)
  const [midPtr, setMidPtr] = useState<number | undefined>(undefined)
  const [foundIndex, setFoundIndex] = useState(-1)
  const [statusMessage, setStatusMessage] = useState('enter a number above and press search')
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
  const targetRef = useRef(0)
  const doneRef = useRef(false)

  const getCellClass = useCallback((k: number): string => {
    if (foundIndex === k) return 'visCellBox found'
    if (leftPtr < 0) return 'visCellBox'
    if (leftPtr > rightPtr) return 'visCellBox passed'
    if (k < leftPtr || k > rightPtr) return 'visCellBox passed'
    if (midPtr !== undefined && k === midPtr) return 'visCellBox checking'
    return 'visCellBox'
  }, [leftPtr, rightPtr, midPtr, foundIndex])

  const getPointerLabel = useCallback((k: number): string => {
    if (leftPtr < 0 || leftPtr > rightPtr) return ''
    const labels: string[] = []
    if (k === leftPtr) labels.push('L')
    if (midPtr !== undefined && k === midPtr) labels.push('M')
    if (k === rightPtr) labels.push('R')
    return labels.join('')
  }, [leftPtr, rightPtr, midPtr])

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
    const arr = NUMBERS
    setLeftPtr(step.left)
    setRightPtr(step.right)

    if (step.type === 'init') {
      setMidPtr(undefined)
      setFoundIndex(-1)
      setActiveLines([0, 1, 2])
      setStatusMessage(`left = 0, right = ${step.right} — checking all ${arr.length} numbers`)
      setStatusVariant('info')
    } else if (step.type === 'check_mid') {
      setMidPtr(step.mid!)
      setFoundIndex(-1)
      setActiveLines([3, 4, 5])
      setStatusMessage(`mid = ${step.mid} — arr[${step.mid}] = ${arr[step.mid!]} — is it ${targetRef.current}?`)
      setStatusVariant('checking')
    } else if (step.type === 'found') {
      doneRef.current = true
      setDone(true)
      setMidPtr(step.mid!)
      setFoundIndex(step.mid!)
      setActiveLines([5, 6])
      setStatusMessage(`arr[${step.mid}] = ${arr[step.mid!]} — found! return index ${step.mid}`)
      setStatusVariant('found')
    } else if (step.type === 'go_left') {
      setMidPtr(undefined)
      setFoundIndex(-1)
      setActiveLines([7, 8])
      setStatusMessage(`${arr[step.mid!]} > ${targetRef.current} — too high, right = ${step.right}`)
      setStatusVariant('')
    } else if (step.type === 'go_right') {
      setMidPtr(undefined)
      setFoundIndex(-1)
      setActiveLines([9, 10])
      setStatusMessage(`${arr[step.mid!]} < ${targetRef.current} — too low, left = ${step.left}`)
      setStatusVariant('')
    } else if (step.type === 'not_found') {
      doneRef.current = true
      setDone(true)
      setMidPtr(undefined)
      setFoundIndex(-1)
      setActiveLines([11])
      setStatusMessage(`window is empty — ${targetRef.current} is not in the list — return −1`)
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
      timerRef.current = setTimeout(runNext, STEP_DELAY[step.type] ?? 700)
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

  const kickoff = useCallback((target: number) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    playingRef.current = false
    doneRef.current = false
    targetRef.current = target
    stepsRef.current = buildSteps(target)
    stepIdxRef.current = 0
    setLeftPtr(-1)
    setRightPtr(-1)
    setMidPtr(undefined)
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
      const t = parseInt(inputValue.trim(), 10)
      if (isNaN(t)) {
        setStatusMessage('enter a number to search for')
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
    targetRef.current = 0
    setInputValue('')
    setLeftPtr(-1)
    setRightPtr(-1)
    setMidPtr(undefined)
    setFoundIndex(-1)
    setActiveLines([])
    setPlaying(false)
    setStarted(false)
    setDone(false)
    setStatusMessage('enter a number above and press search')
    setStatusVariant('')
    updateButtons(false, false, false)
  }, [updateButtons])

  return {
    array: NUMBERS,
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
    activeLines,
    getCellClass,
    getPointerLabel,
    handleMain,
    doStep,
    fullReset,
  }
}
