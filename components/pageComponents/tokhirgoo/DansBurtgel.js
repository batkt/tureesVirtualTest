import React, { useImperativeHandle } from 'react'
import {Form,InputNumber, Select,Input, notification, Switch} from 'antd'
import updateMethod from "tools/function/crud/updateMethod";
import createMethod from "tools/function/crud/createMethod";

function DansBurtgel({data,destroy,baiguullagiinId,barilgiinId,token,dansMutate},ref) {
    const [form] = Form.useForm();

    useImperativeHandle(
        ref,
        () => ({
            khadgalya() {
                const ugugdul = form.getFieldsValue()
                const method = ugugdul?._id ? updateMethod : createMethod
                ugugdul['barilgiinId'] = barilgiinId
                ugugdul['baiguullagiinId'] = baiguullagiinId
        
                method('dans',token,ugugdul).then(({data})=>{
                    if(data === 'Amjilttai')
                        {
                            notification.success()
                            dansMutate()
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
        <Form form={form} initialValues={data} labelCol= {{span: 10}} wrapperCol={{span: 14}}>
            <Form.Item name="_id"></Form.Item>
            <Form.Item label='Дансны нэр' name="bank">
                <Select>
                    <Select.Option key='khanbank' value='khanbank'>Хаан банк</Select.Option>
                    <Select.Option key='tdb' value='tdb'>Худалдаа хөгжилийн банк</Select.Option>
                </Select>
            </Form.Item>
            <Form.Item label='Дансны дугаар' name="dugaar" >
                <InputNumber style={{width:'100%'}} />
            </Form.Item>
            <Form.Item label='Дансны нэр' name="dansniiNer">
                <Input/>
            </Form.Item>
            <Form.Item label='Валют' name="valiut">
                <Select>
                    <Select.Option key='MNT' value='MNT'>MNT</Select.Option>
                    <Select.Option key='USD' value='USD'>USD</Select.Option>
                </Select>
            </Form.Item>
            <Form.Item label='Corporate ашиглах эсэх' name="corporateAshiglakhEsekh">
                <Switch/>
            </Form.Item>
            <Form.Item label='Дансны нэр' name="corporateNevtrekhNer">
                <Input/>
            </Form.Item>
            <Form.Item label='Дансны нэр' name="corporateNuutsUg">
                <Input.Password/>
            </Form.Item>
            <Form.Item label='Дансны нэр' name="corporateGuilgeeniiNuutsUg">
                <Input.Password/>
            </Form.Item>
        </Form>
    )
}

export default React.forwardRef(DansBurtgel)
