import { Button, notification, Popconfirm, Select, } from "antd";
import _ from "lodash";
import React, { useState } from "react";
import uilchilgee, { aldaaBarigch } from "services/uilchilgee";
import { useMailiinZagvarWithoutAuth } from "hooks/useMailiinZagvar";


function GuilgeeKhiikh({ data, token, onFinish, destroy, }, ref) {
    const [turul, setTurul] = useState("SMS");
    const [barimt, setBarimt] = React.useState();
    const { mailiinZagvarGaralt } = useMailiinZagvarWithoutAuth(
        token,
        "SMS",
        data.barilgiinId,
        data.baiguullagiinId
    );
    console.log(barimt)
    console.log(turul)

    React.useImperativeHandle(
        ref,
        () => ({
            khaaya() {
                destroy();
            },
            khadgalya() {
                uilchilgee(token)
                    .then(() => {
                        notification.success({
                            message: "Амжилттай",
                        });
                        destroy();
                    })
                    .catch(aldaaBarigch);
            },

        }),

        []
    );
    return (
        <div className=" space-y-3 flex flex-col" >
            <div className="pr-1" data-aos="fade-right" data-aos-duration="1000">
                <div className="box p-2">
                    <div className="grid grid-cols-3 gap-1 font-medium" role="tablist">
                        {["SMS", "App", "Mail"].map((mur) => (
                            <div
                                key={mur}
                                className={`flex-1 cursor-pointer rounded-md py-2 text-center ${turul === mur ? "bg-green-500 text-white" : ""
                                    }`}
                                onClick={() => setTurul(mur)}
                            >
                                {mur}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div >
                <Select placeholder="Загварын төрөл" onChange={setBarimt} className="w-full rounded-md">
                    {mailiinZagvarGaralt?.jagsaalt?.map((a) => (
                        <Select.Option key={a._id} value={a._id} >
                            {a.ner}
                        </Select.Option>
                    ))}
                </Select>
            </div>
        </div>
    );
}

export default React.forwardRef(GuilgeeKhiikh);
