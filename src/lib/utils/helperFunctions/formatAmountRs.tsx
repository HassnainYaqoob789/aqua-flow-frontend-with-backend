export const formatAmountRs = (
  amount?: number | string,
  options?: {
    currency?: boolean;
    decimals?: number;
  }
): string => {
  if (amount === null || amount === undefined || amount === "") return "Rs 0";

  const num = Number(amount);

  if (isNaN(num)) return "Rs 0";

  const decimals = options?.decimals ?? 0;

  const formatted = num.toLocaleString("en-PK", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return options?.currency === false ? formatted : `Rs ${formatted}`;
};
