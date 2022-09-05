import * as React from 'react'
import Reconciler from 'react-reconciler'
import { DefaultEventPriority, ConcurrentRoot } from 'react-reconciler/constants.js'

export interface NilNode<P = Record<string, unknown>> {
  type: string
  props: P
  children: NilNode[]
}

export interface HostContainer {
  head: NilNode | null
}

interface HostConfig {
  type: string
  props: Record<string, unknown>
  container: HostContainer
  instance: NilNode
  textInstance: NilNode
  suspenseInstance: NilNode
  hydratableInstance: never
  publicInstance: null
  hostContext: null
  updatePayload: {}
  childSet: never
  timeoutHandle: number
  noTimeout: -1
}

const reconciler = Reconciler<
  HostConfig['type'],
  HostConfig['props'],
  HostConfig['container'],
  HostConfig['instance'],
  HostConfig['textInstance'],
  HostConfig['suspenseInstance'],
  HostConfig['hydratableInstance'],
  HostConfig['publicInstance'],
  HostConfig['hostContext'],
  HostConfig['updatePayload'],
  HostConfig['childSet'],
  HostConfig['timeoutHandle'],
  HostConfig['noTimeout']
>({
  isPrimaryRenderer: false,
  supportsMutation: true,
  supportsPersistence: false,
  supportsHydration: false,
  now: Date.now,
  scheduleTimeout: setTimeout,
  cancelTimeout: clearTimeout,
  noTimeout: -1,
  createInstance: (type, { ref, key, children, ...props }) => ({ type, props, children: [] }),
  hideInstance() {},
  unhideInstance() {},
  createTextInstance: (value) => ({ type: 'text', props: { value }, children: [] }),
  hideTextInstance() {},
  unhideTextInstance() {},
  appendInitialChild: (parent, child) => parent.children.push(child),
  appendChild: (parent, child) => parent.children.push(child),
  appendChildToContainer: (container, child) => (container.head = child),
  insertBefore: (parent, child, beforeChild) => parent.children.splice(parent.children.indexOf(beforeChild), 0, child),
  removeChild: (parent, child) => parent.children.splice(parent.children.indexOf(child), 1),
  removeChildFromContainer: (container) => (container.head = null),
  getPublicInstance: () => null,
  getRootHostContext: () => null,
  getChildHostContext: () => null,
  shouldSetTextContent: () => false,
  finalizeInitialChildren: () => false,
  prepareUpdate: () => ({}),
  commitUpdate: (instance, _, __, ___, { ref, key, children, ...props }) => (instance.props = props),
  commitTextUpdate: (instance, _, value) => (instance.props.value = value),
  prepareForCommit: () => null,
  resetAfterCommit() {},
  preparePortalMount() {},
  clearContainer: (container) => (container.head = null),
  // @ts-ignore
  getCurrentEventPriority: () => DefaultEventPriority,
  beforeActiveInstanceBlur: () => {},
  afterActiveInstanceBlur: () => {},
  detachDeletedInstance: () => {},
})

// Inject renderer meta into devtools
const isProd = typeof process === 'undefined' || process.env?.['NODE_ENV'] === 'production'
reconciler.injectIntoDevTools({
  findFiberByHostInstance: () => null,
  bundleType: isProd ? 0 : 1,
  version: React.version,
  rendererPackageName: 'react-nil',
})

const container: HostContainer = { head: null }
const root = reconciler.createContainer(container, ConcurrentRoot, null, false, null, '', console.error, null)

/**
 * Renders a React element into a `null` root.
 */
export function render(element: React.ReactNode): HostContainer {
  reconciler.updateContainer(element, root, null, undefined)
  return container
}

declare module 'react' {
  const unstable_act: (cb: () => Promise<any>) => Promise<any>
}

/**
 * Safely flush async effects when testing, simulating a legacy root.
 */
export const act = React.unstable_act
