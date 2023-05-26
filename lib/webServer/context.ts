import { Route, RouterContext } from "./router";
import { Res } from "./res";

export type Ctx = {
  req: Request;
  res: Res;
  __handle: Route["handler"];
  __routerCtx: RouterContext;
};
