import { takeEvery } from "redux-saga/effects";
import call_isCollApsed from "./saga/IsCollApsed";
export default function* watchSaga() {
  console.log(1);
  yield takeEvery("change_collapsed_saga", call_isCollApsed);
}
