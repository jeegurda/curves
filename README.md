### Bezier curves length

Calculate cubic Bezier curve length by flattening using De Casteljau's algorithm.

It also demonstrates sequential interpolation points. You can traverse (t0).

---

### Build it to /build

and serve with anything

```bash
$ npm i
$ npm run build
$ npx serve ./build
```

### Run it with webpack-dev-serve

```bash
$ npm i
$ npm run serve
```

---

### Force env with force_build var

```bash
# dev build with 50mb js
$ force_build=dev npm run build

# prod build with source maps and shit
$ force_build=prod npm run serve
```

#### Todo:

- quadric curves
- add any high-order curves
- add Legendre-Gauss method for the "true" length
- build with gh
- stretch plot
- scroll plot
