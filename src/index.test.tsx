import * as React from 'react'
import { suspend } from 'suspend-react'
import { vi, it, expect } from 'vitest'
import { render, act } from './index'

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

declare global {
  namespace JSX {
    interface IntrinsicElements {
      element: Partial<{ ref: React.Ref<null>; key: React.Key; children: React.ReactNode }>
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
  let ref!: null

  function Test() {
    lifecycle.push('render')
    React.useImperativeHandle(React.useRef(), () => void lifecycle.push('refCallback'))
    React.useInsertionEffect(() => void lifecycle.push('useInsertionEffect'), [])
    React.useLayoutEffect(() => void lifecycle.push('useLayoutEffect'), [])
    React.useEffect(() => void lifecycle.push('useEffect'), [])
    return (
      <element
        ref={(self) => {
          ref = self
          lifecycle.push('ref')
        }}
      />
    )
  }
  await act(async () => render(<Test />))

  expect(ref).toBe(null)
  expect(lifecycle).toStrictEqual([
    'render',
    'useInsertionEffect',
    'ref',
    'refCallback',
    'useLayoutEffect',
    'useEffect',
  ])
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
