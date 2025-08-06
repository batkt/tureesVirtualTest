import React from "react";
import Admin from "components/Admin";
import useJagsaalt from "hooks/useJagsaalt";
import { Collapse } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

function tugeemelAsuult() {
  const { t, i18n } = useTranslation();
  const { Panel } = Collapse;
  const faq = useJagsaalt("https://zevtabs.mn/api/faqavya/rent");

  return (
    <div
      className="col-span-12 h-full overflow-y-auto"
      scroll={{ y: "calc(100vh - 27rem)" }}
    >
      {faq?.data?.map((mur, i) => (
        <Collapse
          key={`collapse${i}`}
          defaultActiveKey={["0"]}
          expandIcon={({ isActive }) => (
            <PlusOutlined
              className="pr-4 pt-1 text-green-600 "
              rotate={isActive ? 45 : 0}
            />
          )}
          ghost
        >
          <Panel
            header={i18n.language === "mn" ? mur?.asuult : mur?.asuultEN}
            className="font-semibold"
            key="1"
          >
            <div className="px-16 pb-2 font-normal dark:text-gray-200">
              {i18n.language === "mn" ? mur?.khariult : mur?.khariultEN}
            </div>
          </Panel>
          <hr />
        </Collapse>
      ))}
    </div>
  );
}
export default React.forwardRef(tugeemelAsuult);
