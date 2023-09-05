import { serviceWorkerContainer } from "../swr/serviceWorkerContainer";
import { MessageToMain } from "../type";
import { Ctx, NoMatchRouteStatusCode } from "./context";
import { IMiddleware, MiddlewareRunner } from "./middleware";
import { Res } from "./res";
import { Route, Router } from "./router";

export class Server {
  runer = new MiddlewareRunner<Ctx>();

  router = new Router();

  constructor() {
    this.use(async (ctx, next) => {
      if (ctx.__handle) {
        if (ctx.__routerCtx) {
          await ctx.__handle(ctx.__routerCtx);
        }
      } else {
        // 匹配不到路由，应该走一个特殊的处理
        ctx.res.status === NoMatchRouteStatusCode;
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
    return this.runer.run(context);
  }

  msgConsumer = async (data: MessageToMain["data"]) => {
    const { req } = data;
    const url = new URL(req.url);
    const { handler, params } = this.router.match(url.pathname, req.method);

    const r = new Res();

    const ctx = {
      req: req,
      res: r,
      __handle: handler,
      __routerCtx: {
        params: params,
        req: req,
        res: r,
      },
    };

    await this.run(ctx);

    return r._toRes();
  };
}

export class App {
  private server = new Server();
  private sw = new serviceWorkerContainer();

  async start() {
    this.sw.setMessageConsumer(this.server.msgConsumer);
    await this.sw.start();
  }

  async stop() {
    await this.sw.stop();
  }

  addRoutes(routes: Route[]) {
    this.server.addRoutes(routes);
  }

  use(middleware: IMiddleware<Ctx>) {
    this.server.use(middleware);
  }
}
