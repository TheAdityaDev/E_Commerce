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
  IconButton,
} from "@mui/material";
import { useState } from "react";
import { DeleteForeverOutlined, Edit, X } from "@mui/icons-material";

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
    "https://media.istockphoto.com/id/973481674/photo/stylish-man-posing-on-grey-background.jpg?s=2048x2048&w=is&k=20&c=kd0X3EwcoMRCXtgyyVLmuMuWvZe5d7MewThg2ebgwW4=",
    "9876543210",
    "John Pvt Ltd",
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

const HomeCategoryTable = ({ image }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("");
  const [showImage, setShowImage] = useState(false);

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
    <>
      {/* FULL SCREEN IMAGE MODAL */}
      {showImage && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <button
            onClick={() => setShowImage(false)}
            className="absolute top-5 right-5 text-white bg-gray-700/50 p-2 rounded-full hover:bg-gray-600 transition"
          >
            <X size={28} />
          </button>

          <img
          loading="eager"
          fetchPriority="high"
            className="max-h-[90vh] max-w-full rounded-xl object-contain"
            src={image}
            alt="Product"
          />
        </div>
      )}
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
                <StyledTableCell>Sr.No</StyledTableCell>
                <StyledTableCell>ID</StyledTableCell>
                <StyledTableCell>Image</StyledTableCell>
                <StyledTableCell>Category</StyledTableCell>
                <StyledTableCell>Name</StyledTableCell>
                <StyledTableCell>Edit</StyledTableCell>
                <StyledTableCell>Delete</StyledTableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredRows.map((row) => (
                <StyledTableRow key={row.id}>
                  <StyledTableCell>{row.sellerName}</StyledTableCell>
                  <StyledTableCell>{row.email}</StyledTableCell>

                  <StyledTableCell>
                    <img
                    loading="lazy"
                    onClick={() => setShowImage(true)}
                      src={image}
                      className="w-30 h-20 rounded-md object-cover cursor-pointer hover:scale-110 "
                      alt=""
                    />
                  </StyledTableCell>

                  <StyledTableCell>{row.gstin}</StyledTableCell>

                  <StyledTableCell>{row.businessName}</StyledTableCell>
                  <StyledTableCell>
                    <IconButton>
                      <Edit color="primary" />
                    </IconButton>
                  </StyledTableCell>
                  <StyledTableCell>
                    <IconButton>
                      <DeleteForeverOutlined color="error" />
                    </IconButton>
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
    </>
  );
};

export default HomeCategoryTable;
