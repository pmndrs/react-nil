import Reconciler from 'react-reconciler/cjs/react-reconciler.production.min'

const roots = new Map()
const emptyObject = {}

const Renderer = Reconciler({
  supportsMutation: true,
  isPrimaryRenderer: true,
  now: () => Date.now(),
  createInstance() {
    return null
  },
  appendInitialChild() {},
  appendChild() {},
  appendChildToContainer() {},
  insertBefore() {},
  removeChild() {},
  removeChildFromContainer() {},
  commitUpdate() {},
  getPublicInstance(instance) {
    return instance
  },
  getRootHostContext() {
    return emptyObject
  },
  getChildHostContext() {
    return emptyObject
  },
  createTextInstance() {},
  finalizeInitialChildren() {
    return false
  },
  prepareUpdate() {
    return emptyObject
  },
  shouldDeprioritizeSubtree() {
    return false
  },
  prepareForCommit() {},
  resetAfterCommit() {},
  shouldSetTextContent() {
    return false
  },
  schedulePassiveEffects(callback) {
    callback()
  },
  cancelPassiveEffects(callback) {},
})

export function render(element, container = 'default') {
  let root = roots.get(container)
  if (!root) roots.set(container, (root = Renderer.createContainer(container)))
  Renderer.updateContainer(element, root, null, undefined)
  return Renderer.getPublicRootInstance(root)
}

export function unmountComponentAtNode(container = 'default') {
  const root = roots.get(container)
  if (root) Renderer.updateContainer(null, root, null, () => roots.delete(container))
}
