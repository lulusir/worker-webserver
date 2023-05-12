import { Route } from "./router";
import { serviceWorkerContainer } from "./serviceWorkerContainer";

import { App } from "./app";

export const start = (options?: {
  apiRoutes?: Route[];
  customRoutes?: Route[];
}) => {
  const app = new App();
  app.buildRouter(options?.apiRoutes || [], options?.customRoutes || []);
  const sw = new serviceWorkerContainer(app);
  sw.start();

  return app;
};

export type { Route };
