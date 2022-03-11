import React, { useImperativeHandle, useState } from "react"
import { Form, Input, message, Select } from "antd"
import createMethod from "tools/function/crud/createMethod"
import updateMethod from "tools/function/crud/updateMethod"
import uilchilgee from "services/uilchilgee"

function MashinBurtgel({ data, barilgiinId, token, destroy, onRefresh }, ref) {
    const [form] = Form.useForm()

    const [geree,setGeree] = useState()

    useImperativeHandle(
      ref,
      () => ({
        khadgalya() {
          const data = form.getFieldsValue()
          data.barilgiinId = barilgiinId
          data.ezemshigchiinTalbainDugaar = geree.talbainDugaar
          data.gereeniiDugaar = geree.gereeniiDugaar
          const method = data?._id ? updateMethod : createMethod
          method("mashin", token, data).then(({ data }) => {
            if (data === "Amjilttai") {
              message.success("Амжилттай хадгаллаа")
              onRefresh && onRefresh()
              destroy()
            }
          })
        },
        khaaya() {
          destroy()
        },
      }),
      [form,geree]
    )

    function gereeAvya({target}) {
      if(target.value?.length > 7 )
      uilchilgee(token).post('/utasniiDugaaraarGereeAvya',{utas:target.value}).then(({data})=>{
        if(!!data)
          setGeree({...data})
      })
    }
  
    return (
      <Form form={form} initialValues={data} className="space-y-2" labelCol={{ span: 6 }} wrapperCol={{ span: 24 }}>
        <Form.Item name="_id" noStyle />
        <Form.Item label="Төрөл" name="turul" >
            <Select placeholder="Төрөл" >
                {['Гэрээт','Түрээслэгч','Дотоод'].map(a=><Select.Option key={a} value={a}>{a}</Select.Option>)}
            </Select>
        </Form.Item>
        <Form.Item label="Утас" name="ezemshigchiinUtas">
            <Input placeholder="Утас" onChange={gereeAvya}/>
        </Form.Item>
        <Form.Item label="Машины дугаар" name="dugaar">
            <Input placeholder="Машины дугаар" />
        </Form.Item>
        <Form.Item label="Нэр" name="ezemshigchiinNer">
            <Input placeholder="Нэр" />
        </Form.Item>
        <Form.Item label="Регистр" name="ezemshigchiinRegister">
            <Input placeholder="Регистр" />
        </Form.Item>
        
      </Form>
    )
}

export default React.forwardRef(MashinBurtgel)