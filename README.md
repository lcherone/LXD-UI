# LXD-UI

**WIP:***

A LXD user interface, powered by electron-vue, which will allow you to manage your local LXC containers in a GUI.

**Current features:**

 - List, start and stop containers
 - Shell access into containers (xterm.js), and no need to setup any certificates.

More to come... It my first project playing with electron-vue, contributions/feedback is very welcome.

> testing it...

#### Download

The latest build (.AppImage) can be found in [./builds](./builds) called `lxd-ui-0.0.0-x86_64.AppImage`, just download and run it, or build it like below.

#### Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:9080
npm run dev

# build electron application for production
npm run build

# run unit & end-to-end tests
npm test


# lint all JS/Vue component files in `src/`
npm run lint

```

---

This project was generated with [electron-vue](https://github.com/SimulatedGREG/electron-vue)@[1c165f7](https://github.com/SimulatedGREG/electron-vue/tree/1c165f7c5e56edaf48be0fbb70838a1af26bb015) using [vue-cli](https://github.com/vuejs/vue-cli). Documentation about the original structure can be found [here](https://simulatedgreg.gitbooks.io/electron-vue/content/index.html).
