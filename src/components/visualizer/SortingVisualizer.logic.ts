export interface SortElement {
  value: number
  id: number
}

export type StepType = 'comparison' | 'swap' | 'sorted' | 'complete' | 'divide' | 'merge' | 'partition'

export interface SortStep {
  array: SortElement[]
  stepType: StepType
  comparing?: number[]
  swapping?: number[]
  sorted?: number[]
  merging?: number[]
  activeSublistLeft?: number[]
  activeSublistRight?: number[]
  pivot?: number
  depth?: number
  isMajorStep?: boolean
  message: string
}

export type SortFunction = (arr: SortElement[]) => SortStep[]

export interface SortingAlgorithmDefinition {
  key: string
  name: string
  func: SortFunction
}

const selectionSort = (inputArr: SortElement[]): SortStep[] => {
  const arr = inputArr.map((e) => ({ ...e }))
  const n = arr.length
  const steps: SortStep[] = []

  steps.push({
    array: arr.map((e) => ({ ...e })),
    stepType: 'comparison',
    comparing: [],
    sorted: [],
    isMajorStep: true,
    message:
      'Selection sort finds the minimum of the unsorted region and places it at the front each pass',
  })

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i

    for (let j = i + 1; j < n; j++) {
      steps.push({
        array: arr.map((e) => ({ ...e })),
        stepType: 'comparison',
        comparing: [minIdx, j],
        sorted: Array.from({ length: i }, (_, k) => k),
        message: `Comparing ${arr[minIdx].value} and ${arr[j].value}`,
      })

      if (arr[j].value < arr[minIdx].value) {
        minIdx = j

        steps.push({
          array: arr.map((e) => ({ ...e })),
          stepType: 'comparison',
          comparing: [minIdx],
          sorted: Array.from({ length: i }, (_, k) => k),
          isMajorStep: true,
          message: `New minimum: ${arr[minIdx].value} at index ${minIdx}`,
        })
      }
    }

    if (minIdx !== i) {
      const [a, b] = [arr[i].value, arr[minIdx].value]
      ;[arr[i], arr[minIdx]] = [{ ...arr[minIdx] }, { ...arr[i] }]

      steps.push({
        array: arr.map((e) => ({ ...e })),
        stepType: 'swap',
        swapping: [i, minIdx],
        sorted: Array.from({ length: i + 1 }, (_, k) => k),
        isMajorStep: true,
        message: `Swapped ${a} and ${b}`,
      })
    }

    steps.push({
      array: arr.map((e) => ({ ...e })),
      stepType: 'sorted',
      sorted: Array.from({ length: i + 1 }, (_, k) => k),
      isMajorStep: true,
      message: `${arr[i].value} is now in its final position`,
    })
  }

  steps.push({
    array: arr.map((e) => ({ ...e })),
    stepType: 'complete',
    sorted: Array.from({ length: n }, (_, i) => i),
    isMajorStep: true,
    message: 'Sorting complete!',
  })

  return steps
}

export const selectionSortDefinition: SortingAlgorithmDefinition = {
  key: 'selection',
  name: 'Selection Sort',
  func: selectionSort,
}

const bubbleSort = (inputArr: SortElement[]): SortStep[] => {
  const arr = inputArr.map((e) => ({ ...e }))
  const steps: SortStep[] = []
  const n = arr.length
  const sorted: number[] = []

  for (let i = 0; i < n - 1; i++) {
    let swapped = false

    for (let j = 0; j < n - i - 1; j++) {
      steps.push({
        array: arr.map((e) => ({ ...e })),
        stepType: 'comparison',
        comparing: [j, j + 1],
        sorted: [...sorted],
        message: `Comparing ${arr[j].value} and ${arr[j + 1].value}`,
      })

      if (arr[j].value > arr[j + 1].value) {
        const [a, b] = [arr[j].value, arr[j + 1].value]
        ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
        swapped = true

        steps.push({
          array: arr.map((e) => ({ ...e })),
          stepType: 'swap',
          swapping: [j, j + 1],
          sorted: [...sorted],
          message: `Swapping ${a} and ${b}`,
        })
      }
    }

    sorted.push(n - 1 - i)

    steps.push({
      array: arr.map((e) => ({ ...e })),
      stepType: 'sorted',
      sorted: [...sorted],
      isMajorStep: true,
      message: `Pass ${i + 1} complete — ${arr[n - 1 - i].value} is in its final position`,
    })

    if (!swapped) break
  }

  steps.push({
    array: arr.map((e) => ({ ...e })),
    stepType: 'complete',
    sorted: Array.from({ length: n }, (_, i) => i),
    isMajorStep: true,
    message: 'Array sorted!',
  })

  return steps
}

export const bubbleSortDefinition: SortingAlgorithmDefinition = {
  key: 'bubble',
  name: 'Bubble Sort',
  func: bubbleSort,
}

