export const formatDate = (date: string): string => {
  const [year, month, day] = date.split("-");
  return `${month}/${day}/${year}`;
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
});

export const formatDollarAmount = (amount: number): string => currencyFormatter.format(amount);