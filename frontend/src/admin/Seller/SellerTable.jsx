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
import { useState } from "react";

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

function createData(
  id,
  sellerName,
  email,
  mobile,
  gstin,
  businessName,
  accountStatus,
) {
  return { id, sellerName, email, mobile, gstin, businessName, accountStatus };
}

const rows = [
  createData(
    1,
    "John Traders",
    "john@email.com",
    "9876543210",
    "22AAAAA0000A1Z5",
    "John Pvt Ltd",
    "ACTIVE",
  ),
  createData(
    2,
    "Aditya Traders",
    "john@email.com",
    "9876543210",
    "22AAAAA0000A1Z5",
    "John Pvt Ltd",
    "PENDING_VERIFICATION",
  ),
];

const accountStatus = [
  { status: "PENDING_VERIFICATION", title: "Pending Verification" },
  { status: "ACTIVE", title: "Active" },
  { status: "SUSPENDED", title: "Suspended" },
  { status: "DEACTIVATED", title: "Deactivated" },
  { status: "BANDED", title: "Banded" },
  { status: "CLOSED", title: "Closed" },
];

/* -------------------- Component -------------------- */

const SellerTable = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("");

  const open = Boolean(anchorEl);

  const handleMenuClick = (event, rowId) => {
    setAnchorEl(event.currentTarget);
    setSelectedRowId(rowId);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedRowId(null);
  };

  const handleUpdateStatus = (newStatus) => {
    console.log("Row:", selectedRowId, "New Status:", newStatus);
    handleClose();
  };

  const filteredRows =
    filterStatus === ""
      ? rows
      : rows.filter((row) => row.accountStatus === filterStatus);

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
                Business Name
              </StyledTableCell>
              <StyledTableCell>Account Status</StyledTableCell>
              <StyledTableCell align="center">Change Status</StyledTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredRows.map((row) => (
              <StyledTableRow key={row.id}>
                <StyledTableCell>{row.sellerName}</StyledTableCell>
                <StyledTableCell>{row.email}</StyledTableCell>

                <StyledTableCell
                  sx={{ display: { xs: "none", sm: "table-cell" } }}
                >
                  {row.mobile}
                </StyledTableCell>

                <StyledTableCell
                  sx={{ display: { xs: "none", md: "table-cell" } }}
                >
                  {row.gstin}
                </StyledTableCell>

                <StyledTableCell
                  sx={{ display: { xs: "none", md: "table-cell" } }}
                >
                  {row.businessName}
                </StyledTableCell>

                <StyledTableCell>{row.accountStatus}</StyledTableCell>

                <StyledTableCell align="center">
                  <Button
                    variant="outlined"
                    size="small"
                    fullWidth
                    sx={{
                      fontSize: { xs: "0.7rem", sm: "0.8rem" },
                    }}
                    onClick={(e) => handleMenuClick(e, row.id)}
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
