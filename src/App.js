import React, { useState, useEffect } from 'react';
import './App.css';
import { Login } from "./Login";
import { Register } from "./Register";
import { TodoList } from "./TodoList";
import { DndProvider } from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend'

function App() {
  const [currentForm, setCurrentForm] = useState('login');
  useEffect(() => {
    // Check for userId in local storage
    const userId = localStorage.getItem('userId');
    if (userId) {
      // If userId exists in local storage, switch to TodoList
      setCurrentForm('todo');
    }
  }, []); // Empty dependency array to run the effect only once
  const toggleForm = (formName) => {
    setCurrentForm(formName)
  }
  return (
    <>
    <DndProvider backend={HTML5Backend}>
    <div className="App">
      {currentForm === 'login' ? (
        <div>
          <Login onFormSwitch={toggleForm} />
          <button onClick={() => setCurrentForm('todo')}>Switch to Todo List</button>
        </div>
      ) : currentForm === 'register' ? (
        <div>
          <Register onFormSwitch={toggleForm} />
          <button onClick={() => setCurrentForm('todo')}>Switch to Todo List</button>
        </div>
      ) : (
        <div>
          <TodoList />
          <button onClick={() => { localStorage.setItem('userId', ''); setCurrentForm('login') }}>Logout</button>
        </div>
      )}
    </div>
    </DndProvider>
    </>

  );
}

export default App;
