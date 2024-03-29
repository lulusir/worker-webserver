[中文文档](https://github.com/lulusir/worker-webserver/blob/main/README.zh.md)

# worker-webserver

Worker-webserver is a lightweight NPM package that allows you to implement a web server in your service worker using the fetch event. It allows you to intercept incoming requests, match them with a user-defined router, and execute a series of middleware functions to handle them.


## Installation 
You can install worker-webserver via NPM using the following command:
```bash
npm install worker-webserver --save
```

## Usage
Export sw.js using the CLI command and place it in your static resource directory. If you are using Vite or Umi, it corresponds to the public folder

```bash
npx worker-webserver --out public
```
First, import the necessary functions and interfaces:
```typescript
import { App, Route } from 'worker-webserver'
```

Then, create an array of custom routes to match incoming requests:

```typescript
const customRoutes: Route[] = [
  {
    path: "/users/:id",
    method: "POST",
    handler: async (ctx) => {
      ctx.res.body = JSON.stringify({
        test: "test",
        ...ctx.params,
      });
      ctx.res.headers.set("content-type", "application/json");
    },
  },
];

```

You can define your own middleware functions to handle incoming requests and responses. For example:
```typescript
const app = new App();

app.addRoutes(customRoutes);


app.use(async (ctx, next) => {
  await next();

  // unified code to 200
  if (ctx.res.body) {
    const contentType = ctx.res.headers.get("content-type");
    if (contentType === "application/json") {
      try {
        let body = JSON.parse(ctx.res.body);
        if (body.code) {
          body.code = 200;
        }
        ctx.res.body = JSON.stringify(body);
      } catch {}
    }
  }
});

```

Finally, start the worker-webserver by calling the start() function.
```typescript
app.start();
```

You can also stop the worker-webserver by calling the stop() function.
```typescript
app.stop();
```

That's it! You can now intercept incoming requests, match them with a user-defined router, and execute middleware functions to handle them.