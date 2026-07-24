export type HashTableType = 'linear' | 'quadratic' | 'double' | 'chaining'

export type SlotState =
  | 'idle'
  | 'occupied'
  | 'deleted'
  | 'probing'
  | 'found'
  | 'notFound'
  | 'inserted'
  | 'rehashing'
  | 'hashed'

export interface HashSlot {
  index: number
  key: number | null
  isDeleted: boolean
  state: SlotState
}

export interface ChainNode {
  key: number
  state: SlotState
}

export interface HashBucket {
  index: number
  chain: ChainNode[]
  state: SlotState
}

export interface HashStep {
  tableType: HashTableType
  slots?: HashSlot[]
  buckets?: HashBucket[]
  hashIndex?: number
  tableSize: number
  count: number
  message: string
}

function h1(key: number, size: number): number {
  return ((key % size) + size) % size
}

function h2(key: number, size: number): number {
  return 1 + (((key % (size - 1)) + (size - 1)) % (size - 1))
}

function probeIndex(base: number, i: number, key: number, size: number, type: HashTableType): number {
  if (type === 'linear') return (base + i) % size
  if (type === 'quadratic') return (base + i * i) % size
  return (base + i * h2(key, size)) % size
}

function isPrime(n: number): boolean {
  if (n < 2) return false
  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i === 0) return false
  }
  return true
}

function nextPrime(n: number): number {
  let p = Math.max(n, 2)
  while (!isPrime(p)) p++
  return p
}

const DELETED = Symbol('deleted')
type RawSlot = number | null | typeof DELETED

export class OpenSteps {
  private slots: RawSlot[]
  private size: number
  private count: number
  readonly type: Exclude<HashTableType, 'chaining'>

  constructor(size = 7, type: Exclude<HashTableType, 'chaining'> = 'linear') {
    this.size = size
    this.count = 0
    this.type = type
    this.slots = new Array(size).fill(null)
  }

  private toSlots(overrides: Map<number, SlotState>): HashSlot[] {
    return this.slots.map((raw, i) => {
      const defaultState: SlotState =
        raw === null ? 'idle' : raw === DELETED ? 'deleted' : 'occupied'
      return {
        index: i,
        key: raw === null || raw === DELETED ? null : (raw as number),
        isDeleted: raw === DELETED,
        state: overrides.get(i) ?? defaultState,
      }
    })
  }

  private step(overrides: Map<number, SlotState>, hashIndex: number | undefined, message: string): HashStep {
    return {
      tableType: this.type,
      slots: this.toSlots(overrides),
      hashIndex,
      tableSize: this.size,
      count: this.count,
      message,
    }
  }

  insert(key: number): HashStep[] {
    const steps: HashStep[] = []

    if ((this.count + 1) / this.size > 0.7) {
      steps.push(...this.rehash())
    }

    const base = h1(key, this.size)
    steps.push(this.step(new Map([[base, 'hashed']]), base, `insert(${key}) → h(${key}) = ${key} % ${this.size} = ${base}`))

    let firstDeleted: number | null = null

    for (let i = 0; i < this.size; i++) {
      const idx = probeIndex(base, i, key, this.size, this.type)
      const raw = this.slots[idx]

      if (raw === null) {
        const target = firstDeleted !== null ? firstDeleted : idx
        this.slots[target] = key
        this.count++
        steps.push(this.step(new Map([[target, 'inserted']]), base, `slot ${target} is empty — inserted ${key}`))
        return steps
      }

      if (raw === DELETED) {
        if (firstDeleted === null) firstDeleted = idx
        steps.push(this.step(new Map([[idx, 'probing']]), base, `slot ${idx} has tombstone — continue probing`))
        continue
      }

      if (raw === key) {
        steps.push(this.step(new Map([[idx, 'found']]), base, `${key} already exists at slot ${idx}`))
        return steps
      }

      steps.push(this.step(new Map([[idx, 'probing']]), base, `collision at slot ${idx} (${raw}) — probe +${i + 1}`))
    }

    if (firstDeleted !== null) {
      this.slots[firstDeleted] = key
      this.count++
      steps.push(this.step(new Map([[firstDeleted, 'inserted']]), base, `inserted ${key} at slot ${firstDeleted} (reusing tombstone)`))
    }

    return steps
  }

