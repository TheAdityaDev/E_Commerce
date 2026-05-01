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
  FormControl,
  InputLabel,
  Select,
  IconButton,
  MenuItem,
} from "@mui/material";
import { useState } from "react";
import { DeleteForeverOutlined, Edit } from "@mui/icons-material";
import { X } from "lucide-react";

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
  { status: "BANDED", title: "Banded" },
  { status: "CLOSED", title: "Closed" },
];

/* -------------------- Component -------------------- */

const HomeCategoryTable = ({categories}) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [filterStatus, setFilterStatus] = useState("");

  const displayHeaders = ["Sr.No", "ID", "Image", "Category Name", "Edit", "Delete"];

  return (
    <>
      {/* FULL SCREEN IMAGE MODAL */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <button className=" absolute bg-white z-20 top-5 px-2 py-3 rounded-2xl right-10 cursor-pointer" onClick={() => setSelectedImage(null)}>
            <X size={28} />
          </button>

          <img className="max-h-[90vh] max-w-full rounded-2xl" src={selectedImage} alt="" />
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
                {displayHeaders.map((header) => (
                  <StyledTableCell key={header}>{header}</StyledTableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {categories?.map((item, index) => (
                <StyledTableRow key={item?._id}>
                  <StyledTableCell>{index + 1}</StyledTableCell>
                  <StyledTableCell>{item?._id}</StyledTableCell>

                  <StyledTableCell>
                    <img
                      loading="lazy"
                      onClick={() => setSelectedImage(item?.image)}
                      src={item?.image}
                      className="w-30 h-auto rounded-md object-cover cursor-pointer hover:scale-110 "
                      alt={item?.section || item?.name}
                    />
                  </StyledTableCell>

                  <StyledTableCell >{ item?.name || item?.categoryName}</StyledTableCell>

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
      </div>
    </>
  );
};

export default HomeCategoryTable;
