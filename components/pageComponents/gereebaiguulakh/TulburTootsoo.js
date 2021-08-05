import {
    Form,
    Input,
    Button,
} from 'antd';
import { ArrowLeftOutlined, ArrowRightOutlined, ClockCircleOutlined, SaveOutlined } from '@ant-design/icons';
const formItemLayout = {
    labelCol: {
        span: 6,
    },
    wrapperCol: {
        span: 14,
    },
};

const Demo = ({ value, onChange, next, prev }) => {
    const onFinish = (values) => {
        onChange({ ...value, ...values })
        next({ ...value, ...values })
    };

    return (
        <Form
            name="validate_other"
            {...formItemLayout}
            initialValues={value}
            onFinish={onFinish}
        >
            <Form.Item name='sariinTurees' label="Сарын түрээс" >
                <Input
                    allowClear
                    maxLength={10}
                    placeholder="Үнэлгээ"
                    prefix={<ClockCircleOutlined />}
                />
            </Form.Item>
            <Form.Item
                wrapperCol={{
                    span: 12,
                    offset: 6,
                }}
            >
                <Button onClick={prev} icon={<ArrowLeftOutlined />} className='mr-4'>
                    Гэрээний хугацаа
                </Button>
                <Button type="primary" htmlType="submit" icon={<SaveOutlined />} >
                    Хадгалах
                </Button>
            </Form.Item>
        </Form>
    );
};

export default Demo