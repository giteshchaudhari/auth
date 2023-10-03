import type express from 'express'
interface RouteConfig {
  path: string
  middleware: express.RequestHandler
  handler: express.RequestHandler
  method: string
}
const routes: RouteConfig[] = []
export function registerPath (config: RouteConfig): void {
  routes.push(config)
  console.log('vfdcsaxz')
}

export function registerRoutes (app: express.Express): void {
  routes.forEach((config) => {
    app.get(config.path, (req, res, next) => {
      next()
    }, config.handler)
  })
}

// todo: error is in middleware registration
