import { Card, Divider } from "@mui/material";
import React, { useEffect, useMemo } from "react";
import TransactionTable from "../sidebar/Transaction/TransactionTable";
import { useAppDispatch, useAppSelector } from "../../Redux Toolkit/store";
import secureLocalStorage from "react-secure-storage";
import { fetchSellerReport } from "../../Redux Toolkit/Features/Seller/sellerSlice";
import { fetchTransactionBySeller } from "../../Redux Toolkit/Features/Seller/transactionSlice";

const Payment = () => {
  const dispatch = useAppDispatch();
  const sellerSlice = useAppSelector((store) => store.seller || {});
  const transactions = useAppSelector(
    (store) => store.transaction?.transaction ?? [],
  );

  const totalFromTransactions = useMemo(() => {
    if (!Array.isArray(transactions)) return 0;
    return transactions.reduce(
      (sum, t) => sum + (Number(t?.amount) || 0),
      0,
    );
  }, [transactions]);

  useEffect(() => {
    const token = secureLocalStorage.getItem("token");
    if (!token) return;

    if (!sellerSlice.isReportFetched) {
      dispatch(fetchSellerReport());
    }
    dispatch(fetchTransactionBySeller(token));
  }, [dispatch, sellerSlice.isReportFetched]);

  const report = sellerSlice.report;
  const totalEarnings =
    report?.totalEarnings ?? report?.netEarnings ?? report?.totalSales ?? null;
  const transactionCount = report?.totalTransactions ?? transactions.length;

  return (
    <div className="space-y-5">
      <div>
        <Card className="p-5 rounded-md space-y-4">
          <h1>Total earnings</h1>
          <h1 className="font-bold text-xl pb-1">
            {totalEarnings != null && totalEarnings > 0 ? (
              `₹${Number(totalEarnings).toLocaleString("en-IN")}`
            ) : (
              <span className="font-normal text-base text-gray-600">
                No earnings yet
              </span>
            )}
          </h1>
          <Divider />
          <p className="py-2">
            Total transaction amount (from payments):{" "}
            <span className="font-semibold">
              ₹{totalFromTransactions.toLocaleString("en-IN")}
            </span>
          </p>
          <p className="text-sm text-gray-600">
            Transactions recorded: {transactionCount}
          </p>
        </Card>
      </div>
      <TransactionTable />
    </div>
  );
};

export default Payment;
