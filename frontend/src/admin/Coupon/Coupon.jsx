import {
  IconButton,
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button as MuiButton,
  Tooltip,
  Chip,
  Box,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import React, { useEffect, useState , lazy , Suspense } from "react";
import { Gift } from "lucide-react";
import {
  DeleteForeverSharp,
  Edit,
  Visibility as Eye,
} from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../Redux Toolkit/store";
import {
  fetchAllCoupon,
  deleteCoupon,
  toggleCouponStatus,
  resetSuccess,
} from "../../Redux Toolkit/Features/Admin/couponSlice";
import secureLocalStorage from "react-secure-storage";
const CouponForm = lazy(() => import("./CouponForm"));


const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    fontWeight: 600,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const Coupon = () => {
  const dispatch = useAppDispatch();
  const coupon = useAppSelector((store) => store?.adminCoupon);

  const token = secureLocalStorage.getItem("token");

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);

  useEffect(() => {
    dispatch(fetchAllCoupon({ token }));
  }, [dispatch, token]);

  useEffect(() => {
    if (coupon.success) {
      dispatch(resetSuccess());
    }
  }, [coupon.success, dispatch]);

  const handleDeleteClick = (coupon) => {
    setSelectedCoupon(coupon);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedCoupon) {
      await dispatch(deleteCoupon({ id: selectedCoupon._id, token }));
      setOpenDeleteDialog(false);
      setSelectedCoupon(null);
    }
  };

  const handleViewClick = async (coupon) => {
    setSelectedCoupon(coupon);
    setOpenViewDialog(true);
  };

  const handleEditClick = async (coupon) => {
    setSelectedCoupon(coupon);
    setOpenEditDialog(true);
  };

  const handleToggleStatus = async (coupon) => {
    await dispatch(toggleCouponStatus({ id: coupon._id, token }));
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const isExpired = (endDate) => {
    return new Date(endDate) < new Date();
  };

  const isActive = (coupon) => {
    return coupon.isActive && !isExpired(coupon.validityExpireDate);
  };

  return (
    <div className="p-4">
      <div className="mb-6 flex items-center">
        <Gift className="inline-block mr-2 text-red-500" fontSize="large" />
        <h2 className="text-2xl font-bold">Coupons</h2>
      </div>

      {coupon.loading && (
        <div className="flex justify-center items-center h-64">
          <p>Loading coupons...</p>
        </div>
      )}

      {coupon.error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          {coupon.error}
        </div>
      )}

      {!coupon.loading && coupon.coupons && coupon.coupons.length > 0 ? (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="coupon table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Code</StyledTableCell>
                <StyledTableCell align="center">Discount %</StyledTableCell>
                <StyledTableCell align="center">Start Date</StyledTableCell>
                <StyledTableCell align="center">End Date</StyledTableCell>
                <StyledTableCell align="center">
                  Min Order Value
                </StyledTableCell>
                <StyledTableCell align="center">Usage</StyledTableCell>
                <StyledTableCell align="center">Status</StyledTableCell>
                <StyledTableCell align="center">Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {coupon?.coupons?.map((c) => (
                <StyledTableRow key={c._id}>
                  <StyledTableCell className="font-semibold">
                    {c.code}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <Chip
                      label={`${c.discountPercentage}%`}
                      color="primary"
                      variant="outlined"
                      size="small"
                    />
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {formatDate(c.validityStartDate)}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {formatDate(c.validityExpireDate)}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    ₹{c.minimumOrderValue}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {c.usedCount} {c.usageLimit ? `/ ${c.usageLimit}` : ""}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <Chip
                      label={isActive(c) ? "ACTIVE" : "INACTIVE"}
                      color={isActive(c) ? "success" : "error"}
                      size="small"
                      variant="outlined"
                    />
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <Box className="flex gap-2 justify-center">
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          onClick={() => handleViewClick(c)}
                          color="info"
                        >
                          <Eye fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Coupon">
                        <IconButton
                          size="small"
                          onClick={() => handleEditClick(c)}
                          color="warning"
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Coupon">
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteClick(c)}
                          color="error"
                        >
                          <DeleteForeverSharp fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        !coupon.loading && (
          <Paper className="p-8 text-center">
            <p className="text-gray-500">
              No coupons found. Create one to get started!
            </p>
          </Paper>
        )
      )}

      {/* View Dialog */}
      <Dialog
        open={openViewDialog}
        onClose={() => setOpenViewDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle className="font-bold">Coupon Details</DialogTitle>
        <DialogContent>
          {selectedCoupon && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 text-sm">Code</p>
                  <p className="font-semibold">{selectedCoupon.code}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Discount</p>
                  <p className="font-semibold">
                    {selectedCoupon.discountPercentage}%
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 text-sm">Start Date</p>
                  <p className="font-semibold">
                    {formatDate(selectedCoupon.validityStartDate)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">End Date</p>
                  <p className="font-semibold">
                    {formatDate(selectedCoupon.validityExpireDate)}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Minimum Order Value</p>
                <p className="font-semibold">
                  ₹{selectedCoupon.minimumOrderValue}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Usage</p>
                <p className="font-semibold">
                  {selectedCoupon.usedCount}{" "}
                  {selectedCoupon.usageLimit
                    ? `/ ${selectedCoupon.usageLimit}`
                    : "Unlimited"}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Status</p>
                <Chip
                  label={isActive(selectedCoupon) ? "ACTIVE" : "INACTIVE"}
                  color={isActive(selectedCoupon) ? "success" : "error"}
                  size="small"
                  className="mt-2"
                />
              </div>
              {selectedCoupon.description && (
                <div>
                  <p className="text-gray-600 text-sm">Description</p>
                  <p className="text-sm">{selectedCoupon.description}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <MuiButton onClick={() => setOpenViewDialog(false)}>Close</MuiButton>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete the coupon{" "}
          <strong>{selectedCoupon?.code}</strong>? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <MuiButton onClick={() => setOpenDeleteDialog(false)}>
            Cancel
          </MuiButton>
          <MuiButton
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            disabled={coupon.loading}
          >
            {coupon.loading ? "Deleting..." : "Delete"}
          </MuiButton>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Coupon</DialogTitle>
        <Suspense fallback={<div className="p-4">Loading form...</div>}>
        <DialogContent>
          {selectedCoupon && (
            <CouponForm
              editingCoupon={selectedCoupon}
              onSuccess={() => setOpenEditDialog(false)}
            />
          )}
        </DialogContent>
        </Suspense>
      </Dialog>
    </div>
  );
};

export default Coupon;
