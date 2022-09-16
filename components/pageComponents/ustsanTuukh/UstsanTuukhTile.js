import React, { useMemo } from "react";
import moment from "moment";

function UstsanTuukhTile(props) {
  const turul = props.class;
  const turulMemo = useMemo(() => {
    var text;
    switch (turul) {
      case "gereeniiZagvar":
        text = "Гэрээний загвар";
        break;
      case "talbai":
        text = "Талбай";
        break;
      case "Talbai":
        text = "Талбай";
        break;
      case "ajiltanBurtgel":
        text = "Ажилтан бүртгэл";
        break;
      case "Khariltsagch":
        text = "Харилцагч";
        break;
      case "khariltsagch":
        text = "Харилцагч";
        break;
      case "khariltsagch":
        text = "Харилцагч";
        break;
      case "asuult":
        text = "Асуулт";
        break;
      case "nekhemjlekhiinZagvar":
        text = "Нэхэмжлэл загвар";
        break;
      case "zardal":
        text = "Зардлын жагсаалт";
        break;
      case "eBarimt":
        text = "И-баримтын бүртгэл";
        break;
      case "zogsool":
        text = "Зогсоол";
        break;
      case "anket":
        text = "Анкетын асуулга бэлдэх";
        break;
      case "gereeniiGuilgee":
        text = "Гэрээний гүйлгээ";
        break;
      case "mailiinZagvar":
        text = "И-мэйл загвар";
        break;
      default:
        text = "Тодорхойгүй";
        break;
    }
    return text;
  });

  return (
    <div className="mb-3 rounded-md border border-solid border-gray-400 bg-white p-2 shadow-2xl dark:bg-gray-900">
      <div className="flex w-full flex-row">
        <div className="font-bold dark:text-gray-100">{props.turluud}</div>

        <div className="ml-auto text-sm font-medium text-gray-600 dark:text-gray-200">
          {turulMemo}
        </div>
      </div>
      <div className="flex w-full flex-row dark:text-gray-100">
        <div>{moment(props.createdAt).format("YYYY-MM-DD hh:mm")}</div>
        <div className="ml-auto font-medium">{props.ajiltniiNer}</div>
      </div>
    </div>
  );
}

export default UstsanTuukhTile;
