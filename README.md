[中文文档](https://github.com/lulusir/worker-webserver/blob/main/README.zh.md)

# worker-webserver

Worker-webserver is a lightweight NPM package that allows you to implement a web server in your service worker using the fetch event. It allows you to intercept incoming requests, match them with a user-defined router, and execute a series of middleware functions to handle them.


## Installation 
You can install worker-webserver via NPM using the following command:
```bash
npm install worker-webserver --save
```

## Usage

First, import the necessary functions and interfaces:
```typescript
import { start, Route } from 'worker-webserver'
```

Then, create an array of custom routes to match incoming requests:

```typescript
const customRoutes: Route[] = [
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

```

You can define your own middleware functions to handle incoming requests and responses. For example:
```typescript
iconst app = start();

app.addRoutes(customRoutes);

app.use((ctx, next) => {
  console.log(ctx.req, "===========log");
  if (ctx.req.method === "POST") {
    ctx.body = "mybody";
  }
  next();
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