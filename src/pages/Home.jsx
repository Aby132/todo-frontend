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
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import axios from 'axios';

function Home() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editTodo, setEditTodo] = useState({ id: null, text: '' });
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/todos');
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      const response = await axios.post('http://localhost:5000/api/todos', {
        text: newTodo,
      });
      setTodos([...todos, response.data]);
      setNewTodo('');
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/todos/${id}`);
      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const handleEditClick = (todo) => {
    setEditTodo({ id: todo._id, text: todo.text });
    setOpenDialog(true);
  };

  const handleEditSubmit = async () => {
    try {
      await axios.put(`http://localhost:5000/api/todos/${editTodo.id}`, {
        text: editTodo.text,
      });
      setTodos(
        todos.map((todo) =>
          todo._id === editTodo.id ? { ...todo, text: editTodo.text } : todo
        )
      );
      setOpenDialog(false);
    } catch (error) {
      console.error('Error updating todo:', error);
    }
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
        }}
      >
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
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{
              px: 4,
              '&:hover': {
                transform: 'translateY(-2px)',
                transition: 'transform 0.2s',
              },
            }}
          >
            Add
          </Button>
        </form>
      </Paper>

      <List>
        {todos.map((todo) => (
          <ListItem
            key={todo._id}
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
            <ListItemText primary={todo.text} />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                aria-label="edit"
                onClick={() => handleEditClick(todo)}
                sx={{ mr: 1 }}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => handleDeleteTodo(todo._id)}
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
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleEditSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Home; 