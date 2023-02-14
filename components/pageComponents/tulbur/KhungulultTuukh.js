import moment from "moment";
import { useAuth } from "services/auth";
import { DeleteOutlined, SettingOutlined } from "@ant-design/icons";
import { Table, Button, Card, DatePicker, message, Popconfirm } from "antd";

import Admin from "components/Admin";
import shalgaltKhiikh from "services/shalgaltKhiikh";
import uilchilgee, { aldaaBarigch } from "services/uilchilgee";
import formatNumber from "tools/function/formatNumber";
import React, { useMemo, useState, useEffect } from "react";
import useKhungulultTuukh from "hooks/tulburTootsoo/useKhungulultTuukh";
import Aos from "aos";
import { t } from "i18next";

const { RangePicker } = DatePicker;
//#endregion

function KhungulultTuukh({ token }) {
  useEffect(() => {
    Aos.init({ once: true });
  });
  const { ajiltan } = useAuth();
  const [ekhlekhOgnoo, setEkhlekhOgnoo] = useState([moment(), moment()]);



  const query = useMemo(() => {
    return {
      createdAt: ekhlekhOgnoo
        ? {
          $gte: moment(ekhlekhOgnoo[0]).format("YYYY-MM-DD 00:00:00"),
          $lte: moment(ekhlekhOgnoo[1]).format("YYYY-MM-DD 23:59:59"),
        }
        : undefined,
    };
  }, [ekhlekhOgnoo]);



  const { khungulultTuukh, khungulultTuukhMutate, setKhuudaslalt } =
    useKhungulultTuukh(token, ajiltan?.baiguullagiinId, query);

  function ustgaya(mur) {
    uilchilgee(token)
      .post("/khungulultUstgaya", {
        id: mur?._id,
      })
      .then(({ data }) => {
        if (data !== undefined) {
          khungulultTuukhMutate((s) => ({ ...s, jagsaalt: s.jagsaalt }), true);
          message.success(t("Устгагдлаа"));
        }
      });
  }

  return (
    <Card className="cardgrid col-span-12 p-5">
      <div
        className="mt-5 flex w-full flex-row justify-between"
        data-aos="fade-right"
        data-aos-duration="1000"
      >
        <RangePicker
          style={{ marginBottom: "20px" }}
          size="middle"
          value={ekhlekhOgnoo}
          onChange={setEkhlekhOgnoo}
        />
      </div>

      <Table
        bordered
        tableLayout={"fixed"}
        data-aos="fade-right"
        data-aos-duration="1100"
        data-aos-delay="100"
        size="small"
        rowClassName="hover:bg-blue-100"
        dataSource={khungulultTuukh?.jagsaalt}

        pagination={{
          current: khungulultTuukh?.khuudasniiDugaar,
          pageSize: 100,
          total: khungulultTuukh?.niitMur,
          showSizeChanger: true,
          onChange: (khuudasniiDugaar, khuudasniiKhemjee) =>
            setKhuudaslalt((kh) => ({
              ...kh,
              khuudasniiDugaar,
              khuudasniiKhemjee,
            })),
        }}
        scroll={{ y: "calc(100vh - 26rem)" }}
        rowKey={(row) => row._id}
        className="t-head"
        columns={columns}
      />
    </Card>
  );
}

export default React.forwardRef(KhungulultTuukh);
