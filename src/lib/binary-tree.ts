// ── Types ─────────────────────────────────────────────────────────────────────

export type TreeNodeState =
  | 'idle'
  | 'comparing'
  | 'inserting'
  | 'deleting'
  | 'found'
  | 'unbalanced'
  | 'rotating'
  | 'notFound'
  | 'traversing'
  | 'swapping'
  | 'successor'

export interface VisNode {
  id: string
  value: number
  left: string | null
  right: string | null
  parent: string | null
  state: TreeNodeState
  extra?: string
}

export interface TreeStep {
  nodes: VisNode[]
  rootId: string | null
  message: string
  subMessage?: string
  isMajorStep?: boolean
}

export const TREE_EMPTY_STEP: TreeStep = {
  nodes: [],
  rootId: null,
  message: 'Select an operation to begin',
  subMessage: 'Insert nodes to visualize the tree',
}

// ── BST internal node ─────────────────────────────────────────────────────────

export interface BSTNode {
  id: string
  value: number
  left: BSTNode | null
  right: BSTNode | null
  parent: BSTNode | null
}

let _nodeId = 0
export function newBSTNode(value: number): BSTNode {
  return { id: `bt-${++_nodeId}`, value, left: null, right: null, parent: null }
}

export function bstClone(node: BSTNode | null, parent: BSTNode | null = null): BSTNode | null {
  if (!node) return null
  const n: BSTNode = { id: node.id, value: node.value, left: null, right: null, parent }
  n.left = bstClone(node.left, n)
  n.right = bstClone(node.right, n)
  return n
}

function bstToVis(root: BSTNode | null, states: Record<string, TreeNodeState> = {}): VisNode[] {
  const result: VisNode[] = []
  function visit(node: BSTNode | null) {
    if (!node) return
    result.push({
      id: node.id,
      value: node.value,
      left: node.left?.id ?? null,
      right: node.right?.id ?? null,
      parent: node.parent?.id ?? null,
      state: states[node.id] ?? 'idle',
    })
    visit(node.left)
    visit(node.right)
  }
  visit(root)
  return result
}

function snap(
  root: BSTNode | null,
  states: Record<string, TreeNodeState>,
  message: string,
  opts?: { subMessage?: string; isMajorStep?: boolean },
): TreeStep {
  return {
    nodes: bstToVis(root, states),
    rootId: root?.id ?? null,
    message,
    ...(opts?.subMessage !== undefined && { subMessage: opts.subMessage }),
    ...(opts?.isMajorStep && { isMajorStep: true }),
  }
}

// ── BST mutations ─────────────────────────────────────────────────────────────

export function bstInsertMutate(root: BSTNode | null, value: number): BSTNode {
  const node = newBSTNode(value)
  if (!root) return node
  let cur = root
  while (true) {
    if (value < cur.value) {
      if (!cur.left) { cur.left = node; node.parent = cur; break }
      cur = cur.left
    } else if (value > cur.value) {
      if (!cur.right) { cur.right = node; node.parent = cur; break }
      cur = cur.right
    } else break
  }
  return root
}

export function bstDeleteMutate(root: BSTNode | null, value: number): BSTNode | null {
  function del(node: BSTNode | null, val: number): BSTNode | null {
    if (!node) return null
    if (val < node.value) {
      node.left = del(node.left, val)
      if (node.left) node.left.parent = node
      return node
    }
    if (val > node.value) {
      node.right = del(node.right, val)
      if (node.right) node.right.parent = node
      return node
    }
    if (!node.left) { if (node.right) node.right.parent = node.parent; return node.right }
    if (!node.right) { if (node.left) node.left.parent = node.parent; return node.left }
    let succ = node.right
    while (succ.left) succ = succ.left
    node.value = succ.value
    node.right = del(node.right, succ.value)
    if (node.right) node.right.parent = node
    return node
  }
  return del(root, value)
}

// ── BST step generators ───────────────────────────────────────────────────────

export class BSTSteps {
  static insert(root: BSTNode | null, value: number): TreeStep[] {
    const steps: TreeStep[] = []
    const clone = bstClone(root)

    steps.push(snap(clone, {}, `insert(${value})`, {
      subMessage: clone ? `Comparing from root (${clone.value})` : 'Tree is empty — creating root',
      isMajorStep: true,
    }))

    if (!clone) {
      const single = newBSTNode(value)
      steps.push({ nodes: bstToVis(single, { [single.id]: 'inserting' }), rootId: single.id, message: `${value} is now the root`, isMajorStep: true })
      return steps
    }

    let cur: BSTNode = clone
    const visited: string[] = []

    while (true) {
      visited.push(cur.id)
      const states: Record<string, TreeNodeState> = {}
      visited.forEach(id => (states[id] = 'comparing'))

      if (value === cur.value) {
        steps.push(snap(clone, states, `${value} already exists — no duplicate insert`, { isMajorStep: true }))
        return steps
      }

      const dir = value < cur.value ? 'left' : 'right'
      const child = cur[dir]
      steps.push(snap(clone, states, `${value} ${value < cur.value ? '<' : '>'} ${cur.value} — go ${dir}`))

      if (!child) {
        const newNode = newBSTNode(value)
        cur[dir] = newNode
        newNode.parent = cur
        const finalStates: Record<string, TreeNodeState> = {}
        visited.forEach(id => (finalStates[id] = 'comparing'))
        finalStates[newNode.id] = 'inserting'
        steps.push(snap(clone, finalStates, `Inserted ${value}`, { subMessage: `Placed as ${dir} child of ${cur.value}`, isMajorStep: true }))
        break
      }
      cur = child
    }

    return steps
  }

