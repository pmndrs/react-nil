[![Size](https://img.shields.io/bundlephobia/minzip/react-nil?label=gzip&style=flat&colorA=000000&colorB=000000)](https://bundlephobia.com/package/react-nil)
[![Version](https://img.shields.io/npm/v/react-nil?style=flat&colorA=000000&colorB=000000)](https://npmjs.com/package/react-nil)
[![Downloads](https://img.shields.io/npm/dt/react-nil.svg?style=flat&colorA=000000&colorB=000000)](https://npmjs.com/package/react-nil)
[![Twitter](https://img.shields.io/twitter/follow/pmndrs?label=%40pmndrs&style=flat&colorA=000000&colorB=000000&logo=twitter&logoColor=000000)](https://twitter.com/pmndrs)
[![Discord](https://img.shields.io/discord/740090768164651008?style=flat&colorA=000000&colorB=000000&label=discord&logo=discord&logoColor=000000)](https://discord.gg/poimandres)

<p align="left">
  <a id="cover" href="#cover"><img src="img/nil.svg" alt="There are legitimate use cases for null components or logical components. A component has a lifecycle, local state, packs side-effects into useEffect, memoizes calculations in useMemo, orchestrates async ops with suspense, communicates via context, and maintains fast response with concurrency. And, of course — the entire React ecosystem is available." /></a>
</p>

#### Nothing to see here ...

Quite so. This package allows you to bring React's high-level component abstraction to Node or wherever you need it. Why not manage your REST endpoints like routes on the client, users as components with mount/unmount lifecycles, self-contained separation of concern, and clean side effects? Suspense for requests, etc.

You can try a small demo here: https://codesandbox.io/s/react-nil-mvpry

#### How does it work?

```jsx
import * as React from 'react'
import { render } from 'react-nil'

function Foo() {
  const [active, set] = React.useState(false)
  React.useEffect(() => void setInterval(() => set((a) => !a), 1000), [])
  console.log(active)

  // This is a logical component without a view, it renders nothing,
  // but it has a real lifecycle and is managed by React regardless.
  return null
}

render(<Foo />)
```
