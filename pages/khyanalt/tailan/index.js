import shalgaltKhiikh from "services/shalgaltKhiikh"
import Admin from "components/Admin"
import React, { useMemo, useState } from "react"
import VerticarlBarChart from "components/pageComponents/tailan/chart/VerticarlBarChart"
import PieChart from "components/pageComponents/tailan/chart/PieChart"
import LineChart from "components/pageComponents/tailan/chart/LineChart"
import HorizontalBarChart from "components/pageComponents/tailan/chart/HorizontalBarChart"
import useTailan from "hooks/tailan/useTailan"
import { DatePicker, Select } from "antd"
import local from "antd/lib/date-picker/locale/mn_MN"
import { useAuth } from "services/auth"
import moment from "moment"

const tailanguud = [
  {
    ner: "Борлуулалтын тайлан",
    service: "borluulaltiinTailanAvya",
  },
  {
    ner: "Авлагын тайлан",
    service: "avlagiinTailanAvya",
  },
]

function Chart({barilgiinId,token,defaultTurul="line",defaultTailan = "guitsetgeliinTailanAvya"}) {
  const [ognoo, setOgnoo] = useState([moment().startOf('month'), moment().endOf('month')])
  const [tailan, setTailan] = useState(defaultTailan)
  const [tailanTurul, setTailanTurul] = useState(defaultTurul)
  const [nariivchlal, setNariivchlal] = useState('month')

  const query = useMemo(() => {
    return {
      barilgiinId,
      nariivchlal,
      ekhlekhOgnoo: ognoo[0].format("YYYY-MM-DD 00:00:00"),
      duusakhOgnoo: ognoo[1].format("YYYY-MM-DD 23:59:59"),
    }
  }, [barilgiinId, ognoo,nariivchlal])

  const { tailanGaralt, tailanMutate } = useTailan(
    barilgiinId && tailan,
    token,
    query
  )

  return <div className="box col-span-12 p-2 md:col-span-6">
    <div className="w-full space-y-1 md:space-y-0 flex flex-col md:flex-row md:justify-between pb-5">
      <div className="flex md:flex-row space-x-1">
        <Select placeholder="Тайлан" onChange={setTailan} value={tailan}>
          {tailanguud.map((a) => <Select.Option key={a.service} value={a.service}>{a.ner}</Select.Option>)}
        </Select>
        <Select placeholder="График төрөл сонгох" value={tailanTurul} onChange={setTailanTurul}>
          {[{val:'line',lab:'Шугаман'},{val:'bar',lab:'Багана/босоо/'},{val:'barHorizontal',lab:'Багана/хэвтээ/'}].map(a=><Select.Option key={a.val} value={a.val}>{a.lab}</Select.Option>)}
        </Select>
        <Select placeholder="График төрөл сонгох" value={nariivchlal} onChange={setNariivchlal}>
          {[{val:'day',lab:'Өдөр'},{val:'month',lab:'Сар'},{val:'year',lab:'Жил'}].map(a=><Select.Option key={a.val} value={a.val}>{a.lab}</Select.Option>)}
        </Select>
      </div>
      <DatePicker.RangePicker
        locale={local}
        value={ognoo}
        onChange={setOgnoo}
      />
    </div>
    {tailanTurul === "line" && <LineChart data={tailanGaralt || {}} />}
    {tailanTurul === "bar" && <VerticarlBarChart data={tailanGaralt || {}} />}
    {tailanTurul === "barHorizontal" && <HorizontalBarChart data={tailanGaralt || {}} />}
  </div>
}

function AjiltanBurtgel({ token }) {
  const { barilgiinId } = useAuth()
  

  return (
    <Admin title="Тайлан" khuudasniiNer="tailan" className="p-0 md:p-4">
      <div className="box col-span-12 p-2 md:col-span-6">
        <Chart barilgiinId={barilgiinId} token={token} defaultTurul='line' defaultTailan='borluulaltiinTailanAvya'/>
      </div>
      <div className="box col-span-12 divide-y p-2 md:col-span-6">
        <Chart barilgiinId={barilgiinId} token={token} defaultTurul='bar' defaultTailan='avlagiinTailanAvya'/>
      </div>
    </Admin>
  )
}

export const getServerSideProps = shalgaltKhiikh

export default AjiltanBurtgel
