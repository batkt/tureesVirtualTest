import React, { useImperativeHandle } from 'react'
import {Form,Input, message} from 'antd'
import ZagvarUusgekh from './ZagvarUusgekh';
import createMethod from 'tools/function/crud/createMethod';

function ZagvarForm({value,onChange}) {
    return (
        <ZagvarUusgekh value={value} change={onChange} buttonListCustom={[["font", "fontSize","fontColor"],["image","table","list","align","nekhemjlel"]]} otherProps={{height:'595px'}} />
    )
}

function DunZasvar({data,barilgiinId,token,destroy,afterShock},ref) {
    const [form] = Form.useForm();

    useImperativeHandle(
        ref,
        () => ({
            khadgalya() {
                const data = form.getFieldsValue()
                data.barilgiinId = barilgiinId
                createMethod('nekhemjlekhiinZagvar',token,data).then(({data})=>{
                    if(data === 'Amjilttai')
                    {
                        message.success('Амжилттай хадгаллаа')
                        afterShock && afterShock()
                        destroy()
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
        <Form form={form} initialValues={data} className='space-y-2'>
            <Form.Item label='Нэр' name="ner" noStyle >
                <Input placeholder='Нэр'/>
            </Form.Item>
            <Form.Item label='Нэхэмжлэхийн загвар' name="nekhemjlekh" noStyle>
                <ZagvarForm />
            </Form.Item>
        </Form>
    )
}

export default React.forwardRef(DunZasvar)
