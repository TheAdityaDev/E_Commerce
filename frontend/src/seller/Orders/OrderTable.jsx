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
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../Redux Toolkit/store";
import {
  fetchSellerOrders,
  updateOrderStatus,
} from "../../Redux Toolkit/Features/Seller/sellerOrderSlice";
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
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const orderStatus = [
  { color: "#F5BCBA", label: "PLACED" },
  { color: "#1E90FF", label: "SHIPPED" },
  { color: "#32CD32", label: "DELIVERED" },
  { color: "#FF6347", label: "CANCELLED" },
];

const OrderTable = () => {
  const dispatch = useAppDispatch();
  const { orders, loading } = useAppSelector((store) => store?.sellerOrders);
  const [anchorEl, setAnchorEl] = useState({}); // Store anchor per orderId

  const handleClick = (event, orderId) => {
    setAnchorEl({ ...anchorEl, [orderId]: event.currentTarget });
  };
  const handleClose = (orderId) => {
    setAnchorEl({ ...anchorEl, [orderId]: null });
  };

  const token = secureLocalStorage.getItem("token");

  useEffect(() => {
    const timer = setTimeout(() => {
      if (token) {
        dispatch(fetchSellerOrders(token));
      }
    }, 1000);

    return () => clearTimeout(timer); // ✅ correct cleanup
  }, [dispatch]);

  const handelUpdateOrder = (id, status) => {
    dispatch(
      updateOrderStatus({
        orderId: id,
        orderStatus: status.label,
        token: token,
      }),
    );
    handleClose(id);
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Order Id</StyledTableCell>
            <StyledTableCell align="left">Product Details</StyledTableCell>
            <StyledTableCell align="left">Shipping Address</StyledTableCell>
            <StyledTableCell align="center">Order Status</StyledTableCell>
            <StyledTableCell align="center">Update</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.isArray(orders) &&
            orders.map((order) => (
              <StyledTableRow key={order._id}>
                <StyledTableCell
                  sx={{ fontWeight: "bold", fontSize: "0.75rem" }}
                >
                  #{order._id.slice(-8).toUpperCase()}
                </StyledTableCell>
                <StyledTableCell align="left">
                  {order?.orderItems?.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 mb-2 last:mb-0"
                    >
                      <div className="w-16 h-20 shrink-0">
                        <img
                          loading="lazy"
                          className="w-full h-full object-cover rounded-md border"
                          src={item?.product?.images[0]}
                          alt={item?.product?.title}
                        />
                      </div>
                      <div className="flex flex-col text-xs">
                        <span className="font-bold line-clamp-1">
                          {item?.product?.title}
                        </span>
                        <span className="text-gray-500">
                          Price: ₹{item?.product?.sellingPrice}
                        </span>
                        <span className="text-gray-500">
                          Size: {item?.size}
                        </span>
                      </div>
                    </div>
                  ))}
                </StyledTableCell>
                <StyledTableCell align="left">
                  <div className="text-xs max-w-[200px]">
                    <p className="font-semibold">
                      {order?.shippingAddress?.name}
                    </p>
                    <p className="text-gray-600">
                      {order?.shippingAddress?.address},{" "}
                      {order?.shippingAddress?.city}
                    </p>
                    <p className="text-gray-600">
                      {order?.shippingAddress?.state} -{" "}
                      {order?.shippingAddress?.pincode}
                    </p>
                  </div>
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Chip
                    label={order?.orderStatus}
                    size="small"
                    sx={{
                      fontWeight: "bold",
                      borderColor: orderStatus.find(
                        (s) => s.label === order?.orderStatus,
                      )?.color,
                      color: orderStatus.find(
                        (s) => s.label === order?.orderStatus,
                      )?.color,
                    }}
                    variant="outlined"
                  />
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Button
                    size="small"
                    variant="contained"
                    disabled={order?.orderStatus === "DELIVERED" || order?.orderStatus === "CANCELLED"}
                    onClick={(e) => handleClick(e, order._id)}
                    sx={{ textTransform: "none", fontSize: "0.7rem" }}
                  >
                   Update Status
                  </Button>
                  <Menu
                    anchorEl={anchorEl[order._id]}
                    open={Boolean(anchorEl[order._id])}
                    onClose={() => handleClose(order._id)}
                    TransitionComponent={Fade}
                  >
                    {orderStatus.map((status) => (
                      <MenuItem
                        key={status.label}
                        onClick={() => handelUpdateOrder(order._id, status)}
                      >
                        {status.label}
                      </MenuItem>
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
