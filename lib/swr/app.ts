import { MessageToMain } from "../type";
import { IMiddleware, MiddlewareRunner } from "./middleware";
import { Route, RouterContext, Router } from "./router";
import { serviceWorkerContainer } from "./serviceWorkerContainer";

type Ctx = {
  req: Request;
  body: any;
  _routerCtx?: RouterContext;
  _handle?: Route["handler"];
};

export class Server {
  runer = new MiddlewareRunner<Ctx>();

  router = new Router();

  constructor() {
    this.use(async (ctx, next) => {
      if (ctx._handle) {
        if (ctx._routerCtx) {
          const body = await ctx._handle(ctx._routerCtx);
          ctx.body = body;
        }
      }
      await next();
    });
  }

  // buildRouter(apiRoutes: Route[], customRoutes: Route[]) {
  //   const routes = [...apiRoutes];

  //   const repeatRoute: { method: string; path: string }[] = [];

  //   routes.forEach((v) => {
  //     const customRoute = customRoutes.find(
  //       (w) =>
  //         v.method.toUpperCase() === w.method.toUpperCase() && v.path === w.path
  //     );
  //     if (customRoute) {
  //       repeatRoute.push({
  //         method: v.method,
  //         path: v.path,
  //       });

  //       v.handler = customRoute.handler;
  //     }
  //   });

  //   const restRoute = customRoutes.filter((v) =>
  //     repeatRoute.every(
  //       (w) =>
  //         v.method.toUpperCase() !== w.method.toUpperCase() || v.path !== w.path
  //     )
  //   );

  //   routes.push(...restRoute);

  //   this.router.addRoutes(routes);
  // }

  addRoutes(routes: Route[]) {
    this.router.addRoutes(routes);
  }

  use(middleware: IMiddleware<Ctx>) {
    this.runer.use(middleware);
  }

  run(context: Ctx) {
    this.runer.run(context);
  }

  async msgConsumer(data: MessageToMain["data"]) {
    const { req } = data;
    const url = new URL(req.url);
    const { handler, params } = this.router.match(url.pathname, req.method);

    const ctx = {
      req: req,
      body: null,
      _handle: handler,
      _routerCtx: {
        params: params,
        req: req,
      },
    };
    await this.run(ctx);

    return ctx.body;
  }
}

export class App {
  private server = new Server();
  private sw = new serviceWorkerContainer(this.server);

  async start() {
    await this.sw.start();
  }

  async stop() {
    await this.sw.notifySwClose();
    await this.sw.unregister();
  }

  addRoutes(routes: Route[]) {
    this.server.addRoutes(routes);
  }

  use(middleware: IMiddleware<Ctx>) {
    this.server.use(middleware);
  }
}
