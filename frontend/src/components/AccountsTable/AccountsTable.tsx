import { useState, useEffect } from "react";
import Table from "../Table/Table";
import { getAccounts } from "../../services/api";
import { formatDollarAmount } from "../../utils/format";
import type { AccountType } from "../../types/accountType";

const AccountsTable = () => {
  const [accounts, setAccounts] = useState<AccountType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAccounts();
  }, []);

  async function loadAccounts() {
    setLoading(true);
    try {
      const data = await getAccounts();
      setAccounts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const columns = [
    {
      header: "Account ID",
      render: (account: AccountType) => account.id,
    },
    {
      header: "Name",
      render: (account: AccountType) => account.name,
    },
    {
      header: "Starting Balance",
      render: (account: AccountType) =>
        formatDollarAmount(account.starting_balance),
    },
    {
      header: "Current Balance",
      render: (account: AccountType) =>
        formatDollarAmount(account.current_balance),
    },
  ];

  return (
    <>
      <Table
        data={loading ? [] : accounts}
        columns={columns}
        title="Accounts"
      />
    </>
  );
};

export default AccountsTable;
