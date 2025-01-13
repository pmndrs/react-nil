import * as React from 'react'
import { it, expect } from 'vitest'
import { render, createPortal, type HostContainer } from 'react-nil'

// Let React know that we'll be testing effectful components
declare global {
  var IS_REACT_ACT_ENVIRONMENT: boolean
}
globalThis.IS_REACT_ACT_ENVIRONMENT = true

interface ReactProps<T> {
  key?: React.Key
  ref?: React.Ref<T>
  children?: React.ReactNode
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      element: ReactProps<null> & Record<string, unknown>
    }
  }
}

it('should go through lifecycle', async () => {
  const lifecycle: string[] = []

  function Test() {
    lifecycle.push('render')
    React.useImperativeHandle(React.useRef(undefined), () => void lifecycle.push('ref'))
    React.useInsertionEffect(() => void lifecycle.push('useInsertionEffect'), [])
    React.useLayoutEffect(() => void lifecycle.push('useLayoutEffect'), [])
    React.useEffect(() => void lifecycle.push('useEffect'), [])
    return null
  }
  const container: HostContainer = await React.act(async () => render(<Test />))

  expect(lifecycle).toStrictEqual(['render', 'useInsertionEffect', 'ref', 'useLayoutEffect', 'useEffect'])
  expect(container.head).toBe(null)
})

it('should render JSX', async () => {
  let container!: HostContainer

  // Mount
  await React.act(async () => (container = render(<element key={1} foo />)))
  expect(container.head).toStrictEqual({ type: 'element', props: { foo: true }, children: [] })

  // Remount
  await React.act(async () => (container = render(<element bar />)))
  expect(container.head).toStrictEqual({ type: 'element', props: { bar: true }, children: [] })

  // Mutate
  await React.act(async () => (container = render(<element foo />)))
  expect(container.head).toStrictEqual({ type: 'element', props: { foo: true }, children: [] })

  // Child mount
  await React.act(async () => {
    container = render(
      <element foo>
        <element />
      </element>,
    )
  })
  expect(container.head).toStrictEqual({
    type: 'element',
    props: { foo: true },
    children: [{ type: 'element', props: {}, children: [] }],
  })

  // Child unmount
  await React.act(async () => (container = render(<element foo />)))
  expect(container.head).toStrictEqual({ type: 'element', props: { foo: true }, children: [] })

  // Unmount
  await React.act(async () => (container = render(<></>)))
  expect(container.head).toBe(null)

  // Suspense
  const promise = Promise.resolve(null)
  const Test = () => (React.use(promise), (<element bar />))
  await React.act(async () => (container = render(<Test />)))
  expect(container.head).toStrictEqual({ type: 'element', props: { bar: true }, children: [] })

  // Portals
  const portalContainer: HostContainer = { head: null }
  await React.act(async () => (container = render(createPortal(<element />, portalContainer))))
  expect(container.head).toBe(null)
  expect(portalContainer.head).toStrictEqual({ type: 'element', props: {}, children: [] })
})

it('should render text', async () => {
  let container!: HostContainer

  // Mount
  await React.act(async () => (container = render(<>one</>)))
  expect(container.head).toStrictEqual({ type: 'text', props: { value: 'one' }, children: [] })

  // Remount
  await React.act(async () => (container = render(<>one</>)))
  expect(container.head).toStrictEqual({ type: 'text', props: { value: 'one' }, children: [] })

  // Mutate
  await React.act(async () => (container = render(<>two</>)))
  expect(container.head).toStrictEqual({ type: 'text', props: { value: 'two' }, children: [] })

  // Unmount
  await React.act(async () => (container = render(<></>)))
  expect(container.head).toBe(null)

  // Suspense
  const promise = Promise.resolve(null)
  const Test = () => (React.use(promise), (<>three</>))
  await React.act(async () => (container = render(<Test />)))
  expect(container.head).toStrictEqual({ type: 'text', props: { value: 'three' }, children: [] })

  // Portals
  const portalContainer: HostContainer = { head: null }
  await React.act(async () => (container = render(createPortal('four', portalContainer))))
  expect(container.head).toBe(null)
  expect(portalContainer.head).toStrictEqual({ type: 'text', props: { value: 'four' }, children: [] })
})
