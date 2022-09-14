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
} from "antd";
import { useRouter } from "next/router";

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
    const formRef = useRef();

    const { TextArea } = Input;
    const { ajiltan, baiguullaga, barilgiinId } = useAuth();
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
        zasakhEsekh: false,
        ...data
    });

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
        <Form
            ref={formRef}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 15 }}
            form={form}
            name="control-ref"
            onFinish={onFinish}
            initialValues={{ ...data, remember: true }}
        >
            <Admin
                title="Талбай бүртгэл"
                khuudasniiNer="talbaiBurtgekh"
                tsonkhniiId={"61c2c63e1c2830c4e6f90c8d"}
                className="p-0 md:p-4"
                loading={waiting}
            >
                <div
                    className="box col-span-12 overflow-y-scroll p-5 md:col-span-6  xl:col-span-4"
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
                                    {baiguullaga?.barilguud[0]?.davkharuud.map((a) => (
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
                                    <div className=" h-5/6 flex justify-center items-center  bg-gray-300 " width={"100vw"} >
                                        Конва оруулах
                                    </div>
                                    <Button style={{ backgroundColor: "#209669", color: "#ffffff", }}> Хадгалах</Button>
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
                                                                    <div className={data.khurunguud && data.khurunguud[key]?.zurgiinId ? "hidden" : "text-sm"} id={`${key}-upload-image`}  >Зураг оруулах</div>
                                                                    <img className={data.khurunguud && data.khurunguud[key]?.zurgiinId ? "" : 'hidden'} src={data.khurunguud && `${url}/zuragAvya/khurungu/${baiguullaga?._id}/${data.khurunguud[key].zurgiinId}`} id={`${key}-image`} alt='Зураг оруулах'></img>
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
            </Admin>
        </Form >
    );
}


export const getServerSideProps = shalgaltKhiikh;

export default TalbaiBurtgekh;
