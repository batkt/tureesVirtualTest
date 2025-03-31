import React, { useMemo, useEffect } from "react";
import {
  DatePicker,
  message,
  Select,
  Upload,
  Switch,
  Tooltip,
  Button,
  Table,
  InputNumber,
} from "antd";

import { InboxOutlined } from "@ant-design/icons";
import uilchilgee, { url } from "services/uilchilgee";
import useGereeniiZagvar from "hooks/useGereeniiZagvar";
import locale from "antd/lib/date-picker/locale/mn_MN";
import _ from "lodash";
import moment from "moment";
import { useTranslation } from "react-i18next";
import useJagsaalt from "hooks/useJagsaalt";
import formatNumber from "tools/function/formatNumber";

function GuilgeeExceleesOruulakhOlnoor(
  {
    token,
    destroy,
    zam,
    garchig,
    tailbar,
    zagvariinZam,
    onFinish,
    baiguullaga,
    barilgiinId,
  },
  ref
) {
  const [data, setData] = React.useState([]);
  const [ognoo, setOgnoo] = React.useState(null);
  const { t, i18n } = useTranslation();
  const [ashiglaltiinId, setGereeniiZagvar] = React.useState(null);
  const [aldaa, setAldaa] = React.useState(null);
  const [nuatBodokhEsekh, setNuatBodokhEsekh] = React.useState(true);

  const fetchData = async () => {
    if (!ognoo) {
      message.warning("Огноо сонгоно уу!");
      return;
    }
    try {
      const response = await uilchilgee(token).post("/tooluurMedeelelTatya", {
        ognoo: moment(ognoo).format("YYYY-MM-DD HH:mm:ss"),
      });

      console.log("--- fetched data ---", response.data);
      setData(response.data || []);
      message.success("Өгөгдөл амжилттай татагдлаа!");
    } catch (error) {
      console.error("Алдаа:", error);
      message.error("Өгөгдөл татахад алдаа гарлаа!");
    } finally {
    }
  };

  const handleSave = async () => {
    try {
      const payload = {
        ashiglaltiinId: ashiglaltiinId,
        barilgiinId: barilgiinId,
        nuatBodokhEsekh: nuatBodokhEsekh,
        jagsaalt: data
          .filter((item) => item.guidliinKoep > 0)
          .map((item) => ({
            baiguullagiinId: baiguullaga._id,
            barilgiinId: barilgiinId,
            ognoo: moment(ognoo).format("YYYY-MM-DD HH:mm:ss"),
            zardliinId: ashiglaltiinId,
            zardliinNer: "Цахилгаан",
            talbainDugaar: item.talbainDugaar,
            suuliinZaalt: item.suuliinZaalt,
            guidliinKoep: item.guidliinKoep,
          })),
      };

      const response = await uilchilgee(token).post(
        "/zaaltOlnoorOruulya",
        payload
      );

      if (response.status === 200) {
        message.success("Өөрчлөлтүүд амжилттай хадгалагдлаа!");
        console.log(" ----- response -----", response);
        destroy();
      } else {
        message.error("Алдаа гарлаа. Дахин оролдоно уу.");
      }
    } catch (error) {
      console.error("Алдаа:", error);
      message.error("Өгөгдөл хадгалахад алдаа гарлаа!");
    }
  };

  const query = useMemo(
    () => ({
      turul: { $in: ["кВт", "1м3"] },
      barilgiinId,
    }),
    [barilgiinId]
  );

  const zardal = useJagsaalt(
    "/ashiglaltiinZardluud",
    query,
    undefined,
    undefined,
    undefined,
    token
  );

  React.useImperativeHandle(
    ref,
    () => ({
      khaaya() {
        _.isFunction(onFinish) && onFinish();
        destroy();
      },
    }),
    []
  );

  function zagvarAvya() {
    uilchilgee(token)
      .get(`/${zagvariinZam}`, { responseType: "blob" })
      .then(({ data }) => {
        const url = window.URL.createObjectURL(data);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        // the filename you want
        a.download = `${zagvariinZam}.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      });
  }

  useEffect(() => {
    function keyUp(e) {
      if (e.key === "Escape") {
        e.preventDefault();
        destroy();
      }
    }
    document.addEventListener("keyup", keyUp);
    return () => document.removeEventListener("keyup", keyUp);
  }, []);

  const columns = [
    {
      title: t("Талбайн Дугаар"),
      dataIndex: "talbainDugaar",
      key: "talbainDugaar",
    },
    {
      title: t("Тоолуурын Дугаар"),
      dataIndex: "tooluuriinDugaar",
      key: "tooluuriinDugaar",
    },
    {
      title: t("Заалт"),
      dataIndex: "suuliinZaalt",
      key: "suuliinZaalt",
      render: (text) => <span>{text.toFixed(2)}</span>,
    },
    {
      title: t("Гүйдлийн коэффициент"),
      dataIndex: "guidliinKoep",
      key: "guidliinKoep",

      render: (text, record, index) => (
        <InputNumber
          min={0}
          //   step={0.01}
          value={record.guidliinKoep || 0}
          onChange={(value) => {
            const newData = [...data];
            newData[index].guidliinKoep = value;
            setData(newData);
          }}
        />
      ),
    },
  ];
  // const columns = [
  //   {
  //     title: t("Талбайн Дугаар"),
  //     dataIndex: "talbainDugaar",
  //     key: "talbainDugaar",
  //   },
  //   {
  //     title: t("Тоолуурын Дугаар"),
  //     dataIndex: "tooluuriinDugaar",
  //     key: "tooluuriinDugaar",
  //   },
  //   {
  //     title: t("Заалт"),
  //     dataIndex: "suuliinZaalt",
  //     key: "suuliinZaalt",
  //     render: (text) => <span>{text.toFixed(2)}</span>,
  //   },
  //   {
  //     title: t("Гүйдлийн коэффициент"),
  //     dataIndex: "guidliinKoep",
  //     key: "guidliinKoep",
  //     render: (text, record, index) => (
  //       <InputNumber
  //         min={0}
  //         value={record.guidliinKoep || 0}
  //         onChange={(value) => {
  //           const newData = [...data];
  //           newData[index].guidliinKoep = value;

  //           if (value > 0) {
  //             message.warning("Гүйдлийн коэффициент 0-с их байна!", 3);
  //           }

  //           setData(newData);
  //         }}
  //       />
  //     ),
  //   },
  // ];

  const selectedZardal = useMemo(() => {
    return zardal?.jagsaalt?.find((z) => z._id === ashiglaltiinId);
  }, [ashiglaltiinId, zardal]);

  useEffect(() => {
    if (selectedZardal?.ner === "Цахилгаан" && ognoo) {
      fetchData();
    }
  }, [selectedZardal, ognoo]);

  return (
    <div>
      <div className="flex items-center justify-between gap-4 ">
        <DatePicker
          value={ognoo}
          onChange={setOgnoo}
          allowClear={false}
          locale={locale}
          style={{ width: "50%", borderRadius: 5 }}
        />
        <Select
          placeholder={t("Ашиглалтын зардал")}
          onChange={setGereeniiZagvar}
          style={{ width: "100%" }}
        >
          {zardal?.jagsaalt
            ?.filter((a) => a.ner === "Цахилгаан")
            .map((a) => (
              <Select.Option key={a._id} value={a._id}>
                <div className="flex w-full justify-between border-b">
                  <p className="flex border-r bg-green-400 bg-opacity-10 pl-2 pr-2 text-left">
                    {a.ner}
                  </p>
                  <div className="flex w-full justify-between bg-blue-600 bg-opacity-5 pl-2 pr-2">
                    <p className={`mr-5 border-r text-right`}>{t(a.turul)}</p>
                    <p className="text-right">
                      {a.turul !== "Дурын" ? a.tariff : "Дурын"}
                      {a.turul !== "Дурын" && "₮"}
                    </p>
                  </div>
                </div>
              </Select.Option>
            ))}
        </Select>
      </div>

      {selectedZardal?.ner === "Цахилгаан" && (
        <>
          <div className="mt-5" />
          <div className="space-x-2">
            <label>{t("НӨАТ бодох эсэх")}:</label>
            <Switch checked={nuatBodokhEsekh} onChange={setNuatBodokhEsekh} />
          </div>

          {zagvariinZam && (
            <a
              className="cursor-pointer font-medium text-blue-600"
              onClick={zagvarAvya}
            >
              {t("Заалт татах")}
            </a>
          )}

          <div className="mt-5" />
          <Table
            columns={columns}
            dataSource={data}
            rowKey="tooluuriinDugaar"
            pagination={true}
            style={{ marginTop: "20px" }}
          />
          <div className="flex items-end justify-end">
            <Button
              type="primary"
              style={{
                marginTop: 10,
                display: "flex",
                justifyContent: "end",
                alignItems: "end",
              }}
              onClick={handleSave}
            >
              Хадгалах
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

export default React.forwardRef(GuilgeeExceleesOruulakhOlnoor);
