<p align="left">
  <a id="cover" href="#cover"><img src="img/nil.svg" alt="There are legitimate usecases for null-components, or logical components. A component has a lifecycle, local state, packs side-effects into useEffect, memoizes calculations in useMemo, orchestrates async ops with suspense, communicates via context, maintains fast response with concurrency. And of course — the entire React eco system is available." /></a>
</p>

[![Build Status](https://img.shields.io/travis/react-spring/react-nil/master?style=flat&colorA=000000&colorB=000000)](https://travis-ci.org/react-spring/react-nil)
[![Version](https://img.shields.io/npm/v/react-nil?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/react-nil)


#### Nothing to see here ...

Quite so. This package allows you to bring Reacts high-level component abstraction to Node, or wherever you need it. Why not manage your REST endpoints like routes on the client, users as components with mount/unmount lifecycles, self-contained separation of concern and clean side-effects. Suspense for requests, etc.

You can try a small demo here: https://codesandbox.io/s/react-nil-mvpry

#### How does it work?

```jsx
import React, { useState, useEffect } from "react"
import { render } from "react-nil"

function Foo() {
  const [active, set] = useState(false)
  useEffect(() => void setInterval(() => set((a) => !a), 1000), [])
  console.log(active)

  // This is a logical component without a view, it renders nothing,
  // but it has a real lifecycle and is managed by React regardless.
  return null
}

render(<Foo />)
```
