import { Box, Typography, Paper } from '@mui/material';

function About() {
  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', width: '100%' }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          backgroundColor: 'white',
          borderRadius: 2,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom color="primary">
          About TaskMaster
        </Typography>
        <Typography variant="body1" paragraph>
          TaskMaster is a modern, intuitive todo application designed to help you stay organized
          and productive. With its clean interface and powerful features, managing your tasks
          has never been easier.
        </Typography>
        <Typography variant="body1" paragraph>
          Built with React and Material-UI on the frontend, and powered by Node.js, Express,
          and MongoDB on the backend, TaskMaster provides a seamless experience for creating,
          editing, and managing your todos.
        </Typography>
        <Typography variant="body1">
          Key features include:
        </Typography>
        <ul style={{ marginTop: '1rem', marginLeft: '2rem' }}>
          <Typography component="li" variant="body1">
            Clean and intuitive user interface
          </Typography>
          <Typography component="li" variant="body1">
            Real-time updates and persistence
          </Typography>
          <Typography component="li" variant="body1">
            Edit and delete functionality
          </Typography>
          <Typography component="li" variant="body1">
            Responsive design for all devices
          </Typography>
        </ul>
      </Paper>
    </Box>
  );
}

export default About; 