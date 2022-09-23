import React from "react";
import { Button, Popconfirm, Popover, } from "antd";
import {
    MoreOutlined,
    EditOutlined,
    PlusOutlined,
    DeleteOutlined,
} from "@ant-design/icons";
import shalgaltKhiikh from "services/shalgaltKhiikh";
import { modal } from "components/ant/Modal";
import SegmentBurtgekh from "./SegmentBurtgekh";
import useJagsaalt from "hooks/useJagsaalt";
import CardList from "components/cardList";
import deleteMethod from "tools/function/crud/deleteMethod";

function Tile({ token, ...a }) {

    function segmentUstgaya() {
        deleteMethod("segment", token, a._id)
    }
    return (
        <div className="box" >
            <div className="flex items-center shadow-none p-7">
                <div className="border-l-2 border-green-500 pl-4">
                    <div className="font-medium">{a.ner}</div>
                    <div className="text-gray-600">{a.utguud.join(", ")}</div>
                </div>
                <div className="ml-auto">
                    <Popover
                        placement="bottom"
                        trigger="click"
                        content={() => (
                            <div className="flex flex-col space-y-2 w-24">
                                <a
                                    className="ant-dropdown-link p-2 rounded-lg hover:bg-green-100 flex items-center justify-between w-full"
                                // onClick={(a) => segmentBurtegye(a)}
                                >
                                    <EditOutlined style={{ fontSize: "18px" }} />
                                    <label>Засах</label>
                                </a>

                                <Popconfirm
                                    okText="Тийм"
                                    cancelText="Үгүй"
                                    onConfirm={() => segmentUstgaya()}
                                >
                                    <div
                                        className="ant-dropdown-link p-2 rounded-lg hover:bg-green-100 flex items-center justify-between w-full"
                                    >
                                        <DeleteOutlined className="text-lg text-red-500" />
                                        <label className=" text-red-500">Устгах</label>
                                    </div>
                                </Popconfirm>
                            </div>
                        )}

                    >
                        <a className="rounded-full hover:bg-gray-200 flex items-center justify-center">
                            <MoreOutlined style={{ fontSize: "18px" }} />
                        </a>
                    </Popover>
                </div>
            </div>
        </div>
    )
}

function segmentiinTokhirgoo({ token }) {

    const ref = React.useRef(null);

    const segment = useJagsaalt("/segment")

    function segmentBurtegye(data) {
        const footer = [
            <Button onClick={() => ref.current.khaaya()}>Хаах</Button>,
            <Button type="primary" onClick={() => ref.current.khadgalya()}>
                Хадгалах
            </Button>,
        ]
        modal({
            title: "Дансны бүртгэл",
            icon: <PlusOutlined />,
            content: (
                <SegmentBurtgekh
                    ref={ref}
                    data={data}
                    token={token}
                />
            ),
            footer,
        })
    }

    return (
        <div className="xxl:col-span-4 col-span-12 mt-5 lg:col-span-5">
            <div className="box mt-5 lg:mt-0">
                <div
                    className="dark:border-dark-5 flex items-center  justify-end border-b border-gray-200 px-5 pt-5 pb-2"
                    onClick={(a) => segmentBurtegye(a)}
                >
                    <Button type="primary" >
                        Segment бүртгэх
                    </Button>
                </div>
                <div hidden={!segment.jagsaalt} >
                    <CardList
                        keyValue="segment"
                        className="overflow-y-scroll max-h-[70vh] bg-[#F3F4F6]"
                        jagsaalt={segment?.jagsaalt}
                        Component={Tile}
                        componentProps={{ token }}
                    />
                </div>
                <div hidden={!segment.jagsaalt}>
                    < CardList
                        pagination={{
                            current: segment?.data?.khuudasniiDugaar,
                            pageSize: segment?.data?.khuudasniiKhemjee,
                            total: segment?.data?.niitMur,
                            showSizeChanger: true,
                            onChange: (khuudasniiDugaar, khuudasniiKhemjee) =>
                                segment.setKhuudaslalt((kh) => ({
                                    ...kh,
                                    khuudasniiDugaar,
                                    khuudasniiKhemjee,
                                })),
                        }}
                    />
                </div>

            </div>

        </div >
    );
}

export const getServerSideProps = shalgaltKhiikh;

export default segmentiinTokhirgoo;
