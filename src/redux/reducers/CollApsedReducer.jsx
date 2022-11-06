export default function CollApsedReducer(
  PreState = {
    isCollapsed: false,
  },
  { type }
) {
  console.log(type);
  const newState = { ...PreState };
  switch (type) {
    case "change_collapsed":
      newState.isCollapsed = !newState.isCollapsed;
      return newState;

    default:
      return PreState;
  }
}

// 默认不折叠
