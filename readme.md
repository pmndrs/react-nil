<p align="left">
  <a id="cover" href="#cover"><img src="img/nil.svg" alt="A React null renderer" /></a>
</p>

[![Build Status](https://img.shields.io/travis/react-spring/react-nil/master?style=flat&colorA=000000&colorB=000000)](https://travis-ci.org/react-spring/react-nil)
[![Version](https://img.shields.io/npm/v/react-nil?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/react-nil)


```bash
npm install react-nil
```

This is a custom react renderer that only renders `null`, literally.

#### Clearly nothing to see here, moving on ... :)

There are legitimate usecases for null-components, also called logical components, for everything that has to do with, well, logic. For instance, how do you manage side effects and async ops in Node? Most likely you have noticed how hard it is.

But in React all of this comes inbuilt: it's reactive after all, each component has a lifecycle, local state, packs away side-effects in `useEffect`, memoizes calculations in `useMemo`, orchestrates async ops with `suspense`, communicates data via `context`, maintains fast response with optional `concurrency`. And of course — the entire React eco system is available: Redux, Recoil, GraphQl, ...

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