  static delete(root: BSTNode | null, value: number): TreeStep[] {
    const steps: TreeStep[] = []
    const clone = bstClone(root)

    steps.push(snap(clone, {}, `delete(${value})`, { subMessage: 'Searching for node to delete', isMajorStep: true }))

    if (!clone) {
      steps.push({ nodes: [], rootId: null, message: 'Tree is empty', isMajorStep: true })
      return steps
    }

    let cur: BSTNode | null = clone
    const visited: string[] = []

    while (cur) {
      visited.push(cur.id)
      const states: Record<string, TreeNodeState> = {}
      visited.forEach(id => (states[id] = 'comparing'))

      if (value === cur.value) {
        steps.push(snap(clone, { ...states, [cur.id]: 'found' }, `Found ${value}`, { subMessage: 'Determining deletion case' }))
        break
      }

      steps.push(snap(clone, states, `${value} ${value < cur.value ? '<' : '>'} ${cur.value} — go ${value < cur.value ? 'left' : 'right'}`))
      cur = value < cur.value ? cur.left : cur.right
    }

    if (!cur) {
      steps.push(snap(clone, {}, `${value} not found in tree`, { isMajorStep: true }))
      return steps
    }

    const target = cur

    if (!target.left && !target.right) {
      steps.push(snap(clone, { [target.id]: 'deleting' }, `${value} is a leaf — removing`, { subMessage: 'No children to re-link' }))
      if (target.parent) {
        if (target.parent.left === target) target.parent.left = null
        else target.parent.right = null
      }
      const newRoot = target === clone ? null : clone
      steps.push({ nodes: bstToVis(newRoot), rootId: newRoot?.id ?? null, message: `${value} deleted`, isMajorStep: true })
    } else if (!target.left || !target.right) {
      const child = (target.left ?? target.right)!
      steps.push(snap(clone, { [target.id]: 'deleting', [child.id]: 'inserting' }, `${value} has one child — replacing with ${child.value}`))
      child.parent = target.parent
      if (target.parent) {
        if (target.parent.left === target) target.parent.left = child
        else target.parent.right = child
      }
      const newRoot = target === clone ? child : clone
      steps.push({ nodes: bstToVis(newRoot), rootId: newRoot?.id ?? null, message: `${value} deleted`, isMajorStep: true })
    } else {
      let succ = target.right
      while (succ.left) succ = succ.left
      steps.push(snap(clone, { [target.id]: 'deleting', [succ.id]: 'successor' }, `${value} has two children`, { subMessage: `Inorder successor is ${succ.value}` }))
      const oldVal = target.value
      target.value = succ.value
      steps.push(snap(clone, { [target.id]: 'swapping' }, `Replaced ${oldVal} with successor ${target.value}`, { subMessage: `Now deleting ${target.value} from right subtree` }))
      const succChild = succ.right
      if (succ.parent!.left === succ) succ.parent!.left = succChild
      else succ.parent!.right = succChild
      if (succChild) succChild.parent = succ.parent
      steps.push({ nodes: bstToVis(clone), rootId: clone.id, message: `${oldVal} deleted successfully`, isMajorStep: true })
    }

    return steps
  }

  static search(root: BSTNode | null, value: number): TreeStep[] {
    const steps: TreeStep[] = []
    const clone = bstClone(root)

    steps.push(snap(clone, {}, `search(${value})`, { subMessage: 'Starting from root', isMajorStep: true }))

    if (!clone) {
      steps.push({ nodes: [], rootId: null, message: 'Tree is empty', isMajorStep: true })
      return steps
    }

    let cur: BSTNode | null = clone
    const visited: string[] = []

    while (cur) {
      visited.push(cur.id)
      const states: Record<string, TreeNodeState> = {}
      visited.forEach(id => (states[id] = 'comparing'))

      if (cur.value === value) {
        steps.push(snap(clone, { ...states, [cur.id]: 'found' }, `Found ${value}!`, { isMajorStep: true }))
        return steps
      }

      const dir: 'left' | 'right' = value < cur.value ? 'left' : 'right'
      steps.push(snap(clone, states, `${value} ${value < cur.value ? '<' : '>'} ${cur.value} — go ${dir}`))
      cur = cur[dir]
    }

    steps.push(snap(clone, {}, `${value} not found`, { isMajorStep: true }))
    return steps
  }

