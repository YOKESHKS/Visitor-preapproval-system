import React, { useState, useEffect } from 'react';
import { Container, Box, Card, CardContent, TextField, Button, Typography, Alert, Snackbar, Tabs, Tab } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import companyLogo from '../assets/sopra-steria-logo.png';

const Login = () => {
  const navigate = useNavigate();
  const [tabIndex, setTabIndex] = useState(0);
  const [formData, setFormData] = useState({ email: '', password: '', name: '', employeeId: '', role: 'ROLE_EMPLOYEE' });
  const [error, setError] = useState('');
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (authService.isAuthenticated()) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (tabIndex === 0) {
        const user = await authService.login(formData.email, formData.password);

setToast({
  open: true,
  message: 'Login successful!',
  severity: 'success'
});

const role = (user.role || '').replace('ROLE_', '');

switch (role) {

  case 'SECURITY':
    navigate('/security-dashboard');
    break;

  case 'EMPLOYEE':
    navigate('/employee-dashboard');
    break;

  case 'ADMIN':
    navigate('/dashboard');
    break;

  default:
    navigate('/dashboard');

}
      } else {
        await authService.register({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          employeeId: formData.employeeId,
          employeeName: formData.name,
          employeeDepartment: formData.employeedepartment,
          role: formData.role
        });
        setToast({ open: true, message: 'Registration successful! Please login.', severity: 'success' });
        setTabIndex(0);
      }
    } catch (err) {
      setError(err?.message || 'Authentication operation failed.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', py: 4 }}>
        <Box textAlign="center" mb={4}>
        <Box component="img" src={companyLogo} alt="Sopra Steria" sx={{ height: 40 }} />
          <Typography variant="h5" color="primary" gutterBottom sx={{ fontWeight: 700 }}>
            VISITOR MANAGEMENT PORTAL
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Enterprise Security & Pre-Approval Gatekeeper
          </Typography>
        </Box>

        <Card variant="outlined">
          <Tabs value={tabIndex} onChange={handleTabChange} variant="fullWidth" indicatorColor="primary" textColor="primary">
            <Tab label="Sign In" />
            <Tab label="Register Employee" />
          </Tabs>
          <CardContent sx={{ p: 4 }}>
            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
            
            <form onSubmit={handleSubmit}>
              <Box display="flex" flexDirection="column" gap={2.5}>
                {tabIndex === 1 && (
                  <>
                    <TextField label="Full Name" name="name" variant="outlined" fullWidth required value={formData.name} onChange={handleChange} />
                    <TextField label="Employee ID" name="employeeId" variant="outlined" fullWidth required value={formData.employeeId} onChange={handleChange} />
                    <TextField label="Employee Department" name="employeedepartment" variant="outlined" fullWidth required value={formData.employeedepartment} onChange={handleChange} />
                    <TextField
                      select
                      label="Designated System Role"
                      name="role"
                      variant="outlined"
                      fullWidth
                      required
                      value={formData.role}
                      onChange={handleChange}
                      SelectProps={{ native: true }}
                    >
                      
                      <option value="ROLE_EMPLOYEE">Employee (Host)</option>
                      <option value="ROLE_SECURITY">Security Personnel</option>
                    </TextField>
                  </>
                )}
                
                <TextField label="Corporate Email" name="email" type="email" variant="outlined" fullWidth required value={formData.email} onChange={handleChange} />
                <TextField label="Password" name="password" type="password" variant="outlined" fullWidth required value={formData.password} onChange={handleChange} />

                <Button type="submit" variant="contained" color="primary" size="large" fullWidth sx={{ mt: 1, py: 1.5 }}>
                  {tabIndex === 0 ? 'Authenticate' : 'Complete Registration'}
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Box>

      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={toast.severity} variant="filled">{toast.message}</Alert>
      </Snackbar>
    </Container>
  );
};

export default Login;