import {
    CloseCircleOutlined,
    PlusOutlined,
    SettingOutlined,

} from "@ant-design/icons";
import Admin from "components/Admin";
import _ from "lodash";
import React, { useRef, useState, useEffect } from "react";
import { useAuth } from "services/auth";
import shalgaltKhiikh from "services/shalgaltKhiikh";
import Aos from "aos";
import {
    Drawer,
    Button,
    Card,
    Divider,
    Form,
    Input,
    InputNumber,
    Select,
    Upload,
    message,
} from "antd";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { url } from "services/uilchilgee";
import createMethod from "tools/function/crud/createMethod";
import uilchilgee, { aldaaBarigch } from "services/uilchilgee";

const Konva = dynamic(() => import('components/konva'), { ssr: false })

const normFile = (e) => {
    if (Array.isArray(e)) {
        return e;
    }
    return e && e.fileList;
};

function TalbaiBurtgekh({ token }) {
    useEffect(() => {
        Aos.init({ once: true });
    });
    const router = useRouter()
    const query = router.query
    const data = JSON.parse(query.data || ("{}"))
    const barilgiinId = query.barilgiinId
    const formRef = useRef();
    const { TextArea } = Input;
    const { ajiltan, baiguullaga } = useAuth();
    const [waiting, setWaiting] = useState(false);
    const [talbaiState, settalbaiState] = useState({
        kod: undefined,
        talbainKhemjee: undefined,
        tailbar: undefined,
        talbainNegjUne: undefined,
        talbainNiitUne: undefined,
        ashiglaltiinZardal: undefined,
        niitAshiglaltiinZardal: undefined,
        tureesiinTulbur: undefined,
        davkhar: undefined,
        baiguullagiinId: ajiltan?.baiguullagiinId,
        ...data
    });
    function onChange(talbar, utga) {
        if (talbar === "talbainNegjUne") {
            let value = Number(utga) * Number(talbaiState.talbainKhemjee);
            if (
                (_.isNumber(Number(talbaiState.talbainNegjUne)) &&
                    _.isNumber(utga) &&
                    value) ||
                0
            ) {
                talbaiState.talbainNiitUne = value.toFixed(2);
                formRef.current.setFieldsValue({
                    talbainNiitUne: talbaiState.talbainNiitUne,
                });
                talbaiState.tureesiinTulbur =
                    Number(talbaiState.niitAshiglaltiinZardal || 0) +
                    Number(talbaiState.talbainNiitUne || 0);
                formRef.current.setFieldsValue({
                    tureesiinTulbur: talbaiState.tureesiinTulbur,
                });
            }
        }
        if (talbar === "ashiglaltiinZardal") {
            talbaiState.niitAshiglaltiinZardal = (
                utga * talbaiState.talbainKhemjee || 0
            ).toFixed(2);
            formRef.current.setFieldsValue({
                niitAshiglaltiinZardal: talbaiState.niitAshiglaltiinZardal,
            });
            talbaiState.tureesiinTulbur =
                Number(talbaiState.niitAshiglaltiinZardal || 0) +
                Number(talbaiState.talbainNiitUne || 0);
            formRef.current.setFieldsValue({
                tureesiinTulbur: talbaiState.tureesiinTulbur,
            });
        }
        if (talbar === "talbainNiitUne") {
            let value = Number(utga) / Number(talbaiState.talbainKhemjee);
            if (
                (_.isNumber(Number(talbaiState.talbainNegjUne)) &&
                    _.isNumber(utga) &&
                    value) ||
                0
            ) {
                talbaiState.talbainNegjUne = value.toFixed(2);
                formRef.current.setFieldsValue({
                    talbainNegjUne: talbaiState.talbainNegjUne,
                });
                talbaiState.tureesiinTulbur =
                    Number(talbaiState.niitAshiglaltiinZardal) + Number(utga);
                formRef.current.setFieldsValue({
                    tureesiinTulbur: talbaiState.tureesiinTulbur,
                });
            }
        }
        if (talbar === "talbainKhemjee") {
            talbaiState.niitAshiglaltiinZardal = (
                utga * talbaiState.ashiglaltiinZardal || 0
            ).toFixed(2);
            if (!!talbaiState.niitAshiglaltiinZardal) {
                formRef.current.setFieldsValue({
                    niitAshiglaltiinZardal: talbaiState.niitAshiglaltiinZardal,
                });
            }
            console.log(talbaiState.niitAshiglaltiinZardal);
            let value =
                talbaiState.talbainNegjUne === undefined
                    ? Number(talbaiState.talbainNiitUne) / Number(utga)
                    : Number(utga) * Number(talbaiState.talbainNegjUne);

            if (_.isNumber(value) && !_.isNaN(value)) {
                if (talbaiState.talbainNegjUne === undefined) {
                    formRef.current.setFieldsValue({
                        talbainNegjUne: value.toFixed(2),
                    });
                } else {
                    talbaiState.talbainNiitUne = value.toFixed(2);
                    formRef.current.setFieldsValue({
                        talbainNiitUne: value.toFixed(2),
                    });
                }
            }
            if (
                talbaiState.talbainNiitUne > 0 &&
                talbaiState.niitAshiglaltiinZardal > 0
            ) {
                talbaiState.tureesiinTulbur =
                    Number(talbaiState.talbainNiitUne) +
                    Number(talbaiState.niitAshiglaltiinZardal);
                formRef.current.setFieldsValue({
                    tureesiinTulbur: talbaiState.tureesiinTulbur,
                });
            }
        }
        if (talbar === "khurunguUne") {
            talbaiState.talbainNiitUne = (utga * talbaiState.talbainKhemjee).toFixed(
                2
            );
            formRef.current.setFieldsValue({});
        }
        settalbaiState((a) => ({ ...a, [talbar]: utga }));
    }

    function talbaiBurtgekh() {
        const khurunguud = formRef.current.getFieldsValue(khurunguud);
        talbaiState.baiguullagiinId = ajiltan?.baiguullagiinId;
        talbaiState.barilgiinId = barilgiinId
        if (khurunguud?.khurunguud?.length > 0) {
            talbaiState.khurunguud = khurunguud.khurunguud;
            if (talbaiState.khurunguud[0].zurgiinId !== undefined) {
                talbaiState.khurunguud.map(
                    (x) =>
                        x.zurgiinId[0]?.response?.id &&
                        (x.zurgiinId = x.zurgiinId[0].response.id)
                );
            }
        }

        setWaiting(true);
        if (!!talbaiState._id) {
            uilchilgee(token)
                .post("/talbaiZasya", talbaiState)
                .then(({ data }) => {
                    if (data === "Amjilttai") {
                        setWaiting(false);
                        message.success("Бүртгэл амжилттай засагдлаа");
                        formRef.current.resetFields();
                        router.back()
                    }
                })
                .catch((e) => {
                    aldaaBarigch(e);
                    setWaiting(false);
                });
        } else
            createMethod("talbai", token, talbaiState)
                .then(({ data }) => {
                    if (data !== undefined) {
                        setWaiting(false);
                        message.success("Бүртгэл амжилттай хийгдлээ");
                        formRef.current.resetFields();
                        router.back()
                    }
                })
                .catch((e) => {
                    aldaaBarigch(e);
                    setWaiting(false);
                });
    }

    function onFinish() {
        talbaiBurtgekh();
        if (!talbaiState.ashiglaltiinZardal) {
            talbaiState.ashiglaltiinZardal = 0
        }
    };

    const [open, setOpen] = useState(false);

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };


    const [form] = Form.useForm();
    return (

        <Admin
            title="Талбай бүртгэл"
            khuudasniiNer="talbaiBurtgekh"
            tsonkhniiId={"61c2c63e1c2830c4e6f90c8d"}
            className="p-0 md:p-4"
            dedKhuudas
            loading={waiting}
        >
            <Form
                ref={formRef}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 15 }}
                form={form}
                name="control-ref"
                onFinish={onFinish}
                initialValues={{ ...data, remember: true }}
                className='col-span-12 grid grid-cols-12 gap-6'
            >
                <div
                    className="box overflow-y-scroll p-5 md:col-span-6  xl:col-span-4"
                    style={{ maxHeight: "calc(100vh - 7rem)" }}
                >

                    <div>

                        <div data-aos="fade-right" data-aos-duration="1000">
                            <Form.Item
                                name="kod"
                                label="Дугаар"
                                rules={[
                                    {
                                        required: true,
                                        message: "Дугаар бүртгэнэ үү!",
                                    },
                                ]}
                            >
                                <Input
                                    type="text"
                                    allowClear
                                    style={{ width: "100%" }}
                                    placeholder="Дугаар"
                                    value={talbaiState.kod}
                                    onChange={(e) => onChange("kod", e.target.value)}
                                ></Input>
                            </Form.Item>
                        </div>
                        <div
                            data-aos="fade-right"
                            data-aos-duration="1000"
                            data-aos-delay="100"
                        >
                            <Form.Item
                                label="Хэмжээ"
                                name="talbainKhemjee"
                                rules={[
                                    {
                                        required: true,
                                        message: "Талбайн хэмжээ бүртгэнэ үү!",
                                    },
                                ]}
                            >
                                <InputNumber
                                    style={{ width: "100%" }}
                                    allowClear
                                    placeholder="Талбайн хэмжээ/м2/"
                                    value={talbaiState.talbainKhemjee}
                                    onChange={(v) => onChange("talbainKhemjee", v)}
                                ></InputNumber>
                            </Form.Item>
                        </div>
                        <div
                            data-aos="fade-right"
                            data-aos-duration="1000"
                            data-aos-delay="200"
                        >
                            <Form.Item
                                name="talbainNegjUne"
                                label="Нэгж үнэ"
                                rules={[
                                    {
                                        required: true,
                                        message: "Нэгж үнэ бүртгэнэ үү!",
                                    },
                                ]}
                            >
                                <InputNumber
                                    style={{ width: "100%" }}
                                    placeholder="Нэгж үнэ"
                                    value={talbaiState.talbainNegjUne}
                                    formatter={(value) =>
                                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                    }
                                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                                    onChange={(target) => onChange("talbainNegjUne", target)}
                                />
                            </Form.Item>
                        </div>
                        <div
                            data-aos="fade-right"
                            data-aos-duration="1000"
                            data-aos-delay="300"
                        >
                            <Form.Item
                                name="talbainNiitUne"
                                label="Нийт үнэ"
                                rules={[
                                    {
                                        required: true,
                                        message: "Нийт үнэ бүртгэнэ үү!",
                                    },
                                ]}
                            >
                                <InputNumber
                                    style={{ width: "100%" }}
                                    placeholder="Нийт үнэ"
                                    value={talbaiState.talbainNiitUne}
                                    formatter={(value) =>
                                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                    }
                                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                                    onChange={(target) => onChange("talbainNiitUne", target)}
                                />
                            </Form.Item>
                        </div>
                        <div
                            data-aos="fade-right"
                            data-aos-duration="1000"
                            data-aos-delay="400"
                        >
                            <Form.Item name="ashiglaltiinZardal" label="Ашиглалтын зардал">
                                <InputNumber
                                    style={{ width: "100%" }}
                                    placeholder="Ашиглалтын зардал"
                                    value={talbaiState.ashiglaltiinZardal}
                                    formatter={(value) =>
                                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                    }
                                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                                    onChange={(target) => onChange("ashiglaltiinZardal", target)}
                                />
                            </Form.Item>
                        </div>
                        <div
                            data-aos="fade-right"
                            data-aos-duration="1000"
                            data-aos-delay="500"
                        >
                            <Form.Item name="niitAshiglaltiinZardal" label="Нийт зардал">
                                <InputNumber
                                    style={{ width: "100%" }}
                                    readOnly={true}
                                    placeholder="Нийт зардал"
                                    value={talbaiState.niitAshiglaltiinZardal}
                                    formatter={(value) =>
                                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                    }
                                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                                />
                            </Form.Item>
                        </div>
                        <div
                            data-aos="fade-right"
                            data-aos-duration="1000"
                            data-aos-delay="600"
                        >
                            <Form.Item
                                name="tureesiinTulbur"
                                label="Түрээсийн төлбөр"
                                rules={[
                                    {
                                        required: true,
                                        message: "Түрээсийн бүртгэнэ үү!",
                                    },
                                ]}
                            >
                                <InputNumber
                                    style={{ width: "100%" }}
                                    readOnly={true}
                                    placeholder="Түрээсийн төлбөр"
                                    value={talbaiState.tureesiinTulbur}
                                    formatter={(value) =>
                                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                    }
                                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                                />
                            </Form.Item>
                        </div>
                        <div
                            data-aos="fade-right"
                            data-aos-duration="1000"
                            data-aos-delay="700"
                        >
                            <Form.Item
                                name="davkhar"
                                label="Давхар"
                                rules={[
                                    {
                                        required: true,
                                        message: "Давхар бүртгэнэ үү!",
                                    },
                                ]}
                            >
                                <Select
                                    style={{ width: "100%" }}
                                    placeholder="Давхар"
                                    value={talbaiState.davkhar}
                                    onChange={(e) => onChange("davkhar", e)}
                                    allowClear
                                >
                                    {baiguullaga?.barilguud?.find(a => a._id === barilgiinId)?.davkharuud.map((a) => (
                                        <Select.Option key={a._id} value={a.davkhar}>
                                            {a.davkhar}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item name="tailbar" label="Тайлбар">
                                <TextArea
                                    style={{ width: "100%" }}
                                    rows={4}
                                    placeholder="Тайлбар"
                                    value={talbaiState.tailbar}
                                    onChange={(e) => onChange("tailbar", e.target.value)}
                                ></TextArea>
                            </Form.Item>
                            <div className="flex justify-center space-x-5" >
                                <Button
                                    onClick={showDrawer}
                                    style={{
                                        backgroundColor: "white",
                                        color: "black",
                                    }}
                                ><SettingOutlined />
                                    План зураг тохируулах
                                </Button>
                                <Drawer width={"100vw"} title="План зураг тохируулах" placement="left" onClose={onClose} visible={open}>
                                    {open && <Konva davkhar={talbaiState.davkhar} baiguullaga={baiguullaga} barilgiinId={barilgiinId} points={data.bairshil} onFinish={v => {
                                        onChange('bairshil', v)
                                        onClose()
                                    }} />}
                                </Drawer>
                                <Button
                                    htmlType="submit"
                                    style={{
                                        backgroundColor: "#209669",
                                        color: "#ffffff",
                                    }}
                                >
                                    Хадгалах
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    className="box col-span-12 overflow-y-scroll p-5 md:col-span-12  xl:col-span-8"
                    style={{ maxHeight: "calc(100vh - 7rem)" }}
                >
                    <Divider className="pb-5"  >Хөрөнгийн бүртгэл</Divider>
                    <div className="">
                        <div className="">
                            <Form.List name="khurunguud">
                                {(fields, { add, remove }) => (
                                    <>
                                        {fields.map(({ key, name, fieldKey, ...restField }) => (
                                            <Card>
                                                <div
                                                    key={key}
                                                >
                                                    <div className="absolute -top-2 -right-3 rounded-full bg-white text-3xl text-black dark:bg-red-600 dark:text-white">
                                                        <CloseCircleOutlined onClick={() => remove(name)} />
                                                    </div>
                                                    <div className=" grid grid-cols-12 " >
                                                        <div className="row-span-2 col-span-2 flex justify-center items-center" >
                                                            <Form.Item
                                                                {...restField}
                                                                name={[name, "zurgiinId"]}
                                                                fieldKey={[fieldKey, "zurgiinId"]}
                                                                getValueFromEvent={normFile}
                                                            >
                                                                <Upload
                                                                    showUploadList={false}
                                                                    className="avatar-uploader "
                                                                    multiple={false}
                                                                    listType="picture"
                                                                    name="file"
                                                                    action={`${url}/zuragKhadgalya`}
                                                                    method="POST"
                                                                    data={{ turul: "khurungu" }}
                                                                    headers={{ Authorization: `bearer ${token}` }}
                                                                    onChange={e => {
                                                                        document.getElementById(`${key}-upload-image`).classList.add('hidden')
                                                                        document.getElementById(`${key}-image`).classList.remove('hidden')
                                                                        document.getElementById(`${key}-image`).src = `${url}/zuragAvya/khurungu/${baiguullaga._id}/${e.fileList[e.fileList.length - 1]?.response?.id}`
                                                                    }}
                                                                >
                                                                    <div className={data.khurunguud && !!data.khurunguud[key]?.zurgiinId ? "hidden" : "text-sm"} id={`${key}-upload-image`}  >Зураг оруулах</div>
                                                                    <img className={data.khurunguud && !data.khurunguud[key]?.zurgiinId ? "hidden" : "text-sm"} src={data.khurunguud && `${url}/zuragAvya/khurungu/${baiguullaga?._id}/${data.khurunguud[key]?.zurgiinId}`} id={`${key}-image`} alt='Зураг оруулах'></img>
                                                                </Upload>
                                                            </Form.Item>
                                                        </div>
                                                        <div className="col-span-5 flex flex-col justify-center ">
                                                            <Form.Item
                                                                {...restField}
                                                                label="Нэр"
                                                                name={[name, "ner"]}
                                                                fieldKey={[fieldKey, "ner"]}
                                                                rules={[
                                                                    {
                                                                        required: true,
                                                                        message: "Нэр бүртгэнэ үү"
                                                                    },
                                                                ]}
                                                            >
                                                                <Input style={{ width: "100%" }} placeholder="Нэр" />
                                                            </Form.Item>
                                                            <Form.Item
                                                                {...restField}
                                                                label="Тоо"
                                                                name={[name, "too"]}
                                                                fieldKey={[fieldKey, "too"]}
                                                                rules={[
                                                                    {
                                                                        required: false,
                                                                        message: "Тоо ширхэг бүртгэнэ үү",
                                                                    },
                                                                ]}
                                                            >
                                                                <InputNumber
                                                                    style={{ width: "100%" }}
                                                                    placeholder="Тоо ширхэг"
                                                                />
                                                            </Form.Item>
                                                        </div>
                                                        <div className="col-span-5 flex flex-col justify-center ">
                                                            <Form.Item

                                                                {...restField}
                                                                label="Үнэ"
                                                                name={[name, "une"]}
                                                                fieldKey={[fieldKey, "une"]}
                                                                rules={[
                                                                    { required: false, message: "Үнэ бүртгэнэ үү" },
                                                                ]}
                                                            >
                                                                <InputNumber
                                                                    style={{ width: "100%" }}
                                                                    placeholder="Нэгж үнэ"
                                                                    formatter={(value) =>
                                                                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                                                    }
                                                                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                                                                />
                                                            </Form.Item>
                                                            <Form.Item

                                                                {...restField}
                                                                label="Нийт"
                                                                name={[name, "niit"]}
                                                                fieldKey={[fieldKey, "niit"]}
                                                                rules={[
                                                                    {
                                                                        required: false,
                                                                        message: "Нийт бүртгэнэ үү",
                                                                    },
                                                                ]}
                                                            >
                                                                <InputNumber
                                                                    style={{ width: "100%" }}
                                                                    placeholder="Нийт үнэ"
                                                                    formatter={(value) =>
                                                                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                                                    }
                                                                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                                                                />
                                                            </Form.Item>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card>
                                        ))}
                                        <div className="-mt-4 flex justify-center gap-5 px-2">
                                            <Button
                                                className="bg-white w-full h-8 rounded-sm  hover:bg-green-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-700  "
                                                type="dashed"
                                                onClick={() => add()}
                                                block
                                                icon={<PlusOutlined />}
                                            >
                                                Хөрөнгө бүртгэх
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </Form.List>
                        </div>
                    </div>
                </div>
            </Form>
        </Admin >
    );
}


export const getServerSideProps = shalgaltKhiikh;

export default TalbaiBurtgekh;
