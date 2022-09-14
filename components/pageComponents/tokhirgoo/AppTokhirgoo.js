import React, { useState } from "react";
import { Button, DatePicker, notification } from "antd";
import {
    SolutionOutlined,
} from "@ant-design/icons";
import uilchilgee from "services/uilchilgee";
import moment from 'moment'

function AppTokhirgoo({ token, baiguullaga, }) {

    const [ekhlekhOgnoo, setekhlekhOgnoo] = useState();
    function ekhlehOgnooBurtgey() {
        uilchilgee(token)
            .post("/baiguullagaTokhirgooZasya", { tokhirgoo: { khereglegchEkhlekhOgnoo: ekhlekhOgnoo } })
            .then(({ data }) => {
                if (data === "Amjilttai") {
                    notification.success({ message: "Амжилттай засагдлаа" });
                }
            });
    }
    return (
        <>
            <div className="xxl:col-span-4 col-span-12 mt-5 lg:col-span-5">
                <div className="box mt-5 lg:mt-0">
                    <div className="dark:border-dark-5 flex items-center border-b border-gray-200 px-5 pt-5 pb-2">
                        <h2 className="mr-auto text-base font-medium dark:text-gray-200">
                            Аппликейшин тохиргоо
                        </h2>
                    </div>
                    <div className="box">
                        <div className="flex items-center p-5">
                            <div className="border-l-2 border-green-500 pl-4">
                                <div className="font-medium">Ашиглаж эхлэх огноо</div>
                            </div>
                            <div className="ml-auto w-1/2">
                                <DatePicker
                                    disabled={!!baiguullaga.tokhirgoo.khereglegchEkhlekhOgnoo}
                                    name="ekhlehOgnoo"
                                    style={{ width: "100%" }}
                                    defaultValue={baiguullaga.tokhirgoo.khereglegchEkhlekhOgnoo && moment(baiguullaga.tokhirgoo.khereglegchEkhlekhOgnoo)}
                                    prefix={<SolutionOutlined />}
                                    onChange={setekhlekhOgnoo}
                                    format="YYYY-MM-DD"
                                />
                            </div>

                        </div>

                        <div hidden={!baiguullaga.tokhirgoo.khereglegchEkhlekhOgnoo} className="dark:border-dark-5 flex items-center border-b border-gray-200 px-5 pt-5 pb-2">
                            <p className="mr-auto text-xs font-meium dark:text-gray-200">
                                Хэрвээ энэхүү тохиргоог өөрчлөхийг хүсвэл манай байгууллагад хандана уу
                            </p>
                        </div>
                    </div>
                    <div
                        className="dark:border-dark-5 flex items-center justify-end border-b border-gray-200 px-5 pt-2 pb-2">
                        <Button type="primary" onClick={ekhlehOgnooBurtgey} >
                            Хадгалах
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AppTokhirgoo;
