function LoadingReducer(preState = { isLoading: true }, { type, playLoad }) {
  let newState = { ...preState };
  switch (type) {
    case "change_isLoading":
      newState.isLoading = playLoad;
      return newState;
    default:
      return preState;
  }
}
export default LoadingReducer;
