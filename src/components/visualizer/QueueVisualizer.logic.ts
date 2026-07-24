export type QueueNodeState =
  | 'idle'
  | 'front'
  | 'rear'
  | 'enqueuing'
  | 'dequeuing'
  | 'peeking'

export interface QueueNode {
  id: string
  value: number
  state: QueueNodeState
}

export interface QueueStep {
  nodes: QueueNode[]
  message: string
  subMessage?: string
}

export const QUEUE_EMPTY_STEP: QueueStep = {
  nodes: [],
  message: 'Select an operation to begin',
  subMessage: 'Enqueue elements to visualize the queue',
}

function toNodes(
  values: number[],
  overrides: Partial<Record<number, QueueNodeState>> = {},
): QueueNode[] {
  return values.map((v, i) => ({
    id: `node-${i}`,
    value: v,
    state:
      overrides[i] ??
      (values.length === 1
        ? 'front'
        : i === 0
          ? 'front'
          : i === values.length - 1
            ? 'rear'
            : 'idle'),
  }))
}

export class QueueSteps {
  static enqueueRear(current: number[], value: number): QueueStep[] {
    const after = [...current, value]
    return [
      {
        nodes: toNodes(current),
        message: `enqueue(${value})`,
        subMessage:
          current.length === 0
            ? 'Queue is empty — placing first element'
            : `Current rear is ${current[current.length - 1]}`,
      },
      {
        nodes: [
          ...toNodes(current).map(n => ({ ...n, state: 'idle' as QueueNodeState })),
          { id: `node-${current.length}`, value, state: 'enqueuing' as QueueNodeState },
        ],
        message: `Placing ${value} at the rear`,
      },
      {
        nodes: toNodes(after),
        message: `${value} enqueued successfully`,
        subMessage: `Queue size: ${after.length}`,
      },
    ]
  }

  static enqueueFront(current: number[], value: number): QueueStep[] {
    const after = [value, ...current]
    return [
      {
        nodes: toNodes(current),
        message: `addFront(${value})`,
        subMessage:
          current.length === 0
            ? 'Queue is empty — placing first element'
            : `Current front is ${current[0]}`,
      },
      {
        nodes: [
          { id: `node-0`, value, state: 'enqueuing' as QueueNodeState },
          ...toNodes(current).map((n, i) => ({
            ...n,
            id: `node-${i + 1}`,
            state: 'idle' as QueueNodeState,
          })),
        ],
        message: `Placing ${value} at the front`,
      },
      {
        nodes: toNodes(after),
        message: `${value} added to front successfully`,
        subMessage: `Queue size: ${after.length}`,
      },
    ]
  }

  static dequeueFront(current: number[]): QueueStep[] {
    if (current.length === 0) {
      return [{ nodes: [], message: 'dequeue() — Queue is empty!', subMessage: 'Cannot dequeue from an empty queue' }]
    }
    const after = current.slice(1)
    return [
      { nodes: toNodes(current), message: `dequeue()`, subMessage: `Front element is ${current[0]}` },
      { nodes: toNodes(current, { 0: 'dequeuing' }), message: `Removing ${current[0]} from the front` },
      {
        nodes: toNodes(after),
        message: `Dequeued ${current[0]}`,
        subMessage:
          after.length > 0
            ? `New front: ${after[0]} — Queue size: ${after.length}`
            : 'Queue is now empty',
      },
    ]
  }

  static dequeueRear(current: number[]): QueueStep[] {
    if (current.length === 0) {
      return [{ nodes: [], message: 'removeRear() — Queue is empty!', subMessage: 'Cannot remove from an empty queue' }]
    }
    const rearValue = current[current.length - 1]
    const after = current.slice(0, -1)
    return [
      { nodes: toNodes(current), message: `removeRear()`, subMessage: `Rear element is ${rearValue}` },
      { nodes: toNodes(current, { [current.length - 1]: 'dequeuing' }), message: `Removing ${rearValue} from the rear` },
      {
        nodes: toNodes(after),
        message: `Removed ${rearValue} from rear`,
        subMessage:
          after.length > 0
            ? `New rear: ${after[after.length - 1]} — Queue size: ${after.length}`
            : 'Queue is now empty',
      },
    ]
  }

  static peekFront(current: number[]): QueueStep[] {
    if (current.length === 0) {
      return [{ nodes: [], message: 'peekFront() — Queue is empty' }]
    }
    return [
      { nodes: toNodes(current, { 0: 'peeking' }), message: `peekFront()`, subMessage: 'Examining the front element' },
      { nodes: toNodes(current), message: `peekFront() returned ${current[0]}`, subMessage: 'Queue is unchanged' },
    ]
  }

  static peekRear(current: number[]): QueueStep[] {
    if (current.length === 0) {
      return [{ nodes: [], message: 'peekRear() — Queue is empty' }]
    }
    const lastIdx = current.length - 1
    return [
      { nodes: toNodes(current, { [lastIdx]: 'peeking' }), message: `peekRear()`, subMessage: 'Examining the rear element' },
      { nodes: toNodes(current), message: `peekRear() returned ${current[lastIdx]}`, subMessage: 'Queue is unchanged' },
    ]
  }
}
