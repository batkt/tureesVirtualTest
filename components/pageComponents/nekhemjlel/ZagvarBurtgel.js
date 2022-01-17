import React, { useImperativeHandle } from "react"
import { Form, Input, message } from "antd"
import ZagvarUusgekh from "./ZagvarUusgekh"
import createMethod from "tools/function/crud/createMethod"
import updateMethod from "tools/function/crud/updateMethod"

const defaultZagvar = `<p><span style="font-size: 11px;">​​<br></span></p><table class="se-table-size-auto border"><tbody><tr><td colspan="5" rowspan="1"><div><br></div></td><td colspan="5" rowspan="1"><div><br></div><div style="text-align: right;"><span style="font-size: 11px;">Сангийн сайдын 2017 оны 12 дугаар&nbsp;</span></div><div style="text-align: right;"><span style="font-size: 11px;">сарын 5ны&nbsp;&nbsp;<span style="background-color: transparent;">өдрийн 347 тоо ттушаалын</span></span></div></td></tr><tr><td colspan="10" rowspan="1"><div><br></div></td></tr><tr><td colspan="10" rowspan="1"><div><span style="font-size: 11px;">НЭХЭМЖЛЭГЧ БАЙГУУЛЛАГА&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; ТӨЛБӨР ТӨЛӨГЧ</span></div></td></tr><tr><td colspan="6" rowspan="1"><div><span style="font-size: 11px;">НЭР: Их Наяд Плаза ХХК<br></span></div></td><td><div><span style="font-size: 11px;"><br></span></div></td><td colspan="3" rowspan="1"><div><span style="font-size: 11px;">БАЙГУУЛЛАГА:<span class="se-custom-tag">&lt;ner&gt;</span>​​</span></div></td></tr><tr><td colspan="7" rowspan="1"><div><span style="font-size: 11px;">БАЙГУУЛЛАГЫН РД : 6481523<br></span></div></td><td><div><span style="font-size: 11px;">НЭР:<span class="se-custom-tag">&lt;ner&gt;</span>​​</span></div></td></tr><tr><td colspan="7" rowspan="1"><div><span style="font-size: 11px;">ДАНС :&nbsp;<span class="se-custom-tag">&lt;dans&gt;</span>​​<br></span></div></td><td colspan="3" rowspan="1"><div><span style="font-size: 11px;">РД:<span class="se-custom-tag">&lt;register&gt;</span>​​</span></div></td></tr><tr><td colspan="7" rowspan="1"><div><span style="font-size: 11px;"><br></span></div></td><td colspan="3" rowspan="1"><div><span style="font-size: 11px;"><br></span></div></td></tr><tr><td colspan="7" rowspan="1"><div><span style="font-size: 11px;">ХАЯГ: Их Наяд Плаза 5-р давхар 15-хороо, Хан-Уул дүүрэг&nbsp;</span></div><div><span style="font-size: 11px;">Утас : 7709-1155 8900-9090 8810-9549</span></div></td><td colspan="3" rowspan="1"><div><span style="font-size: 11px;">ХАЯГ:<span class="se-custom-tag">&lt;utas&gt;</span>​​</span></div><div><span style="font-size: 11px;">УТАС:<span class="se-custom-tag">&lt;utas&gt;</span>​​<br></span></div><div><span style="font-size: 11px;">ТАЛБАЙ<span class="se-custom-tag">&lt;talbainDugaar&gt;</span>​​<br></span></div></td></tr><tr><td colspan="10" rowspan="1"><div><span style="font-size: 11px;"><br></span></div></td></tr><tr><td><div><span style="font-size: 11px;">№</span></div></td><td colspan="3" rowspan="1"><div><span style="font-size: 11px;">Бараа үйлчилгээний нэр</span></div></td><td rowspan="1" colspan="3"><div><span style="font-size: 11px;"><span style="background-color: transparent;">Тоо ширхэг/м2/</span><br></span></div></td><td><div><span style="font-size: 11px;">Нэгж үнэ</span></div></td><td colspan="2" rowspan="1"><div><span style="font-size: 11px;">Нийт үнэ</span></div></td></tr><tr><td><div><span style="font-size: 11px;"><br></span></div></td><td colspan="3" rowspan="1"><div><span style="font-size: 11px;">&nbsp;</span></div></td><td colspan="3" rowspan="1"><div><span style="font-size: 11px;"><br></span></div></td><td><div><span style="font-size: 11px;"><br></span></div></td><td colspan="2" rowspan="1"><div><span style="font-size: 11px;"><br></span></div></td></tr><tr><td colspan="7" rowspan="2"><div><span style="font-size: 11px;"><br></span></div></td><td><div style="text-align: right;"><span style="font-size: 11px;">Дүн</span></div></td><td colspan="2" rowspan="1"><div><span style="font-size: 11px;"><br></span></div></td></tr><tr><td><div style="text-align: right;"><span style="font-size: 11px;">Нийт дүн</span></div></td><td colspan="2" rowspan="1"><div><span style="font-size: 11px;"><br></span></div></td></tr><tr><td colspan="10" rowspan="1"><div><span style="font-size: 11px;"><span style="background-color: transparent;">Мөнгөн дүн: (үсгээр)</span><br></span></div></td></tr><tr><td colspan="10" rowspan="1"><div><span style="font-size: 11px;">​​​​<span class="se-custom-tag">&lt;mungunDunUsgeer&gt;</span>​<br></span></div></td></tr><tr><td colspan="10" rowspan="1"><div><span style="font-size: 11px;"><span style="background-color: transparent;">(Тамга)</span><br></span></div></td></tr><tr><td colspan="5" rowspan="3"><div><span style="font-size: 11px;">&nbsp;</span></div></td><td colspan="5" rowspan="1"><div><span style="font-size: 11px;">Дарга:......................</span></div></td></tr><tr><td colspan="5" rowspan="1"><div><span style="font-size: 11px;">Хүлээн авсан:....................<br></span></div></td></tr><tr><td colspan="5" rowspan="1"><div><span style="font-size: 11px;">Нягтлаг бодогч:..................</span></div></td></tr></tbody></table><p><span style="font-size: 11px;">​</span></p>`

function ZagvarForm({ value = defaultZagvar, onChange }) {
  return (
    <ZagvarUusgekh
      value={value}
      change={onChange}
      buttonListCustom={[
        ["font", "fontSize", "fontColor"],
        ["image", "table", "list", "align"],
      ]}
      otherProps={{ height: 500 }}
    />
  )
}

function DunZasvar({ data, barilgiinId, token, destroy, afterShock }, ref) {
  const [form] = Form.useForm()

  useImperativeHandle(
    ref,
    () => ({
      khadgalya() {
        const data = form.getFieldsValue()
        data.barilgiinId = barilgiinId
        const method = data?._id ? updateMethod : createMethod
        method("nekhemjlekhiinZagvar", token, data).then(({ data }) => {
          if (data === "Amjilttai") {
            message.success("Амжилттай хадгаллаа")
            afterShock && afterShock()
            destroy()
          }
        })
      },
      khaaya() {
        destroy()
      },
    }),
    [form]
  )

  return (
    <Form form={form} initialValues={data} className="space-y-2">
      <Form.Item name="_id" noStyle />
      <Form.Item label="Нэр" name="ner" noStyle>
        <Input placeholder="Нэр" />
      </Form.Item>
      <Form.Item label="Нэхэмжлэхийн загвар" name="nekhemjlekh" noStyle>
        <ZagvarForm />
      </Form.Item>
    </Form>
  )
}

export default React.forwardRef(DunZasvar)
