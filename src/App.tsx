import "./App.css";

function App() {
  return (
    <div className="App">
      <div>
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
              .then((res) => res.text())
              .then(console.log);
          }}
        >
          fetch 2
        </button>
      </div>
    </div>
  );
}

export default App;
