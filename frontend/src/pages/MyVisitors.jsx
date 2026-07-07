import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  Chip,
  Stack,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  CircularProgress,
  Tooltip
} from '@mui/material';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CloseIcon from '@mui/icons-material/Close';
import { visitorService } from '../services/visitorService';
import { authService } from '../services/authService';

const MyVisitors = () => {
  const [visitors, setVisitors] = useState([]);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');

  // View QR dialog state. The QR is fetched as a blob through the authenticated
  // /api/qrcode/download/{visitId} endpoint (there is no static file route for it).
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [qrImageUrl, setQrImageUrl] = useState('');
  const [qrLoading, setQrLoading] = useState(false);
  const [qrLoadError, setQrLoadError] = useState('');

  // Tracks which row's download button is currently in-flight, for its own spinner
  const [downloadingId, setDownloadingId] = useState(null);

  // Delete confirmation dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [visitorPendingDelete, setVisitorPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchVisitors = useCallback(() => {
    const user = authService.getCurrentUser();
    const targetEmployeeId = user?.employeeId;

    if (!targetEmployeeId) {
      setError('Could not trace your active session employee ID. Please sign in again.');
      return;
    }

    visitorService.getMyVisitors(targetEmployeeId)
      .then(res => {
        let extractedData = null;

        if (res && res.data) {
          if (Array.isArray(res.data)) {
            extractedData = res.data;
          } else if (res.data.data && Array.isArray(res.data.data)) {
            extractedData = res.data.data;
          } else if (res.data.success !== false) {
            extractedData = res.data;
          }
        }

        if (Array.isArray(extractedData)) {
          setVisitors(extractedData);
          setError('');
        } else {
          setError(res.data?.message || 'Failed to parse host records from server response.');
        }
      })
      .catch(err => {
        console.error('Fetch Error:', err);
        setError(err.response?.data?.message || err.message || 'Error communicating with backend.');
      });
  }, []);

  useEffect(() => {
    fetchVisitors();
  }, [fetchVisitors]);

  // Revoke the QR object URL whenever it changes or the component unmounts
  useEffect(() => {
    return () => {
      if (qrImageUrl) {
        URL.revokeObjectURL(qrImageUrl);
      }
    };
  }, [qrImageUrl]);

  const formatSchedule = (dateStr, timeInStr, timeOutStr) => {
    if (!dateStr) return 'N/A';
    const shortIn = timeInStr ? timeInStr.substring(0, 5) : '??:??';
    const shortOut = timeOutStr ? timeOutStr.substring(0, 5) : '??:??';
    return `${dateStr} (${shortIn} - ${shortOut})`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'REGISTERED': return 'primary';
      case 'CHECKED_IN': return 'success';
      case 'CHECKED_OUT': return 'default';
      case 'CANCELLED': return 'error';
      default: return 'warning';
    }
  };

  const handleViewQr = async (visitor) => {
    setSelectedVisitor(visitor);
    setQrDialogOpen(true);
    setQrImageUrl('');
    setQrLoadError('');
    setQrLoading(true);
    try {
      const res = await visitorService.getQrCodeBlob(visitor.visitId);
      const objectUrl = URL.createObjectURL(res.data);
      setQrImageUrl(objectUrl);
    } catch (err) {
      console.error('QR Fetch Error:', err);
      setQrLoadError('Unable to load QR code image.');
    } finally {
      setQrLoading(false);
    }
  };

  const handleCloseQrDialog = () => {
    setQrDialogOpen(false);
    setSelectedVisitor(null);
    if (qrImageUrl) {
      URL.revokeObjectURL(qrImageUrl);
      setQrImageUrl('');
    }
  };

  const triggerBlobDownload = (blob, filename) => {
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(objectUrl);
  };

  const downloadQrForVisitor = async (visitor) => {
    if (!visitor?.visitId) return;
    const rowId = visitor.id || visitor.visitId;
    setDownloadingId(rowId);
    setActionError('');
    try {
      const res = await visitorService.getQrCodeBlob(visitor.visitId);
      triggerBlobDownload(res.data, `${visitor.visitId}.png`);
    } catch (err) {
      console.error('QR Download Error:', err);
      setActionError('Failed to download QR code image.');
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDialogDownload = () => {
    if (!qrImageUrl || !selectedVisitor) return;
    // Reuse the already-fetched blob URL directly rather than re-fetching
    const link = document.createElement('a');
    link.href = qrImageUrl;
    link.download = `${selectedVisitor.visitId}.png`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleDeleteClick = (visitor) => {
    setVisitorPendingDelete(visitor);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    if (deleting) return;
    setDeleteDialogOpen(false);
    setVisitorPendingDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!visitorPendingDelete) return;
    const id = visitorPendingDelete.id || visitorPendingDelete.visitId;
    setDeleting(true);
    setActionError('');
    try {
      // Uses the existing backend cancel endpoint: PUT /visitors/cancel/{id}
      await visitorService.cancelVisitor(id);
      setDeleteDialogOpen(false);
      setVisitorPendingDelete(null);
      fetchVisitors();
    } catch (err) {
      console.error('Cancel Visitor Error:', err);
      setActionError(err.response?.data?.message || err.message || 'Failed to cancel visitor.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>My Sponsored Visitors</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Track real-time check-in milestones, print access passes, or cancel pending pre-approvals.
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      {actionError && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setActionError('')}>{actionError}</Alert>}

      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead sx={{ bgcolor: 'action.hover' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Visitor Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Company</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Purpose</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Scheduled Window</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visitors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                  No records mapped to your host employee profile. Try registering a new visitor.
                </TableCell>
              </TableRow>
            ) : (
              visitors.map((visitor) => {
                const rowId = visitor.id || visitor.visitId;
                const isRowDownloading = downloadingId === rowId;
                return (
                  <TableRow key={rowId}>
                    <TableCell sx={{ fontWeight: 500 }}>{visitor.visitorName || 'N/A'}</TableCell>
                    <TableCell>{visitor.companyName || 'N/A'}</TableCell>
                    <TableCell>{visitor.purpose || 'N/A'}</TableCell>
                    <TableCell>{formatSchedule(visitor.visitDate, visitor.expectedInTime, visitor.expectedOutTime)}</TableCell>
                    <TableCell>
                      <Chip
                        label={visitor.status || 'UNKNOWN'}
                        color={getStatusColor(visitor.status)}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        {visitor.qrPath && (
                          <>
                            <Tooltip title="View QR">
                              <IconButton size="small" color="primary" onClick={() => handleViewQr(visitor)}>
                                <QrCode2Icon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Download QR">
                              <span>
                                <IconButton
                                  size="small"
                                  onClick={() => downloadQrForVisitor(visitor)}
                                  disabled={isRowDownloading}
                                >
                                  {isRowDownloading ? <CircularProgress size={16} /> : <DownloadIcon fontSize="small" />}
                                </IconButton>
                              </span>
                            </Tooltip>
                          </>
                        )}
                        {visitor.status === 'REGISTERED' && (
                          <Tooltip title="Delete / Cancel Visit">
                            <IconButton size="small" color="error" onClick={() => handleDeleteClick(visitor)}>
                              <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* View QR Dialog */}
      <Dialog open={qrDialogOpen} onClose={handleCloseQrDialog} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          Visitor QR Code
          <IconButton onClick={handleCloseQrDialog} sx={{ ml: 'auto' }} size="small" aria-label="close">
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent>
          {selectedVisitor && (
            <Stack spacing={2} alignItems="center" sx={{ mt: 1 }}>
              {qrLoading && (
                <Box sx={{ py: 4 }}>
                  <CircularProgress size={32} />
                </Box>
              )}
              {!qrLoading && qrImageUrl && (
                <Box
                  component="img"
                  src={qrImageUrl}
                  alt="Visitor QR Code"
                  sx={{ width: 180, height: 180, objectFit: 'contain', border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 1 }}
                />
              )}
              {!qrLoading && !qrImageUrl && (
                <Alert severity="warning" sx={{ width: '100%' }}>
                  {qrLoadError || 'QR code not available for this visit.'}
                </Alert>
              )}
              <Box sx={{ width: '100%' }}>
                <Stack direction="row" justifyContent="space-between" sx={{ py: 0.5 }}>
                  <Typography variant="body2" color="text.secondary">Visit ID</Typography>
                  <Typography variant="body2" fontWeight={600}>{selectedVisitor.visitId}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between" sx={{ py: 0.5 }}>
                  <Typography variant="body2" color="text.secondary">Visitor Name</Typography>
                  <Typography variant="body2" fontWeight={600}>{selectedVisitor.visitorName}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between" sx={{ py: 0.5 }}>
                  <Typography variant="body2" color="text.secondary">Host</Typography>
                  <Typography variant="body2" fontWeight={600}>{selectedVisitor.hostEmployeeName}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between" sx={{ py: 0.5 }}>
                  <Typography variant="body2" color="text.secondary">Purpose</Typography>
                  <Typography variant="body2" fontWeight={600}>{selectedVisitor.purpose}</Typography>
                </Stack>
              </Box>
            </Stack>
          )}
        </DialogContent>
        <Divider />
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleDialogDownload}
            disabled={!qrImageUrl}
          >
            Download
          </Button>
          <Button variant="contained" onClick={handleCloseQrDialog} sx={{ ml: 'auto' }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog} maxWidth="xs" fullWidth>
        <DialogTitle>Cancel Visitor Registration?</DialogTitle>
        <Divider />
        <DialogContent>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Are you sure you want to cancel the pre-approval for{' '}
            <strong>{visitorPendingDelete?.visitorName}</strong> ({visitorPendingDelete?.visitId})?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button variant="outlined" onClick={handleCloseDeleteDialog} disabled={deleting}>
            No, Keep It
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmDelete}
            disabled={deleting}
            sx={{ minWidth: 110 }}
          >
            {deleting ? <CircularProgress size={20} color="inherit" /> : 'Yes, Cancel'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyVisitors;
