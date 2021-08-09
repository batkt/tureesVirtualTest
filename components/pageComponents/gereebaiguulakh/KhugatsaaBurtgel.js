import {
    Form,
    Select,
    Input,
    Switch,
    Button,
    Upload,
    DatePicker,
} from 'antd';
import { UploadOutlined, InboxOutlined, SolutionOutlined, ArrowRightOutlined, ArrowLeftOutlined, DatabaseOutlined, ClockCircleOutlined } from '@ant-design/icons';
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
const YurunkhiiMedeele = ({ next, prev, onChange, value }) => {

    const [baiguullagaEsekh, setBaiguullagaEsekh] = React.useState(false)

    const onFinish = (values) => {
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
            <Form.Item name='khugatsaa' label="Гэрээний хугацаа" >
                <Input
                    allowClear
                    maxLength={10}
                    placeholder="Гэрээний хугацаа"
                    prefix={<ClockCircleOutlined />}
                />
            </Form.Item>
            <Form.Item name='khungulukhKhugatsaa' label="Хөнгөлөх хугацаа" >
                <Input
                    allowClear
                    placeholder="Хөнгөлөх хугацаа"
                    prefix={<SolutionOutlined />}
                />
            </Form.Item>
            <Form.Item label="Төлөлт хийх огноо сар бүрийн / өдөр" >
                <Input
                    allowClear
                    placeholder="Төлөлт хийх огноо сар бүрийн / өдөр"
                    prefix={<SolutionOutlined />}
                />
            </Form.Item>
            <Form.Item name='duusakhOgnoo' label="Гэрээ дуусах хугацаа" >
                <DatePicker
                    allowClear
                    placeholder="Гэрээ дуусах хугацаа"
                    prefix={<SolutionOutlined />}
                />
            </Form.Item>
            <Form.Item label="Гэрээний хугацааг сунгах " >
                <Input
                    allowClear
                    placeholder="Гэрээний хугацааг сунгах "
                    prefix={<SolutionOutlined />}
                />
            </Form.Item>
            <Form.Item label="Хугацаа хэтрэвэл төлөлт хийх боломжит хугацаа" >
                <Input
                    allowClear
                    placeholder="Хугацаа хэтрэвэл төлөлт хийх боломжит хугацаа"
                    prefix={<SolutionOutlined />}
                />
            </Form.Item>
            <Form.Item label="Төлөлт сануулах мэдээлэл хугацаа дуусахаас /өдрийн өмнө" >
                <Input
                    allowClear
                    placeholder="Төлөлт сануулах мэдээлэл хугацаа дуусахаас /өдрийн өмнө"
                    prefix={<SolutionOutlined />}
                />
            </Form.Item>
            <Form.Item noStyle className='w-full flex flex-row justify-between'>
                <Button onClick={prev} icon={<ArrowLeftOutlined />} className='mr-4'>
                    Хөрөнгийн бүртгэл
                </Button>
                <Button type="primary" htmlType="submit" icon={<ArrowRightOutlined />} >
                    Төлбөр тооцоо
                </Button>
            </Form.Item>
        </Form>
    );
};

export default YurunkhiiMedeele