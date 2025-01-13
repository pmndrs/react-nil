import * as React from 'react'
import Reconciler from 'react-reconciler'
import {
  // NoEventPriority,
  ContinuousEventPriority,
  DiscreteEventPriority,
  DefaultEventPriority,
  ConcurrentRoot,
} from 'react-reconciler/constants.js'

// @ts-ignore
const __DEV__ = /* @__PURE__ */ (() => typeof process !== 'undefined' && process.env.NODE_ENV !== 'production')()

// TODO: upstream to DefinitelyTyped for React 19
// https://github.com/facebook/react/issues/28956
type EventPriority = number

function createReconciler<
  Type,
  Props,
  Container,
  Instance,
  TextInstance,
  SuspenseInstance,
  HydratableInstance,
  FormInstance,
  PublicInstance,
  HostContext,
  ChildSet,
  TimeoutHandle,
  NoTimeout,
  TransitionStatus,
>(
  config: Omit<
    Reconciler.HostConfig<
      Type,
      Props,
      Container,
      Instance,
      TextInstance,
      SuspenseInstance,
      HydratableInstance,
      PublicInstance,
      HostContext,
      null, // updatePayload
      ChildSet,
      TimeoutHandle,
      NoTimeout
    >,
    'getCurrentEventPriority' | 'prepareUpdate' | 'commitUpdate'
  > & {
    /**
     * This method should mutate the `instance` and perform prop diffing if needed.
     *
     * The `internalHandle` data structure is meant to be opaque. If you bend the rules and rely on its internal fields, be aware that it may change significantly between versions. You're taking on additional maintenance risk by reading from it, and giving up all guarantees if you write something to it.
     */
    commitUpdate?(
      instance: Instance,
      type: Type,
      prevProps: Props,
      nextProps: Props,
      internalHandle: Reconciler.OpaqueHandle,
    ): void

    // Undocumented
    // https://github.com/facebook/react/pull/26722
    NotPendingTransition: TransitionStatus | null
    HostTransitionContext: React.Context<TransitionStatus>
    // https://github.com/facebook/react/pull/28751
    setCurrentUpdatePriority(newPriority: EventPriority): void
    getCurrentUpdatePriority(): EventPriority
    resolveUpdatePriority(): EventPriority
    // https://github.com/facebook/react/pull/28804
    resetFormInstance(form: FormInstance): void
    // https://github.com/facebook/react/pull/25105
    requestPostPaintCallback(callback: (time: number) => void): void
    // https://github.com/facebook/react/pull/26025
    shouldAttemptEagerTransition(): boolean
    // https://github.com/facebook/react/pull/31528
    trackSchedulerEvent(): void
    // https://github.com/facebook/react/pull/31008
    resolveEventType(): null | string
    resolveEventTimeStamp(): number

    /**
     * This method is called during render to determine if the Host Component type and props require some kind of loading process to complete before committing an update.
     */
    maySuspendCommit(type: Type, props: Props): boolean
    /**
     * This method may be called during render if the Host Component type and props might suspend a commit. It can be used to initiate any work that might shorten the duration of a suspended commit.
     */
    preloadInstance(type: Type, props: Props): boolean
    /**
     * This method is called just before the commit phase. Use it to set up any necessary state while any Host Components that might suspend this commit are evaluated to determine if the commit must be suspended.
     */
    startSuspendingCommit(): void
    /**
     * This method is called after `startSuspendingCommit` for each Host Component that indicated it might suspend a commit.
     */
    suspendInstance(type: Type, props: Props): void
    /**
     * This method is called after all `suspendInstance` calls are complete.
     *
     * Return `null` if the commit can happen immediately.
     *
     * Return `(initiateCommit: Function) => Function` if the commit must be suspended. The argument to this callback will initiate the commit when called. The return value is a cancellation function that the Reconciler can use to abort the commit.
     *
     */
    waitForCommitToBeReady(): ((initiateCommit: Function) => Function) | null
  },
): Reconciler.Reconciler<Container, Instance, TextInstance, SuspenseInstance, PublicInstance> {
  const reconciler = Reconciler(config as any)

  reconciler.injectIntoDevTools({
    bundleType: __DEV__ ? 1 : 0,
    rendererPackageName: 'react-nil',
    version: React.version,
  })

  return reconciler as any
}

const NoEventPriority = 0

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
  formInstance: never
  hostContext: {}
  childSet: never
  timeoutHandle: number
  noTimeout: -1
  TransitionStatus: null
}

// react-reconciler exposes some sensitive props. We don't want them exposed in public instances
const REACT_INTERNAL_PROPS = ['ref', 'key', 'children']
function getInstanceProps(props: Reconciler.Fiber['pendingProps']): HostConfig['props'] {
  const instanceProps: HostConfig['props'] = {}

  for (const key in props) {
    if (!REACT_INTERNAL_PROPS.includes(key)) instanceProps[key] = props[key]
  }

  return instanceProps
}

