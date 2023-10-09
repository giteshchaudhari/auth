import type express from 'express'
interface RouteConfig {
  path: string
  middleware: express.RequestHandler[]
  handler: express.RequestHandler
  method: string
}
const routes: RouteConfig[] = []
export function registerPath (config: RouteConfig): void {
  routes.push(config)
}

export function registerRoutes (app: express.Express): void {
  routes.forEach((config) => {
    app[config.method](config.path, ...config.middleware, config.handler)
  })
}
