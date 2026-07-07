import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Alert, TextField, InputAdornment, Divider, Tabs, Tab } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import { securityService } from '../services/securityService';
import { visitorService } from '../services/visitorService';
import { VISITOR_STATUS } from '../utils/constants';

const SecurityDashboard = () => {
  const [activeTabList, setActiveTabList] = useState([]); 
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  // Freeze feature management states
  const [freezeDate, setFreezeDate] = useState('');
  const [freezeReason, setFreezeReason] = useState('');

 const loadCheckpointMetrics = async () => {
  try {

    const activeRes = await securityService.getVisitorsInside();

    setActiveTabList(activeRes.data.data || []);

  } catch (err) {

    console.error(err);

    setError("Failed to refresh perimeter registry updates.");

  }
};

  useEffect(() => {
    loadCheckpointMetrics();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setSearchResults(null);
    if (!searchQuery.trim()) return;

    try {
      const res = await visitorService.searchVisitors({
        visitorName: searchQuery,
        visitId: searchQuery,
        companyName: '',
        governmentId: '',
        mobileNumber: ''
      });
      setSearchResults(res.data.data || []);
    } catch (err) {
      setError('Error matching credentials to pre-approval logs.');
    }
  };

const handleApprove = async (visitId) => {
  try {

    await securityService.approveVisitor(visitId);

    setSuccessMsg("Visitor Approved Successfully");

    await handleSearch({
      preventDefault: () => {}
    });

    await loadCheckpointMetrics();

  } catch (err) {
    setError(err.message);
  }
};
 const handleProcessCheckIn = async (visitId) => {
  try {

    await securityService.checkInVisitor(visitId);

    setSuccessMsg("Visitor Checked In Successfully");

    await handleSearch({
      preventDefault: () => {}
    });

    await loadCheckpointMetrics();

  } catch (err) {
    setError(err.message);
  }
};

 const handleProcessCheckOut = async (visitId) => {
  try {

    await securityService.checkOutVisitor(visitId);

    setSuccessMsg("Visitor Checked Out Successfully");

    await loadCheckpointMetrics();

  } catch (err) {
    setError(err.message);
  }
};

  const handleApplyFreeze = async (e) => {
    e.preventDefault();
    if (!freezeDate || !freezeReason.trim()) {
      setError('Provide calendar target selections and freeze reasons.');
      return;
    }
    try {
      await securityService.freezeDate({
        freezeDate: freezeDate,
        reason: freezeReason,
        active: true
      });
      setSuccessMsg(`Gate entry processing successfully frozen for ${freezeDate}.`);
      setFreezeDate('');
      setFreezeReason('');
    } catch (err) {
      setError('Unable to store calendar freeze constraints.');
    }
  };

  return (
    <Box>
      <Box mb={4}>
        <Typography variant="h5" color="text.primary" gutterBottom sx={{ fontWeight: 700 }}>
          Security Guard Checkpoint
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Validate entry passes, authorize pending pre-approvals, and manage perimeter parameters.
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>{error}</Alert>}
      {successMsg && <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccessMsg('')}>{successMsg}</Alert>}

      <Grid container spacing={4}>
        {/* Verification and Action Panel */}
        <Grid item xs={12} lg={5}>
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
                Verify Visitor Pass (QR Lookup)
              </Typography>
              <form onSubmit={handleSearch}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Scan or enter Visit ID token..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />
                <Button type="submit" variant="contained" fullWidth color="primary">
                  Validate Visitor Profile
                </Button>
              </form>

              {searchResults && (
                <Box mt={3}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>
                    Matches Found ({searchResults.length})
                  </Typography>
                  {searchResults.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">No matching records.</Typography>
                  ) : (
                    searchResults.map((visitor) => (
                      <Paper key={visitor.id} variant="outlined" sx={{ p: 2, mb: 1.5, backgroundColor: '#fafafa' }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>{visitor.visitorName}</Typography>
                            <Typography variant="caption" display="block" color="text.secondary">ID: {visitor.visitId}</Typography>
                            <Typography variant="caption" display="block" color="text.secondary">Status: <b>{visitor.status}</b></Typography>
                          </Box>
                          
                          {/* Step 1: Security Approval */}
                          {visitor.status === VISITOR_STATUS.REGISTERED && (
                            <Button
                              variant="contained"
                              color="primary"
                              size="small"
                              startIcon={<CheckCircleIcon />}
                              onClick={() => handleApprove(visitor.visitId)}
                            >
                              Approve
                            </Button>
                          )}

                          {/* Step 2: Day-Of Check In */}
                          {visitor.status === VISITOR_STATUS.APPROVED && (
                            <Button
                              variant="contained"
                              color="success"
                              size="small"
                              startIcon={<LoginIcon />}
                              onClick={() => handleProcessCheckIn(visitor.visitId)}
                            >
                              Check-In
                            </Button>
                          )}
                        </Box>
                      </Paper>
                    ))
                  )}
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Freeze Registration Module */}
          <Card variant="outlined">
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
                Freeze Registration Gate
              </Typography>
              <form onSubmit={handleApplyFreeze}>
                <TextField
                  fullWidth
                  type="date"
                  variant="outlined"
                  value={freezeDate}
                  onChange={(e) => setFreezeDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={{ mb: 2 }}
                  label="Target Freeze Date"
                />
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Reason for closure (e.g. Corporate Holiday)"
                  value={freezeReason}
                  onChange={(e) => setFreezeReason(e.target.value)}
                  sx={{ mb: 2 }}
                  label="Freeze Description"
                />
                <Button type="submit" variant="contained" fullWidth color="error" startIcon={<AcUnitIcon />}>
                  Lock Entry Registration
                </Button>
              </form>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Side: Active Occupants Tracker */}
        <Grid item xs={12} lg={7}>
          <Card variant="outlined">
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
                Active Facility Occupants (Inside Perimeter)
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Visitor</TableCell>
                      <TableCell>Sponsoring Host</TableCell>
                      <TableCell>Check-In Time</TableCell>
                      <TableCell align="center">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {activeTabList.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                          No visitors are currently checked inside the perimeter.
                        </TableCell>
                      </TableRow>
                    ) : (
                      activeTabList.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell sx={{ fontWeight: 500 }}>{row.visitorName}</TableCell>
                          <TableCell>{row.hostEmployeeName}</TableCell>
                          <TableCell>{row.checkInTime ? new Date(row.checkInTime).toLocaleTimeString() : 'N/A'}</TableCell>
                          <TableCell align="center">
                            <Button
                              variant="outlined"
                              color="error"
                              size="small"
                              startIcon={<LogoutIcon />}
                              onClick={() => handleProcessCheckOut(row.visitId)}
                            >
                              Check-Out
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SecurityDashboard;