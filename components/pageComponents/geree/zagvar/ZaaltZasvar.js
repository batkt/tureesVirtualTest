import React from "react";
import {renderToString} from "react-dom/server";
import SunEditor, { buttonList } from "suneditor-react";
import _ from "lodash";
import { customPlugin } from "./ZaaltOruulakh";
import { BankOutlined, ClockCircleOutlined, DollarCircleOutlined, LockOutlined, SolutionOutlined } from "@ant-design/icons";

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
  { ner: "Хаяг", talbar: "khayag" }
]

const khugatsaaniiTalbaruud = [
  { ner: "Хугацаа", talbar: "khugatsaa" },
  { ner: "Эхлэх он", talbar: "ekhlekhOn" },
  { ner: "Эхлэх сар", talbar: "ekhelkhSar" },
  { ner: "Эхлэх өдөр", talbar: "ekhlekhUdur" },
  { ner: "Дуусах он", talbar: "duusakhOn" },
  { ner: "Дуусах сар", talbar: "duusakhSar" },
  { ner: "Дуусах өдөр", talbar: "duusakhUdur" }
]

const languuniiTalbaruud = [
  { ner: "Лангууны дугаар", talbar: "languuniiDugaar" },
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
  }
]

const tulburiinTalbaruud = [
  { ner: "Хөнгөлөх хугацаа", talbar: "khungulukhKhugatsaa" },
  { ner: "Сарын түрээс", talbar: "sariinTurees" },
  { ner: "Мөнгөн дүн үсгээр", talbar: "mungunDunUsgeer" },
]

function ZaaltZasvar({ destroy, value, change }, ref) {
  const editorRef = React.useRef();
  const [sunValue, setValue] = React.useState(value);

  React.useImperativeHandle(
    ref,
    () => ({
      khadgalya() {
        change(sunValue);
        destroy();
      },
      khaaya() {
        destroy();
      },
    }),
    [sunValue]
  );

  const custom = React.useMemo(() => {
    const undsen = customPlugin({songokhTalbaruud:undsenTalbaruud,name:'undsen',title:'Үндсэн мэдээлэл',button:renderToString(<SolutionOutlined/>)})
    const khugatsaa = customPlugin({songokhTalbaruud:khugatsaaniiTalbaruud,name:'khugatsaa',title:'Хугацаа',button:renderToString(<ClockCircleOutlined/>)})
    const baritsaa = customPlugin({songokhTalbaruud:languuniiTalbaruud,name:'languu',title:'Түрээсийн талбай',button:renderToString(<BankOutlined/>)})
    const languu = customPlugin({songokhTalbaruud:baritsaaniiTalbaruud,name:'baritsaa',title:'Барьцаа',button:renderToString(<LockOutlined />)})
    const tulbur = customPlugin({songokhTalbaruud:tulburiinTalbaruud,name:'tulbur',title:'Төлбөр',button:renderToString(<DollarCircleOutlined/>)})
    return [undsen,khugatsaa,baritsaa,languu,tulbur];
  }, []);

  return (
    <SunEditor
      onChange={setValue}
      defaultValue={sunValue}
      setOptions={{
        plugins: custom,
        height: 200,
        buttonList: [...buttonList.formatting, ["undsen","khugatsaa","languu","baritsaa","tulbur"]],
      }}
      showToolbar={true}
      ref={editorRef}
    />
  );
}

export default React.forwardRef(ZaaltZasvar);
