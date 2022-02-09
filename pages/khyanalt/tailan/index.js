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
import moment from 'moment'

const labels = ["1-сар", "2-сар", "3-сар", "4-сар", "5-сар", "6-сар", "7-сар"]

const data = {
  labels,
  datasets: [
    {
      label: "Орлого",
      data: labels.map(() => (Math.random() * 10).toFixed(2)),
      backgroundColor: "rgba(255, 99, 132, 0.5)",
      borderColor: "rgba(255, 99, 132, 0.5)",
      fill: false,
      lineWidth: 10,
    },
    {
      label: "Зарлага",
      data: labels.map(() => (Math.random() * 10).toFixed(2)),
      fill: false,
      borderColor: "rgba(53, 162, 235, 0.5)",
      backgroundColor: "rgba(53, 162, 235, 0.5)",
      borderDash: [10,10]
    },
  ],
}

const query = {
  "barilgiinId" :"61ab41b56e7f7d347c622472",
  "ekhlekhOgnoo" : "2022-01-01 00:00:00",
  "duusakhOgnoo" : "2022-06-31 23:59:59"
}

function AjiltanBurtgel({ token }) {
  const {barilgiinId} = useAuth()
  const [tailan,setTailan] = useState('guitsetgeliinTailanAvya')
  const [ognoo,setOgnoo] = useState([moment(),moment()])
  
  const query = useMemo(()=>{
    return {
      "barilgiinId" : barilgiinId,
      "ekhlekhOgnoo" : ognoo[0].format("YYYY-MM-DD 00:00:00"),
      "duusakhOgnoo" : ognoo[1].format("YYYY-MM-DD 23:59:59")
    }
  },[barilgiinId,ognoo])

  const {tailanGaralt,tailanMutate} = useTailan(barilgiinId && tailan,token,query)

  return (
    <Admin title="Тайлан" khuudasniiNer="tailan" className="p-0 md:p-4">
      <div className="box col-span-12 space-x-2 p-2">
        <DatePicker.RangePicker locale={local} value={ognoo} onChange={setOgnoo}/>
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
        <LineChart data={tailanGaralt || {}} />
      </div>
      <div className="box col-span-12 divide-y p-2 md:col-span-6">
        <VerticarlBarChart data={tailanGaralt || {}} />
      </div>
      <div className="box col-span-12 p-2 md:col-span-6">
        <PieChart />
      </div>
      <div className="box col-span-12 divide-y p-2 md:col-span-6">
        <HorizontalBarChart data={tailanGaralt || {}} />
      </div>
    </Admin>
  )
}

export const getServerSideProps = shalgaltKhiikh

export default AjiltanBurtgel
