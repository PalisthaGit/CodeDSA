'use client'

import { useState, useRef, useCallback, useMemo } from 'react'
import type { GraphData, GraphStep, GraphAlgorithmOptions, NodeState } from './graph.types'
import { graphRegistry } from './graph.registry'

export const DEFAULT_GRAPH: GraphData = {
  nodes: [
    { id: 'A', x: 55,  y: 150 },
    { id: 'B', x: 165, y: 55  },
    { id: 'C', x: 165, y: 245 },
    { id: 'D', x: 280, y: 150 },
    { id: 'E', x: 395, y: 55  },
    { id: 'F', x: 395, y: 245 },
    { id: 'G', x: 505, y: 150 },
  ],
  edges: [
    { id: 'AB', from: 'A', to: 'B', weight: 2 },
    { id: 'AC', from: 'A', to: 'C', weight: 3 },
    { id: 'BD', from: 'B', to: 'D', weight: 3 },
    { id: 'CD', from: 'C', to: 'D', weight: 2 },
    { id: 'BE', from: 'B', to: 'E', weight: 5 },
    { id: 'DE', from: 'D', to: 'E', weight: 2 },
    { id: 'DF', from: 'D', to: 'F', weight: 3 },
    { id: 'EG', from: 'E', to: 'G', weight: 2 },
    { id: 'FG', from: 'F', to: 'G', weight: 4 },
  ],
}

export function useGraphVisualizer(algorithmKey: string) {
  const def = graphRegistry[algorithmKey]
  const graph = def?.graph ?? DEFAULT_GRAPH
  const defaultStart = graph.nodes[0]?.id ?? 'A'
  const defaultEnd = graph.nodes.at(-1)?.id ?? 'G'

  const [steps, setSteps] = useState<GraphStep[]>([])
  const [stepIdx, setStepIdx] = useState(-1)
  const [playing, setPlaying] = useState(false)
  const [started, setStarted] = useState(false)
  const [done, setDone] = useState(false)
  const [startNodeId, setStartNodeId] = useState(defaultStart)
  const [endNodeId, setEndNodeId] = useState(defaultEnd)

  const playingRef = useRef(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const stepIdxRef = useRef(-1)
  const stepsRef = useRef<GraphStep[]>([])
  const doneRef = useRef(false)

  const currentStep = steps[stepIdx] ?? null

  const displayNodeStates = useMemo((): Record<string, NodeState> => {
    if (!currentStep) return {}
    const states = { ...currentStep.nodeStates }
    if (currentStep.stepType === 'path' || currentStep.stepType === 'complete') {
      for (const id of currentStep.metadata.path) states[id] = 'path'
    }
    return states
  }, [currentStep])

  const stopPlay = useCallback((isDone: boolean) => {
    playingRef.current = false
    setPlaying(false)
    if (timerRef.current) clearTimeout(timerRef.current)
    if (isDone) { doneRef.current = true; setDone(true) }
  }, [])

  const runNext = useCallback(() => {
    const idx = stepIdxRef.current + 1
    if (!playingRef.current || idx >= stepsRef.current.length) {
      stopPlay(idx >= stepsRef.current.length)
      return
    }
    stepIdxRef.current = idx
    setStepIdx(idx)
    const step = stepsRef.current[idx]
    if (idx + 1 < stepsRef.current.length) {
      timerRef.current = setTimeout(runNext, step.isMajorStep ? 950 : 450)
    } else {
      stopPlay(true)
    }
  }, [stopPlay])

  const startPlay = useCallback(() => {
    if (doneRef.current || stepIdxRef.current >= stepsRef.current.length - 1) return
    playingRef.current = true
    setPlaying(true)
    runNext()
  }, [runNext])

  const kickoff = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (!def) return
    const options: GraphAlgorithmOptions = { startNodeId, endNodeId }
    const newSteps = def.func(graph, options)
    stepsRef.current = newSteps
    stepIdxRef.current = -1
    doneRef.current = false
    setSteps(newSteps)
    setStepIdx(-1)
    setDone(false)
    setStarted(true)
    playingRef.current = true
    setPlaying(true)
    runNext()
  }, [algorithmKey, startNodeId, endNodeId, runNext])

  const kickoffStep = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (!def) return
    const options: GraphAlgorithmOptions = { startNodeId, endNodeId }
    const newSteps = def.func(graph, options)
    stepsRef.current = newSteps
    stepIdxRef.current = -1
    doneRef.current = false
    setSteps(newSteps)
    setStepIdx(-1)
    setDone(false)
    setStarted(true)
    playingRef.current = false
    setPlaying(false)
  }, [algorithmKey, startNodeId, endNodeId, def, graph])

  const handleMain = useCallback(() => {
    if (!started || done) kickoff()
    else if (playingRef.current) stopPlay(false)
    else startPlay()
  }, [started, done, kickoff, stopPlay, startPlay])

  const doStep = useCallback(() => {
    if (done || playingRef.current) return
    if (!started) {
      kickoffStep()
      const idx = 0
      stepIdxRef.current = idx
      setStepIdx(idx)
      return
    }
    const idx = stepIdxRef.current + 1
    if (idx >= stepsRef.current.length) return
    stepIdxRef.current = idx
    setStepIdx(idx)
    if (idx >= stepsRef.current.length - 1) { doneRef.current = true; setDone(true) }
  }, [started, done, kickoffStep])

  const fullReset = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    playingRef.current = false
    doneRef.current = false
    stepsRef.current = []
    stepIdxRef.current = -1
    setSteps([])
    setStepIdx(-1)
    setPlaying(false)
    setStarted(false)
    setDone(false)
  }, [])

  const algorithmCategory = def?.category ?? 'pathfinding'
  const idleMessage = algorithmCategory === 'spanning-tree' || algorithmCategory === 'traversal'
    ? 'choose a start node, then press ▶ play or step →'
    : 'choose start and end nodes, then press ▶ play or step →'

  return {
    graph,
    algoName: def?.name ?? algorithmKey,
    algorithmCategory,
    nodeStates: displayNodeStates,
    edgeStates: currentStep?.edgeStates ?? {},
    message: currentStep?.message ?? idleMessage,
    subMessage: currentStep?.subMessage ?? '',
    stepType: currentStep?.stepType,
    currentStep,
    playing,
    started,
    done,
    startNodeId,
    endNodeId,
    setStartNodeId,
    setEndNodeId,
    mainBtnLabel: !started || done ? 'Play' : playing ? 'Pause' : 'Play',
    stepDim: done || playing,
    resetDim: !started,
    handleMain,
    doStep,
    fullReset,
    stepIdx,
    totalSteps: steps.length,
  }
}