  search(key: number): HashStep[] {
    const steps: HashStep[] = []
    const base = h1(key, this.size)
    steps.push(this.step(new Map([[base, 'hashed']]), base, `search(${key}) → h(${key}) = ${base}`))

    for (let i = 0; i < this.size; i++) {
      const idx = probeIndex(base, i, key, this.size, this.type)
      const raw = this.slots[idx]

      if (raw === null) {
        steps.push(this.step(new Map([[idx, 'notFound']]), base, `slot ${idx} is empty — ${key} not found`))
        return steps
      }

      if (raw === DELETED) {
        steps.push(this.step(new Map([[idx, 'probing']]), base, `slot ${idx} is a tombstone — keep probing`))
        continue
      }

      if (raw === key) {
        steps.push(this.step(new Map([[idx, 'found']]), base, `found ${key} at slot ${idx}!`))
        return steps
      }

      steps.push(this.step(new Map([[idx, 'probing']]), base, `slot ${idx} has ${raw}, not ${key} — probe +${i + 1}`))
    }

    steps.push(this.step(new Map(), base, `${key} not found after full probe sequence`))
    return steps
  }

  delete(key: number): HashStep[] {
    const steps: HashStep[] = []
    const base = h1(key, this.size)
    steps.push(this.step(new Map([[base, 'hashed']]), base, `delete(${key}) → h(${key}) = ${base}`))

    for (let i = 0; i < this.size; i++) {
      const idx = probeIndex(base, i, key, this.size, this.type)
      const raw = this.slots[idx]

      if (raw === null) {
        steps.push(this.step(new Map([[idx, 'notFound']]), base, `slot ${idx} is empty — ${key} not found`))
        return steps
      }

      if (raw === DELETED) {
        steps.push(this.step(new Map([[idx, 'probing']]), base, `slot ${idx} is a tombstone — keep probing`))
        continue
      }

      if (raw === key) {
        this.slots[idx] = DELETED
        this.count--
        steps.push(this.step(new Map([[idx, 'deleted']]), base, `deleted ${key} at slot ${idx} — marked as tombstone`))
        return steps
      }

      steps.push(this.step(new Map([[idx, 'probing']]), base, `slot ${idx} has ${raw}, not ${key} — probe +${i + 1}`))
    }

    steps.push(this.step(new Map(), base, `${key} not found`))
    return steps
  }

  rehash(): HashStep[] {
    const steps: HashStep[] = []
    const oldSize = this.size
    const newSize = nextPrime(oldSize * 2 + 1)

    const rehashOverrides = new Map<number, SlotState>()
    for (let i = 0; i < this.size; i++) {
      if (this.slots[i] !== null && this.slots[i] !== DELETED) rehashOverrides.set(i, 'rehashing')
    }
    steps.push(this.step(rehashOverrides, undefined, `load factor exceeded threshold — rehashing from size ${oldSize} to ${newSize}`))

    const oldSlots = [...this.slots]
    this.size = newSize
    this.slots = new Array(newSize).fill(null)
    this.count = 0

    for (const raw of oldSlots) {
      if (raw !== null && raw !== DELETED) {
        const k = raw as number
        const base = h1(k, this.size)
        for (let i = 0; i < this.size; i++) {
          const idx = probeIndex(base, i, k, this.size, this.type)
          if (this.slots[idx] === null) {
            this.slots[idx] = k
            this.count++
            break
          }
        }
      }
    }

    const insertedOverrides = new Map<number, SlotState>()
    for (let i = 0; i < this.size; i++) {
      if (this.slots[i] !== null) insertedOverrides.set(i, 'inserted')
    }
    steps.push(this.step(insertedOverrides, undefined, `rehash complete — new table size: ${newSize}`))

    return steps
  }

  getInitialStep(): HashStep {
    return this.step(new Map(), undefined, 'Select an operation to begin')
  }
}

export class ChainingSteps {
  private buckets: number[][]
  private size: number
  private count: number

  constructor(size = 7) {
    this.size = size
    this.count = 0
    this.buckets = Array.from({ length: size }, () => [])
  }

  private toBuckets(
    bucketOverrides: Map<number, SlotState>,
    nodeOverrides: Map<string, SlotState>,
  ): HashBucket[] {
    return this.buckets.map((chain, i) => ({
      index: i,
      chain: chain.map(key => ({
        key,
        state: nodeOverrides.get(`${i}-${key}`) ?? 'occupied',
      })),
      state: bucketOverrides.get(i) ?? (chain.length > 0 ? 'occupied' : 'idle'),
    }))
  }

