import React from "react";
import { Menu, Checkbox, Popover, Button } from "antd";
import { UnorderedListOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

const BaganiinSongolt = ({
  columns,
  shineBagana,
  setShineBagana,
  ButtonStyle,
}) => {
  const { t } = useTranslation();
  React.useEffect(() => {
    const baganuud = localStorage.getItem("bagana-" + window.location.href);
    if (!!baganuud)
      setShineBagana(
        columns.filter((a) => {
          let parsedBaganuud = JSON.parse(baganuud);
          return parsedBaganuud.find((b) => JSON.stringify(b) === JSON.stringify(a.dataIndex));
        })
      );
  }, []);

  function baganaNemekh(e, mur) {
    var jagsaalt = shineBagana;
    if (e.target.checked === true) {
      var nemekhBagana = {
        ellipsis: true,
        showSorterTooltip: false,
        sorter: () => 0,
        ...mur,
      };
      jagsaalt.push(nemekhBagana);
    } else
      jagsaalt = shineBagana.filter(function (item) {
        return JSON.stringify(item.dataIndex) !== JSON.stringify(mur.dataIndex);
      });

    localStorage.setItem(
      "bagana-" + window.location.href,
      JSON.stringify(jagsaalt.map((a) => JSON.stringify(a.dataIndex)))
    );
    setShineBagana([...jagsaalt]);
  }

  return (
    <div>
      <Popover
        content={() => (
          <div className="contents w-32 flex-col">
            <Menu className="contents self-center">
              {columns.map((mur, i) => (
                <Menu.Item key={"bagana-" + i}>
                  <Checkbox
                    checked={
                      !!shineBagana.find((a) => JSON.stringify(a.dataIndex) === JSON.stringify(mur.dataIndex))
                    }
                    onClick={(e) => baganaNemekh(e, mur)}>
                    {mur.title}
                  </Checkbox>
                </Menu.Item>
              ))}
            </Menu>
          </div>
        )}
        style={{ padding: 0 }}
        placement="bottom"
        trigger="click">
        <Button
          className={ButtonStyle}
          type="primary"
          icon={<UnorderedListOutlined style={{ fontSize: "16px" }} />}>
          <span>{t("Багана")}</span>
        </Button>
      </Popover>
    </div>
  );
};
export default BaganiinSongolt;
