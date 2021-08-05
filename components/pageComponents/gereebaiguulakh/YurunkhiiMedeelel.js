import {
    Form,
    Select,
    Input,
    Switch,
    Button,
    Upload,
    Space,
} from 'antd';
import { UploadOutlined, InboxOutlined, SolutionOutlined, ArrowRightOutlined, MinusCircleOutlined, PlusOutlined, PhoneOutlined } from '@ant-design/icons';
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

// ААН	Байгууллага нэр	
// 	    Регистр	
// 	    Албан тушаал	
// 	    Овог	
// 	    Нэр	
// 	    Утас	Гар утас
// 		Байгууллага
// 	    Хаяг	
// 	    Гэрчилгээний хуулбар	
// Иргэн	Овог	
// 	        Нэр	
// 	        Регистр	
// 	        Гар утас	
// 	        Хаяг	
// 	        Зөвшөөрлийн бичгийн хуулбар	
// 	        Иргэний үнэмлэхний хуулбар	
/*
baiguullagiinNer
register
ovog 
ner
utas1 utas2
baiguullaga
khayag
gerchilgeeniiKhuulbar
zuvshuurliinBichgiinKhuulbar
irgeniiUnemlekhiinKhuulbar
*/
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
            <Form.Item name='register' label="Регистр" rules={[
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
            </Form.Item>
            <Form.Item name='ovog' label="Овог">
                <Input
                    allowClear
                    maxLength={10}
                    placeholder="Овог"
                    prefix={<SolutionOutlined />}
                />
            </Form.Item>
            <Form.Item name='ner' label="Нэр">
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
                        <>
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
                                        <Input prefix={<PhoneOutlined />} placeholder="Утас" style={{ width: '60%' }} />
                                    </Form.Item>
                                    {fields.length > 1 ? (
                                        <MinusCircleOutlined
                                            className="ml-2"
                                            onClick={() => remove(field.name)}
                                        />
                                    ) : null}
                                </Form.Item>
                            ))}
                            <Form.Item>
                                <Button
                                    type="dashed"
                                    onClick={() => add()}
                                    style={{ width: '60%' }}
                                    icon={<PlusOutlined />}
                                >
                                    Утас нэмэх
                                </Button>
                                <Form.ErrorList errors={errors} />
                            </Form.Item>
                        </>
                    )}
                </Form.List>
            </Form.Item>
            <Form.Item
                hidden={!baiguullagaEsekh}
                name="upload"
                label="Гэрчилгээний хуулбар"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                extra="Гэрчилгээний хуулбар"
            >
                <Upload name="logo" action="/upload.do" listType="picture">
                    <Button icon={<UploadOutlined />}>Click to upload</Button>
                </Upload>
            </Form.Item>
            <Form.Item
                name="upload"
                label="Зөвшөөрлийн бичгийн хуулбар"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                extra="Зөвшөөрлийн бичгийн хуулбар"
            >
                <Upload name="logo" action="/upload.do" listType="picture">
                    <Button icon={<UploadOutlined />}>Click to upload</Button>
                </Upload>
            </Form.Item>
            <Form.Item
                name="upload"
                label="Иргэний үнэмлэхний хуулбар"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                extra="Иргэний үнэмлэхний хуулбар"
            >
                <Upload name="logo" action="/upload.do" listType="picture">
                    <Button icon={<UploadOutlined />}>Click to upload</Button>
                </Upload>
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
        </Form>
    );
};

export default YurunkhiiMedeele