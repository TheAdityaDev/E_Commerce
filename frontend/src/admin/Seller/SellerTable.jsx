import { styled } from "@mui/material/styles";
import {
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Menu,
  MenuItem,
  Fade,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../Redux Toolkit/store";
import {
  fetchSellers,
  updateSellerAccountStatus,
} from "../../Redux Toolkit/Features/Seller/sellerSlice";
import secureLocalStorage from "react-secure-storage";

/* -------------------- Styled Components -------------------- */

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    fontSize: "0.9rem",
    [theme.breakpoints.down("sm")]: {
      fontSize: "0.75rem",
    },
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: "0.85rem",
    [theme.breakpoints.down("sm")]: {
      fontSize: "0.75rem",
    },
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

/* -------------------- Dummy Data -------------------- */

const accountStatus = [
  { status: "PENDING_VERIFICATION", title: "Pending Verification" },
  { status: "ACTIVE", title: "Active" },
  { status: "SUSPENDED", title: "Suspended" },
  { status: "DEACTIVATED", title: "Deactivated" },
  { status: "BANNED", title: "Banded" },
  { status: "CLOSED", title: "Closed" },
];

/* -------------------- Component -------------------- */

const SellerTable = () => {
  const dispatch = useAppDispatch();
  const sellers = useAppSelector((store) => store?.seller?.sellers);

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("");
  const [status, setStatus] = useState("");

  const open = Boolean(anchorEl);

  const token = secureLocalStorage.getItem("token");
  useEffect(() => {
    dispatch(fetchSellers({ status, token }));
  }, [status, token, dispatch]);

  const handleMenuClick = (event, rowId) => {
    setAnchorEl(event.currentTarget);
    setSelectedRowId(rowId);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedRowId(null);
  };

  const handleUpdateStatus = (newStatus) => {
    console.log("Status", newStatus);

    dispatch(
      updateSellerAccountStatus({
        token: token,
        sellerId: selectedRowId,
        status: newStatus,
      }),
    ).then(() => {
      dispatch(fetchSellers({ status: "", token }));
    });
    handleClose();
  };

  const filteredSeller = () => {
    return filterStatus === ""
      ? sellers
      : sellers?.filter((row) => row.accountStatus === filterStatus);
  };

  return (
    <div style={{ padding: "16px" }}>
      {/* -------------------- Filter Section -------------------- */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <FormControl
          size="small"
          sx={{
            minWidth: { xs: "100%", sm: 200 },
          }}
        >
          <InputLabel>Status</InputLabel>
          <Select
            value={filterStatus}
            label="Status"
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            {accountStatus.map((item) => (
              <MenuItem key={item.status} value={item.status}>
                {item.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      {/* -------------------- Table Section -------------------- */}
      <TableContainer
        component={Paper}
        sx={{
          width: "100%",
          overflowX: "auto",
          marginTop: 2,
        }}
      >
        <Table
          sx={{
            minWidth: 800,
          }}
        >
          <TableHead>
            <TableRow>
              <StyledTableCell>Seller Name</StyledTableCell>
              <StyledTableCell>Email</StyledTableCell>
              <StyledTableCell
                sx={{ display: { xs: "none", sm: "table-cell" } }}
              >
                Mobile
              </StyledTableCell>
              <StyledTableCell
                sx={{ display: { xs: "none", md: "table-cell" } }}
              >
                GSTIN
              </StyledTableCell>
              <StyledTableCell
                sx={{ display: { xs: "none", md: "table-cell" } }}
              >
                Account Created
              </StyledTableCell>
              <StyledTableCell>Account Status</StyledTableCell>
              <StyledTableCell align="center">Change Status</StyledTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredSeller(sellers || [])?.map((item) => (
              <StyledTableRow key={item._id}>
                <StyledTableCell>{item?.sellerName}</StyledTableCell>
                <StyledTableCell>{item?.email}</StyledTableCell>

                <StyledTableCell
                  sx={{ display: { xs: "none", sm: "table-cell" } }}
                >
                  {item.mobile}
                </StyledTableCell>

                <StyledTableCell
                  sx={{ display: { xs: "none", md: "table-cell" } }}
                >
                  {item.GSTIN}
                </StyledTableCell>

                <StyledTableCell
                  sx={{ display: { xs: "none", md: "table-cell" } }}
                >
                  {item.createdAt
                    ? new Date(item.createdAt).toLocaleDateString()
                    : "N/A"}
                </StyledTableCell>

                <StyledTableCell>{item.accountStatus}</StyledTableCell>
                <StyledTableCell align="center">
                  <Button
                    variant="outlined"
                    size="small"
                    fullWidth
                    sx={{
                      fontSize: { xs: "0.7rem", sm: "0.8rem" },
                    }}
                    onClick={(e) => handleMenuClick(e, item._id)}
                  >
                    Update
                  </Button>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* -------------------- Status Menu -------------------- */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slots={{ transition: Fade }}
      >
        {accountStatus.map((item) => (
          <MenuItem
            key={item.status}
            value={item.status}
            onClick={() => handleUpdateStatus(item.status)}
          >
            {item.title}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default SellerTable;
