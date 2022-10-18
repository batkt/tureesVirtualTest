import React from "react";
import { Button, Popconfirm, Popover } from "antd";
import {
  MoreOutlined,
  EditOutlined,
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import shalgaltKhiikh from "services/shalgaltKhiikh";
import { modal } from "components/ant/Modal";
import SegmentBurtgekh from "./SegmentBurtgekh";
import useJagsaalt from "hooks/useJagsaalt";
import CardList from "components/cardList";
import deleteMethod from "tools/function/crud/deleteMethod";

function Tile({ zasya, token, ...a }) {

  const segment = useJagsaalt("/segment");
  function segmentUstgaya() {
    deleteMethod("segment", token, a._id).then(
      ({ data }) => data === "Amjilttai" && segment.refresh()
    )
  }
  return (
    <div className="box">
      <div className="flex items-center p-7 shadow-none">
        <div className="border-l-2 border-green-500 pl-4">
          <div className="font-medium">{a.ner}</div>
          <div className="text-gray-600">{a.utguud.join(", ")}</div>
        </div>
        <div className="ml-auto">
          <Popover
            placement="bottom"
            trigger="hover"
            content={() => (
              <div className="flex w-24 flex-col space-y-2">
                <a
                  className="ant-dropdown-link flex w-full items-center justify-between rounded-lg p-2 hover:bg-green-100"
                  onClick={() => zasya(a)}
                >
                  <EditOutlined style={{ fontSize: "18px" }} />
                  <label>Засах</label>
                </a>
                <Popconfirm
                  okText="Тийм"
                  cancelText="Үгүй"
                  onConfirm={() => segmentUstgaya()}
                >
                  <div className="ant-dropdown-link flex w-full items-center justify-between rounded-lg p-2 hover:bg-green-100">
                    <DeleteOutlined className="text-lg text-red-500" />
                    <label className=" text-red-500">Устгах</label>
                  </div>
                </Popconfirm>
              </div>
            )}
          >
            <a className="flex items-center justify-center rounded-full hover:bg-gray-200">
              <MoreOutlined style={{ fontSize: "18px" }} />
            </a>
          </Popover>
        </div>
      </div>
    </div>
  );
}

function segmentiinTokhirgoo({ token }) {
  const ref = React.useRef(null);
  const segment = useJagsaalt("/segment");

  function segmentBurtegye(data) {
    const footer = [
      <Button onClick={() => ref.current.khaaya()}>Хаах</Button>,
      <Button type="primary" onClick={() => ref.current.khadgalya()}>
        Хадгалах
      </Button>,
    ];
    modal({
      title: "Ялгаж бүртгэх",
      icon: <PlusOutlined />,
      content:
        <SegmentBurtgekh
          ref={ref}
          data={data}
          token={token}
          refresh={segment.refresh}
        />,
      footer,
    });
  }

  return (
    <div className="xxl:col-span-4 col-span-12 mt-5 lg:col-span-6">
      <div className="box mt-5 lg:mt-0">
        <div
          className="dark:border-dark-5 flex items-center  justify-end border-b border-gray-200 px-5 pt-5 pb-2"
          onClick={() => segmentBurtegye()}
        >
          <Button type="primary">Ялгаж бүртгэх</Button>
        </div>
        <div hidden={!segment.jagsaalt}>
          <CardList
            keyValue="segment"
            className="max-h-[70vh] overflow-y-scroll bg-[#F3F4F6]"
            jagsaalt={segment?.jagsaalt}
            Component={Tile}
            componentProps={{ zasya: segmentBurtegye, token }}
          />
        </div>
        <div hidden={!segment.jagsaalt}>
          <CardList
            pagination={{
              current: segment?.data?.khuudasniiDugaar,
              pageSize: segment?.data?.khuudasniiKhemjee,
              total: segment?.data?.niitMur,
              showSizeChanger: true,
              onChange: (khuudasniiDugaar, khuudasniiKhemjee) =>
                segment.setKhuudaslalt((kh) => ({
                  ...kh,
                  khuudasniiDugaar,
                  khuudasniiKhemjee,
                })),
            }}
          />
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps = shalgaltKhiikh;

export default segmentiinTokhirgoo;
