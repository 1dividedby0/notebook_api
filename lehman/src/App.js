import './App.css';
import {
  useContext,
  useState,
} from "react";
// import LoginForm from './LoginForm';
import LoginForm from './LoginForm';
import { NotebookContext } from './data';

function App() {
  const [notebook, setNotebook] = useState();
  return (
    <div className="App">
      <NotebookContext.Provider value={[notebook, setNotebook]}>
        <LoginForm />
      </NotebookContext.Provider>
    </div>

  );
}

export default App;
