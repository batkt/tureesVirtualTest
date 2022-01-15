import React, { useImperativeHandle } from "react"
import { Form, Input, message, Select } from "antd"
import ZagvarUusgekh from "./ZagvarUusgekh"
import createMethod from "tools/function/crud/createMethod"

function DunZasvar(
  { data, barilgiinId, token, destroy, afterShock, dans },
  ref
) {
  const [form] = Form.useForm()

  useImperativeHandle(
    ref,
    () => ({
      khadgalya() {
        const data = form.getFieldsValue()
        data.barilgiinId = barilgiinId
        createMethod("nekhemjlekhiinZagvar", token, data).then(({ data }) => {
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
  function ZagvarForm({ value, onChange }) {
    if (value === undefined) {
      var ner = dans.length === 9 ? "Худалдаа хөгжлийн банк" : "Хаан банк"
      var defaultZagvar =
        '<p>​​<br></p><table class="se-table-size-auto"><tbody><tr><td colspan="5" rowspan="1"><div><br></div></td><td colspan="5" rowspan="1"><div style="text-align: right;">Сангийн сайдын 2017 оны 12 дугаар&nbsp;</div><div style="text-align: right;">сарын 5ны&nbsp;&nbsp;<span style="background-color: transparent;">өдрийн 347 тоо ттушаалын</span></div></td></tr><tr><td colspan="10" rowspan="1"><div>НЭХЭМЖЛЭГЧ БАЙГУУЛЛАГА&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; ТӨЛБӨР ТӨЛӨГЧ</div></td></tr><tr><td colspan="6" rowspan="1"><div>НЭР: Их Наяд Плаза ХХК<br></div></td><td><div><br></div></td><td colspan="3" rowspan="1"><div>БАЙГУУЛЛАГА:<span class="se-custom-tag">&lt;ner&gt;</span>​​</div></td></tr><tr><td colspan="7" rowspan="1"><div>БАЙГУУЛЛАГЫН РД : 6481523<br></div></td><td><div>НЭР:<span class="se-custom-tag">&lt;ner&gt;</span>​​</div></td></tr><tr><td colspan="7" rowspan="1"><div>ДАНС :&nbsp;<span class="se-custom-tag">&lt;dans&gt;</span>​​<br></div></td><td colspan="3" rowspan="1"><div>РД:<span class="se-custom-tag">&lt;register&gt;</span>​​</div></td></tr><tr><td colspan="7" rowspan="1"><div><br></div></td><td colspan="3" rowspan="1"><div><br></div></td></tr><tr><td colspan="7" rowspan="1"><div>ХАЯГ: Их Наяд Плаза 5-р давхар 15-хороо, Хан-Уул дүүрэг&nbsp;</div><div>Утас : 7709-1155 8900-9090 8810-9549</div></td><td colspan="3" rowspan="1"><div>ХАЯГ:<span class="se-custom-tag">&lt;utas&gt;</span>​​</div><div>УТАС:<span class="se-custom-tag">&lt;utas&gt;</span>​​<br></div><div>ТАЛБАЙ<span class="se-custom-tag">&lt;talbainDugaar&gt;</span>​​<br></div></td></tr><tr><td colspan="10" rowspan="1"><div><br></div></td></tr><tr><td><div>№</div></td><td colspan="3" rowspan="1"><div>Бараа үйлчилгээний нэр</div></td><td rowspan="1" colspan="3"><div><span style="background-color: transparent;">Тоо ширхэг/м2/</span><br></div></td><td><div>Нэгж үнэ</div></td><td colspan="2" rowspan="1"><div>Нийт үнэ</div></td></tr><tr><td><div><br></div></td><td colspan="3" rowspan="1"><div>&nbsp;</div></td><td colspan="3" rowspan="1"><div><br></div></td><td><div><br></div></td><td colspan="2" rowspan="1"><div><br></div></td></tr><tr><td colspan="7" rowspan="2"><div><br></div></td><td><div style="text-align: right;">Дүн</div></td><td colspan="2" rowspan="1"><div><br></div></td></tr><tr><td><div style="text-align: right;">Нийт дүн</div></td><td colspan="2" rowspan="1"><div><br></div></td></tr><tr><td colspan="10" rowspan="1"><div><span style="background-color: transparent;">Мөнгөн дүн: (үсгээр)</span><br></div></td></tr><tr><td colspan="10" rowspan="1"><div>​​​​<br></div></td></tr><tr><td colspan="10" rowspan="1"><div><span style="background-color: transparent;">(Тамга)</span><br></div></td></tr><tr><td colspan="5" rowspan="3"><div>&nbsp;</div></td><td colspan="5" rowspan="1"><div>Дарга:......................</div></td></tr><tr><td colspan="5" rowspan="1"><div>Хүлээн авсан:....................<br></div></td></tr><tr><td colspan="5" rowspan="1"><div>Нягтлаг бодогч:..................</div></td></tr></tbody></table><p><br></p>'
      var zagvar = defaultZagvar.replace(
        new RegExp(`&lt;dans&gt;`, "g"),
        dans + ner
      )
      value = zagvar
    }
    return (
      <ZagvarUusgekh
        value={value}
        change={onChange}
        buttonListCustom={[
          ["font", "fontSize", "fontColor"],
          ["image", "table", "list", "align", "nekhemjlel"],
        ]}
        otherProps={{ height: "500" }}
      />
    )
  }

  return (
    <Form form={form} initialValues={data} className="space-y-2">
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
