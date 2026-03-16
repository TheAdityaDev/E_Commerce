import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Fade from "@mui/material/Fade";
import { useState } from "react";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
];

const orderStatus = [
  { color: "#FFA500", label: "PENDING" },
  { color: "#F5BCBA", label: "PLACED" },
  { color: "#F5BCBA", label: "CONFIRMED" },
  { color: "#1E90FF", label: "SHIPPED" },
  { color: "#32CD32", label: "DELIVERED" },
  { color: "#FF0000", label: "CANCELLED" },
];

const OrderTable = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };


  const handelUpdateOrder =(id , status) =>{
    const log = {id,status}
    console.table(log)
    handleClose()
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Order Id</StyledTableCell>
            <StyledTableCell align="right">Product Details</StyledTableCell>
            <StyledTableCell align="center">Shopping Address</StyledTableCell>
            <StyledTableCell align="center">Order Status</StyledTableCell>
            <StyledTableCell align="center">Update</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <StyledTableRow key={row.name}>
              <StyledTableCell>{row.calories}</StyledTableCell>
              <StyledTableCell>
                <div className="flex justify-between">
                  <div className="flex gap-3 flex-wrap">
                    <img
                    loading="lazy"
                      className="h-30 w-30 object-cover rounded-lg"
                      src="https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcSE87yh8fXjYZo7eS7Bt2QfO51ukrWAUPPSbM_ETDMVYPCK9Z_Z5BHQXfnGWkGm7IgN3vemQtquDiq3Oy4fVDSUZnzhGotuTeYqItI2c2gbpCYmZTZ6VTTWUA"
                      alt=""
                    />
                  </div>
                  <div className="flex flex-col justify-center py-6">
                    <h1>Title: Men Shoes</h1>
                    <h1>MRP: ₹2999</h1>
                    <h1>Color: Blue</h1>
                    <h1>Size: M</h1>
                  </div>
                </div>
              </StyledTableCell>
              <StyledTableCell align="center" className="m-20">
                {row.fat}
              </StyledTableCell>
              <StyledTableCell align="center">
                  <Chip
                    label="hello"
                    color="primary"
                    variant="outlined"
                  />
                  
                </StyledTableCell>
              <StyledTableCell align="center">
                <Button
                  id="fade-button"
                  aria-controls={open ? "fade-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  onClick={handleClick}
                  variant="outlined"
                  size="small"
                >
                  Status
                </Button>

                <Menu
                  id="fade-menu"
                  slotProps={{
                    list: {
                      "aria-labelledby": "fade-button",
                    },
                  }}
                  slots={{ transition: Fade }}
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                >
                  {orderStatus.map((status) => (
                    <MenuItem onClick={()=>handelUpdateOrder(status.label,status)}>{status.label}</MenuItem>
                  ))}
                </Menu>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OrderTable;
