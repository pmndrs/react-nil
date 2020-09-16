<p align="left">
  <a id="cover" href="#cover"><img src="img/nil.svg" alt="A React null renderer" /></a>
</p>

[![Build Status](https://img.shields.io/travis/react-spring/react-nil/master?style=flat&colorA=000000&colorB=000000)](https://travis-ci.org/react-spring/react-nil)
[![Version](https://img.shields.io/npm/v/react-nil?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/react-nil)


#### Clearly nothing to see here ... :)

Quite so. This package allows you to bring Reacts high level component abstraction to Node, or whereever you need it. Why not manage your REST endpoints like routes on the client, users as components with unmount/unmount lifecycles, self-contained logic and clean side-effects. Suspense for requests, etc.

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
