import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/store";
import { fetchTransactionBySeller } from "../../../Redux Toolkit/Features/Seller/transactionSlice";
import secureLocalStorage from "react-secure-storage";

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
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function formatDate(value) {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleString();
  } catch {
    return String(value);
  }
}

function orderLabel(order) {
  if (!order) return "—";
  const id = typeof order === "object" && order?._id ? order._id : order;
  const s = String(id);
  return s.length > 8 ? `…${s.slice(-8)}` : s;
}

const statusColor = {
  SUCCESS: "success",
  PAID: "success",
  PENDING: "warning",
  FAILED: "error",
  REFUNDED: "error",
};

const TransactionTable = () => {
  const dispatch = useAppDispatch();
  const { transaction } = useAppSelector((store) => store?.transaction);

  const shippingCharges= 79

  useEffect(() => {
    const token = secureLocalStorage.getItem("token");
    dispatch(fetchTransactionBySeller(token));
  }, [dispatch]);

  const rows = Array.isArray(transaction) ? transaction : [];

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="transactions table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Date</StyledTableCell>
            <StyledTableCell align="center">Customer</StyledTableCell>
            <StyledTableCell align="center">Order</StyledTableCell>
            <StyledTableCell align="center">Status</StyledTableCell>
            <StyledTableCell align="center">Amount</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} align="center">
                No transactions yet
              </TableCell>
            </TableRow>
          ) : (
            rows.map((item) => {
              const customer = item?.customer;
              const name =
                typeof customer === "object" && customer !== null
                  ? customer.name || customer.email || customer.mobile || "—"
                  : "—";
              const payStatus = String(item?.paymentStatus || "PENDING");
              const chipColor = statusColor[payStatus] || "default";

              return (
                <StyledTableRow key={item?._id}>
                  <StyledTableCell>{formatDate(item?.date || item?.createdAt)}</StyledTableCell>
                  <StyledTableCell align="center">{name}</StyledTableCell>
                  <StyledTableCell align="center">
                    {orderLabel(item?.order)}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <Chip label={payStatus} color={chipColor} size="small" variant="outlined" />
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    ₹{Number(item?.amount - shippingCharges ?? 0).toLocaleString("en-IN")}
                  </StyledTableCell>
                </StyledTableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TransactionTable;
