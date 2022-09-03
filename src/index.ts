import * as React from 'react'
import Reconciler from 'react-reconciler'
import { DefaultEventPriority, ConcurrentRoot } from 'react-reconciler/constants'

interface HostConfig {
  type: never
  props: never
  container: {}
  instance: null
  textInstance: null
  suspenseInstance: null
  hydratableInstance: never
  publicInstance: null
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
  createInstance: () => null,
  hideInstance() {},
  unhideInstance() {},
  createTextInstance: () => null,
  hideTextInstance() {},
  unhideTextInstance() {},
  appendInitialChild() {},
  appendChild() {},
  appendChildToContainer() {},
  insertBefore() {},
  removeChild() {},
  removeChildFromContainer() {},
  getPublicInstance: (instance) => instance,
  getRootHostContext: () => null,
  getChildHostContext: () => null,
  shouldSetTextContent: () => false,
  finalizeInitialChildren: () => false,
  prepareUpdate: () => null,
  commitUpdate() {},
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
