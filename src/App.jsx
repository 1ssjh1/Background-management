import { HashRouter } from "react-router-dom";
import IndexRouter from "./router/IndexRouter";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { persistor } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";

import "./App.css";
// redux 包裹在根组件
function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <HashRouter>
          <IndexRouter></IndexRouter>
        </HashRouter>
      </PersistGate>
    </Provider>
  );
}

export default App;
