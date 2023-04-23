### Bezier curves length

Live: https://jeegurda.github.io/curves/

---

### Build it to /build

and serve with anything

```bash
$ npm i
$ npm run build
$ npx serve ./build  # 'serve' not included, just an example
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

- add curves?
- add Legendre-Gauss method for the "true" length
- stretch plot
- scroll plot (how randomizer bounds should work tho?)
