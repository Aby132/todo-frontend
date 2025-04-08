import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import TaskAltIcon from '@mui/icons-material/TaskAlt';

function Header() {
  return (
    <AppBar position="static" elevation={0} sx={{ backgroundColor: 'white' }}>
      <Toolbar>
        <TaskAltIcon sx={{ color: 'primary.main', mr: 2 }} />
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, color: 'primary.main', fontWeight: 'bold' }}
        >
          TaskMaster
        </Typography>
        <Box>
          <Button
            component={RouterLink}
            to="/"
            sx={{ 
              mx: 1,
              '&:hover': {
                backgroundColor: 'primary.light',
                color: 'white'
              }
            }}
          >
            Home
          </Button>
          <Button
            component={RouterLink}
            to="/about"
            sx={{ 
              mx: 1,
              '&:hover': {
                backgroundColor: 'primary.light',
                color: 'white'
              }
            }}
          >
            About
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header; 