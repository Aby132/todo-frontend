import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [todos, setTodos] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editingText, setEditingText] = useState('')
  const API_URL = 'https://todo-backend-x40y.onrender.com/api/todos'

  // Fetch todos from backend when component mounts
  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    try {
      const response = await fetch(API_URL)
      const data = await response.json()
      setTodos(data)
    } catch (error) {
      console.error('Error fetching todos:', error)
    }
  }

  const handleAddTodo = async (e) => {
    e.preventDefault()
    if (inputValue.trim() === '') return
    
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputValue }),
      })
      const newTodo = await response.json()
      setTodos([...todos, newTodo])
      setInputValue('')
    } catch (error) {
      console.error('Error adding todo:', error)
    }
  }

  const handleDeleteTodo = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      })
      setTodos(todos.filter(todo => todo._id !== id))
    } catch (error) {
      console.error('Error deleting todo:', error)
    }
  }

  const handleToggleTodo = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}/toggle`, {
        method: 'PUT',
      })
      const updatedTodo = await response.json()
      setTodos(todos.map(todo => 
        todo._id === id ? updatedTodo : todo
      ))
    } catch (error) {
      console.error('Error toggling todo:', error)
    }
  }

  const startEditing = (todo) => {
    setEditingId(todo._id)
    setEditingText(todo.text)
  }

  const handleEditSubmit = async (id) => {
    if (editingText.trim() === '') return
    
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: editingText }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to update todo')
      }
      
      const updatedTodo = await response.json()
      setTodos(todos.map(todo =>
        todo._id === id ? updatedTodo : todo
      ))
      setEditingId(null)
      setEditingText('')
    } catch (error) {
      console.error('Error editing todo:', error)
    }
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditingText('')
  }

  return (
    <div className="app">
      <nav className="navbar">
        <div className="nav-brand">Todo App</div>
        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>

      <main className="main-content">
        <h1>My Todo List</h1>
        
        <form onSubmit={handleAddTodo} className="todo-form">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Add a new todo..."
            className="todo-input"
          />
          <button type="submit" className="add-button">Add Todo</button>
        </form>

        <div className="todo-list">
          {todos.map(todo => (
            <div key={todo._id} className="todo-item">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggleTodo(todo._id)}
                className="todo-checkbox"
              />
              {editingId === todo._id ? (
                <div className="edit-container">
                  <input
                    type="text"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    className="edit-input"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleEditSubmit(todo._id)
                      } else if (e.key === 'Escape') {
                        cancelEditing()
                      }
                    }}
                  />
                  <div className="edit-actions">
                    <button
                      onClick={() => handleEditSubmit(todo._id)}
                      className="save-button"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="cancel-button"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <span className={`todo-text ${todo.completed ? 'completed' : ''}`}>
                  {todo.text}
                </span>
              )}
              <div className="todo-actions">
                {editingId !== todo._id && (
                  <>
                    <button
                      onClick={() => startEditing(todo)}
                      className="edit-button"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTodo(todo._id)}
                      className="delete-button"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default App
