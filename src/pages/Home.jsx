import { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Paper,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import axios from 'axios';

const API_BASE_URL = 'https://todo-backend-oifm.onrender.com/api';

// Configure axios defaults
axios.defaults.timeout = 30000; // 30 seconds timeout
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Add retry logic
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If the error is a timeout and we haven't retried yet
    if (error.code === 'ECONNABORTED' && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Wait for 2 seconds before retrying
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Retry the request
      return axios(originalRequest);
    }
    
    return Promise.reject(error);
  }
);

function Home() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editTodo, setEditTodo] = useState({ _id: null, text: '' });
  const [openDialog, setOpenDialog] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    fetchTodos();
  }, []);

  const getTodoId = (todo) => todo._id || todo.id;

  const fetchTodos = async () => {
    try {
      setLoading(true);
      setRetrying(false);
      const response = await axios.get(`${API_BASE_URL}/todos`);
      setTodos(response.data.map(todo => ({
        ...todo,
        _id: todo._id || todo.id // Ensure we always have _id
      })));
      setError(null);
    } catch (error) {
      console.error('Error fetching todos:', error);
      if (error.code === 'ECONNABORTED') {
        setRetrying(true);
        try {
          const retryResponse = await axios.get(`${API_BASE_URL}/todos`);
          setTodos(retryResponse.data.map(todo => ({
            ...todo,
            _id: todo._id || todo.id
          })));
          setError(null);
        } catch (retryError) {
          setError('Server is taking too long to respond. Please try again later.');
        }
      } else {
        setError('Failed to fetch todos. Please try again later.');
      }
    } finally {
      setLoading(false);
      setRetrying(false);
    }
  };

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE_URL}/todos`, {
        text: newTodo,
      });
      const newTodoItem = {
        ...response.data,
        _id: response.data._id || response.data.id
      };
      setTodos([...todos, newTodoItem]);
      setNewTodo('');
      setError(null);
    } catch (error) {
      console.error('Error adding todo:', error);
      setError('Failed to add todo. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTodo = async (todoId) => {
    if (!todoId) {
      setError('Invalid todo ID');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.delete(`${API_BASE_URL}/todos/${todoId}`);
      if (response.status === 200) {
        setTodos(todos.filter((todo) => getTodoId(todo) !== todoId));
        setError(null);
      }
    } catch (error) {
      console.error('Error deleting todo:', error);
      if (error.response) {
        setError(error.response.data.message || 'Failed to delete todo');
      } else {
        setError('Failed to delete todo. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (todo) => {
    const todoId = getTodoId(todo);
    if (!todo || !todoId) {
      setError('Invalid todo item');
      return;
    }
    setEditTodo({ _id: todoId, text: todo.text });
    setOpenDialog(true);
  };

  const handleEditSubmit = async () => {
    if (!editTodo._id) {
      setError('Invalid todo ID');
      return;
    }

    if (!editTodo.text.trim()) {
      setError('Todo text cannot be empty');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.put(`${API_BASE_URL}/todos/${editTodo._id}`, {
        text: editTodo.text,
      });
      if (response.status === 200) {
        const updatedTodo = {
          ...response.data,
          _id: response.data._id || response.data.id
        };
        setTodos(
          todos.map((todo) =>
            getTodoId(todo) === editTodo._id ? updatedTodo : todo
          )
        );
        setOpenDialog(false);
        setError(null);
      }
    } catch (error) {
      console.error('Error updating todo:', error);
      if (error.response) {
        setError(error.response.data.message || 'Failed to update todo');
      } else {
        setError('Failed to update todo. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCloseError = () => {
    setError(null);
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', width: '100%' }}>
      <Paper
        elevation={3}
        sx={{
          p: 3,
          mb: 4,
          backgroundColor: 'white',
          borderRadius: 2,
          position: 'relative',
        }}
      >
        {loading && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              zIndex: 1,
            }}
          >
            <CircularProgress />
            {retrying && (
              <Typography variant="body2" sx={{ ml: 2 }}>
                Retrying...
              </Typography>
            )}
          </Box>
        )}
        <Typography variant="h5" component="h1" gutterBottom sx={{ color: 'primary.main' }}>
          What's on your mind today?
        </Typography>
        <form onSubmit={handleAddTodo} style={{ display: 'flex', gap: '1rem' }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Add a new task..."
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            sx={{ backgroundColor: 'white' }}
            disabled={loading}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{
              px: 4,
              '&:hover': {
                transform: 'translateY(-2px)',
                transition: 'transform 0.2s',
              },
            }}
          >
            {loading ? 'Adding...' : 'Add'}
          </Button>
        </form>
      </Paper>

      <List>
        {todos.map((todo) => (
          <ListItem
            key={getTodoId(todo)}
            sx={{
              mb: 2,
              backgroundColor: 'white',
              borderRadius: 1,
              '&:hover': {
                boxShadow: 1,
                transform: 'translateY(-2px)',
                transition: 'all 0.2s',
              },
            }}
          >
            <ListItemText 
              primary={todo.text}
              primaryTypographyProps={{
                component: 'div',
                style: { wordBreak: 'break-word' }
              }}
            />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                aria-label="edit"
                onClick={() => handleEditClick(todo)}
                sx={{ mr: 1 }}
                disabled={loading}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => handleDeleteTodo(getTodoId(todo))}
                disabled={loading}
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Edit Todo</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            fullWidth
            value={editTodo.text}
            onChange={(e) => setEditTodo({ ...editTodo, text: e.target.value })}
            disabled={loading}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleEditSubmit} color="primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Home; 