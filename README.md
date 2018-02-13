# LXD-UI

**WIP:***

A LXD user interface, powered by electron-vue, which will allow you to manage local LXC containers in a GUI.

**Current features:**

 - List, start and stop containers
 - Shell access into containers (xterm.js), and no need to setup any certificates.

> More to come... Its my first project with electron-vue and node in general, contributions/feedback is very welcome.

#### Download (.AppImage)

As versions are released, they will be posted here: [https://github.com/lcherone/lxd-ui/releases](https://github.com/lcherone/lxd-ui/releases) 
which you can just download an run, or you can build as shown below.

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

This project was generated with [electron-vue](https://github.com/SimulatedGREG/electron-vue)