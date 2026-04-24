export const formatter = (value) => {
  if (value === undefined || value === null || value === "") return "";
  const str = String(value);
  // If user is still typing a decimal (e.g. "123."), preserve it
  const parts = str.split(".");
  const intPart = parts[0].replace(/[^\d-]/g, "") || "0";
  const formatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  if (parts.length > 1) {
    return `${formatted}.${parts[1]}`;
  }
  return formatted;
};
export const parser = (value) => value.replace(/\$\s?|(,*)/g, "");
