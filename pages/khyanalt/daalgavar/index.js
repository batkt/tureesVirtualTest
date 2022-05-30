import {
  AudioOutlined,
  CheckOutlined,
  ClockCircleOutlined,
  DotChartOutlined,
  FlagOutlined,
  GifOutlined,
  HistoryOutlined,
  LoadingOutlined,
  PaperClipOutlined,
  PictureOutlined,
  SendOutlined,
  SmileOutlined,
  StarOutlined,
} from "@ant-design/icons";
import { Input } from "antd";
import moment from "moment";
import Admin from "components/Admin";
import React from "react";

const tasks = [{ started: true }, {}, {}];

const { TextArea } = Input;
function index() {
  const [tuluv, setTuluv] = React.useState("Идэвхитэй");
  return (
    <Admin
      khuudasniiNer="daalgavar"
      title="Даалгавар"
      className={"h-5/6 gap-5 p-6"}
    >
      <div className="col-span-4 flex flex-col space-y-5 bg-white p-8">
        <div className="grid grid-cols-3 gap-5 rounded-xl bg-indigo-300 p-2 text-xl font-medium">
          {["Идэвхитэй", "Дууссан", "Цуцлагдсан"].map((status) => (
            <div
              onClick={() => setTuluv(status)}
              className={`cursor-pointer rounded-lg p-1 text-center ${
                tuluv === status ? "bg-white text-gray-800 " : "text-gray-50"
              }`}
            >
              {status}
            </div>
          ))}
        </div>
        <div className="w-full divide-y">
          {tasks.map((mur, index) => (
            <div
              className="flex w-full flex-row space-x-2 p-2"
              key={`${index}-daalgavar`}
            >
              <div
                className={`h-10 w-10 rounded-lg bg-${
                  mur.started ? "green" : "indigo"
                }-300 text-2xl text-white`}
              >
                {mur.started ? <HistoryOutlined /> : <ClockCircleOutlined />}
              </div>
              <div className="w-full">
                <div className="flex w-full flex-row justify-between">
                  <span className="font-medium text-gray-700">Захирал</span>
                  <span className="ml-auto">{moment().format("MM/DD")}</span>
                </div>
                <div className="grid grid-cols-12">
                  <div className="col-span-11">
                    <div className="text-medium overflow-hidden overflow-ellipsis whitespace-nowrap break-words font-medium">
                      Where does it come from?
                    </div>
                    <div className="overflow-hidden overflow-ellipsis whitespace-nowrap break-words">
                      Contrary to popular belief, Lorem Ipsum is not simply
                      random text. It has roots in a piece of classical Latin
                      literature from 45 BC, making it over 2000 years old.
                      Richard McClintock, a Latin professor at Hampden-Sydney
                      College in Virginia, looked up one of the more obscure
                      Latin words, consectetur, from a Lorem Ipsum passage, and
                      going through the cites of the word in classical
                      literature, discovered the undoubtable source. Lorem Ipsum
                      comes from sections 1.10.32 and 1.10.33 of "de Finibus
                      Bonorum et Malorum" (The Extremes of Good and Evil) by
                      Cicero, written in 45 BC. This book is a treatise on the
                      theory of ethics, very popular during the Renaissance. The
                      first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..",
                      comes from a line in section 1.10.32.
                    </div>
                  </div>
                  <div className="col-span-1 flex cursor-pointer flex-col items-end text-yellow-500">
                    <StarOutlined />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* chat */}
      <div className="col-span-8 flex flex-col gap-5 divide-y bg-white p-1">
        <div className="w-full">
          <div className="px-5 py-2 text-2xl font-bold">Lorem Ipsum</div>
          <div className="flex flex-row items-center px-5">
            <div className="flex flex-row items-center space-x-2">
              <FlagOutlined />
              <div>Lorem Ipsum</div>
            </div>
            <div className="ml-auto flex flex-row items-center space-x-2 border border-gray-400 bg-gray-100 py-1 px-2">
              <CheckOutlined />
              <span>Marked as Closed</span>
            </div>
            <div className="ml-5 flex flex-row items-center space-x-2 border border-gray-400 bg-gray-100 py-1 px-2">
              ...
            </div>
            <div></div>
          </div>
        </div>
        <div className="w-full space-y-5 divide-y p-5">
          {tasks.map((mur, index) => (
            <div key={`${index}-daalgavar`} className="flex flex-row p-2">
              <div className="h-10 w-10 rounded-full bg-gray-300"></div>
              <div className="w-full p-2">
                <div className="flex flex-row">
                  <div className="py-2 font-medium">Lorem Ipsum</div>
                  <div className="ml-auto py-2 text-xs font-medium text-gray-700">
                    {moment().format("YYYY/MM/DD HH:mm")}
                  </div>
                </div>
                <div>
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry's
                  standard dummy text ever since the 1500s, when an unknown
                  printer took a galley of type and scrambled it to make a type
                  specimen book. It has survived not only five centuries, but
                  also the leap into electronic typesetting, remaining
                  essentially unchanged. It was popularised in the 1960s with
                  the release of Letraset sheets containing Lorem Ipsum
                  passages, and more recently with desktop publishing software
                  like Aldus PageMaker including versions of Lorem Ipsum.
                </div>
                {mur.started && (
                  <div className="w-full border border-gray-600">
                    <div className="flex flex-row items-center space-x-2 p-2">
                      <PictureOutlined />
                      <span>Зураг</span>
                      <PictureOutlined />
                      <span>Зураг</span>
                    </div>
                    <div className="bg-gray-500 p-2">2 хавсралт</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="w-full">
          <div className="flex h-auto w-full flex-row py-2">
            <div className="w-full px-2">
              <input
                className="h-10 w-full border border-gray-300 p-2"
                placeholder="Тайлбар"
              />
            </div>
            <div className="flex flex-row space-x-3">
              <div className="h-10 w-10 cursor-pointer rounded-full bg-gray-100 p-2 text-xl">
                <AudioOutlined />
              </div>
              <div className="h-10 w-10 cursor-pointer rounded-full bg-gray-100 p-2 text-xl">
                <PictureOutlined />
              </div>
              <div className="h-10 w-10 cursor-pointer rounded-full bg-gray-100 p-2 text-xl">
                <SendOutlined />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Admin>
  );
}

export default index;
