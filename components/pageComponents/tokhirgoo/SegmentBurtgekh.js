import React, { useImperativeHandle, } from 'react'
import { Form, Select, Input, Button, notification } from 'antd'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import createMethod from 'tools/function/crud/createMethod';
import updateMethod from 'tools/function/crud/updateMethod';
import { aldaaBarigch } from 'services/uilchilgee';

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
    },
};
const formItemLayoutWithOutLabel = {
    wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 },
    },
};

function SegmentBurtgekh({ data, destroy, token, refresh }, ref) {

    const [form] = Form.useForm();

    useImperativeHandle(
        ref,
        () => ({
            khadgalya() {
                const utga = form.getFieldsValue();
                const method = data?._id ? updateMethod : createMethod;
                method("segment", token, { ...data, ...utga }).then(
                    ({ data }) => {
                        if (data === "Amjilttai") {
                            notification.success({ message: "Амжилттай хадгаллаа" });
                            refresh();
                            destroy();
                            console.log(">>>>")
                        }
                    }

                ).catch((e) => {
                    aldaaBarigch(e);
                });
            },
            khaaya() {
                destroy()
            },
        }),
        [form],
    )

    return (
        <Form form={form} autoComplete="off" initialValues={data} {...formItemLayout} >
            <Form.Item label='Төрөл' name="turul">
                <Select >
                    <Select.Option key='khariltsagch' value='khariltsagch'>Харилцагч</Select.Option>
                    <Select.Option key='talbai' value='talbai'>Талбай</Select.Option>
                </Select>
            </Form.Item>
            <Form.Item
                name="ner"
                label="Нэр"
                rules={[
                    {
                        required: true,
                        message: 'Нэр өгнө үү',
                    },
                ]}
            >
                <Input  ></Input>
            </Form.Item>
            <Form.List name="utguud">
                {(fields, { add, remove }, { errors }) => (
                    <>
                        {fields.map((field, index) => (
                            <Form.Item
                                {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                                label={index === 0 ? "Утгууд" : ""}
                                required={false}
                                key={field.key}
                            >
                                <Form.Item
                                    {...field}
                                    validateTrigger={["onChange", "onBlur"]}
                                    rules={[
                                        {
                                            required: true,
                                            whitespace: true,
                                            message: "Та утга нэмэх юм уу энэ хэсгийг устагна уу.",
                                        },
                                    ]}
                                    noStyle
                                >
                                    <Input placeholder="Утга" className='relative w-[85%]' />
                                </Form.Item>

                                {fields.length > 1 ? (
                                    <MinusCircleOutlined
                                        className="absolute right-5 bottom-0  bg-gray-300w-full dynamic-delete-button opacity-40 "
                                        onClick={() => remove(field.name)}
                                    />
                                ) : null}

                            </Form.Item>
                        ))}
                        <Form.Item {...formItemLayoutWithOutLabel}>
                            <Button
                                type="dashed"
                                onClick={() => add()}
                                className="relative w-[85%]"
                                icon={
                                    <PlusOutlined />
                                }
                            >
                                Утга нэмэх
                            </Button>
                            <Form.ErrorList errors={errors} />
                        </Form.Item>
                    </>
                )}
            </Form.List>
            {/* <Form.Item>
                <Button onClick={segmentAvya} > ss</Button>
            </Form.Item> */}
        </Form >
    )
}

export default React.forwardRef(SegmentBurtgekh)

