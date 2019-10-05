const Koa = require('koa')
const koaStatic = require('koa-static')
const webpack = require('webpack')
const koaWebpack = require('koa-webpack')
const webpackConfig = require('./webpack.config')

const app = new Koa()

async function start() {
  const compiler = webpack(webpackConfig)
  try {
    const middleware = await koaWebpack({ compiler });
    app.use(middleware)
    app.use(koaStatic(__dirname))

    app.listen(port, () => {
      console.log(`Server listening on http://localhost:${port}, Ctrl+C to stop`)
    })
  } catch (e) {
    console.log('---------', e)
  }
}

const port = process.env.PORT || 3100;

start();
