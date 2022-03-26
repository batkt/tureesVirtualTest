import React, { useImperativeHandle } from 'react'
import {Form,InputNumber} from 'antd'
function DunZasvar({data,index,setNekhemjleliinJagsaalt,destroy,nekhemjleliinJagsaalt},ref) {
    const [form] = Form.useForm();

    useImperativeHandle(
        ref,
        () => ({
            khadgalya() {
                const nekhemjlelChanged = form.getFieldsValue()
                nekhemjleliinJagsaalt[index] = {...nekhemjleliinJagsaalt[index],...nekhemjlelChanged}
                setNekhemjleliinJagsaalt([...nekhemjleliinJagsaalt])
                destroy()
            },
            khaaya() {
                destroy()
            },
        }),
        [form],
    )


    return (
        <Form form={form} initialValues={data} labelCol= {{span: 10}} wrapperCol={{span: 14}}>
            <Form.Item label='Өмнөх хуримтлагдсан өр төлбөр' name="umnukhSariinUrTulbur" >
                <InputNumber formatter={(value) =>`${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} parser={(value) => value.replace(/\$\s?|(,*)/g, "")}/>
            </Form.Item>
            <Form.Item label='Энэ сард төлөх дүн' name="eneSardTulukhDun">
                <InputNumber formatter={(value) =>`${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} parser={(value) => value.replace(/\$\s?|(,*)/g, "")}/>
            </Form.Item>
        </Form>
    )
}

export default React.forwardRef(DunZasvar)
