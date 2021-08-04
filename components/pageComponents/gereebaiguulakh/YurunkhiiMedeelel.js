import {
    Form,
    Select,
    Input,
    Switch,
    Button,
    Upload,
} from 'antd';
import { UploadOutlined, InboxOutlined, SolutionOutlined } from '@ant-design/icons';

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

const YurunkhiiMedeele = () => {
    const onFinish = (values) => {
        console.log('Received values of form: ', values);
    };

    return (
        <Form
            name="validate_other"
            {...formItemLayout}
            onFinish={onFinish}
            initialValues={{
                'input-number': 3,
                'checkbox-group': ['A', 'B'],
                rate: 3.5,
            }}
        >
            <Form.Item name="baiguullagaEsekh" label="Байгууллага эсэх" valuePropName="checked">
                <Switch />
            </Form.Item>
            <Form.Item label="Регистр" rules={[
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
            <Form.Item
                name="upload"
                label="Upload"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                extra="longgggggggggggggggggggggggggggggggggg"
            >
                <Upload name="logo" action="/upload.do" listType="picture">
                    <Button icon={<UploadOutlined />}>Click to upload</Button>
                </Upload>
            </Form.Item>

            <Form.Item label="Dragger">
                <Form.Item name="dragger" valuePropName="fileList" getValueFromEvent={normFile} noStyle>
                    <Upload.Dragger name="files" action="/upload.do">
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">Click or drag file to this area to upload</p>
                        <p className="ant-upload-hint">Support for a single or bulk upload.</p>
                    </Upload.Dragger>
                </Form.Item>
            </Form.Item>

            <Form.Item
                wrapperCol={{
                    span: 12,
                    offset: 6,
                }}
            >
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    );
};

export default YurunkhiiMedeele