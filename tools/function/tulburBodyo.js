import moment from "moment";

export const tulburBodoy = async (
  tulburuud,
  garakh,
  orson,
  undsenUne,
  undsenMin,
  dotorZogsoolMinut,
  zuruuMinut
) => {
  let dun = 0;
  const diff = Math.abs(garakh - orson);
  let niitMinut = zuruuMinut ? zuruuMinut : Math.floor(diff / (1000 * 60));
  const seconds = async (t) => {
    const tt = moment(t).format("HH:mm");
    let [tsag, min] = tt.split(":").map(Number);
    return tsag * 3600 + min * 60;
  };
  const tariffTootsokh = async (v, min) => {
    let maxMin = v[v.length - 1]?.minut;
    let tariff = 0;
    for await (const z of v) {
      tariff = z.tulbur;
      if (min <= z.minut) break;
    }
    if (min > maxMin) {
      const time = undsenMin ? 30 : 60;
      let tsag = Math.ceil((min - maxMin) / time);
      tariff = tsag * undsenUne + tariff;
    }
    return tariff;
  };
  const tulburuudTootsokh = async (orsonSec, garsanSec) => {
    let tulbur = 0;
    for await (const x of tulburuud) {
      const zStartSec = await seconds(x.tsag[0]);
      const zEndSec = await seconds(x.tsag[1]);
      x.tariff.sort(function (a, b) {
        return a.minut - b.minut;
      });
      if (zStartSec <= orsonSec && zEndSec > orsonSec && zEndSec >= garsanSec) {
        const bsanMin = zuruuMinut ? zuruuMinut : (garsanSec - orsonSec) / 60;
        const tariff = await tariffTootsokh(x.tariff, bsanMin);
        if (tariff > 0) tulbur = tariff;
        break;
      } else if (
        zStartSec <= orsonSec &&
        zEndSec > orsonSec &&
        zEndSec <= garsanSec
      ) {
        const bsanMin = Math.trunc(
          zuruuMinut ? zuruuMinut : (zEndSec - orsonSec) / 60
        );
        const tariff = await tariffTootsokh(x.tariff, bsanMin);
        if (tariff > 0) tulbur = tulbur + tariff;
      } else if (
        orsonSec < zStartSec &&
        zStartSec < garsanSec &&
        zEndSec >= garsanSec
      ) {
        const bsanMin = zuruuMinut ? zuruuMinut : (garsanSec - zStartSec) / 60;
        const tariff = await tariffTootsokh(x.tariff, bsanMin);
        if (tariff > 0) tulbur = tulbur + tariff;
      } else if (orsonSec < zStartSec && zEndSec < garsanSec) {
        const bsanMin = zuruuMinut ? zuruuMinut : (zEndSec - zStartSec) / 60;
        const tariff = await tariffTootsokh(x.tariff, bsanMin);
        if (tariff > 0) tulbur = tulbur + tariff;
      }
    }
    return tulbur;
  };
  let orsonSec = await seconds(orson);
  let garsanSec = await seconds(garakh);
  if (dotorZogsoolMinut > 0) {
    const niitSec = (niitMinut - dotorZogsoolMinut) * 60;
    niitMinut = niitMinut - dotorZogsoolMinut;
    if (niitMinut < 1440 && niitSec < garsanSec) {
      orsonSec = garsanSec - niitSec;
    }
  }
  if (orsonSec > garsanSec) {
    let dun1 = 0;
    let dun2 = 0;
    if (dotorZogsoolMinut > 0) {
      if (niitMinut < 1440) {
        const niitSec = niitMinut * 60;
        dun1 = await tulburuudTootsokh(86400 - niitSec, 86400);
      } else {
        const zurvv = (niitMinut % 1440) * 60;
        dun1 = await tulburuudTootsokh(86400 - zurvv, 86400);
      }
    } else {
      dun1 = await tulburuudTootsokh(orsonSec, 86400);
      dun2 = await tulburuudTootsokh(0, garsanSec);
    }
    if (niitMinut < 1440) {
      dun = dun1 + dun2;
    } else {
      const khonog = Math.trunc(niitMinut / 1440);
      const khonogDun = await tulburuudTootsokh(0, 86400);
      dun = khonogDun * khonog + dun1 + dun2;
    }
  } else {
    if (niitMinut < 1440) {
      dun = await tulburuudTootsokh(orsonSec, garsanSec);
    } else {
      let dun1 = 0;
      if (dotorZogsoolMinut > 0) {
        const zurvv = (niitMinut % 1440) * 60;
        dun1 = await tulburuudTootsokh(86400 - zurvv, 86400);
      } else {
        dun1 = await tulburuudTootsokh(orsonSec, garsanSec);
      }
      const khonog = Math.trunc(niitMinut / 1440);
      const khonogDun = await tulburuudTootsokh(0, 86400);
      dun = khonogDun * khonog + dun1;
    }
  }
  return dun;
};
