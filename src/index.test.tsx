import * as React from 'react'
import { suspend } from 'suspend-react'
import { vi, it, expect } from 'vitest'
import { act, render, createPortal, type HostContainer } from './index'

declare global {
  var IS_REACT_ACT_ENVIRONMENT: boolean
}

// Let React know that we'll be testing effectful components
global.IS_REACT_ACT_ENVIRONMENT = true

// Mock scheduler to test React features
vi.mock('scheduler', () => require('scheduler/unstable_mock'))

// Silence react-dom & react-dom/client mismatch
const logError = global.console.error.bind(global.console.error)
global.console.error = (...args: any[]) => !args[0].startsWith('Warning') && logError(...args)

interface ReactProps {
  key?: React.Key
  ref?: React.Ref<null>
  children?: React.ReactNode
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      element: ReactProps
      parent: ReactProps & { foo: boolean }
      child: ReactProps & { bar: boolean }
    }
  }
}

it('should render JSX', () => {
  render(<React.Fragment />)
  render(<element />)
  render(
    <element>
      <element />
    </element>,
  )
  render(null)
})

it('should go through lifecycle', async () => {
  const lifecycle: string[] = []

  function Test() {
    lifecycle.push('render')
    React.useImperativeHandle(React.useRef(), () => void lifecycle.push('ref'))
    React.useInsertionEffect(() => void lifecycle.push('useInsertionEffect'), [])
    React.useLayoutEffect(() => void lifecycle.push('useLayoutEffect'), [])
    React.useEffect(() => void lifecycle.push('useEffect'), [])
    return null
  }
  await act(async () => render(<Test />))

  expect(lifecycle).toStrictEqual(['render', 'useInsertionEffect', 'ref', 'useLayoutEffect', 'useEffect'])
})

it('should handle suspense', async () => {
  const Test = () => suspend(async () => null, [])
  await act(async () => render(<Test />))
})

it('should handle text', async () => {
  // Mount
  await act(async () => render(<>one</>))
  // Update
  await act(async () => render(<>two</>))
  // Unmount
  await act(async () => render(<></>))
  // Suspense
  const Test = () => suspend(async () => null, [])
  await act(async () => render(<Test />))
})

it('should pass tree as JSON from render', async () => {
  let container!: HostContainer
  await act(async () => {
    container = render(
      <parent foo>
        <child bar>text</child>
      </parent>,
    )
  })

  expect(container.head).toStrictEqual({
    type: 'parent',
    props: { foo: true },
    children: [
      {
        type: 'child',
        props: { bar: true },
        children: [
          {
            type: 'text',
            props: { value: 'text' },
            children: [],
          },
        ],
      },
    ],
  })
})

it('should support multiple concurrent roots', async () => {
  let container1!: HostContainer
  let container2!: HostContainer

  await act(async () => (container1 = render(<parent foo />)))
  await act(async () => (container2 = render(<child bar />)))

  expect(container1.head).toStrictEqual({ type: 'parent', props: { foo: true }, children: [] })
  expect(container2.head).toStrictEqual({ type: 'child', props: { bar: true }, children: [] })
  expect(container1).not.toBe(container2)
})
