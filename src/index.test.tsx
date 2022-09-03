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

it('should render JSX', () => {
  render(<React.Fragment />)
})

it('should go through lifecycle', async () => {
  const lifecycle: string[] = []

  function Test() {
    lifecycle.push('render')
    const ref = React.useRef()
    React.useImperativeHandle(ref, () => void lifecycle.push('ref'))
    React.useInsertionEffect(() => void lifecycle.push('useInsertionEffect'), [])
    React.useLayoutEffect(() => void lifecycle.push('useLayoutEffect'), [])
    React.useEffect(() => void lifecycle.push('useEffect'), [])
    return null
  }
  await act(async () => render(<Test />))

  expect(lifecycle).toStrictEqual(['render', 'useInsertionEffect', 'ref', 'useLayoutEffect', 'useEffect'])
})

it('should handle suspense', async () => {
  const lifecycle: string[] = []

  function Test() {
    lifecycle.push('render')
    const ref = React.useRef()
    React.useImperativeHandle(ref, () => void lifecycle.push('ref'))
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
