import React, { useCallback, useEffect, useImperativeHandle, } from 'react'
import { Form, Select, Input, Button, notification, Modal } from 'antd'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import createMethod from 'tools/function/crud/createMethod';
import updateMethod from 'tools/function/crud/updateMethod';
import { aldaaBarigch } from 'services/uilchilgee';
import compareFields from 'tools/function/compareFields';
import { useTranslation } from 'react-i18next';

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
const { t } = useTranslation();
    const [form] = Form.useForm();

    function garya() {
        const values = form.getFieldsValue()
        if(compareFields(values,data,['ner','turul','tariff']))
            Modal.confirm({
              content: `Та хадгалахгүй гарахдаа итгэлтэй байна уу?`,
              okText: "Тийм",
              cancelText: "Үгүй",
              onOk: destroy})
        else
          destroy();
    }

    useEffect(()=>{
        function keyUp(e) {
            if (e.key === "Escape") {
            e.preventDefault()
            garya()
            }
        }
        form.getFieldInstance('turul').focus()
        document.addEventListener("keyup", keyUp);
        return ()=>document.removeEventListener("keyup", keyUp);
    },[])

    useImperativeHandle(
        ref,
        () => ({
            khadgalya() {
                const utga = form.getFieldsValue();
                const method = data?._id ? updateMethod : createMethod;
                method("segment", token, { ...data, ...utga }).then(
                    ({ data }) => {
                        if (data === "Amjilttai") {
                            notification.success({ message: t("Амжилттай хадгаллаа") });
                            refresh();
                            destroy();
                        }
                    }

                ).catch((e) => {
                    aldaaBarigch(e);
                });
            },
            khaaya() {
                garya()
            },
        }),
        [form],
    )

    const focuser = useCallback((e)=>{
        if(e.key === 'Enter'){
          e.preventDefault()
          switch (e.target.id) {
            case 'turul':
              form.getFieldInstance('ner').focus()
              break;
            case 'ner':
              form.getFieldInstance('ner').focus()
              break;
            default:
              break;
          }
        }
      },[])

    return (
        <Form form={form} autoComplete="off" initialValues={data} {...formItemLayout} >
            <Form.Item label={t('Төрөл')} name="turul">
                <Select onKeyUp={focuser}>
                    <Select.Option key='khariltsagch' value='khariltsagch'>{t("Харилцагч")}</Select.Option>
                    <Select.Option key='talbai' value='talbai'>{t("Талбай")}</Select.Option>
                    <Select.Option key='geree' value='geree'>{t("Гэрээ")}</Select.Option>
                </Select>
            </Form.Item>
            <Form.Item
                name="ner"
                label={t("Нэр")}
                rules={[
                    {
                        required: true,
                        message: t("Нэр өгнө үү"),
                    },
                ]}
            >
                <Input onKeyUp={focuser} ></Input>
            </Form.Item>
            <Form.List name="utguud">
                {(fields, { add, remove }, { errors }) => (
                    <>
                        {fields.map((field, index) => (
                            <Form.Item
                                {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                                label={index === 0 ? t("Утгууд") : ""}
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
                                            message: t("Та утга нэмэх юм уу энэ хэсгийг устагна уу."),
                                        },
                                    ]}
                                    noStyle
                                >
                                    <Input placeholder={t("Утга")} className='relative w-[85%]' />
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
                                {t("Утга нэмэх")}
                            </Button>
                            <Form.ErrorList errors={errors} />
                        </Form.Item>
                    </>
                )}
            </Form.List>
        </Form >
    )
}

export default React.forwardRef(SegmentBurtgekh)
