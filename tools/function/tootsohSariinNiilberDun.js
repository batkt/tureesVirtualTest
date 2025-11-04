export default function tootsohSariinNiilberDun(geree = {}) {
  const sariinTurees = Number(geree?.sariinTurees) || 0;

  const togtmolZardluud = Array.isArray(geree?.zardluud)
    ? geree.zardluud.filter((zardal) =>
        ["Тогтмол", "Дурын"].includes(zardal?.turul)
      )
    : [];

  const togtmolZardliinNiit = togtmolZardluud.reduce((sum, zardal) => {
    const dun =
      Number(zardal?.tulukhDun) ||
      Number(zardal?.dun) ||
      Number(zardal?.tariff) ||
      0;
    return sum + dun;
  }, 0);

  const baritsaaAvakhEsekh = geree?.baritsaaAvakhEsekh;
  const baritsaaDun = Number(geree?.baritsaaAvakhDun) || 0;
  const baritsaaAvakhKhugatsaa = Number(geree?.baritsaaAvakhKhugatsaa) || 0;

  const baritsaaNemegdsenTulbur =
    baritsaaAvakhEsekh && baritsaaAvakhKhugatsaa > 0
      ? baritsaaDun / baritsaaAvakhKhugatsaa
      : 0;

  const total =
    sariinTurees + togtmolZardliinNiit + baritsaaNemegdsenTulbur;

  return Math.round((total + Number.EPSILON) * 100) / 100;
}
