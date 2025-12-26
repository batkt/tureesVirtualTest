import moment from "moment";

function toSeconds(t) {
  const tt = moment(t).format("HH:mm");
  const [hh, mm] = tt.split(":").map(Number);
  return hh * 3600 + mm * 60;
}

/**
 * Returns the tariff price for a given minute threshold (defaults to 60) for the
 * current time segment.
 *
 * Expects `tulburuud` in the same shape used by `tools/function/tulburBodyo.js`:
 * - each item has `tsag: [startTime, endTime]`
 * - each item has `tariff: [{ minut: number, tulbur: number }, ...]`
 */
export default function getTsagiinTariff(
  tulburuud,
  now = new Date(),
  minuteThreshold = 60
) {
  if (!Array.isArray(tulburuud) || tulburuud.length === 0) return 0;

  const nowSec = toSeconds(now);
  const normalized = tulburuud
    .map((x) => ({
      ...x,
      tariff: Array.isArray(x?.tariff) ? [...x.tariff] : [],
    }))
    .filter((x) => x.tariff.length > 0);

  if (normalized.length === 0) return 0;

  const pickFrom = (item) => {
    const tariffs = [...item.tariff].sort(
      (a, b) => (a?.minut || 0) - (b?.minut || 0)
    );
    // Prefer exact/first tariff that covers the threshold (e.g. 60 minutes).
    const match = tariffs.find(
      (t) => Number(t?.minut) >= Number(minuteThreshold)
    );
    return Number((match || tariffs[tariffs.length - 1])?.tulbur) || 0;
  };

  // Find the active time segment for "now"
  for (const item of normalized) {
    const startSec = toSeconds(item.tsag?.[0]);
    const endSec = toSeconds(item.tsag?.[1]);

    // Handle ranges that don't wrap over midnight
    if (startSec <= endSec) {
      if (startSec <= nowSec && nowSec < endSec) return pickFrom(item);
    } else {
      // Handle ranges that wrap over midnight
      if (nowSec >= startSec || nowSec < endSec) return pickFrom(item);
    }
  }

  // Fallback: first segment
  return pickFrom(normalized[0]);
}
