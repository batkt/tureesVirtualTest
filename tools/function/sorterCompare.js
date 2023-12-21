function getSortValue(v) {
  let response = undefined;
  switch (v) {
    case "descend":
      response = -1;
      break;
    case "ascend":
      response = 1;
      break;
    default:
      break;
  }
  return response;
}

export default function sorterCompare(s, setOrder, defaultValue) {
  let sort = {};
  if (_.isArray(s))
    s.map((r) => {
      sort[r.field] = getSortValue(r.order);
    });
  else if (_.isObject(s)) {
    sort[s.field] = getSortValue(s.order);
    if (s.order === undefined) sort = _.clone(defaultValue);
  }
  setOrder({ ...sort });
}
