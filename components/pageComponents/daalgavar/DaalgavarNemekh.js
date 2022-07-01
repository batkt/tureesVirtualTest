import React, { useState } from "react";
import moment from "moment";
import {
  FileExcelOutlined,
  FileImageOutlined,
  RightOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, notification, Upload } from "antd";
import { modal } from "components/ant/Modal";
import { useAuth } from "services/auth";
import AjiltanNemekh from "./ajiltanNemekh";
import uilchilgee, { url } from "services/uilchilgee";

const ognoonuud = new Array(30)
  .fill("")
  .map((v, i) => moment().add(i, "d").format("YYYY-MM-DD 23:59:59"));

function DaalgavarNemekh({ className, token, onRefresh, data }) {
  const ajitanRef = React.useRef(null);
  const { barilgiinId, baiguullaga } = useAuth();
  const [daalgavar, setDaalgavar] = React.useState({});

  function onChange(k, v) {
    setDaalgavar((a) => ({ ...a, [k]: v }));
  }

  function ajiltanSongokh() {
    const footer = [
      <Button onClick={() => ajitanRef.current.khaaya()}>Хаах</Button>,
      <Button
        style={{ backgroundColor: "#209669", color: "#ffffff" }}
        onClick={() => ajitanRef.current.khadgalya()}
      >
        сонгох
      </Button>,
    ];
    modal({
      title: "Ажилтан сонгох",
      icon: <FileExcelOutlined />,
      content: (
        <AjiltanNemekh
          ref={ajitanRef}
          token={token}
          onFinish={onRefresh}
          barilgiinId={barilgiinId}
          onChange={onChange}
          baiguullaga={baiguullaga}
          setDaalgavar={setDaalgavar}
        />
      ),
      footer,
    });
  }

  function khadgalakh() {
    if (!daalgavar.duusakhOgnoo) {
      notification.warn({
        description: "Дуусах Огноо сонгоно уу !",
        message: "Анхаар",
      });
      return;
    }
    if (!daalgavar.ajiltniiNer) {
      notification.warn({
        description: "Ажилтан сонгоно уу !",
        message: "Анхаар",
      });
      return;
    }
    if (!daalgavar.tailbar) {
      notification.warn({
        description: "Даалгавар хэсэгт сэтгэгдэлээ оруулна уу !",
        message: "Анхаар",
      });
      return;
    }

    daalgavar.baiguullagiinId = baiguullaga?._id;
    daalgavar.tuluv = 0;
    uilchilgee(token)
      .post("/daalgavarOruulya", daalgavar)
      .then((res) => {
        if (data === "Amjilttai") {
          onRefresh();
          setDaalgavar({});
          notification.info({ message: "Даалгавар амжилттай бүртгэгдлээ" });
        }
      });
  }

  return (
    <div
      data-aos="flip-right"
      data-aos-delay="200"
      data-aos-anchor-placement="top-bottom"
      className={`relative col-span-12 space-y-10 bg-white p-8 dark:bg-gray-900 xl:col-span-7 xl:px-12 2xl:px-28 ${className}`}
    >
      <div className="text-center text-xl font-medium">Даалгавар бүртгэх</div>
      <div className="flex justify-between gap-2 overflow-x-scroll p-2 lg:justify-center xl:justify-between">
        {ognoonuud.map((ognoo) => (
          <div
            key={ognoo}
            onClick={() => onChange("duusakhOgnoo", ognoo)}
            className={`w-16 cursor-pointer rounded-2xl ${
              ognoo === daalgavar.duusakhOgnoo ? "bg-green-400 text-white" : ""
            } bg-gray-200 py-2 text-center font-bold transition-colors duration-500 hover:bg-green-400 hover:text-white`}
          >
            <div className="text-xl">{moment(ognoo).format("DD")}</div>
            <div className="w-16">{moment(ognoo).format("MM")} сар</div>
          </div>
        ))}
      </div>
      <div className="text-2xl font-medium">Ажилтан сонгоно уу</div>
      <div className="flex flex-col gap-5">
        <div
          onClick={ajiltanSongokh}
          className="flex cursor-pointer justify-between rounded-xl bg-gray-200 p-5 transition-colors duration-500 hover:bg-green-400 hover:text-white xl:w-2/3"
        >
          <div className="flex gap-5">
            <UserOutlined className="text-xl" />
            <div>
              <div className="text-lg font-medium">
                {daalgavar?.ajiltniiNer && `${daalgavar?.ajiltniiNer}:`}Ажилтан
              </div>
              <div>Та ажилтангаа сонгоно уу</div>
            </div>
          </div>
          <div>
            <RightOutlined className="items-end self-center" />
          </div>
        </div>
        <Upload
          multiple={true}
          name="file"
          listType="picture"
          action={`${url}/zuragKhadgalya`}
          method="POST"
          data={{ turul: "jpg" }}
          headers={{ Authorization: `bearer ${token}` }}
          onChange={(v) =>
            onChange(
              "zurguud",
              v.fileList.map((v) => v.response?.id)
            )
          }
          className="flex flex-col"
        >
          <div className="flex cursor-pointer justify-between rounded-xl bg-gray-200 p-5 transition-colors duration-500 hover:bg-green-500 hover:text-white xl:w-2/3">
            <div className="flex gap-5">
              <FileImageOutlined className="text-xl" />
              <div>
                <div className="text-lg font-medium">Зураг</div>
                <div>Та зураг сонгоно уу</div>
              </div>
            </div>
            <div>
              <RightOutlined className="items-end self-center" />
            </div>
          </div>
        </Upload>
      </div>
      <div>
        <input
          className="mt-10 h-24 w-full border-2 p-5"
          placeholder="Даалгавар"
          type={"text"}
          onChange={(e) => onChange("tailbar", e.target.value)}
        ></input>
      </div>
      <div className="flex w-full justify-center">
        <button
          className="rounded-xl bg-green-500 py-1 px-24 text-lg font-medium text-white"
          onClick={khadgalakh}
        >
          Хадгалах
        </button>
      </div>
    </div>
  );
}

export default DaalgavarNemekh;
