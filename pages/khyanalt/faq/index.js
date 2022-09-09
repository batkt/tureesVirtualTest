import React, { useState, useEffect } from "react";
import Admin from "components/Admin";
import useJagsaalt from "hooks/useJagsaalt";
import { Collapse } from 'antd';

function tugeemelAsuult() {
    const { Panel } = Collapse;
    const faq = useJagsaalt("https://zevtabs.mn/api/faqavya/rent")

    return (
        <Admin
            title="Түгээмэл асуулт"
            khuudasniiNer="tugeemelAsuult"
            className="p-0 md:p-4"
        >
            <div className="col-span-12 ">
                {faq?.data?.map((mur) => (
                    <Collapse
                        defaultActiveKey={['0']}
                    >
                        <Panel header={mur?.asuult} key="1" >
                            {mur?.khariult}
                        </Panel>
                    </Collapse>
                ))}
            </div>
        </Admin >

    );
}
export default tugeemelAsuult;
