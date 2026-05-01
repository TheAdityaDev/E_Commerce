import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Container,
  Grid,
} from "@mui/material";
import {
  Lock,
  AlertCircle,
  Clock,
  Mail,
  Ban,
  CheckCircle,
  HelpCircle,
} from "lucide-react";
import { useAppSelector } from "../Redux Toolkit/store";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const blockedStatuses = {
  INACTIVE: {
    icon: Lock,
    color: "#FFA500",
    title: "Account Inactive",
    message: "Your account is currently inactive.",
    description: "Please verify your email or contact support to activate your account.",
    waitDays: 0,
    severity: "warning",
  },
  PENDING_VERIFICATION: {
    icon: Mail,
    color: "#2196F3",
    title: "Verification Pending",
    message: "Your account is awaiting verification.",
    description: "Our team is reviewing your seller profile. This typically takes 1-2 business days.",
    waitDays: 2,
    severity: "info",
  },
  BLOCKED: {
    icon: AlertCircle,
    color: "#FF9800",
    title: "Account Blocked",
    message: "Your account has been temporarily blocked.",
    description: "This usually happens due to suspicious activity or policy violation.",
    waitDays: 5,
    severity: "warning",
  },
  CLOSED: {
    icon: Ban,
    color: "#D32F2F",
    title: "Account Closed",
    message: "Your account has been closed.",
    description: "If you believe this is a mistake, please contact our support team.",
    waitDays: 0,
    severity: "error",
  },
  SUSPENDED: {
    icon: Clock,
    color: "#FF5722",
    title: "Account Suspended",
    message: "Your account has been temporarily suspended.",
    description: "Please check your email for details and instructions on how to resolve this issue.",
    waitDays: 7,
    severity: "error",
  },
  BANNED: {
    icon: Ban,
    color: "#B71C1C",
    title: "Account Banned",
    message: "Your account has been permanently banned.",
    description: "This decision is final. For more information, please contact our support team.",
    waitDays: null,
    severity: "error",
  },
  REJECTED: {
    icon: AlertCircle,
    color: "#D32F2F",
    title: "Registration Rejected",
    message: "Your seller registration has been rejected.",
    description: "You do not meet the requirements to sell on our platform.",
    waitDays: 0,
    severity: "error",
  },
};