  private step(
    bucketOverrides: Map<number, SlotState>,
    nodeOverrides: Map<string, SlotState>,
    hashIndex: number | undefined,
    message: string,
  ): HashStep {
    return {
      tableType: 'chaining',
      buckets: this.toBuckets(bucketOverrides, nodeOverrides),
      hashIndex,
      tableSize: this.size,
      count: this.count,
      message,
    }
  }

  insert(key: number): HashStep[] {
    const steps: HashStep[] = []

    if ((this.count + 1) / this.size > 1.0) {
      steps.push(...this.rehash())
    }

    const idx = h1(key, this.size)
    steps.push(this.step(new Map([[idx, 'hashed']]), new Map(), idx, `insert(${key}) → h(${key}) = ${key} % ${this.size} = ${idx}`))

    for (const k of this.buckets[idx]) {
      if (k === key) {
        steps.push(this.step(
          new Map([[idx, 'found']]),
          new Map([[`${idx}-${key}`, 'found']]),
          idx,
          `${key} already in bucket ${idx}`,
        ))
        return steps
      }
    }

    this.buckets[idx].push(key)
    this.count++
    steps.push(this.step(
      new Map([[idx, 'inserted']]),
      new Map([[`${idx}-${key}`, 'inserted']]),
      idx,
      `inserted ${key} at bucket ${idx} (chain length: ${this.buckets[idx].length})`,
    ))
    return steps
  }

  search(key: number): HashStep[] {
    const steps: HashStep[] = []
    const idx = h1(key, this.size)
    steps.push(this.step(new Map([[idx, 'hashed']]), new Map(), idx, `search(${key}) → h(${key}) = ${idx}`))

    for (const k of this.buckets[idx]) {
      if (k === key) {
        steps.push(this.step(
          new Map([[idx, 'found']]),
          new Map([[`${idx}-${key}`, 'found']]),
          idx,
          `found ${key} in bucket ${idx}!`,
        ))
        return steps
      }
      steps.push(this.step(
        new Map([[idx, 'probing']]),
        new Map([[`${idx}-${k}`, 'probing']]),
        idx,
        `${k} ≠ ${key} — continue scanning chain`,
      ))
    }

    steps.push(this.step(new Map([[idx, 'notFound']]), new Map(), idx, `${key} not found in bucket ${idx}`))
    return steps
  }

  delete(key: number): HashStep[] {
    const steps: HashStep[] = []
    const idx = h1(key, this.size)
    steps.push(this.step(new Map([[idx, 'hashed']]), new Map(), idx, `delete(${key}) → h(${key}) = ${idx}`))

    const pos = this.buckets[idx].indexOf(key)
    if (pos === -1) {
      steps.push(this.step(new Map([[idx, 'notFound']]), new Map(), idx, `${key} not found in bucket ${idx}`))
      return steps
    }

    this.buckets[idx].splice(pos, 1)
    this.count--
    steps.push(this.step(new Map([[idx, 'deleted']]), new Map(), idx, `removed ${key} from bucket ${idx}`))
    return steps
  }

  rehash(): HashStep[] {
    const steps: HashStep[] = []
    const oldSize = this.size
    const newSize = nextPrime(oldSize * 2 + 1)

    const rehashOverrides = new Map<number, SlotState>()
    for (let i = 0; i < this.size; i++) {
      if (this.buckets[i].length > 0) rehashOverrides.set(i, 'rehashing')
    }
    steps.push(this.step(rehashOverrides, new Map(), undefined, `load factor exceeded threshold — rehashing from size ${oldSize} to ${newSize}`))

    const oldBuckets = this.buckets.map(b => [...b])
    this.size = newSize
    this.buckets = Array.from({ length: newSize }, () => [])
    this.count = 0

    for (const chain of oldBuckets) {
      for (const key of chain) {
        const idx = h1(key, this.size)
        this.buckets[idx].push(key)
        this.count++
      }
    }

    const insertedOverrides = new Map<number, SlotState>()
    for (let i = 0; i < this.size; i++) {
      if (this.buckets[i].length > 0) insertedOverrides.set(i, 'inserted')
    }
    steps.push(this.step(insertedOverrides, new Map(), undefined, `rehash complete — new table size: ${newSize}`))

    return steps
  }

  getInitialStep(): HashStep {
    return this.step(new Map(), new Map(), undefined, 'Select an operation to begin')
  }
}
