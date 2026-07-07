import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const Loader = ({ message = 'Loading layout components...' }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="60vh"
    >
      <CircularProgress size={50} thickness={4} color="primary" />
      {message && (
        <Typography variant="body1" sx={{ mt: 2, color: 'text.secondary' }}>
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default Loader;