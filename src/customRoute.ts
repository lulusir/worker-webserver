// 用户自定义route

import { Route } from "../dist";

export const customRoutes: Route[] = [
  {
    path: "/users/:id",
    handler: async (params) => {
      return JSON.stringify({
        test: "testhh",
        ...params,
      });
    },
    method: "POST",
  },
];
