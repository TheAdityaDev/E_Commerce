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
import { useEffect, useState } from "react";
import { DeleteForeverOutlined, Edit, X } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../Redux Toolkit/store";
import {
  deleteDeal,
  getAllDeals,
} from "../../Redux Toolkit/Features/Admin/dealSlice";
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

const accountStatus = [
  { status: "PENDING_VERIFICATION", title: "Pending Verification" },
  { status: "ACTIVE", title: "Active" },
  { status: "SUSPENDED", title: "Suspended" },
  { status: "DEACTIVATED", title: "Deactivated" },
  { status: "BANDED", title: "Banded" },
  { status: "CLOSED", title: "Closed" },
];

/* -------------------- Component -------------------- */

const DealTable = () => {
  const dispatch = useAppDispatch();
  const deals = useAppSelector((state) => state?.deal);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("");

  const open = Boolean(anchorEl);

  const token = secureLocalStorage.getItem("token");
  useEffect(() => {
    if (!token ) {
      throw new Error("Something went wrong try again..");
      
    }
    dispatch(getAllDeals(token));
    console.log(secureLocalStorage.getItem("token"))
  }, [dispatch,token]);

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

  const handelDelete = (id) => {
    dispatch(deleteDeal({ id, token: secureLocalStorage.getItem("token") }));
  };

  const filteredRows = () => {
    return filterStatus === ""
      ? deals
      : deals?.filter((row) => row.accountStatus === filterStatus);
  };

  return (
    <>


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
              maxWidth: "100%",
            }}
          >
            <TableHead>
              <TableRow>
                <StyledTableCell align="center">Sr.No</StyledTableCell>
                <StyledTableCell align="center">Category</StyledTableCell>
                <StyledTableCell align="center">Discount</StyledTableCell>
                <StyledTableCell align="center">Edit</StyledTableCell>
                <StyledTableCell align="center">Delete</StyledTableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredRows()?.deals?.map((item, index) => (
                <StyledTableRow key={item._id}>
                  {/* Sr No */}
                  <StyledTableCell align="center">{index + 1}</StyledTableCell>

                  {/* Category */}
                  <StyledTableCell align="center">
                    {item.category?.name || "N/A"}
                  </StyledTableCell>

                  {/* Discount */}
                  <StyledTableCell align="center">
                    {item.discount}%
                  </StyledTableCell>

                  {/* Edit */}
                  <StyledTableCell align="center">
                    <IconButton>
                      <Edit color="primary" />
                    </IconButton>
                  </StyledTableCell>

                  {/* Delete */}
                  <StyledTableCell align="center">
                    <IconButton onClick={() => handelDelete(item._id)}>
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
