import './App.css';
import {
  useContext,
  useState,
} from "react";

function App() {
  const [notebook, setNotebook] = useState();
  return (
    <div className="App">
      <NotebookContext.Provider value={notebook, setNotebook}>
        <LoginForm></LoginForm>
      </NotebookContext.Provider>
    </div>
  );
}

export default App;
