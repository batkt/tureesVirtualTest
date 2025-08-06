import moment from "moment";
function dateDiff(start, end, turul = "minute") {
  return moment(end).diff(moment(start), turul);
}

export default dateDiff;
