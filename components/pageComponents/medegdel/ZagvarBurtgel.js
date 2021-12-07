import React, { useImperativeHandle } from 'react'
import { Form, Input } from 'antd'
import updateMethod from 'tools/function/crud/updateMethod'
import createMethod from 'tools/function/crud/createMethod'

function ZagvarBurtgel({destroy,data,turul},ref) {
    const [form] = Form.useForm();
    useImperativeHandle(
        ref,
        () => ({
            khadgalya() {
                const method = data?._id ? updateMethod : createMethod
                const zagvar = form.getFieldsValue()
                method('mailiinZagvar',token,{...data,...zagvar,turul})
                .then(({data})=>{
                    if(data === 'Amjilttai')
                        {
                            console.log(data)
                        }
                })
            },
            khaaya() {
                destroy()
            },
        }),
        [form],
    )

    return (
        <Form form={form} initialValues={data}>
            <Form.Item name="ner" >
                <Input placeholder='Нэвтрэх нэр' type='email' className='login-input' />
            </Form.Item>
            <Form.Item name="mail">
                <Input placeholder='Нууц үг' className='login-input' />
            </Form.Item>
        </Form>
    )
}

export default React.forwardRef(ZagvarBurtgel)
