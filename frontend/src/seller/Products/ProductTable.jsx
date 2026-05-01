import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import { Edit } from "@mui/icons-material";
import Button from "@mui/material/Button";
import { useAppSelector } from "../../Redux Toolkit/store";
import ProductImagesWithPopup from "./ProductImagesWithPopup";

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

const ProductTable = () => {
  const sellerProduct = useAppSelector((store) => store.sellerProduct || {});
  const productArray = Array.isArray(sellerProduct?.products)
    ? sellerProduct.products
    : sellerProduct?.products
      ? Object.values(sellerProduct.products)
      : [];

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell align="center">Images</StyledTableCell>
            <StyledTableCell align="center">Title</StyledTableCell>
            <StyledTableCell align="center">Price</StyledTableCell>
            <StyledTableCell align="center">Selling Price</StyledTableCell>
            <StyledTableCell align="center">Update Stock</StyledTableCell>
            <StyledTableCell align="center">Update</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {productArray.map((item) => (
            <StyledTableRow key={item.id}>
              <StyledTableCell component="th" scope="row">
                <StyledTableCell component="th" scope="row">
                  <ProductImagesWithPopup
                    images={item.images}
                    title={item.title}
                  />
                </StyledTableCell>
              </StyledTableCell>
              <StyledTableCell align="center">{item.title}</StyledTableCell>
              <StyledTableCell align="center">₹{item.mrpPrice}</StyledTableCell>
              <StyledTableCell align="center">
                ₹{item.sellingPrice}
              </StyledTableCell>
              <StyledTableCell align="center">
                <Button variant="outlined" size="small">
                  In_Stock
                </Button>
              </StyledTableCell>
              <StyledTableCell align="center">
                <IconButton color="primary">
                  <Edit />
                </IconButton>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ProductTable;