const NO_CONTEXT: HostConfig['hostContext'] = {}

let currentUpdatePriority: number = NoEventPriority

const reconciler = /* @__PURE__ */ createReconciler<
  HostConfig['type'],
  HostConfig['props'],
  HostConfig['container'],
  HostConfig['instance'],
  HostConfig['textInstance'],
  HostConfig['suspenseInstance'],
  HostConfig['hydratableInstance'],
  HostConfig['formInstance'],
  HostConfig['publicInstance'],
  HostConfig['hostContext'],
  HostConfig['childSet'],
  HostConfig['timeoutHandle'],
  HostConfig['noTimeout'],
  HostConfig['TransitionStatus']
>({
  isPrimaryRenderer: false,
  warnsIfNotActing: false,
  supportsMutation: true,
  supportsPersistence: false,
  supportsHydration: false,
  scheduleTimeout: setTimeout,
  cancelTimeout: clearTimeout,
  noTimeout: -1,
  createInstance: (type, props) => ({ type, props: getInstanceProps(props), children: [] }),
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
  getRootHostContext: () => NO_CONTEXT,
  getChildHostContext: () => NO_CONTEXT,
  shouldSetTextContent: () => false,
  finalizeInitialChildren: () => false,
  commitUpdate: (instance, _type, _prevProps, nextProps) => (instance.props = getInstanceProps(nextProps)),
  commitTextUpdate: (instance, _, value) => (instance.props.value = value),
  prepareForCommit: () => null,
  resetAfterCommit() {},
  preparePortalMount() {},
  clearContainer: (container) => (container.head = null),
  getInstanceFromNode: () => null,
  beforeActiveInstanceBlur() {},
  afterActiveInstanceBlur() {},
  detachDeletedInstance() {},
  prepareScopeUpdate() {},
  getInstanceFromScope: () => null,
  shouldAttemptEagerTransition: () => false,
  trackSchedulerEvent: () => {},
  resolveEventType: () => null,
  resolveEventTimeStamp: () => -1.1,
  requestPostPaintCallback() {},
  maySuspendCommit: () => false,
  preloadInstance: () => true, // true indicates already loaded
  startSuspendingCommit() {},
  suspendInstance() {},
  waitForCommitToBeReady: () => null,
  NotPendingTransition: null,
  HostTransitionContext: /* @__PURE__ */ React.createContext<HostConfig['TransitionStatus']>(null),
  setCurrentUpdatePriority(newPriority: number) {
    currentUpdatePriority = newPriority
  },
  getCurrentUpdatePriority() {
    return currentUpdatePriority
  },
  resolveUpdatePriority() {
    if (currentUpdatePriority !== NoEventPriority) return currentUpdatePriority

    switch (typeof window !== 'undefined' && window.event?.type) {
      case 'click':
      case 'contextmenu':
      case 'dblclick':
      case 'pointercancel':
      case 'pointerdown':
      case 'pointerup':
        return DiscreteEventPriority
      case 'pointermove':
      case 'pointerout':
      case 'pointerover':
      case 'pointerenter':
      case 'pointerleave':
      case 'wheel':
        return ContinuousEventPriority
      default:
        return DefaultEventPriority
    }
  },
  resetFormInstance() {},
})

/**
 * Force React to flush any updates inside the provided callback synchronously and immediately.
 */
export function flushSync<R>(fn: () => R): R {
  return reconciler.flushSync(fn)
}

// Report when an error was detected in a previous render
// https://github.com/facebook/react/pull/23207
const logRecoverableError = /* @__PURE__ */ (() =>
  typeof reportError === 'function'
    ? // In modern browsers, reportError will dispatch an error event,
      // emulating an uncaught JavaScript error.
      reportError
    : // In older browsers and test environments, fallback to console.error.
      console.error)()

const container: HostContainer = { head: null }
const root = /* @__PURE__ */ (reconciler as any).createContainer(
  container, // containerInfo
  ConcurrentRoot, // tag
  null, // hydrationCallbacks
  false, // isStrictMode
  null, // concurrentUpdatesByDefaultOverride
  '', // identifierPrefix
  logRecoverableError, // onUncaughtError
  logRecoverableError, // onCaughtError
  logRecoverableError, // onRecoverableError
  null, // transitionCallbacks
)

/**
 * Renders a React element into a `null` root.
 */
export function render(element: React.ReactNode): HostContainer {
  reconciler.updateContainer(element, root, null, undefined)
  return container
}

/**
 * Renders a React element into a foreign {@link HostContainer}.
 */
export function createPortal(element: React.ReactNode, container: HostContainer): React.JSX.Element {
  // @ts-expect-error
  return <>{reconciler.createPortal(element, container, null, null)}</>
}
