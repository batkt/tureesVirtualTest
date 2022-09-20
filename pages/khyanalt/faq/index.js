import React from "react";
import Admin from "components/Admin";
import useJagsaalt from "hooks/useJagsaalt";
import { Collapse, } from 'antd';
import { PlusOutlined } from '@ant-design/icons';



function tugeemelAsuult() {
    const { Panel } = Collapse;
    const faq = useJagsaalt("https://zevtabs.mn/api/faqavya/rent")

    return (
        <Admin
            title="Түгээмэл асуулт"
            khuudasniiNer="tugeemelAsuult"
            className="p-0 md:p-2 "
        >
            <div className="col-span-12 ">
                {faq?.data?.map((mur) => (
                    <Collapse
                        defaultActiveKey={['0']}
                        expandIcon={({ isActive }) => <PlusOutlined className="pt-1 text-green-600 pr-4" rotate={isActive ? 45 : 0} />}
                        ghost
                    >
                        <Panel header={mur?.asuult} key="1" >
                            <div className="px-16 pb-2 dark:text-white font-medium">{mur?.khariult}</div>
                        </Panel>
                        <hr />
                    </Collapse>
                ))}
            </div>
        </Admin >

    );
}
export default tugeemelAsuult;
