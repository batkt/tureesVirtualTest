import {
    Form,
    Input,
    Switch,
    Button,
    Upload,
} from 'antd';
import { UploadOutlined, SolutionOutlined, ArrowRightOutlined, MinusCircleOutlined, PlusOutlined, PhoneOutlined } from '@ant-design/icons';
import React from 'react';

const formItemLayout = {
    labelCol: {
        span: 6,
    },
    wrapperCol: {
        span: 14,
    },
};

const normFile = (e) => {
    console.log('Upload event:', e);

    if (Array.isArray(e)) {
        return e;
    }

    return e && e.fileList;
};

const YurunkhiiMedeele = ({ next, onChange, value }) => {

    const [baiguullagaEsekh, setBaiguullagaEsekh] = React.useState(false)

    const onFinish = (values) => {
        console.log(values)
        onChange({ ...value, ...values })
        next()
    };

    return (
        <Form
            name="validate_other"
            {...formItemLayout}
            initialValues={value}
            onFinish={onFinish}
        >
            <Form.Item name="baiguullagaEsekh" label="Байгууллага эсэх" valuePropName="checked">
                <Switch onChange={(v) => setBaiguullagaEsekh(v)} />
            </Form.Item>
            <Form.Item name='baiguullagiinNer' hidden={!baiguullagaEsekh} label="Байгууллага нэр">
                <Input
                    allowClear
                    maxLength={10}
                    placeholder="Байгууллага нэр"
                    prefix={<SolutionOutlined />}
                />
            </Form.Item>
            {!baiguullagaEsekh && <Form.Item hidden={baiguullagaEsekh} name='register' label="Регистр" rules={[
                {
                    required: true,
                    len: 10,
                    pattern: new RegExp("([А-Я|Ө|Ү]{2})(\\d{8})"),
                    message: "Регистр бүртгэнэ үү!",
                },
            ]}>
                <Input
                    allowClear
                    maxLength={10}
                    placeholder="Регистр"
                    prefix={<SolutionOutlined />}
                />
            </Form.Item>}
            {baiguullagaEsekh && <Form.Item hidden={!baiguullagaEsekh} name='register' label="Регистр" rules={[
                {
                    required: true,
                    len: 7,
                    pattern: new RegExp("(\\d{7})"),
                    message: "Регистр бүртгэнэ үү!",
                },
            ]}>
                <Input
                    allowClear
                    maxLength={7}
                    placeholder="Регистр"
                    prefix={<SolutionOutlined />}
                />
            </Form.Item>}
            <Form.Item hidden={baiguullagaEsekh} name='ovog' label="Овог">
                <Input
                    allowClear
                    maxLength={10}
                    placeholder="Овог"
                    prefix={<SolutionOutlined />}
                />
            </Form.Item>
            <Form.Item hidden={baiguullagaEsekh} name='ner' label="Нэр">
                <Input
                    allowClear
                    maxLength={10}
                    placeholder="Нэр"
                    prefix={<SolutionOutlined />}
                />
            </Form.Item>
            <Form.Item hidden={!baiguullagaEsekh} name='zakhirliinOvog' label="Захирлын овог">
                <Input
                    allowClear
                    maxLength={10}
                    placeholder="Овог"
                    prefix={<SolutionOutlined />}
                />
            </Form.Item>
            <Form.Item hidden={!baiguullagaEsekh} name='zakhirliinNer' label="Захирлын нэр">
                <Input
                    allowClear
                    maxLength={10}
                    placeholder="Нэр"
                    prefix={<SolutionOutlined />}
                />
            </Form.Item>
            <Form.Item label="Утас">
                <Form.List
                    name="utas"
                    rules={[
                        {
                            validator: async (_, names) => {
                                if (!names || names.length < 2) {
                                    return Promise.reject(new Error('Багадаа 2 дугаар оруулна уу!'));
                                }
                            },
                        },
                    ]}
                >
                    {(fields, { add, remove }, { errors }) => (
                        <div className='flex flex-wrap'>
                            {fields.map((field) => (
                                <Form.Item
                                    required={false}
                                    key={field.key}
                                >
                                    <Form.Item
                                        {...field}
                                        validateTrigger={['onChange', 'onBlur']}
                                        rules={[
                                            {
                                                required: true,
                                                whitespace: true,
                                                message: "Утас оруулна уу.",
                                            },
                                        ]}
                                        noStyle
                                    >
                                        <Input prefix={<PhoneOutlined />} placeholder="Утас" style={{ width: '10rem', minWidth: '2rem' }} />
                                    </Form.Item>
                                    {fields.length > 1 ? (
                                        <MinusCircleOutlined
                                            className="mx-2"
                                            onClick={() => remove(field.name)}
                                        />
                                    ) : null}
                                </Form.Item>
                            ))}
                            <Form.Item>
                                <Button
                                    type="dashed"
                                    onClick={() => add()}
                                    style={{ marginLeft: '1rem' }}
                                    icon={<PlusOutlined />}
                                >
                                    Утас нэмэх
                                </Button>
                                <Form.ErrorList errors={errors} />
                            </Form.Item>
                        </div>
                    )}
                </Form.List>
            </Form.Item>
            <Form.Item
                hidden={!baiguullagaEsekh}
                name="gerchilgeeniiZurag"
                label="Гэрчилгээний хуулбар"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                extra="Гэрчилгээний хуулбар"
            >
                <Upload name="logo" action="/upload.do" listType="picture">
                    <Button icon={<UploadOutlined />}>Файл сонгох</Button>
                </Upload>
            </Form.Item>
            <Form.Item label='Хавсаргал' hidden={baiguullagaEsekh} className='w-full'>
                <div className='flex md:flex-row w-full'>
                    <Form.Item
                        name="zuvshuurliinZurag"
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                        extra="Зөвшөөрлийн бичгийн хуулбар"
                        className='md:w-1/2'
                    >
                        <Upload name="logo" action="/upload.do" listType="picture">
                            <Button icon={<UploadOutlined />}>Файл сонгох</Button>
                        </Upload>
                    </Form.Item>
                    <div className='md:ml-10 md:w-1/2'>
                        <Form.Item
                            name="unemlekhniiZurag"
                            valuePropName="fileList"
                            getValueFromEvent={normFile}
                            extra="Иргэний үнэмлэхний хуулбар"

                        >
                            <Upload name="logo" action="/upload.do" listType="picture">
                                <Button icon={<UploadOutlined />}>Файл сонгох</Button>
                            </Upload>
                        </Form.Item>
                    </div>
                </div>
            </Form.Item>
            <Form.Item
                wrapperCol={{
                    span: 12,
                    offset: 6,
                }}
            >
                <Button type="primary" htmlType="submit" icon={<ArrowRightOutlined />} >
                    Барьцаа бүртгэл
                </Button>
            </Form.Item>
        </Form >
    );
};

export default YurunkhiiMedeele