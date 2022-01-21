import React from "react"
import { renderToString } from "react-dom/server"
import SunEditor, { buttonList } from "suneditor-react"
import _ from "lodash"
import { customPlugin } from "./ZaaltOruulakh"
import {
  BankOutlined,
  ClockCircleOutlined,
  DollarCircleOutlined,
  LockOutlined,
  SolutionOutlined,
} from "@ant-design/icons"
import { Input, Select } from "antd"

const undsenTalbaruud = [
  { ner: "Овог", talbar: "ovog" },
  { ner: "Нэр", talbar: "ner" },
  { ner: "Гэрээний огноо", talbar: "gereeniiOgnoo" },
  { ner: "Төрөл", talbar: "turul" },
  { ner: "Регистр", talbar: "register" },
  { ner: "Албан тушаал", talbar: "albanTushaal" },
  { ner: "Захиралын овог", talbar: "zakhirliinOvog" },
  { ner: "Захиралын нэр", talbar: "zakhirliinNer" },
  { ner: "Утас", talbar: "utas" },
  { ner: "Хаяг", talbar: "khayag" },
]

const khugatsaaniiTalbaruud = [
  { ner: "Хугацаа", talbar: "khugatsaa" },
  { ner: "Эхлэх он", talbar: "ekhlekhOn" },
  { ner: "Эхлэх сар", talbar: "ekhelkhSar" },
  { ner: "Эхлэх өдөр", talbar: "ekhlekhUdur" },
  { ner: "Дуусах он", talbar: "duusakhOn" },
  { ner: "Дуусах сар", talbar: "duusakhSar" },
  { ner: "Дуусах өдөр", talbar: "duusakhUdur" },
]

const talbainiiTalbaruud = [
  { ner: "Талбайн дугаар", talbar: "talbainDugaar" },
  { ner: "Талбайн нэгж үнэ", talbar: "talbainNegjUne" },
  { ner: "Талбайн нэгж үнэ үсгээр", talbar: "talbainNegjUneUsgeer" },
  { ner: "Талбайн нийт үнэ", talbar: "talbainNiitUne" },
  { ner: "Талбайн нийт үнэ үсгээр", talbar: "talbainNiitUneUsgeer" },
  { ner: "Талбайн хэмжээ", talbar: "talbainKhemjee" },
  { ner: "Түрээсийн талбайн давхар", talbar: "davkhar" },
  { ner: "Зардлын дүн", talbar: "zardliinDun" },
  { ner: "Зориулалт", talbar: "zoriulalt" },
]

const baritsaaniiTalbaruud = [
  { ner: "Барьцаа авах дүн", talbar: "baritsaaAvakhDun" },
  {
    ner: "Барьцаа байршуулах хугацаа",
    talbar: "baritsaaBairshuulakhKhugatsaa",
  },
]

const tulburiinTalbaruud = [
  { ner: "Хөнгөлөх хугацаа", talbar: "khungulukhKhugatsaa" },
  { ner: "Сарын түрээс", talbar: "sariinTurees" },
  { ner: "Мөнгөн дүн үсгээр", talbar: "mungunDunUsgeer" },
]

function ZaaltZasvar({ destroy, value, change }, ref) {
  const editorRef = React.useRef()
  const [utga, setUtga] = React.useState(value)

  React.useImperativeHandle(
    ref,
    () => ({
      khadgalya() {
        change(utga)
        destroy()
      },
      khaaya() {
        destroy()
      },
    }),
    [utga]
  )

  const custom = React.useMemo(() => {
    const undsen = customPlugin({
      songokhTalbaruud: undsenTalbaruud,
      name: "undsen",
      title: "Үндсэн мэдээлэл",
      button: renderToString(<SolutionOutlined />),
    })
    const khugatsaa = customPlugin({
      songokhTalbaruud: khugatsaaniiTalbaruud,
      name: "khugatsaa",
      title: "Хугацаа",
      button: renderToString(<ClockCircleOutlined />),
    })
    const baritsaa = customPlugin({
      songokhTalbaruud: talbainiiTalbaruud,
      name: "talbai",
      title: "Түрээсийн талбай",
      button: renderToString(<BankOutlined />),
    })
    const talbai = customPlugin({
      songokhTalbaruud: baritsaaniiTalbaruud,
      name: "baritsaa",
      title: "Барьцаа",
      button: renderToString(<LockOutlined />),
    })
    const tulbur = customPlugin({
      songokhTalbaruud: tulburiinTalbaruud,
      name: "tulbur",
      title: "Төлбөр",
      button: renderToString(<DollarCircleOutlined />),
    })
    return [undsen, khugatsaa, baritsaa, talbai, tulbur]
  }, [])

  if (_.isString(value))
    return (
      <SunEditor
        onChange={setUtga}
        defaultValue={utga}
        setOptions={{
          plugins: custom,
          height: 200,
          buttonList: [
            ...buttonList.formatting,
            ["undsen", "khugatsaa", "talbai", "baritsaa", "tulbur","table","fontSize"],
          ],
        }}
        showToolbar={true}
        ref={editorRef}
      />
    )
  return (
    <React.Fragment>
      <div className="w-full flex flex-row">
        <span className="w-1/3 text-right">Харагдах дугаар:</span>
        <div className="w-2/3">
          <Input
            placeholder="Харагдах дугаар"
            value={utga?.kharagdakhDugaar}
            onChange={({target}) => setUtga((a) => ({ ...a, kharagdakhDugaar: target.value }))}
          />
        </div>
      </div>
      <div className="w-full flex flex-row mt-5">
        <span className="w-1/3 text-right">Хамаарагдах хэсэг:</span>
        <Select
          placeholder="Хамаарагдах хэсэг"
          className="w-2/3"
          value={utga?.khamaarakhKheseg}
          onChange={(v) => setUtga((a) => ({ ...a, khamaarakhKheseg: v }))}
        >
          {[
            "Ерөнхий мэдээлэл",
            "Гэрээний хугацаа",
            "Түрээсийн талбай",
            "Барьцаа бүртгэл",
            "Төлбөр тооцоо",
          ].map((a) => (
            <Select.Option value={a}>{a}</Select.Option>
          ))}
        </Select>
      </div>
      <div className="mt-5" />
      <SunEditor
        onChange={(v) => setUtga((a) => ({ ...a, zaalt: v }))}
        defaultValue={utga?.zaalt}
        setOptions={{
          plugins: custom,
          height: 200,
          buttonList: [
            ...buttonList.formatting,
            ["table","align","fontSize"],
            ["undsen", "khugatsaa", "talbai", "baritsaa", "tulbur"],
          ],
        }}
        showToolbar={true}
        ref={editorRef}
      />
    </React.Fragment>
  )
}

export default React.forwardRef(ZaaltZasvar)