const SellerStatusPage = () => {
  const seller = useAppSelector((state) => state.seller.profile);
  const [remainingDays, setRemainingDays] = useState(null);
  const [remainingHours, setRemainingHours] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progressPercent, setProgressPercent] = useState(0);

  useEffect(() => {
    if (!seller) {
      setLoading(false);
      return;
    }

    const statusKey = (seller.accountStatus || "").toUpperCase();
    const statusInfo = blockedStatuses[statusKey];

    if (statusInfo && statusInfo.waitDays) {
      const statusUpdatedAt = seller.statusUpdatedAt || new Date();
      const suspensionDate = dayjs(statusUpdatedAt).add(statusInfo.waitDays, "day");
      const now = dayjs();
      const diffDays = suspensionDate.diff(now, "day");
      const diffHours = suspensionDate.diff(now, "hour") % 24;

      setRemainingDays(diffDays > 0 ? diffDays : 0);
      setRemainingHours(diffHours > 0 ? diffHours : 0);

      const totalMilliseconds =
        suspensionDate.valueOf() - now.valueOf();
      const durationMilliseconds =
        suspensionDate.valueOf() - dayjs(statusUpdatedAt).valueOf();
      const passedPercent = Math.min(
        100,
        100 - (totalMilliseconds / durationMilliseconds) * 100
      );
      setProgressPercent(passedPercent);
    }

    setLoading(false);
  }, [seller]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        bgcolor="#F5F5F5"
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (!seller) {
    return (
      <Container maxWidth="sm">
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
          textAlign="center"
        >
          <CircularProgress size={60} sx={{ mb: 3 }} />
          <Typography variant="h5">Loading seller information...</Typography>
        </Box>
      </Container>
    );
  }

  const statusKey = (seller.accountStatus || "").toUpperCase();
  const statusInfo = blockedStatuses[statusKey];

  if (!statusInfo) {
    return (
      <Container maxWidth="sm">
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
          textAlign="center"
        >
          <CheckCircle size={80} color="#4CAF50" strokeWidth={1.5} />
          <Typography variant="h5" sx={{ mt: 3, fontWeight: 600 }}>
            Your Account is Active
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            You have full access to your seller dashboard.
          </Typography>
          <Button
            variant="contained"
            color="success"
            sx={{ mt: 4 }}
            onClick={() => (window.location.href = "/seller")}
          >
            Go to Dashboard
          </Button>
        </Box>
      </Container>
    );
  }

  const IconComponent = statusInfo.icon;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            overflow: "hidden",
          }}
        >
          {/* Status Header */}
          <Box
            sx={{
              background: `linear-gradient(135deg, ${statusInfo.color} 0%, ${statusInfo.color}dd 100%)`,
              color: "white",
              py: 4,
              textAlign: "center",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
              <IconComponent size={80} strokeWidth={1.5} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              {statusInfo.title}
            </Typography>
            <Chip
              label={seller.accountStatus}
              sx={{
                backgroundColor: "rgba(255,255,255,0.3)",
                color: "white",
                fontWeight: 600,
              }}
            />
          </Box>

          <CardContent sx={{ pt: 4, pb: 4 }}>
            {/* Main Message */}
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                mb: 2,
                color: "#333",
                textAlign: "center",
              }}
            >
              {statusInfo.message}
            </Typography>

            {/* Description */}
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{
                mb: 3,
                textAlign: "center",
                lineHeight: 1.6,
              }}
            >
              {statusInfo.description}
            </Typography>

            {/* Countdown Timer */}
            {statusInfo.waitDays && statusInfo.waitDays > 0 && remainingDays !== null && (
              <Box
                sx={{
                  backgroundColor: "#F5F5F5",
                  borderRadius: 2,
                  p: 3,
                  mb: 3,
                }}
              >
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ mb: 2, fontWeight: 600, textAlign: "center" }}
                >
                  Time Remaining
                </Typography>
                <Box sx={{ display: "flex", gap: 2, justifyContent: "center", mb: 3 }}>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: 700, color: statusInfo.color }}
                    >
                      {remainingDays}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Days
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: 700, color: statusInfo.color }}
                    >
                      {remainingHours}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Hours
                    </Typography>
                  </Box>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={progressPercent}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: "#E0E0E0",
                    "& .MuiLinearProgress-bar": {
                      borderRadius: 4,
                      backgroundColor: statusInfo.color,
                    },
                  }}
                />
              </Box>
            )}

            {/* Key Info Grid */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6}>
                <Box
                  sx={{
                    backgroundColor: "#F5F5F5",
                    p: 2,
                    borderRadius: 2,
                    textAlign: "center",
                  }}
                >
                  <Typography variant="caption" color="textSecondary">
                    Account Status
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, mt: 1 }}>
                    {seller.accountStatus || "Unknown"}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box
                  sx={{
                    backgroundColor: "#F5F5F5",
                    p: 2,
                    borderRadius: 2,
                    textAlign: "center",
                  }}
                >
                  <Typography variant="caption" color="textSecondary">
                    Business Name
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, mt: 1, overflow: "hidden", textOverflow: "ellipsis" }}
                  >
                    {seller.businessName || "N/A"}
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            {/* Action Buttons */}
            <Box sx={{ display: "flex", gap: 2, flexDirection: "column" }}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<HelpCircle size={20} />}
                sx={{
                  backgroundColor: statusInfo.color,
                  "&:hover": {
                    backgroundColor: statusInfo.color,
                    opacity: 0.9,
                  },
                }}
                onClick={() => (window.location.href = "mailto:support@rambazaar.com")}
              >
                Contact Support
              </Button>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => (window.location.href = "/")}
              >
                Return to Homepage
              </Button>
            </Box>

            {/* Help Text */}
            <Box
              sx={{
                backgroundColor: "#FFF3CD",
                border: "1px solid #FFE4A6",
                borderRadius: 2,
                p: 2,
                mt: 3,
              }}
            >
              <Typography variant="caption" sx={{ color: "#856404", display: "block" }}>
                <strong>Need Help?</strong> Our support team is available 24/7.
                Contact us via email or call +91-XXXX-XXXX for assistance.
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default SellerStatusPage;