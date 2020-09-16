import Reconciler from 'react-reconciler/cjs/react-reconciler.production.min'

const root = Renderer.createContainer({}, 0, false, null)
const emptyObject = {}

// Behold ... 💩

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

export function render(element) {
  Renderer.updateContainer(element, root, null, undefined)
  return Renderer.getPublicRootInstance(root)
}