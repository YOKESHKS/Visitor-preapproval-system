import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Alert,
  MenuItem,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Stack,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import PrintIcon from '@mui/icons-material/Print';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate } from 'react-router-dom';
import { visitorService } from '../services/visitorService';
import { authService } from '../services/authService';

const RegisterVisitor = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [hostUser, setHostUser] = useState(null);

  const [formData, setFormData] = useState({
    visitorName: '',
    companyName: '',
    governmentId: '',
    mobileNumber: '',
    email: '',
    purpose: 'CLIENT_MEETING',
    visitDate: new Date().toISOString().split('T')[0],
    expectedInTime: '09:00',
    expectedOutTime: '18:00',
    numberOfVisitors: '1',
    remarks: ''
  });

  // Holds the registered visitor DTO returned by the backend, used to drive the success dialog
  const [registeredVisitor, setRegisteredVisitor] = useState(null);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);

  // The QR PNG is fetched as a blob through the authenticated /api/qrcode/download/{visitId}
  // endpoint (there is no static file route for it), then turned into an object URL for
  // both the <img> preview and the download/print actions.
  const [qrImageUrl, setQrImageUrl] = useState('');
  const [qrLoading, setQrLoading] = useState(false);
  const [qrLoadError, setQrLoadError] = useState('');

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user && user.employeeId) {
      setHostUser(user);
    } else {
      setError('Active employee host profile not found. Please log in again.');
    }
  }, []);

  // Revoke the object URL when the component unmounts, so we don't leak memory
  useEffect(() => {
    return () => {
      if (qrImageUrl) {
        URL.revokeObjectURL(qrImageUrl);
      }
    };
  }, [qrImageUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const loadQrImage = async (visitId) => {
    if (!visitId) return;
    setQrLoading(true);
    setQrLoadError('');
    try {
      const res = await visitorService.getQrCodeBlob(visitId);
      const blob = res.data;
      const objectUrl = URL.createObjectURL(blob);
      setQrImageUrl(objectUrl);
    } catch (err) {
      console.error('QR Fetch Error:', err);
      setQrLoadError('Unable to load QR code image.');
    } finally {
      setQrLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!hostUser || !hostUser.employeeId) {
      setError('Cannot submit request: Missing host employee authorization mapping.');
      return;
    }

    if (formData.expectedOutTime <= formData.expectedInTime) {
      setError('Expected Out Time must be strictly after Expected In Time.');
      return;
    }

    setLoading(true);

    const formatTimeToLocalTime = (timeStr) => {
      if (!timeStr) return '00:00:00';
      return timeStr.split(':').length === 2 ? `${timeStr}:00` : timeStr;
    };

    const payload = {
      visitId: `V-${Date.now()}`,
      hostEmployeeId: hostUser.employeeId,
      hostEmployeeName: hostUser.employeeName,
      visitorName: formData.visitorName.trim(),
      companyName: formData.companyName.trim() || 'N/A',
      governmentId: formData.governmentId.trim(),
      mobileNumber: formData.mobileNumber.trim(),
      email: formData.email.trim(),
      purpose: formData.purpose,
      visitDate: formData.visitDate,
      expectedInTime: formatTimeToLocalTime(formData.expectedInTime),
      expectedOutTime: formatTimeToLocalTime(formData.expectedOutTime),
      numberOfVisitors: parseInt(formData.numberOfVisitors, 10) || 1,
      remarks: formData.remarks.trim(),
      status: 'REGISTERED',
      cancelled: false,
      active: true
    };

    try {
      const response = await visitorService.registerVisitor(payload);

      // Check if the server returned a valid response wrapper or a direct raw DTO object
      const isSuccessfulWrapper = response.data && response.data.success === true;
      const isDirectDtoObject = response.data && (response.data.visitId || response.data.id);

      if (isSuccessfulWrapper || isDirectDtoObject) {
        // The backend wraps the actual VisitorDTO inside response.data.data for the
        // success-wrapper case; fall back to response.data itself for a direct DTO.
        const visitorDto = isSuccessfulWrapper ? response.data.data : response.data;

        setSuccess('Visitor pre-registration submitted successfully!');
        setRegisteredVisitor(visitorDto);
        setQrDialogOpen(true);
        loadQrImage(visitorDto.visitId);
      } else {
        setError(response.data?.message || 'The server rejected the registration parameters.');
      }
    } catch (err) {
      console.error('Registration Submission Error:', err);
      const backendMessage = err.response?.data?.message || err.message;
      setError(backendMessage || 'Network communication timeout.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadQr = () => {
    if (!qrImageUrl || !registeredVisitor) return;
    const link = document.createElement('a');
    link.href = qrImageUrl;
    link.download = `${registeredVisitor.visitId || 'visitor-qr'}.png`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handlePrintPass = () => {
    if (!registeredVisitor) return;

    const printWindow = window.open('', '_blank', 'width=500,height=700');
    if (!printWindow) {
      setError('Pop-up blocked. Please allow pop-ups to print the visitor pass.');
      return;
    }

    const passHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Visitor Entry Pass - ${registeredVisitor.visitId || ''}</title>
          <style>
            * { box-sizing: border-box; }
            body {
              font-family: 'Segoe UI', Arial, sans-serif;
              margin: 0;
              padding: 24px;
              display: flex;
              justify-content: center;
              background: #ffffff;
            }
            .pass {
              width: 340px;
              border: 2px solid #1a237e;
              border-radius: 10px;
              padding: 20px;
              text-align: center;
            }
            .company-title {
              font-size: 14px;
              font-weight: 700;
              letter-spacing: 1px;
              color: #1a237e;
              text-transform: uppercase;
              margin-bottom: 4px;
            }
            .pass-title {
              font-size: 20px;
              font-weight: 800;
              margin: 0 0 16px 0;
              color: #111;
              letter-spacing: 0.5px;
            }
            .qr-wrap {
              margin: 12px 0;
            }
            .qr-wrap img {
              width: 160px;
              height: 160px;
              object-fit: contain;
            }
            .details {
              text-align: left;
              margin-top: 12px;
              border-top: 1px dashed #999;
              padding-top: 12px;
            }
            .row {
              display: flex;
              justify-content: space-between;
              font-size: 13px;
              padding: 4px 0;
            }
            .label {
              color: #555;
              font-weight: 600;
            }
            .value {
              color: #111;
              font-weight: 500;
              text-align: right;
              max-width: 60%;
            }
            .status-badge {
              display: inline-block;
              margin-top: 14px;
              padding: 4px 14px;
              border-radius: 20px;
              background: #e8f5e9;
              color: #2e7d32;
              font-size: 12px;
              font-weight: 700;
              letter-spacing: 0.5px;
            }
            @media print {
              body { padding: 0; }
              .pass { border: 2px solid #000; }
            }
          </style>
        </head>
        <body>
          <div class="pass">
            <div class="company-title">Company Name</div>
            <div class="pass-title">VISITOR ENTRY PASS</div>
            <div class="qr-wrap">
              ${qrImageUrl ? `<img src="${qrImageUrl}" alt="Visitor QR Code" />` : '<div>No QR Available</div>'}
            </div>
            <div class="details">
              <div class="row"><span class="label">Visit ID</span><span class="value">${registeredVisitor.visitId || 'N/A'}</span></div>
              <div class="row"><span class="label">Visitor Name</span><span class="value">${registeredVisitor.visitorName || 'N/A'}</span></div>
              <div class="row"><span class="label">Company</span><span class="value">${registeredVisitor.companyName || 'N/A'}</span></div>
              <div class="row"><span class="label">Host</span><span class="value">${registeredVisitor.hostEmployeeName || 'N/A'}</span></div>
              <div class="row"><span class="label">Visit Date</span><span class="value">${registeredVisitor.visitDate || 'N/A'}</span></div>
              <div class="row"><span class="label">Purpose</span><span class="value">${registeredVisitor.purpose || 'N/A'}</span></div>
            </div>
            <div class="status-badge">${registeredVisitor.status || 'REGISTERED'}</div>
          </div>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(passHtml);
    printWindow.document.close();

    // Wait for the QR image to load before triggering print
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
    };
  };

  const handleCloseDialog = () => {
    setQrDialogOpen(false);
    if (qrImageUrl) {
      URL.revokeObjectURL(qrImageUrl);
      setQrImageUrl('');
    }
    navigate('/my-visitors');
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
      <Paper variant="outlined" sx={{ p: 4, mt: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
          Pre-Register a Visitor
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Host Session Mapping: <strong>{hostUser?.employeeName} ({hostUser?.employeeId})</strong>
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        {success && !qrDialogOpen && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField required fullWidth label="Visitor Full Name" name="visitorName" value={formData.visitorName} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Company / Organization" name="companyName" value={formData.companyName} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField required fullWidth label="Mobile Number" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField required fullWidth type="email" label="Email Address" name="email" value={formData.email} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField required fullWidth label="Government Issued ID Number" name="governmentId" value={formData.governmentId} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                required
                fullWidth
                label="Purpose of Visit"
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
              >
                <MenuItem value="CLIENT_MEETING">Client Meeting</MenuItem>
                <MenuItem value="INTERVIEW">Interview</MenuItem>
                <MenuItem value="DELIVERY">Maintenance / Delivery</MenuItem>
                <MenuItem value="VENDOR">Vendor Visit</MenuItem>
                <MenuItem value="OTHER">Other</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField required fullWidth type="date" label="Scheduled Date" name="visitDate" value={formData.visitDate} onChange={handleChange} InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField required fullWidth type="time" label="Expected Check-In" name="expectedInTime" value={formData.expectedInTime} onChange={handleChange} InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField required fullWidth type="time" label="Expected Check-Out" name="expectedOutTime" value={formData.expectedOutTime} onChange={handleChange} InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField required fullWidth type="number" label="Total Group Count" name="numberOfVisitors" value={formData.numberOfVisitors} onChange={handleChange} inputProps={{ min: 1 }} />
            </Grid>
            <Grid item xs={12} sm={8}>
              <TextField fullWidth label="Additional Notes / Remarks" name="remarks" value={formData.remarks} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button variant="outlined" color="secondary" onClick={() => navigate('/my-visitors')} disabled={loading}>Cancel</Button>
              <Button type="submit" variant="contained" color="primary" disabled={loading || !hostUser} sx={{ minWidth: 150 }}>
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Register Visit'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Dialog open={qrDialogOpen} onClose={handleCloseDialog} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CheckCircleIcon color="success" />
          Visitor Registered Successfully
          <IconButton
            onClick={handleCloseDialog}
            sx={{ ml: 'auto' }}
            size="small"
            aria-label="close"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent>
          {registeredVisitor && (
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
                  <Typography variant="body2" fontWeight={600}>{registeredVisitor.visitId}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between" sx={{ py: 0.5 }}>
                  <Typography variant="body2" color="text.secondary">Visitor Name</Typography>
                  <Typography variant="body2" fontWeight={600}>{registeredVisitor.visitorName}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between" sx={{ py: 0.5 }}>
                  <Typography variant="body2" color="text.secondary">Host Employee</Typography>
                  <Typography variant="body2" fontWeight={600}>{registeredVisitor.hostEmployeeName}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between" sx={{ py: 0.5 }}>
                  <Typography variant="body2" color="text.secondary">Visit Date</Typography>
                  <Typography variant="body2" fontWeight={600}>{registeredVisitor.visitDate}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between" sx={{ py: 0.5 }}>
                  <Typography variant="body2" color="text.secondary">Purpose</Typography>
                  <Typography variant="body2" fontWeight={600}>{registeredVisitor.purpose}</Typography>
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
            onClick={handleDownloadQr}
            disabled={!qrImageUrl}
          >
            Download QR
          </Button>
          <Button
            variant="outlined"
            startIcon={<PrintIcon />}
            onClick={handlePrintPass}
            disabled={!registeredVisitor}
          >
            Print Visitor Pass
          </Button>
          <Button variant="contained" onClick={handleCloseDialog} sx={{ ml: 'auto' }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RegisterVisitor;
