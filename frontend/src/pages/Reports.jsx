
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Grid,
  TextField,
  MenuItem
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import RefreshIcon from '@mui/icons-material/Refresh';
import { visitorService } from '../services/visitorService';
import { VISIT_PURPOSES } from '../utils/constants';

const Reports = () => {

  const [records, setRecords] = useState([]);
  const [filters, setFilters] = useState({
    name: '',
    purpose: '',
    status: ''
  });

  const [loading, setLoading] = useState(false);

const executeSearchQuery = async () => {

  setLoading(true);

  try {

    const res = await visitorService.getAllVisitors();

    // Supports both interceptor styles
    let finalData = [];

    if (Array.isArray(res.data?.data)) {
      finalData = res.data.data;
    } else if (Array.isArray(res.data)) {
      finalData = res.data;
    } else if (Array.isArray(res)) {
      finalData = res;
    }

    if (filters.name.trim()) {

      const search = filters.name.toLowerCase();

      finalData = finalData.filter(v =>
        (v.visitorName &&
          v.visitorName.toLowerCase().includes(search)) ||

        (v.visitId &&
          v.visitId.toLowerCase().includes(search))
      );

    }

    if (filters.purpose) {
      finalData = finalData.filter(
        v => v.purpose === filters.purpose
      );
    }

    if (filters.status) {
      finalData = finalData.filter(
        v => v.status === filters.status
      );
    }

    setRecords(finalData);

  } catch (err) {
    console.error("Report Error :", err);
    setRecords([]);
  } finally {
    setLoading(false);
  }

};

  useEffect(() => {
    executeSearchQuery();
  }, []);

  const handleReset = () => {
    setFilters({
      name: '',
      purpose: '',
      status: ''
    });

    setTimeout(() => executeSearchQuery(), 100);
  };

  return (
    <Box>

      <Box mb={4}>
        <Typography
          variant="h5"
          color="text.primary"
          gutterBottom
          sx={{ fontWeight: 700 }}
        >
          System Audit & Access Logs
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
        >
          Run detailed filter operations across corporate visitor traffic parameters.
        </Typography>
      </Box>

      <Card variant="outlined" sx={{ mb: 4 }}>
        <CardContent sx={{ p: 3 }}>

          <Grid container spacing={2} alignItems="center">

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Search Visitor Name / Visit ID"
                size="small"
                value={filters.name}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    name: e.target.value
                  })
                }
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <TextField
                select
                fullWidth
                label="Purpose"
                size="small"
                value={filters.purpose}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    purpose: e.target.value
                  })
                }
              >
                <MenuItem value="">All Purposes</MenuItem>

                {VISIT_PURPOSES.map((p) => (
                  <MenuItem
                    key={p.value}
                    value={p.value}
                  >
                    {p.label}
                  </MenuItem>
                ))}

              </TextField>
            </Grid>

            <Grid item xs={12} sm={3}>
              <TextField
                select
                fullWidth
                label="Status"
                size="small"
                value={filters.status}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    status: e.target.value
                  })
                }
              >
                <MenuItem value="">All Statuses</MenuItem>
                <MenuItem value="REGISTERED">Registered</MenuItem>
                <MenuItem value="APPROVED">Approved</MenuItem>
                <MenuItem value="CHECKED_IN">Checked In</MenuItem>
                <MenuItem value="CHECKED_OUT">Checked Out</MenuItem>
                <MenuItem value="CANCELLED">Cancelled</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={2} display="flex" gap={1}>

              <Button
                fullWidth
                variant="contained"
                startIcon={<FilterListIcon />}
                onClick={executeSearchQuery}
                disabled={loading}
              >
                Filter
              </Button>

              <Button
                variant="outlined"
                onClick={handleReset}
                disabled={loading}
              >
                <RefreshIcon />
              </Button>

            </Grid>

          </Grid>

        </CardContent>
      </Card>

      <TableContainer component={Paper} variant="outlined">

        <Table>

          <TableHead>

            <TableRow>
              <TableCell>Visitor Name</TableCell>
              <TableCell>Host Employee</TableCell>
              <TableCell>Purpose</TableCell>
              <TableCell>Check In</TableCell>
              <TableCell>Check Out</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>

          </TableHead>

          <TableBody>

            {loading ? (

              <TableRow>
                <TableCell colSpan={6} align="center">
                  Loading...
                </TableCell>
              </TableRow>

            ) : records.length === 0 ? (

              <TableRow>
                <TableCell colSpan={6} align="center">
                  No Records Found
                </TableCell>
              </TableRow>

            ) : (

              records.map((row) => (

                <TableRow key={row.id}>

                  <TableCell>{row.visitorName}</TableCell>

                  <TableCell>
                    {row.hostEmployeeName}
                  </TableCell>

                  <TableCell>
                    {row.purpose}
                  </TableCell>

                  <TableCell>
                    {row.checkInTime
                      ? new Date(row.checkInTime).toLocaleString()
                      : "-"}
                  </TableCell>

                  <TableCell>
                    {row.checkOutTime
                      ? new Date(row.checkOutTime).toLocaleString()
                      : "-"}
                  </TableCell>

                  <TableCell>
                    {row.status}
                  </TableCell>

                </TableRow>

              ))

            )}

          </TableBody>

        </Table>

      </TableContainer>

    </Box>
  );
};

export default Reports;

