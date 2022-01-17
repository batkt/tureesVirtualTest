import React, { useEffect } from "react"
import { renderToString } from "react-dom/server"
import SunEditor from "suneditor-react"
import _ from "lodash"
import { customPlugin } from "../geree/zagvar/ZaaltOruulakh"
import {
  BankOutlined,
  ClockCircleOutlined,
  DollarCircleOutlined,
  LockOutlined,
  SolutionOutlined,
} from "@ant-design/icons"

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
  { ner: "Гэрээний дугаар", talbar: "gereeniiDugaar" },
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
  { ner: "Энэ сард төлөх дүн", talbar: "eneSardTulukhDun" },
  { ner: "Нийт үлдэгдэл", talbar: "niitUldegdel" },
]

const nekhemjlekhiinTalbaruud = [
  { ner: "Нэхэмжлэхийн сар", talbar: "sar" },
  { ner: "Данс", talbar: "dans" },
  { ner: "Дансны нэр", talbar: "dansniiNer" },
  { ner: "Банк", talbar: "bank" },
  { ner: "Хэвлэсэн огноо", talbar: "khevlesenOgnoo" },
  { ner: "Нэхэмжлэхийн дугаар", talbar: "nekhemjlekhiinDugaar" },
  { ner: "Энэ сард төлөх үсгээр",talbar:"eneSardTulukhUsgeer"},
  { ner: "Нийт үлдэгдэл үсгээр",talbar:"niitUldegdelUsgeer"}
]

function ZaaltZasvar({
  value,
  change,
  onTextChange,
  buttonListCustom = [],
  otherProps,
}) {
  const editorRef = React.useRef()

  useEffect(() => {
    onTextChange && onTextChange(editorRef.current.editor.getText())
    console.log(value)
  }, [value])

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

    const nekhemjlel = customPlugin({
      songokhTalbaruud: nekhemjlekhiinTalbaruud,
      name: "nekhemjlel",
      title: "Нэхэмжлэл",
      button: renderToString(<DollarCircleOutlined />),
    })

    return [undsen, khugatsaa, baritsaa, talbai, tulbur, nekhemjlel]
  }, [])

  return (
    <SunEditor
      onChange={change}
      defaultValue={value}
      setContents={value}
      setOptions={{
        plugins: custom,
        buttonList: [
          ["undsen", "khugatsaa", "talbai", "baritsaa", "tulbur", "nekhemjlel"],
          ...buttonListCustom,
        ],
      }}
      showToolbar={true}
      ref={editorRef}
      {...otherProps}
    />
  )
}

export default ZaaltZasvar
