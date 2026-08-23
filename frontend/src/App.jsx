import Register from "./components/Register";
import { Route, Switch } from "react-router-dom";
import Login from "./components/Login";
import Products from "./components/Products";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import Thanks from "./components/Thanks";

import ipConfig from "./ipConfig.json";

export const config = {
  endpoint:
    (typeof import.meta !== "undefined" &&
      (import.meta.env?.VITE_BACKEND_URL || import.meta.env?.VITE_API_URL)) ||
    `http://${ipConfig.workspaceIp}:8082/api/v1`,
};

function App() {
  return (
    <div className="App">
      {/* TODO: CRIO_TASK_MODULE_LOGIN - To add configure routes and their mapping */}
      {/* <Register /> */}
      <Switch>
        <Route path="/register">
          <Register />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/cart">
          <Cart />
        </Route>
        <Route path="/checkout">
          <Checkout />
        </Route>
        <Route exact path="/">
          <Products />
        </Route>
        <Route exact path="/thanks">
          <Thanks />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
