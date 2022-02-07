import shalgaltKhiikh from "services/shalgaltKhiikh"
import Admin from "components/Admin"
import React from "react"
import BarChart from "components/pageComponents/tailan/chart/BarChart"
import VerticarlBarChart from "components/pageComponents/tailan/chart/VerticarlBarChart"
import PieChart from "components/pageComponents/tailan/chart/PieChart"
import LineChart from "components/pageComponents/tailan/chart/LineChart"
import HorizontalBarChart from "components/pageComponents/tailan/chart/HorizontalBarChart"
import { Button, DatePicker, Select } from "antd"
import local from "antd/lib/date-picker/locale/mn_MN"
const labels = ["1-сар", "2-сар", "3-сар", "4-сар", "5-сар", "6-сар", "7-сар"]

const data = {
  labels,
  datasets: [
    {
      label: "Орлого",
      data: labels.map(() => (Math.random() * 10).toFixed(2)),
      backgroundColor: "rgba(255, 99, 132, 0.5)",
      lineWidth: 10,
    },
    {
      label: "Зарлага",
      data: labels.map(() => (Math.random() * 10).toFixed(2)),
      backgroundColor: "rgba(53, 162, 235, 0.5)",
    },
  ],
}

function AjiltanBurtgel({ token }) {
  return (
    <Admin title="Тайлан" khuudasniiNer="tailan" className="p-0 md:p-4">
      <div className="box col-span-12 space-x-2 p-2">
        <DatePicker.RangePicker locale={local} />
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
        <LineChart data={data} />
      </div>

      <div className="box col-span-12 divide-y p-2 md:col-span-6">
        <VerticarlBarChart data={data} />
      </div>
      <div className="box col-span-12 p-2 md:col-span-6">
        <PieChart />
      </div>
      <div className="box col-span-12 divide-y p-2 md:col-span-6">
        <HorizontalBarChart data={data} />
      </div>
    </Admin>
  )
}

export const getServerSideProps = shalgaltKhiikh

export default AjiltanBurtgel
