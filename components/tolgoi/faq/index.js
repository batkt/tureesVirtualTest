import React from "react";
import Admin from "components/Admin";
import useJagsaalt from "hooks/useJagsaalt";
import { Collapse } from "antd";
import { PlusOutlined } from "@ant-design/icons";

function tugeemelAsuult() {
  const { Panel } = Collapse;
  const faq = useJagsaalt("https://zevtabs.mn/api/faqavya/rent");

  return (
    <div className="col-span-12 ">
      {faq?.data?.map((mur) => (
        <Collapse
          defaultActiveKey={["0"]}
          expandIcon={({ isActive }) => (
            <PlusOutlined
              className="pt-1 pr-4 text-green-600 "
              rotate={isActive ? 45 : 0}
            />
          )}
          ghost
        >
          <Panel header={mur?.asuult} className="font-semibold" key="1">
            <div className="px-16 pb-2 font-normal dark:text-white">
              {mur?.khariult}
            </div>
          </Panel>
          <hr />
        </Collapse>
      ))}
    </div>
  );
}
export default React.forwardRef(tugeemelAsuult);
