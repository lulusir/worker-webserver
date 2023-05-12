import "./App.css";
import { App } from "../dist";
import { apiRoutes } from "./apiRoute";
import { customRoutes } from "./customRoute";

const app = new App();
app.addRoutes(apiRoutes);
app.addRoutes(customRoutes);
app.use((ctx, next) => {
  console.log(ctx.req, "===========log");
  if (ctx.req.method === "POST") {
    ctx.body = "mybody";
  }
  next();
});

console.log(app);

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
              .then((res) => res.json())
              .then((res) => {
                console.log(res);
                console.log(Date.now() - start);
              });
          }}
        >
          get usrr
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
