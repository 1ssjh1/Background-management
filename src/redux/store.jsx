import { combineReducers, createStore, compose, applyMiddleware } from "redux";
// combineReducers 合并reducer
import CollApsedReducer from "./reducers/CollApsedReducer";
// 引入创建saga
import createSagaMiddleWare from "redux-saga";
import LoadingReducer from "./reducers/LoadingReducer";
// 引入持久化 本地
import storage from "redux-persist/lib/storage";
// 引入持久化文件
import { persistStore, persistReducer } from "redux-persist";
// 引入saga saga-ever
import watchSaga from "./saga-every";

const SagaMiddleWare = createSagaMiddleWare();

// 合并reducer
const reducers = combineReducers({
  CollApsedReducer,
  LoadingReducer,
});
// 持久化 文件
const persistConfig = {
  key: "isCollapsed",
  storage,
  whitelist: ["CollApsedReducer"],
};
// 将reducer做持久化
const persistedReducer = persistReducer(persistConfig, reducers);
// 引入全局的redux插件
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// 让 SagaMiddleWare 执行一次 创建 saga 中间件
const store = createStore(
  persistedReducer,
  composeEnhancers(applyMiddleware(SagaMiddleWare))
);
// 初始化 持久 套在 app上面
const persistor = persistStore(store);
// 传入 saga任务
SagaMiddleWare.run(watchSaga);

export { store, persistor };
