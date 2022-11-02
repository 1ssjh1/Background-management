
import { HashRouter } from 'react-router-dom'
import IndexRouter from "./router/IndexRouter"
import "./App.css"
function App() {
  return (
    <HashRouter>
      <IndexRouter ></IndexRouter>
    </HashRouter>
  );
}

export default App;
