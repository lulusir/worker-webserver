# worker-webserver

Worker-webserver是一个轻量级的NPM包，它使用fetch事件允许你在service worker中实现一个web服务器。它允许你拦截进来的请求，使用用户自定义的路由匹配它们，并执行一系列的中间件函数来处理请求。
## 安装 
你可以使用以下命令通过NPM安装worker-webserver：
```bash
npm install worker-webserver --save
```

## 使用

首先，导入所需的函数和接口：
```typescript
import { start, Route } from 'worker-webserver'
```

然后，创建一个自定义路由的数组来匹配进来的请求：

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

你可以定义自己的中间件函数来处理进来的请求和响应。例如：
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

最后，通过调用start()函数启动worker-webserver
```typescript
app.start();
```

你也可以通过调用stop()函数来停止worker-webserver。
```typescript
app.stop();
```
就是这样！现在你可以拦截进来的请求，使用用户自定义的路由匹配它们，并执行中间件函数来处理它们。