const mergeSort = (array: SortElement[]): SortStep[] => {
  const arr = array.map((e) => ({ ...e }))
  const steps: SortStep[] = []
  const sortedIndices = new Set<number>()

  const snapshot = () => arr.map((e) => ({ ...e }))

  const mergeSortHelper = (left: number, right: number, depth: number = 0) => {
    if (left >= right) return

    const mid = Math.floor((left + right) / 2)

    const activeSublistLeft = Array.from({ length: mid - left + 1 }, (_, i) => left + i)
    const activeSublistRight = Array.from({ length: right - mid }, (_, i) => mid + 1 + i)

    steps.push({
      array: snapshot(),
      stepType: 'divide',
      activeSublistLeft,
      activeSublistRight,
      depth,
      isMajorStep: true,
      message: `Divide [${left}..${mid}] and [${mid + 1}..${right}] at depth ${depth}`,
    })

    mergeSortHelper(left, mid, depth + 1)
    mergeSortHelper(mid + 1, right, depth + 1)

    let i = left
    let j = mid + 1
    const temp: SortElement[] = []

    while (i <= mid && j <= right) {
      steps.push({
        array: snapshot(),
        stepType: 'comparison',
        comparing: [i, j],
        activeSublistLeft,
        activeSublistRight,
        depth,
        message: `Depth ${depth}: compare ${arr[i].value} (pos ${i}) and ${arr[j].value} (pos ${j})`,
      })

      if (arr[i].value <= arr[j].value) {
        temp.push({ ...arr[i] })
        i++
      } else {
        temp.push({ ...arr[j] })
        j++
      }
    }

    while (i <= mid) { temp.push({ ...arr[i] }); i++ }
    while (j <= right) { temp.push({ ...arr[j] }); j++ }

    for (let k = 0; k < temp.length; k++) {
      const idx = left + k
      if (arr[idx].value !== temp[k].value) {
        arr[idx] = { ...temp[k] }
        steps.push({
          array: snapshot(),
          stepType: 'merge',
          merging: [idx],
          activeSublistLeft,
          activeSublistRight,
          depth,
          message: `Depth ${depth}: place ${arr[idx].value} at position ${idx}`,
        })
      }
    }

    for (let k = left; k <= right; k++) sortedIndices.add(k)

    steps.push({
      array: snapshot(),
      stepType: 'sorted',
      sorted: [...sortedIndices],
      activeSublistLeft,
      activeSublistRight,
      depth,
      isMajorStep: true,
      message: `Subarray [${left}..${right}] is sorted at depth ${depth}`,
    })
  }

  mergeSortHelper(0, arr.length - 1, 0)

  steps.push({
    array: snapshot(),
    stepType: 'complete',
    sorted: Array.from({ length: arr.length }, (_, i) => i),
    isMajorStep: true,
    message: 'Sorting complete!',
  })

  return steps
}

export const mergeSortDefinition: SortingAlgorithmDefinition = {
  key: 'merge',
  name: 'Merge Sort',
  func: mergeSort,
}

const quickSort = (array: SortElement[]): SortStep[] => {
  const arr = array.map((e) => ({ ...e }))
  const steps: SortStep[] = []
  const sortedIndices = new Set<number>()

  const snapshot = () => arr.map((e) => ({ ...e }))

  const swap = (i: number, j: number) => {
    ;[arr[i], arr[j]] = [{ ...arr[j] }, { ...arr[i] }]
  }

  const helper = (left: number, right: number, depth: number = 0) => {
    if (left >= right) {
      if (left === right) sortedIndices.add(left)
      return
    }

    const pivotIndex = right
    const pivotValue = arr[pivotIndex].value
    const activeRange = Array.from({ length: right - left + 1 }, (_, i) => left + i)

    steps.push({
      array: snapshot(),
      stepType: 'partition',
      pivot: pivotIndex,
      activeSublistLeft: activeRange,
      activeSublistRight: activeRange,
      sorted: [...sortedIndices],
      depth,
      isMajorStep: true,
      message: `Depth ${depth}: pivot is ${pivotValue} at index ${pivotIndex}`,
    })

    let i = left
    for (let j = left; j < right; j++) {
      const [valJ, valPivot] = [arr[j].value, pivotValue]

      steps.push({
        array: snapshot(),
        stepType: 'comparison',
        comparing: [j, pivotIndex],
        pivot: pivotIndex,
        sorted: [...sortedIndices],
        depth,
        message: `Depth ${depth}: compare ${valJ} with pivot ${valPivot}`,
      })

      if (arr[j].value < pivotValue) {
        if (i !== j) {
          const [a, b] = [arr[i].value, arr[j].value]
          swap(i, j)

          steps.push({
            array: snapshot(),
            stepType: 'swap',
            swapping: [i, j],
            pivot: pivotIndex,
            sorted: [...sortedIndices],
            depth,
            message: `Depth ${depth}: swap ${a} and ${b}`,
          })
        }
        i++
      }
    }

    if (i !== pivotIndex) {
      const [a, b] = [arr[i].value, arr[pivotIndex].value]
      swap(i, pivotIndex)

      steps.push({
        array: snapshot(),
        stepType: 'swap',
        swapping: [i, pivotIndex],
        pivot: i,
        sorted: [...sortedIndices],
        depth,
        message: `Depth ${depth}: place pivot ${b} at index ${i} (swapped with ${a})`,
      })
    }

    sortedIndices.add(i)

    steps.push({
      array: snapshot(),
      stepType: 'sorted',
      sorted: [...sortedIndices],
      pivot: i,
      depth,
      isMajorStep: true,
      message: `Depth ${depth}: pivot ${pivotValue} is in its final position at index ${i}`,
    })

    helper(left, i - 1, depth + 1)
    helper(i + 1, right, depth + 1)
  }

  helper(0, arr.length - 1)

  steps.push({
    array: snapshot(),
    stepType: 'complete',
    sorted: Array.from({ length: arr.length }, (_, i) => i),
    isMajorStep: true,
    message: 'Sorting complete!',
  })

  return steps
}

export const quickSortDefinition: SortingAlgorithmDefinition = {
  key: 'quick',
  name: 'Quick Sort',
  func: quickSort,
}
