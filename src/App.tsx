import "./App.css";
import { App } from "../dist";
import { apiRoutes } from "./apiRoute";
import { customRoutes } from "./customRoute";

const app = new App();

app.addRoutes(apiRoutes);
app.addRoutes(customRoutes);

console.log(app);

app.use(async (ctx, next) => {
  await next();
  if (ctx.req.method === "POST") {
    ctx.res.body = "mybody";
  }
  // 统一code

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

function AppC() {
  return (
    <div className="App">
      <div>
        <button
          onClick={() => {
            app.start();
          }}
        >
          start
        </button>
        <button
          onClick={() => {
            app.stop();
          }}
        >
          stop
        </button>
        <button
          onClick={() => {
            const start = Date.now();
            fetch("http://localhost:8080/users/12")
              .then((res) => {
                console.log(
                  res.headers,
                  res.headers.get("content-type"),
                  "========res"
                );
                return res.json();
              })
              .then((res) => {
                console.log(res, "===res");
                console.log(Date.now() - start);
              });
          }}
        >
          get usrr
        </button>
        <button
          onClick={() => {
            fetch("http://localhost:8080/test/12/rep", {
              method: "get",
            })
              .then((res) => res.json())
              .then((res) => {
                debugger;
              });
          }}
        >
          params usrr
        </button>
        <button
          onClick={() => {
            fetch(
              "https://flextask-test.onewo.com/ftc/admin/task/setting/page?current=1&size=10",
              {
                method: "get",
              }
            )
              .then((res) => res.json())
              .then((res) => {
                debugger;
              });
          }}
        >
          page
        </button>
        <button
          onClick={() => {
            fetch("http://localhost:8080/users?a=1", {
              method: "get",
            })
              .then((res) => res.json())
              .then((res) => {
                debugger;
              });
          }}
        >
          users
        </button>
        <button
          onClick={() => {
            fetch("http://localhost:8080/users/12", {
              method: "post",
            })
              .then((res) => res.json())
              .then((res) => {
                debugger;
              });
          }}
        >
          post usrr
        </button>
        <button
          onClick={() => {
            fetch("http://localhost:8080/posts/:id/comments/:commentId")
              .then((res) => res.json())
              .then(console.log);
          }}
        >
          fetch 2
        </button>
      </div>
    </div>
  );
}

export default AppC;
