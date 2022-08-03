import { DatePicker, message, Table } from "antd";
import React, { useMemo, useState, useEffect } from "react";
import uilchilgee, { aldaaBarigch } from "services/uilchilgee";
import moment from "moment";
import useOrder from "tools/function/useOrder";
import _ from "lodash";
const garalt = {
  khuudasniiDugaar: 1,
  khuudasniiKhemjee: 10,
};

import Admin from "components/Admin";
import shalgaltKhiikh from "services/shalgaltKhiikh";
import Aos from "aos";

function Khabea({ token }) {
  const [ekhlekhOgnoo, setEkhlekhOgnoo] = useState([
    moment(new Date()).format("YYYY-MM-DD 00:00:00"),
    moment(new Date()).format("YYYY-MM-DD 23:59:59"),
  ]);

  const { order, onChangeTable } = useOrder({ createdAt: -1 });
  const [surveyJagsaalt, setSurveyJagsaalt] = useState([]);
  const [queryGaraasUgsun, setQueryGaraasUgsun] = useState({
    ognoo:
      ekhlekhOgnoo !== undefined
        ? {
            $gte: moment(ekhlekhOgnoo[0]).format("YYYY-MM-DD 00:00:00"),
            $lte: moment(ekhlekhOgnoo[1]).format("YYYY-MM-DD 23:59:59"),
          }
        : undefined,
  });
  const { RangePicker } = DatePicker;

  const columns = useMemo(
    () => [
      {
        title: "№",
        key: "index",
        className: "text-center",
        width: "2rem",
        render: (text, record, index) => index + 1,
      },
      {
        title: "Огноо",
        key: "createdAt",
        dataIndex: "createdAt",
        align: "center",
        render: (data) => {
          return moment(data).format("YYYY-MM-DD HH:mm");
        },
      },
      {
        title: "Нэр",
        key: "ner",
        dataIndex: "ner",
        align: "center",
        ellipsis: true,
      },
      {
        title: "Утас",
        key: "utas",
        dataIndex: "utas",
        align: "center",
        ellipsis: true,
      },
      {
        title: "И-мэйл",
        key: "mail",
        dataIndex: "mail",
        align: "center",
        ellipsis: true,
      },
      {
        title: "Чиглэл",
        key: "chiglel",
        dataIndex: "chiglel",
        align: "center",
        ellipsis: true,
      },
      {
        title: "Хугацаа",
        key: "uilAjillagaa",
        dataIndex: "uilAjillagaa",
        align: "center",
        ellipsis: true,
      },
      {
        title: "Ажилтан тоо",
        key: "ajiltniiToo",
        dataIndex: "ajiltniiToo",
        align: "center",
        ellipsis: true,
      },
      {
        title: "Талбайн хэмжээ",
        key: "talbainKhemjee",
        dataIndex: "talbainKhemjee",
        align: "center",
        ellipsis: true,
      },
      {
        title: "Давхар",
        align: "center",
        dataIndex: "",
        ellipsis: true,
        render: (data) => {
          var turul = Array.from(new Set(data?.davkhar)).toString();
          return turul;
        },
      },
      {
        title: "Нэмэлт",
        key: "nemeltMedeelel",
        dataIndex: "nemeltMedeelel",
        ellipsis: true,
        align: "center",
      },
    ],
    []
  );
  useEffect(() => {
    anketJagsaalt();
  }, [ekhlekhOgnoo]);

  function ognoogoorShuukh(orolt, ognoo) {
    queryGaraasUgsun.ognoo = {
      $gte: moment(ognoo[0]).format("YYYY-MM-DD 00:00:00"),
      $lte: moment(ognoo[1]).format("YYYY-MM-DD 23:59:59"),
    };
    setQueryGaraasUgsun({
      ...queryGaraasUgsun,
    });
  }
  function onChangeOgnoo(date, dateString) {
    setEkhlekhOgnoo(dateString);
    ognoogoorShuukh(garalt, dateString);
  }
  function khadgalakh() {
    // const asuulga = formRef.current.getFieldsValue(asuulga)
    // const khadgalakhUgugDul = asuulga.asuulga.map((x) =>
    //   Object.assign(x, {
    //     baiguullagiinId: baiguullaga?._id,
    //     barilgiinId: barilgiinId,
    //   })
    // )
    // if (khadgalakhUgugDul.length > 0) {
    //   uilchilgee(token)
    //     .post("/asuulgaOlnoorKhadgalya", khadgalakhUgugDul)
    //     .then(({ data }) => {
    //       if (data !== undefined) {
    //         message.success("Бүртгэл амжилттай хийгдлээ")
    //         formRef.current.resetFields()
    //         asuulgiinMutate()
    //       }
    //     })
    //     .catch(aldaaBarigch)
    // }
  }
  function asuulgaUstgay(id) {
    uilchilgee(token)
      .post("/asuulgaUstgay", { id: id })
      .then(({ data }) => {
        if (data !== undefined) {
          message.success("Устгагдлаа");
          asuulgiinMutate();
        }
      })
      .catch(aldaaBarigch);
  }
  function anketJagsaalt() {
    uilchilgee(token)
      .get("/survey", {
        params: {
          queryGaraasUgsun,
          order,
          khuudasniiKhemjee: 100,
          khuudasniiDugaar: 1,
        },
      })
      .then(({ data }) => {
        if (data !== undefined) {
          setSurveyJagsaalt(data?.jagsaalt);
        }
      });
  }
  useEffect(() => {
    Aos.init({ once: true });
  });
  return (
    <Admin
      title="Анкетын асуулга бэлдэх"
      khuudasniiNer="anket"
      tsonkhniiId={"62ea0d2b7c54f8189bdca54c"}
      onSearch={(search) =>
        setAsuulgiinKhuudaslalt((kh) => ({
          ...kh,
          khuudasniiDugaar: 1,
          search,
        }))
      }
    >
      <div className="col-span-12 p-0 md:p-5">
        <div className="box col-span-12 overflow-auto p-5 md:col-span-6 xl:col-span-9">
          <div
            className="flex justify-between"
            data-aos="fade-right"
            data-aos-duration="1000"
          >
            <RangePicker
              style={{ marginBottom: "15px" }}
              size="large"
              disabledTime
              defaultValue={[
                moment(new Date(), "YYYY-MM-DD"),
                moment(new Date(), "YYYY-MM-DD"),
              ]}
              format={"YYYY-MM-DD"}
              onChange={onChangeOgnoo}
            />
          </div>
          <div
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-delay="200"
            data-aos-anchor-placement="top-bottom"
          >
            <Table
              bordered
              size="small"
              tableLayout="fixed"
              scroll={{ y: "calc(100vh - 20rem)" }}
              rowClassName={(record, index) =>
                index % 2 === 0
                  ? "bg-white dark:bg-gray-600 h-0.5"
                  : "bg-gray-200 dark:bg-gray-800 h-0.5"
              }
              dataSource={surveyJagsaalt}
              columns={columns}
            />
          </div>
        </div>
      </div>
    </Admin>
  );
}
export const getServerSideProps = shalgaltKhiikh;

export default Khabea;
