import _ from "lodash";
function formatNumber(num, fixed = 2) {
  const parsed = Number(num);

  if (_.isNaN(parsed)) {
    return (0).toFixed(fixed);
  }

  const fixedNum = parsed.toFixed(fixed);

  if (Number(fixedNum) === 0) {
    return (0).toFixed(fixed);
  }
  const [intPart, decimalPart] = fixedNum.split(".");

  const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return fixed === 0 ? formattedInt : `${formattedInt}.${decimalPart}`;
}

export default formatNumber;

/**
 * Use as `formatter` prop on Ant Design <InputNumber>.
 * Only adds comma separators — does NOT force ".00" on every
 * keystroke (which breaks typing). Pair with parseNumber and
 * set precision={2} on the InputNumber for 2dp on commit.
 */
export function formatNumberInput(value) {
  if (value === undefined || value === null || value === "") return "";
  const parts = `${value}`.split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

/** Use as `parser` prop paired with formatNumberInput. */
export function parseNumber(value) {
  return value?.replace(/,/g, "") || "";
}
