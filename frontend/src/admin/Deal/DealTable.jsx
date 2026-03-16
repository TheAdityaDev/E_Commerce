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
    "30%",
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

const DealTable = ({ image }) => {
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
            className="max-h-[90vh] max-w-full rounded-xl object-contain"
            src={image}
            alt="Product"
          />
        </div>
      )}
      <div style={{ padding: "16px" }}>
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
                <StyledTableCell align="center">Sr.No</StyledTableCell>
                <StyledTableCell align="center">Image</StyledTableCell>
                <StyledTableCell align="center">Category</StyledTableCell>
                <StyledTableCell align="center">Discount</StyledTableCell>
                <StyledTableCell align="center">Edit</StyledTableCell>
                <StyledTableCell align="center">Delete</StyledTableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredRows.map((row) => (
                <StyledTableRow key={row.id}>
                  <StyledTableCell align="center">
                    {row.sellerName}
                  </StyledTableCell>

                  <StyledTableCell>
                   <img
                      onClick={() => setShowImage(true)}
                      src={image}
                      className="w-30 h-20 lg:ml-35 sm:ml-25 rounded-md justify-center object-cover cursor-pointer hover:scale-110"
                      alt=""
                    />
                  </StyledTableCell>

                  <StyledTableCell align="center">{row.gstin}</StyledTableCell>

                  <StyledTableCell align="center">
                    {row.businessName}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <IconButton>
                      <Edit color="primary" />
                    </IconButton>
                  </StyledTableCell>
                  <StyledTableCell align="center">
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

export default DealTable;
