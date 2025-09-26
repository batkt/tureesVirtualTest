import { Divider, InputNumber, Input, notification, DatePicker } from "antd";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import uilchilgee, { aldaaBarigch } from "services/uilchilgee";
import moment from "moment";
import { CloseCircleOutlined } from "@ant-design/icons";
import { t } from "i18next";

function Table({ data, updateMyData }) {
  return (
    <div className="table w-full">
      <div className="table-row">
        <div className="table-cell text-center dark:text-gray-100">№</div>
        <div className="table-cell w-20 text-center dark:text-gray-100">
          Огноо
        </div>
        <div className="table-cell w-14 text-center dark:text-gray-100">
          Хувь
        </div>
        <div className="table-cell text-center dark:text-gray-100">
          Төлөх дүн
        </div>
        <div className="table-cell text-center dark:text-gray-100">Тайлбар</div>
      </div>
      {data?.map((mur, index) => (
        <div className="mt-2 table-row" key={index + "khyamdral"}>
          <div className="table-cell p-1 text-center">{index + 1}.</div>
          <div className="table-cell w-20">
            {moment(mur.ognoo).format("YYYY-MM-DD")}
          </div>
          <div className="table-cell w-14">
            <InputNumber
              style={{ width: "100%" }}
              placeholder="Хөнгөлөх хувь"
              title="Хөнгөлөх хувь"
              min={0}
              max={100}
              value={mur.khyamdraliinKhuvi}
              onChange={(v) => updateMyData(index, "khyamdraliinKhuvi", v)}
            />
          </div>
          <div className="table-cell ">
            <InputNumber
              style={{ width: "100%" }}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              placeholder="Төлөх дүн"
              value={mur.tulukhDun}
              min={0}
              onChange={(v) => updateMyData(index, "khyamdral", v)}
            />
          </div>
          <div className="table-cell ">
            <Input
              style={{ width: "100%" }}
              placeholder="Тайлбар"
              value={mur.tailbar}
              onChange={({ target }) =>
                updateMyData(index, "tailbar", target.value)
              }
            />
          </div>
          <div className="table-cell cursor-pointer fill-current p-2 text-red-500">
            <CloseCircleOutlined />
          </div>
        </div>
      ))}
    </div>
  );
}

function disabledDate(current) {
  return current && current < moment().endOf("day");
}

function Khungulukh({ data, token, onFinish, destroy }, ref) {
  const [sar, setSar] = useState(moment().add(1, "month"));
  const [jagsaalt, setJagsaalt] = useState([]);

  useEffect(() => {
    var jdata = [];
    new Array(1).fill("").map((mur, index) => {
      data?.tulukhUdur.forEach((udur) => {
        jdata.push({
          turul: "khyamdral",
          ognoo: moment(sar).set("date", udur),
          khyamdraliinKhuvi: 0,
          khyamdral: 0,
          tulukhDun: data?.sariinTurees,
          gereeniiId: data?._id,
        });
      });
    });
    setJagsaalt([...jdata]);
  }, [sar]);

  React.useImperativeHandle(
    ref,
    () => ({
      khaaya() {
        _.isFunction(onFinish) && onFinish();
        destroy();
      },
      khadgalya() {
        const { tulukhDun, ...khyamdral } = jagsaalt[0];
        uilchilgee(token)
          .post("/gereeniiGuilgeeKhadgalya", {
            guilgee: khyamdral,
          })
          .then(({ data }) => {
            notification.success({
              placement: "bottomRight",
              message: t("Амжилттай"),
            });
            _.isFunction(onFinish) && onFinish();
            destroy();
          })
          .catch(aldaaBarigch);
      },
    }),
    [jagsaalt]
  );

  const updateMyData = (rowIndex, columnId, value) => {
    setJagsaalt((old) => {
      var row = old[rowIndex];
      row[columnId] = value;
      var tulukhDun = data?.sariinTurees / data?.tulukhUdur.length;
      if (columnId === "khyamdraliinKhuvi") {
        row["tulukhDun"] = tulukhDun - (tulukhDun * value) / 100;
        row["khyamdral"] = (tulukhDun * value) / 100;
      }
      return [...old];
    });
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex flex-row items-center space-x-2">
        <label>{t("Хөнгөлөх сар")}</label>
        <DatePicker
          disabledDate={disabledDate}
          picker="month"
          placeholder="сар"
          onChange={setSar}
        />
      </div>
      <Divider />
      <label>{t("Хөнгөлөлт оруулах")}</label>
      <Table className="mt-2" data={jagsaalt} updateMyData={updateMyData} />
    </div>
  );
}

export default React.forwardRef(Khungulukh);
