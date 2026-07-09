export interface SortElement {
  value: number
  id: number
}

export type StepType = 'comparison' | 'swap' | 'sorted' | 'complete'

export interface SortStep {
  array: SortElement[]
  stepType: StepType
  comparing?: number[]
  swapping?: number[]
  sorted?: number[]
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
