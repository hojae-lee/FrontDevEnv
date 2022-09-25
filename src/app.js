import form from "./form";
import result from "./result";
import "./app.css";

let resultEl;
let formEl;
document.addEventListener("DOMContentLoaded", async () => {
  formEl = document.createElement("div");
  formEl.innerHTML = form.render();
  document.body.appendChild(formEl);

  resultEl = document.createElement("div");
  resultEl.innerHTML = await result.render();
  document.body.appendChild(resultEl);

  // import(/* webpackChunkName: "result" */ "./result.js").then(async m => {
  //   const result = m.default;
  //   resultEl = document.createElement("div");
  //   resultEl.innerHTML = await result.render();
  //   document.body.appendChild(resultEl);
  // })
});

if (module.hot) {
  console.log("핫 모듈 켜짐");

  module.hot.accept("./result", async () => {
    console.log("result 모듈 변경 됨");
    resultEl.innerHTML = await result.render();
  });

  module.hot.accept("./form", () => {
    formEl.innerHTML = form.render();
  });
}
