import { call, put } from "redux-saga/effects";

function* call_isCollApsed() {
  let res = yield call(get_isCollApsed);
  console.log(1);
  yield put({
    type: "change_collapsed",
    payload: res,
  });
}

function get_isCollApsed() {
  console.log(1);

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(["这是第一个个saga"], 1000);
    });
  });
}

export default call_isCollApsed;