  private static _traversal(root: BSTNode | null, order: 'inorder' | 'preorder' | 'postorder', label: string, description: string): TreeStep[] {
    const steps: TreeStep[] = []
    const clone = bstClone(root)

    steps.push(snap(clone, {}, `${order}()`, { subMessage: description, isMajorStep: true }))

    if (!clone) {
      steps.push({ nodes: [], rootId: null, message: 'Tree is empty', isMajorStep: true })
      return steps
    }

    const visitedIds: string[] = []
    const visitedVals: number[] = []

    function visit(node: BSTNode | null) {
      if (!node) return
      if (order === 'preorder') {
        visitedIds.push(node.id); visitedVals.push(node.value)
        const s: Record<string, TreeNodeState> = {}; visitedIds.forEach(id => (s[id] = 'traversing'))
        steps.push(snap(clone, s, `Visiting ${node.value}`, { subMessage: `[${visitedVals.join(', ')}]` }))
      }
      visit(node.left)
      if (order === 'inorder') {
        visitedIds.push(node.id); visitedVals.push(node.value)
        const s: Record<string, TreeNodeState> = {}; visitedIds.forEach(id => (s[id] = 'traversing'))
        steps.push(snap(clone, s, `Visiting ${node.value}`, { subMessage: `[${visitedVals.join(', ')}]` }))
      }
      visit(node.right)
      if (order === 'postorder') {
        visitedIds.push(node.id); visitedVals.push(node.value)
        const s: Record<string, TreeNodeState> = {}; visitedIds.forEach(id => (s[id] = 'traversing'))
        steps.push(snap(clone, s, `Visiting ${node.value}`, { subMessage: `[${visitedVals.join(', ')}]` }))
      }
    }

    visit(clone)

    const finalStates: Record<string, TreeNodeState> = {}
    visitedIds.forEach(id => (finalStates[id] = 'traversing'))
    steps.push(snap(clone, finalStates, `${label} complete`, { subMessage: `[${visitedVals.join(', ')}]`, isMajorStep: true }))
    return steps
  }

  static inorder(root: BSTNode | null): TreeStep[] { return BSTSteps._traversal(root, 'inorder', 'Inorder traversal', 'Left → Root → Right') }
  static preorder(root: BSTNode | null): TreeStep[] { return BSTSteps._traversal(root, 'preorder', 'Preorder traversal', 'Root → Left → Right') }
  static postorder(root: BSTNode | null): TreeStep[] { return BSTSteps._traversal(root, 'postorder', 'Postorder traversal', 'Left → Right → Root') }

  static levelOrder(root: BSTNode | null): TreeStep[] {
    const steps: TreeStep[] = []
    const clone = bstClone(root)

    steps.push(snap(clone, {}, 'levelOrder()', { subMessage: 'Visit nodes level by level', isMajorStep: true }))
    if (!clone) { steps.push({ nodes: [], rootId: null, message: 'Tree is empty', isMajorStep: true }); return steps }

    const queue: BSTNode[] = [clone]
    const visitedIds: string[] = []
    const visitedVals: number[] = []

    while (queue.length > 0) {
      const node = queue.shift()!
      visitedIds.push(node.id); visitedVals.push(node.value)
      const s: Record<string, TreeNodeState> = {}; visitedIds.forEach(id => (s[id] = 'traversing'))
      steps.push(snap(clone, s, `Visiting ${node.value}`, { subMessage: `[${visitedVals.join(', ')}]` }))
      if (node.left) queue.push(node.left)
      if (node.right) queue.push(node.right)
    }

    const finalStates: Record<string, TreeNodeState> = {}
    visitedIds.forEach(id => (finalStates[id] = 'traversing'))
    steps.push(snap(clone, finalStates, 'Level-order traversal complete', { subMessage: `[${visitedVals.join(', ')}]`, isMajorStep: true }))
    return steps
  }

  static dfs(root: BSTNode | null): TreeStep[] {
    const steps: TreeStep[] = []
    const clone = bstClone(root)

    steps.push(snap(clone, {}, 'dfs()', { subMessage: 'Iterative DFS using a stack', isMajorStep: true }))
    if (!clone) { steps.push({ nodes: [], rootId: null, message: 'Tree is empty', isMajorStep: true }); return steps }

    const stack: BSTNode[] = [clone]
    const visitedIds: string[] = []
    const visitedVals: number[] = []

    while (stack.length > 0) {
      const node = stack.pop()!
      visitedIds.push(node.id); visitedVals.push(node.value)
      const s: Record<string, TreeNodeState> = {}; visitedIds.forEach(id => (s[id] = 'traversing'))
      steps.push(snap(clone, s, `Popped ${node.value} from stack`, { subMessage: `Visited: [${visitedVals.join(', ')}]` }))
      if (node.right) stack.push(node.right)
      if (node.left) stack.push(node.left)
    }

    const finalStates: Record<string, TreeNodeState> = {}
    visitedIds.forEach(id => (finalStates[id] = 'traversing'))
    steps.push(snap(clone, finalStates, 'DFS complete', { subMessage: `[${visitedVals.join(', ')}]`, isMajorStep: true }))
    return steps
  }
}
