import {
  AudioOutlined,
  CheckOutlined,
  ClockCircleOutlined,
  FlagOutlined,
  HistoryOutlined,
  PictureOutlined,
  SendOutlined,
  StarOutlined,
} from "@ant-design/icons";
import moment from "moment";
import Admin from "components/Admin";
import React from "react";
import useJagsaalt from "hooks/useJagsaalt";
import { useAuth } from "services/auth";
import uilchilgee from "services/uilchilgee";
import shalgaltKhiikh from "services/shalgaltKhiikh";
import { Popconfirm } from "antd";

const order = { createdAt: -1 };

function index({ token }) {
  const [tuluv, setTuluv] = React.useState("Идэвхитэй");
  const [daalgavar, setDaalgavar] = React.useState();
  const { ajiltan } = useAuth();

  const query = React.useMemo(
    () => ({
      ajiltniiId: ajiltan?._id,
      tuluv: tuluv === "Идэвхитэй" ? [0, 1] : tuluv === "Дууссан" ? 2 : 3,
    }),
    [ajiltan, tuluv]
  );

  const task = useJagsaalt(ajiltan && "/daalgavar", query, order);

  function daalgavarKhuleejAvlaa() {
    uilchilgee(token)
      .post("/daalgavarKhuleejAvlaa", { id: daalgavar._id })
      .then(({ data }) => {
        if (data === "Amjilttai") setDaalgavar((v) => ({ ...v, tuluv: 1 }));
      })
      .finally(() => task.mutate());
  }
  function daalgavarDuusgalaa() {
    uilchilgee(token)
      .post("/daalgavarDuusgalaa", { id: daalgavar._id })
      .then(({ data }) => {
        if (data === "Amjilttai") setDaalgavar((v) => ({ ...v, tuluv: 2 }));
      })
      .finally(() => task.mutate());
  }

  function batlakh() {
    if (daalgavar.tuluv === 0) daalgavarKhuleejAvlaa();
    else if (daalgavar.tuluv === 1) daalgavarDuusgalaa();
  }

  return (
    <Admin
      khuudasniiNer="daalgavar"
      title="Даалгавар"
      className={"h-5/6 gap-5 p-6"}
      onSearch={task.onSearch}
    >
      <div className="col-span-12 flex flex-col space-y-5 bg-white p-8 lg:col-span-6 xl:col-span-4">
        <div className="grid grid-cols-3 gap-5 rounded-xl bg-green-500 p-2 text-xl font-medium">
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
          {task?.data?.jagsaalt?.map((mur, index) => (
            <div
              className={`flex w-full cursor-pointer flex-row space-x-2 p-2 ${
                daalgavar?._id === mur._id ? "bg-green-100" : ""
              }`}
              key={`${index}-daalgavar`}
              onClick={() => setDaalgavar(mur)}
            >
              <div
                className={`h-10 w-10 rounded-lg bg-${
                  mur.started ? "green" : "green"
                }-500 text-2xl text-white`}
              >
                {mur.tuluv === 1 ? (
                  <HistoryOutlined />
                ) : (
                  <ClockCircleOutlined />
                )}
              </div>
              <div className="w-full">
                <div className="flex w-full flex-row justify-between">
                  <span className="font-medium text-gray-700">Захирал</span>
                  <span className="ml-auto">
                    {moment(mur.ognoo).format("YYYY-MM-DD HH:mm")}
                  </span>
                </div>
                <div className="grid grid-cols-12">
                  <div className="col-span-11">
                    <div
                      className={`text-medium overflow-hidden overflow-ellipsis whitespace-nowrap break-words font-medium text-${
                        mur.tuluv === 1
                          ? "yellow"
                          : mur.tuluv === 2
                          ? "green"
                          : "red"
                      }-500`}
                    >
                      {mur.tuluv === 1
                        ? "Хүлээн авсан"
                        : mur.tuluv === 2
                        ? "Дууссан"
                        : "Эхлээгүй"}
                    </div>
                    <div className="overflow-hidden overflow-ellipsis whitespace-nowrap break-words">
                      {mur.tailbar}
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
      {daalgavar && (
        <div className="col-span-12 flex flex-col gap-5 divide-y bg-white p-1 lg:col-span-6 xl:col-span-8">
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
            <div className="flex w-full justify-center pt-5">
              <Popconfirm
                disabled={daalgavar.tuluv === 2}
                title={`Та даалгавар ${
                  0 === daalgavar.tuluv
                    ? "Хүлээж авах "
                    : 1 === daalgavar.tuluv
                    ? "дуусгах"
                    : ""
                } уу?`}
                okText="Тийм"
                cancelText="Үгүй"
                onConfirm={() => batlakh()}
              >
                <div
                  className={`text-md cursor-pointer rounded-full bg-${
                    0 === daalgavar.tuluv
                      ? "red"
                      : 1 === daalgavar.tuluv
                      ? "yellow"
                      : "green"
                  }-400 py-2 px-5 font-medium text-gray-50`}
                >
                  {0 === daalgavar.tuluv
                    ? "Хүлээж авах"
                    : 1 === daalgavar.tuluv
                    ? "Хийгдэж байна"
                    : "Дууссан"}
                </div>
              </Popconfirm>
            </div>
            <div className="flex flex-row p-2">
              <div className="h-10 w-10 rounded-full bg-gray-300"></div>
              <div className="w-full p-2">
                <div className="flex flex-row">
                  <div className="py-2 font-medium">Lorem Ipsum</div>
                  <div className="ml-auto py-2 text-xs font-medium text-gray-700">
                    {moment().format("YYYY/MM/DD HH:mm")}
                  </div>
                </div>
                <div>{daalgavar?.tailbar}.</div>
                {!!daalgavar?.file && daalgavar?.file?.length > 0 && (
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
      )}
    </Admin>
  );
}

export const getServerSideProps = shalgaltKhiikh;

export default index;
