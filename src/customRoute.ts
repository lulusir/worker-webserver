// 用户自定义route

import { Route } from "../dist";

export const customRoutes: Route[] = [
  {
    path: "/users/:id",
    method: "POST",
    handler: async (ctx) => {
      ctx.res.body = JSON.stringify({
        test: "testhh",
        ...ctx.params,
      });
      ctx.res.headers.set("content-type", "application/json");
    },
  },

  {
    path: "/err",
    method: "get",
    handler: async (ctx) => {
      ctx.res.status = 500;
    },
  },
];
