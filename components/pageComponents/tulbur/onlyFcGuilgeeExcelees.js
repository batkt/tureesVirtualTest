import React, { useMemo, useEffect, useState } from "react";
import {
  DatePicker,
  message,
  Select,
  Upload,
  Switch,
  Tooltip,
  Button,
  Table,
  Input,
  InputNumber,
} from "antd";

import uilchilgee, { aldaaBarigch } from "../../../services/uilchilgee";

import { SearchOutlined } from "@ant-design/icons";
import locale from "antd/lib/date-picker/locale/mn_MN";
import _ from "lodash";
import moment from "moment";
import { useTranslation } from "react-i18next";
import useJagsaalt from "hooks/useJagsaalt";
import { toast } from "sonner";

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
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Хайх утга`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => {
            confirm();
            setSearchText(selectedKeys[0]);
            setSearchedColumn(dataIndex);
          }}
          style={{ marginBottom: 8, display: "block" }}
        />
        <div className="space-x-2">
          <Button
            type="primary"
            onClick={() => {
              confirm();
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
            icon={<SearchOutlined />}
            size="small"
          >
            Хайх
          </Button>
          <Button
            onClick={() => {
              clearFilters();
              setSearchText("");
              confirm();
            }}
            size="small"
          >
            Цэвэрлэх
          </Button>
        </div>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()),
  });

  const filteredData = data.filter((item) => {
    const search = searchValue.toLowerCase();
    return (
      item.talbainDugaar?.toLowerCase().includes(search) ||
      item.tooluuriinDugaar?.toLowerCase().includes(search)
    );
  });

  const fetchData = async () => {
    if (!ognoo) {
      toast.warning("Огноо сонгоно уу!");
      return;
    }
    try {
      setLoading(true);

      const response = await uilchilgee(token).post("/tooluurMedeelelTatya", {
        ognoo: moment(ognoo).format("YYYY-MM-DD HH:mm:ss"),
      });

      setData(response.data || []);
      toast.success("Өгөгдөл амжилттай татагдлаа!");
    } catch (error) {
      toast.error("Өгөгдөл татахад алдаа гарлаа!" + error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    const hadgalakhJagsaalt = data
      .filter((item) => selectedRowKeys.includes(item.tooluuriinDugaar))
      .map((item) => ({
        baiguullagiinId: baiguullaga._id,
        barilgiinId,
        ognoo: moment(ognoo).format("YYYY-MM-DD HH:mm:ss"),
        zardliinId: ashiglaltiinId,
        zardliinNer: "Цахилгаан",
        talbainId: item.talbainId,
        tooluuriinDugaar: item.tooluuriinDugaar,
        talbainDugaar: item.talbainDugaar,
        suuliinZaalt: item.suuliinZaalt,
        guidliinKoep: item.guidliinKoep,
      }));

    if (!hadgalakhJagsaalt.length) {
      toast.info("Хадгалах мөр сонгоно уу.");
      return;
    }

    uilchilgee(token)
      .post("/zaaltOlnoorOruulya", {
        ashiglaltiinId,
        barilgiinId,
        nuatBodokhEsekh,
        jagsaalt: hadgalakhJagsaalt,
      })
      .then((response) => {
        if (response.status === 200) {
          toast.success("Өөрчлөлтүүд амжилттай хадгалагдлаа!");
          destroy();
        } else {
          toast.error("Хадгалахад алдаа гарлаа!");
        }
      })
      .catch(aldaaBarigch);
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
      khadgalya() {
        handleSave();
      },
    }),
    [
      onFinish,
      data,
      selectedRowKeys,
      baiguullaga,
      barilgiinId,
      ognoo,
      ashiglaltiinId,
    ]
  );

  function zagvarAvya() {
    uilchilgee(token)
      .get(`/${zagvariinZam}`, { responseType: "blob" })
      .then(({ data }) => {
        const url = window.URL.createObjectURL(data);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
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

      render: (text, record) => (
        <InputNumber
          min={0}
          //   step={0.01}
          value={record.guidliinKoep ?? 0}
          onChange={(value) => {
            setData((prev) =>
              prev.map((row) =>
                row.tooluuriinDugaar === record.tooluuriinDugaar
                  ? { ...row, guidliinKoep: value }
                  : row
              )
            );
          }}
        />
      ),
    },
  ];

  const selectedZardal = useMemo(() => {
    return zardal?.jagsaalt?.find((z) => z._id === ashiglaltiinId);
  }, [ashiglaltiinId, zardal]);

  useEffect(() => {
    if (selectedZardal?.ner?.includes("Цахилгаан") && ognoo) {
      fetchData();
    }
  }, [selectedZardal, ognoo]);

  return (
    <div>
      <div className="flex items-center justify-between gap-4 ">
        <DatePicker
          value={ognoo}
          onChange={(val) => {
            setOgnoo(val);
            setLoading(true);
          }}
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
            ?.filter((a) => a.ner?.includes("Цахилгаан"))
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

      {selectedZardal?.ner?.includes("Цахилгаан") && (
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
          <div className="mt-4 flex justify-end">
            <Input
              placeholder="Талбай / Тоолуурын дугаар"
              prefix={<SearchOutlined style={{ color: "#94a3b8" }} />}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              allowClear
              style={{
                width: 250,
                borderRadius: 8,
              }}
            />
          </div>

          <div className="mt-5" />
          <div
            style={{
              paddingBottom: "40px",
              position: "relative",
              minHeight: "500px",
            }}
          >
            <Table
              columns={columns}
              dataSource={filteredData}
              loading={loading}
              rowKey="tooluuriinDugaar"
              rowSelection={rowSelection}
              pagination={{
                pageSize: 10,
                style: {
                  position: "sticky",
                  padding: "1px 0",
                },
              }}
              scroll={{ y: 400 }}
              style={{ marginTop: "20px" }}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default React.forwardRef(GuilgeeExceleesOruulakhOlnoor);
