import React from "react";
import moment from "moment";
import uilchilgee, { aldaaBarigch } from "services/uilchilgee";

function Daalgavar({ onClose, token, ...object }) {
  const { turul, tailbar, duusakhOgnoo, ajiltniiNer, _id } = object || {};

  function sonorduulgaKharlaa() {
    uilchilgee(token).post("/sanalKharlaa", { id: _id }).catch(aldaaBarigch);
  }

  return (
    <div
      id="notification-with-split-buttons-content"
      className="flex flex-row items-center "
      onClick={onClose}
    >
      <div className="mr-2 flex"></div>
      <div className="md:mr-40">
        <div className="font-medium">
          {turul}
          {ajiltniiNer}
        </div>
        <div className="mt-1 text-gray-600">
          {moment(duusakhOgnoo).format("YYYY-MM-DD")}
        </div>
        <div className="mt-1  flex flex-row space-x-10 text-gray-600">
          {tailbar}
          <div className="ml-auto rounded-md bg-red-400 px-2 text-white">
            Даалгавар
          </div>
        </div>
      </div>
      <div className="dark:border-dark-5 absolute top-0 bottom-0 right-0 hidden flex-col border-l border-gray-200 md:flex">
        <a
          className="text-theme-1 dark:border-dark-5 flex flex-1 items-center justify-center border-b border-gray-200 px-6 font-medium dark:text-gray-500"
          onClick={(event) => {
            event.stopPropagation();
            sonorduulgaKharlaa();
          }}
        >
          Дэлгэрэнгүй
        </a>
        <a
          data-dismiss="notification"
          className="flex flex-1 items-center justify-center px-6 font-medium text-gray-600"
          onClick={onClose}
        >
          Хаах
        </a>
      </div>
    </div>
  );
}

export default Daalgavar;
