import React, { useImperativeHandle, useState } from 'react'
import { Form, Input, message } from 'antd'
import updateMethod from 'tools/function/crud/updateMethod'
import createMethod from 'tools/function/crud/createMethod'
import ZagvarUusgekh from './ZagvarUusgekh';

function ZagvarForm({value,onChange}) {
    return (
        <ZagvarUusgekh value={value} change={onChange} />
    )
}

function ZagvarBurtgel({barilgiinId,destroy,token,data={},turul,onRefresh},ref) {
    const [form] = Form.useForm();

    const [zagvar,setZagvar] = useState(data?.mail || '') 

    useImperativeHandle(
        ref,
        () => ({
            khadgalya() {
                const method = data?._id ? updateMethod : createMethod
                const zagvar = form.getFieldsValue()
                console.log('{barilgiinId,...data,...zagvar,turul}',{barilgiinId,...data,...zagvar,turul})
                method('mailiinZagvar',token,{barilgiinId,...data,...zagvar,turul})
                .then(({data})=>{
                    if(data === 'Amjilttai')
                        {
                            console.log(data)
                            message.success('Амжилттай хадгаллаа')
                            onRefresh()
                            destroy()
                        }
                })
            },
            khaaya() {
                destroy()
            },
        }),
        [form,barilgiinId],
    )

    return (
        <Form form={form} initialValues={data}>
            <Form.Item name="ner" >
                <Input placeholder='Нэр' />
            </Form.Item>
            <Form.Item name="mail">
                <ZagvarForm/>
            </Form.Item>
        </Form>
    )
}

export default React.forwardRef(ZagvarBurtgel)
