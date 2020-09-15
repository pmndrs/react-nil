<p align="left">
  <a id="cover" href="#cover"><img src="img/nil.svg" alt="A React null renderer" /></a>
</p>

[![Build Size](https://img.shields.io/bundlephobia/min/react-nil?label=bunlde%20size&style=flat&colorA=000000&colorB=000000)](https://bundlephobia.com/result?p=react-nil)
[![Build Status](https://img.shields.io/travis/react-spring/react-nil/master?style=flat&colorA=000000&colorB=000000)](https://travis-ci.org/react-spring/react-nil)
[![Version](https://img.shields.io/npm/v/react-nil?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/react-nil)

This is a custom react renderer that renders `null`, literally. It has no native elements. That sounds crazy to you? Well, it still runs *logical* (non-visual) React components, with all the benefits that brings.

```bash
npm install react-nil
```

#### But ... why?

Think of how hard managing async side effects in Node is. In React you can mark and pack away effects into useEffect, memoize via useMemo, there is Suspense to orchestrate async requests, context to communicate data. And of course — the entire React eco system is now at your finger tips: Redux, Recoil, GraphQl, whatever you need.

You can try a small demo here: https://codesandbox.io/s/react-nil-mvpry

#### How does it work?

```jsx
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
