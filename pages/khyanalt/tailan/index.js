import shalgaltKhiikh from "services/shalgaltKhiikh"
import Admin from "components/Admin"
import React, { useMemo, useState } from "react"
import VerticarlBarChart from "components/pageComponents/tailan/chart/VerticarlBarChart"
import PieChart from "components/pageComponents/tailan/chart/PieChart"
import LineChart from "components/pageComponents/tailan/chart/LineChart"
import HorizontalBarChart from "components/pageComponents/tailan/chart/HorizontalBarChart"
import useTailan from "hooks/tailan/useTailan"
import { Button, DatePicker, Select } from "antd"
import local from "antd/lib/date-picker/locale/mn_MN"
import { useAuth } from "services/auth"
import moment from "moment"
import { Line } from "react-chartjs-2"

const tailanguud = [
  {
    ner: "Гүйцэтгэлийн тайлан",
    service: "guitsetgeliinTailanAvya",
  },
  {
    ner: "Авлагын тайлан",
    service: "avlagiinTailanAvya",
  },
]

function AjiltanBurtgel({ token }) {
  const { barilgiinId } = useAuth()
  const [tailan, setTailan] = useState("guitsetgeliinTailanAvya")
  const [ognoo, setOgnoo] = useState([moment(), moment()])
  const [tailanTurul, setTailanTurul] = useState("line")

  const query = useMemo(() => {
    return {
      barilgiinId: barilgiinId,
      ekhlekhOgnoo: ognoo[0].format("YYYY-MM-DD 00:00:00"),
      duusakhOgnoo: ognoo[1].format("YYYY-MM-DD 23:59:59"),
    }
  }, [barilgiinId, ognoo])

  const { tailanGaralt, tailanMutate } = useTailan(
    barilgiinId && tailan,
    token,
    query
  )
  const config = {
    options: {
      animation: true,
      animations: {
        duration: 1000000,
        tension: {
          duration: 1000,
          easing: "linear",
          from: 1,
          to: 0,
          loop: true,
        },
      },
    },
  }
  function tailanTurulSongokh(turul) {
    setTailanTurul(turul)
  }
  const labels = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
  ]

  const data = {
    labels: ["Jan", "Feb", "March"],
    datasets: [
      {
        label: "Sales",
        data: [86, 67, 91],
      },
    ],
  }

  return (
    <Admin title="Тайлан" khuudasniiNer="tailan" className="p-0 md:p-4">
      <div className="box col-span-12 space-x-2 p-2">
        <Select placeholder="Тайлан" onChange={setTailan} value={tailan}>
          {tailanguud.map((a) => (
            <Select.Option key={a.service} value={a.service}>
              {a.ner}
            </Select.Option>
          ))}
        </Select>
        <DatePicker.RangePicker
          locale={local}
          value={ognoo}
          onChange={setOgnoo}
        />
        <Select placeholder="Борлуулалт">
          <Select.Option key="Хамгийн их" value="Хамгийн их">
            Хамгийн их
          </Select.Option>
          <Select.Option key="Хамгийн бага" value="Хамгийн бага">
            Хамгийн бага
          </Select.Option>
        </Select>
        <Select placeholder="Зардал">
          <Select.Option key="Хамгийн их" value="Хамгийн их">
            Хамгийн их
          </Select.Option>
          <Select.Option key="Хамгийн бага" value="Хамгийн бага">
            Хамгийн бага
          </Select.Option>
        </Select>
        <Select placeholder="Ашиг">
          <Select.Option key="Хамгийн их" value="Хамгийн их">
            Хамгийн их
          </Select.Option>
          <Select.Option key="Хамгийн бага" value="Хамгийн бага">
            Хамгийн бага
          </Select.Option>
        </Select>
        <Button type="primary">Харьцуулах</Button>
      </div>
      <div className="box col-span-12 p-2 md:col-span-6">
        <Select placeholder="График төрөл сонгох" onChange={tailanTurulSongokh}>
          <Select.Option key="Хамгийн их" value="line">
            Шугаман
          </Select.Option>
          <Select.Option key="Хамгийн бага" value="bar">
            Багана/босоо/
          </Select.Option>
          <Select.Option key="Хамгийн бага" value="barHorizontal">
            Багана/хэвтээ/
          </Select.Option>
        </Select>
        {tailanTurul === "line" && <LineChart data={tailanGaralt || {}} />}
        {tailanTurul === "bar" && (
          <VerticarlBarChart data={tailanGaralt || {}} />
        )}
        {tailanTurul === "barHorizontal" && (
          <HorizontalBarChart data={tailanGaralt || {}} />
        )}
      </div>
      <div className="box col-span-12 divide-y p-2 md:col-span-6">
        <VerticarlBarChart data={tailanGaralt || {}} />
      </div>
      <div className="box col-span-12 p-2 md:col-span-6">
        <Line data={data} />
      </div>
      <div className="box col-span-12 divide-y p-2 md:col-span-6">
        <HorizontalBarChart data={tailanGaralt || {}} />
      </div>
    </Admin>
  )
}

export const getServerSideProps = shalgaltKhiikh

export default AjiltanBurtgel
