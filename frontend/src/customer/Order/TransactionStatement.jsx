import React, { useState } from "react";
import { Button, TextField } from "@mui/material";
import { generateStatementPDF } from "./pdf/generateStatementPDF";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

const TransactionStatement = ({ transactions, user }) => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const filteredTransactions = React.useMemo(() => {
    if (!fromDate || !toDate) return transactions || [];

    const start = new Date(fromDate);
    const end = new Date(toDate);
    end.setHours(23, 59, 59, 999); // include full day

    return (transactions || []).filter((tx) => {
      const txDate = new Date(tx.createdAt || tx.date);
      return txDate >= start && txDate <= end;
    });
  }, [transactions, fromDate, toDate]);

  const handleDownload = () => {
    generateStatementPDF(filteredTransactions, fromDate, toDate, user);
  };

  

  return (
    <div className="flex flex-col justify-center gap-4 items-center">
      <div className="p-4 flex justify-center gap-4 items-center">
        <TextField
          type="date"
          label="From"
          inputMode="numeric"
          enterKeyHint="enter"
          InputLabelProps={{ shrink: true }}
          value={fromDate}
          required
          onChange={(e) => setFromDate(e.target.value)}
        />

        <TextField
          type="date"
          label="To"
          required
          inputMode="numeric"
          enterKeyHint="enter"
          InputLabelProps={{ shrink: true }}
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />

        {
          fromDate && toDate && new Date(fromDate) > new Date(toDate) && (
            <p className="text-red-500 text-sm absolute top-28">
              "From" date cannot be later than "To" date.
            </p>
          )
        }

      </div>
        <Button
          className="cursor-pointer active:scale-95 top-3"
          disabled={
            !fromDate || !toDate || new Date(fromDate) > new Date(toDate)
          }
          variant="contained"
          onClick={handleDownload}
        >
          Download PDF
        </Button>
    </div>
  );
};

export default TransactionStatement;
