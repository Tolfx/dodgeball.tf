export function processDate(amount: number) {
  // Since minimum donation is $2.50 which is 1 month
  // so if its 5 dollars, then its 2 months
  // etc
  const months = Math.floor(amount / 2.5);
  const days = Math.floor((amount % 2.5) * 30);

  const date = new Date();
  date.setMonth(date.getMonth() + months);
  date.setDate(date.getDate() + days);

  return {
    months,
    days,
    date
  };
}
