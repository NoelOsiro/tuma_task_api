'use client';

import type { CardProps } from '@mui/material/Card';

import { _bankingRecentTransitions } from 'src/_mock/_overview';

import { BankingRecentTransitions } from '../overview/banking/banking-recent-transitions';

export function BidNotifications({ sx, ...other }: CardProps) {
  return (

    <BankingRecentTransitions
      title="Recent bids"
      tableData={_bankingRecentTransitions}
      headCells={[
        { id: 'description', label: 'Description' },
        { id: 'date', label: 'Date' },
        { id: 'amount', label: 'Amount' },
        { id: 'status', label: 'Status' },
        { id: '' },
      ]}
    />
  );
}
