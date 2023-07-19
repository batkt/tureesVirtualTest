import React, {useEffect, useImperativeHandle, useMemo, useState} from 'react'
import {Form, Select, Input, Button, notification, Modal, InputNumber, Divider, Space} from 'antd'
import {CloseCircleOutlined, MinusCircleOutlined, PlusOutlined} from '@ant-design/icons';
import createMethod from 'tools/function/crud/createMethod';
import updateMethod from 'tools/function/crud/updateMethod';
import uilchilgee, {aldaaBarigch, url} from 'services/uilchilgee';
import { useTranslation } from 'react-i18next';
import axios from "axios";
import moment from "moment";
import useJagsaalt from "../../../hooks/useJagsaalt";
import getConfig from "next/config";

/**
 * khaalga.turul Select.Option value(Орох, Гарах) гэснийг өөрчилж болохгүй
 * Parking.н backend дээр (Орох, Гарах) гэж хадгалсан утгаар хайж байгаа
 */

function ZogsoolBurtgekh({ data, jagsaalt, barilgiinId, destroy, token, refresh }, ref) {
    const { t } = useTranslation();
    const [form] = Form.useForm();
    let method;
    if(!!data){
        method = updateMethod;
        form.setFieldsValue({...data});
    }
    else
        method = createMethod;

    useImperativeHandle(
        ref,
        () => ({
            khadgalya() {
                const body = form.getFieldsValue();
                body.barilgiinId = barilgiinId;
                method("parking", token, body).then(
                    ({data} ) => {
                        if (data === "Amjilttai") {
                            notification.success({ message: t("Амжилттай хадгаллаа") });
                            destroy();
                            refresh();
                        }
                    }
                ).catch((e) => {
                    aldaaBarigch(e);
                });
            },
            khaaya() {
                destroy();
            },
        }),
        [form],
    );

    return (
        <Form form={form} autoComplete="off">
            {!!data&&<Form.Item name="_id" hidden></Form.Item>}
            <Form.Item name="barilgiinId" hidden></Form.Item>
            <div className="grid grid-cols-4 gap-10">
                <div className="col-span-2">
                    <div className="grid grid-cols-4 gap-5 p-3">
                        <div className="border-l-2 border-green-500 pl-4 col-span-2">
                            <div className="font-medium">{t("Зогсоолын нэр")}</div>
                        </div>
                        <div className="col-span-2">
                            <Form.Item
                                className="m-0"
                                name="ner"
                                rules={[
                                    {
                                        required: true,
                                        message: t("Нэр оруулна уу!"),
                                    },
                                ]}
                            >
                                <Input
                                    autoFocus={true}
                                />
                            </Form.Item>
                        </div>
                        <div className="border-l-2 border-green-500 pl-4 col-span-2">
                            <div className="font-medium">{t("Нийт зогсоолын тоо")}</div>
                        </div>
                        <div className="col-span-2">
                            <Form.Item
                                className="m-0"
                                name="too"
                                rules={[
                                    {
                                        required: true,
                                        message: t("Нийт зогсоолын тоо оруулна уу!"),
                                    },
                                ]}
                            >
                                <Input/>
                            </Form.Item>
                        </div>
                        <div className="border-l-2 border-green-500 pl-4 col-span-2">
                            <div className="font-medium">{t("Үндсэн тариф /30мин ₮/")}</div>
                        </div>
                        <div className="col-span-2">
                            <Form.Item
                                className="m-0"
                                name="undsenUne"
                                rules={[
                                    {
                                        required: true,
                                        message: t("Үндсэн тариф оруулна уу!"),
                                    },
                                ]}
                            >
                                <Input/>
                            </Form.Item>
                        </div>
                        <div className="border-l-2 border-green-500 pl-4 col-span-2">
                            <div className="font-medium">{t("Гадна зогсоол сонгох")}</div>
                        </div>
                        <div className="col-span-2">
                            <Form.Item
                                extra="Зөвхөн дотор зогсоол нэмэх үед сонгоно уу!!"
                                className="m-0"
                                name="gadnaZogsooliinId">
                                <Select>
                                    <Select.Option value={undefined}>---</Select.Option>
                                    {jagsaalt.map((mur, i) => (
                                        !!data ? mur._id !== data._id &&
                                            <Select.Option key={i} value={mur?._id}>
                                                {mur?.ner}
                                            </Select.Option>
                                            :
                                            <Select.Option key={i} value={mur?._id}>
                                                {mur?.ner}
                                            </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </div>
                    </div>
                </div>
                <div className="col-span-2">
                    <Form.List name="tulburuud">
                        {(fields, { add, remove }) => (
                            <>
                                <div
                                    className="my-5 space-y-3 overflow-y-auto py-2"
                                    style={{ maxHeight: "40vh" }}>
                                    {fields.map(({ key, name, fieldKey, ...restField }) => (
                                        (
                                            <div key={fieldKey} className=" relative rounded-md border bg-green-50 px-10 py-4 shadow-md 2xl:pr-20 mb-5">
                                                <div className="grid w-full grid-cols-4 items-center gap-5">
                                                    <div
                                                        onClick={()=> remove(name)}
                                                        className="absolute right-2 top-[2%] flex text-lg transition-all hover:text-red-500">
                                                        <CloseCircleOutlined />
                                                    </div>
                                                    <Form.Item
                                                        label="Минут хүртэл:"
                                                        labelCol={{span: 24}}
                                                        {...restField}
                                                        name={[name, 'minut']}
                                                        fieldKey={[fieldKey, "minut"]}
                                                        rules={[{ required: true, message: 'Минут бөглөнө үү.' }]}
                                                        className="col-span-2 mb-0">
                                                        <InputNumber placeholder="Минут" className="w-full" />
                                                    </Form.Item>
                                                    <Form.Item
                                                        label="Тариф/₮/:"
                                                        labelCol={{span: 24}}
                                                        {...restField}
                                                        name={[name, 'tulbur']}
                                                        fieldKey={[fieldKey, "tulbur"]}
                                                        rules={[{ required: true, message: 'Тариф бөглөнө үү.' }]}
                                                        className="col-span-2 mb-0">
                                                        <InputNumber
                                                            formatter={(value) =>
                                                                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                                            }
                                                            className="w-full"
                                                            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                                                            placeholder="Тариф"
                                                        />
                                                    </Form.Item>
                                                </div>
                                            </div>
                                            )
                                    ))}
                                </div>
                                <Button
                                    icon={<PlusOutlined />}
                                    className="mb-5 w-full flex bg-green-200 hover:bg-green-200"
                                    type="dashed"
                                    onClick={()=>add()} >
                                    Тариф нэмэх
                                </Button>
                            </>
                        )}
                    </Form.List>
                    <Form.List name="khaalga">
                        {(fields, { add, remove }) => (
                            <>
                                <div className="space-y-3 overflow-y-auto mb-5" style={{ maxHeight: "40vh" }}>
                                    {fields.map(({ key, name, fieldKey, ...restField }) => (
                                        <Khaalga barilgiinId={barilgiinId} key={key} name={name} fieldKey={fieldKey} restField={restField} fields={fields} remove={remove}/>
                                    ))}

                                </div>
                                <Button
                                    icon={<PlusOutlined />}
                                    className="w-full flex bg-green-200 hover:bg-green-200"
                                    type="dashed"
                                    onClick={() => add()} >
                                    Хаалга нэмэх
                                </Button>
                            </>
                        )}
                    </Form.List>
                </div>
            </div>
        </Form >
    )
}

function Khaalga({ name, fieldKey, restField, remove, barilgiinId }) {
    const [cameraIps, setCameraIps] = useState([]);
    useEffect(()=>{
        axios.get("https://turees.zevtabs.mn/api/zogsooliinIpAvaya/"+barilgiinId )
            .then(function (response) {
                if (!!response)
                    setCameraIps(response.data.ip);
            })
            .catch(function (error) {
                console.log("ERROR: /api/neeye", error);
            });
    },[]);
    // console.log('11111111', name, 'fieldKey: ',fieldKey, 'restField ', restField, 'fields ', cameraIps);
    const { t } = useTranslation();
    return (
        <div key={fieldKey} className=" relative rounded-md border bg-yellow-50 px-10 py-4 shadow-md 2xl:pr-20 mb-5">
            <Divider className="pb-5">Хаалга {fieldKey + 1}</Divider>
            <div className="grid w-full grid-cols-4 items-center gap-5">
                <div
                    onClick={()=> remove(name)}
                    className="absolute right-2 top-[2%] flex text-lg transition-all hover:text-red-500">
                    <CloseCircleOutlined />
                </div>
                <Form.Item
                    label="Нэр:"
                    labelCol={{span: 24}}
                    {...restField}
                    name={[name, 'ner']}
                    fieldKey={[fieldKey, "ner"]}
                    rules={[{ required: true, message: 'Нэр бөглөнө үү.' }]}
                    className="col-span-2 mb-0">
                    <Input placeholder="Ялгах нэр"/>
                </Form.Item>
                <Form.Item
                    label="Төрөл:"
                    labelCol={{span: 24}}
                    {...restField}
                    name={[name, 'turul']}
                    fieldKey={[fieldKey, "turul"]}
                    rules={[{ required: true, message: 'Төрөл бөглөнө үү.' }]}
                    className="col-span-2 mb-0">
                    <Select style={{ width: "100%" }} placeholder={t("Орох / Гарах")}>
                        <Select.Option value={"Орох"}>Орох</Select.Option>
                        <Select.Option value={"Гарах"}>Гарах</Select.Option>
                    </Select>
                </Form.Item>
            </div>
            <Form.List name={[name, 'camera']}>
                {(talbaruud, { add, remove }) => (
                    <>
                        {talbaruud.map(talbar => (
                            <div className="mt-5 flex">
                                <Form.Item
                                    {...talbar.restField}
                                    name={[talbar.name,'cameraIP']}
                                    fieldKey={[talbar.key, "cameraIP"]}
                                    className="w-full m-0"
                                >
                                    <Select style={{ width: "100%" }} placeholder={t("Камер IP")}>
                                        {
                                            cameraIps?.map((mur)=>(
                                            <Select.Option value={mur}>{mur}</Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                                <MinusCircleOutlined className="ml-2" onClick={() => remove(talbar.name)} />
                            </div>
                        ))}
                        <Button
                            className="mt-5 h-8 w-full rounded-sm bg-white  hover:bg-green-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-700  "
                            type="dashed"
                            onClick={() => add()}
                            id={"khurunguBurtgekh"}
                            block
                            icon={<PlusOutlined />}
                        >
                            {t("Камер нэмэх")}
                        </Button>
                    </>
                )}
            </Form.List>
        </div>
    )
}

export default React.forwardRef(ZogsoolBurtgekh)
