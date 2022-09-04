import * as React from 'react'
import Reconciler from 'react-reconciler'
import { DefaultEventPriority, ConcurrentRoot } from 'react-reconciler/constants.js'

export interface NilNode<P = {}> {
  type: string
  props: P
  children: NilNode[]
}

export type NilElement<P = {}> = {
  key?: React.Key
  ref?: React.Ref<NilNode<P>>
  children?: React.ReactNode
} & P

interface HostConfig {
  type: string
  props: Record<string, unknown>
  container: {}
  instance: NilNode
  textInstance: NilNode
  suspenseInstance: NilNode
  hydratableInstance: never
  publicInstance: NilNode
  hostContext: null
  updatePayload: null
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
  appendChildToContainer() {},
  insertBefore: (parent, child, beforeChild) => parent.children.splice(parent.children.indexOf(beforeChild), 0, child),
  removeChild: (parent, child) => parent.children.splice(parent.children.indexOf(child), 1),
  removeChildFromContainer() {},
  getPublicInstance: (instance) => instance,
  getRootHostContext: () => null,
  getChildHostContext: () => null,
  shouldSetTextContent: () => false,
  finalizeInitialChildren: () => false,
  prepareUpdate: () => null,
  commitUpdate: (instance, _, __, ___, { ref, key, children, ...props }) => Object.assign(instance.props, props),
  commitTextUpdate: (instance, _, value) => Object.assign(instance.props, { value }),
  prepareForCommit: () => null,
  resetAfterCommit() {},
  preparePortalMount() {},
  clearContainer() {},
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

const root = reconciler.createContainer({}, ConcurrentRoot, null, false, null, '', console.error, null)

/**
 * Renders a React element into a `null` root.
 */
export function render(element: React.ReactNode): void {
  reconciler.updateContainer(element, root, null, undefined)
}

declare module 'react' {
  const unstable_act: (cb: () => Promise<any>) => Promise<any>
}

/**
 * Safely flush async effects when testing, simulating a legacy root.
 */
export const act = React.unstable_act
