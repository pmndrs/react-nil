<p align="left">
  <a id="cover" href="#cover"><img src="img/nil.svg" alt="A React null renderer" /></a>
</p>

[![Build Size](https://img.shields.io/bundlephobia/min/react-nil?label=bunlde%20size&style=flat&colorA=000000&colorB=000000)](https://bundlephobia.com/result?p=react-nil)
[![Build Status](https://img.shields.io/travis/react-spring/react-nil/master?style=flat&colorA=000000&colorB=000000)](https://travis-ci.org/react-spring/react-nil)
[![Version](https://img.shields.io/npm/v/react-nil?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/react-nil)


```bash
npm install react-nil
```

This is a custom react renderer that only renders `null`, literally.

#### Clearly nothing to see here, moving on ...

Though if you think about it, managing side effects and async ops in Node is hard. In React all of this comes inbuilt and is trivial to manage: you pack away side-effects into useEffect, memoize tasks via useMemo, there is Suspense to orchestrate async ops where component A can await component B and access it by reference, context to communicate data, optional concurrency to maintain fast response. And of course — the entire React eco system is available: Redux, Recoil, GraphQl, whatever you need.

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
