import moment from "moment";
import addMinutes from "./addMinutes";
import setTime from "./setTime";
function zakhialgiinTsaguudOlyo(
  zakhilagiinOgnoo,
  baiguullaga,
  khuvaarilsanTsaguud
) {
  if (!baiguullaga) return [];
  var ognoo = new Date(zakhilagiinOgnoo);
  var odoo = new Date();
  let tsag = baiguullaga?.ajillakhUdruud?.find(
    (x) => !!x.udruud.find((d) => d === ognoo.getDay().toString())
  );

  if (!tsag) return [];

  setTime(ognoo, tsag.neekhTsag);
  let duusakhOgnoo = new Date(zakhilagiinOgnoo);
  setTime(duusakhOgnoo, tsag.khaakhTsag);
  let tsagiinJagsaalt = [];
  for (ognoo; ognoo < duusakhOgnoo; ognoo = addMinutes(ognoo, 30)) {
    if (ognoo > odoo) tsagiinJagsaalt.push(moment(ognoo).format("HH:mm"));
  }
  return [...tsagiinJagsaalt];
}

export default zakhialgiinTsaguudOlyo;
