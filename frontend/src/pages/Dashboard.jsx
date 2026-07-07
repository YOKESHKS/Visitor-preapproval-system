import React, { useState, useEffect } from 'react';
import { Grid, Typography, Card, CardContent, Box, Alert, Button, Paper, Avatar } from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import BlockIcon from '@mui/icons-material/Block';
import RefreshIcon from '@mui/icons-material/Refresh';
import { dashboardService } from '../services/dashboardService';
import Loader from '../components/Loader';
import companyLogo from '../assets/sopra-steria-logo.png';

// Drop your company logo file into src/assets (e.g. src/assets/sopra-steria-logo.png)
// and uncomment the import below, then replace the <Avatar>/fallback block in the
// header with: <Box component="img" src={companyLogo} alt="Sopra Steria" sx={{ height: 40 }} />


const Dashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMetrics = () => {
    setLoading(true);
    setError('');
    dashboardService.getDashboardStats()
      .then(res => {
        // res.data is the Axios response body
        // res.data.data extracts the 'data' field from your Spring Boot ApiResponse wrapper
        if (res.data && res.data.success) {
          setMetrics(res.data.data);
        } else {
          setError(res.data?.message || 'Failed to parse response metrics wrapper.');
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Dashboard Fetch Error:', err);
        const statusText = err.response ? `(HTTP ${err.response.status}: ${err.response.statusText})` : '';
        setError(err.message || `Failed to fetch dashboard metrics. ${statusText}`);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', width: '100%', minHeight: '80vh', justifyContent: 'center', alignItems: 'center' }}>
        <Loader message="Aggregating workspace statistics..." />
      </Box>
    );
  }

  // Approved Pre-Approvals card removed per request — only these three remain
  const statCards = [
    {
      title: 'Total Registered Visits',
      value: metrics?.totalVisitors || 0,
      icon: <GroupIcon sx={{ fontSize: 36 }} />,
      color: '#1e3a8a'
    },
    {
      title: 'Currently Checked-In',
      value: metrics?.activeVisitors || 0,
      icon: <MeetingRoomIcon sx={{ fontSize: 36 }} />,
      color: '#0f766e'
    },
    {
      title: 'Cancelled Appointments',
      value: metrics?.cancelledVisitors || 0,
      icon: <BlockIcon sx={{ fontSize: 36 }} />,
      color: '#ef4444'
    }
  ];

  return (
    <Box sx={{ p: 3, width: '100%', minHeight: '100vh', boxSizing: 'border-box', bgcolor: '#f7f8fa' }}>
      {/* Top Header Section */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
        flexWrap="wrap"
        gap={2}
      >
        <Box display="flex" alignItems="center" gap={2}>
          {
            <Box component="img" src={companyLogo} alt="Sopra Steria" sx={{ height: 40 }} />
          }
          <Avatar
            variant="rounded"
            sx={{ bgcolor: '#1e3a8a', width: 44, height: 44, fontWeight: 700, fontSize: 14 }}
          >
            SS
          </Avatar>
          <Box>
            <Typography variant="h5" color="text.primary" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
              System Dashboard
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Real-time metrics and operations overview.
            </Typography>
          </Box>
        </Box>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={fetchMetrics}
          size="small"
        >
          Refresh Data
        </Button>
      </Box>

      {/* Error View Banner */}
      {error && (
        <Paper elevation={0} sx={{ mb: 4 }}>
          <Alert severity="error" variant="filled">
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
              Backend Connection Blocked / Failed
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              {error}
            </Typography>
          </Alert>
        </Paper>
      )}

      {/* Metrics Cards Grid Layout — 3 cards, evenly spaced */}
      <Grid container spacing={3}>
        {statCards.map((card, idx) => (
          <Grid item xs={12} sm={6} md={4} key={idx}>
            <Card
              variant="outlined"
              sx={{
                borderRadius: 3,
                borderLeft: `5px solid ${card.color}`,
                boxShadow: '0px 4px 14px rgba(15, 23, 42, 0.06)',
                height: '100%',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0px 8px 20px rgba(15, 23, 42, 0.10)'
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.4, fontSize: 12 }}
                    >
                      {card.title}
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 800, color: 'text.primary', mt: 1.5 }}>
                      {card.value}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      color: card.color,
                      bgcolor: `${card.color}14`,
                      borderRadius: '50%',
                      width: 56,
                      height: 56,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {card.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;
