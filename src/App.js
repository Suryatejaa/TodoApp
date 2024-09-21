import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const getTodosFromLocalStorage = () => {
    const savedTods = localStorage.getItem('todos');
    return savedTods ? JSON.parse(savedTods) : [];
  };
  const [todos, setTodos] = useState(getTodosFromLocalStorage());
  const [input, setInput] = useState('');
  const ulRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (e) => {
    e.preventDefault();
    if (input.trim()) {
      setTodos([...todos, { id: uuidv4(), text: input, completed: false }]);
      setInput('');
    }
  };

  const toggleComplete = (id) => {
    // Toggle the completed flag of the selected to-do
    const newTodos = todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(newTodos);
  };

  const deleteTodo = (id) => {
    // Remove the selected to-do from the list
    const newTodos = todos.filter(todo => todo.id !== id);
    setTodos(newTodos);
  };

  const handleScroll = () => {
    const ul = ulRef.current;

    ul.classList.add('scrollable');

    clearTimeout(ul.timeout);
    ul.timeout = setTimeout(() => {
      ul.classList.remove('scrollable');
    }, 500);
  };

  return (
    <div className='container'>
      <div className='app'>
        <h1>To-Do App</h1>
        <form onSubmit={addTodo}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Add a new task"
          />
          <button type="submit">Add</button>
        </form>

        <ul ref={ulRef} onScroll={handleScroll}>
          {/* Display uncompleted todos first with proper numbering */}
          {todos.length === 0 ? (
            <li style={{textAlign:'center',color:'#999'}}>Add some tasks</li>
          ) : (todos
            .filter(todo => !todo.completed)
            .map((todo, index) => (
              <li key={todo.id} className={todo.completed ? 'completed' : ''}>
                {/* Display uncompleted todos with index starting from 1 */}
                {index + 1}. {todo.text}
                <div className='actions'>
                <span className="tooltip">
                  <button onClick={() => toggleComplete(todo.id)}>
                    ✔️
                  </button>
                  <span className="tooltiptext">Mark as complete</span>
                </span>
                <span className='tooltip'>
                  <button onClick={() => deleteTodo(todo.id)}>✖️</button>
                  <span className="tooltiptext">Delete</span>
                  </span>
                  </div>
              </li>
            )))}

          {/* Display completed todos next with their numbering continuing from uncompleted */}

          {todos.some(todo => todo.completed) && (
            <>
              <h2>Completed:</h2>
              {todos
                .filter(todo => todo.completed)
                .map((todo, index) => (
                  <li key={todo.id} className="completed">
                    {/* Add numbering for completed tasks */}
                    <span className='todo'>
                      {index + 1 + todos.filter(todo => !todo.completed).length}. {todo.text}
                    </span>
                    <div className='actions'>
                    <span className="tooltip">
                      <button onClick={() => toggleComplete(todo.id)}>
                        Undo
                      </button>
                      <span className="tooltiptext">Undo the task</span>
                    </span>
                    <span className='tooltip'>
                      <button onClick={() => deleteTodo(todo.id)}>✖️</button>
                      <span className="tooltiptext">Delete</span>
                      </span>
                      </div>
                  </li>
                ))}
            </>
          )}
        </ul>
      </div>
    </div>
  );
}

export default App;
