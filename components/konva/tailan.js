import React from "react";
import uilchilgee, { url } from "services/uilchilgee";
import PlanKharakh from "components/konva/plan";

import { modal } from "components/ant/Modal";
import { CloseCircleOutlined, FileExcelOutlined } from "@ant-design/icons";
import { useAuth } from "services/auth";
import { bairshilKhurvuuljAvakh } from ".";
import _ from "lodash";
import { t } from "i18next";

function tailan({ token, points }) {
  const ref = React.useRef(null);
  const { baiguullaga, barilgiinId } = useAuth();
  const planzuragiinId = baiguullaga?.barilguud.find(
    (a) => a._id === barilgiinId
  );

  function khaakh() {
    ref.current.destroy();
  }
  function zuragKharakh(a) {
    uilchilgee(token)
      .get("/talbai", {
        params: {
          khuudasniiKhemjee: 1000,
          query: JSON.stringify({
            davkhar: a.davkhar,
            barilgiinId: barilgiinId,
            "bairshil.1": { $exists: true },
          }),
        },
      })
      .then(({ data }) => {
        if (data?.jagsaalt) {
          data?.jagsaalt.map(
            (mur) => (mur.bairshil = bairshilKhurvuuljAvakh(mur.bairshil))
          );
          modal({
            className: " top-0",
            width: "100%",
            height: "100%",
            title: [
              <div className="flex justify-between ">
                <div className="flex items-center justify-start">
                  {t("Дэлгэрэнгүй Мэдээлэл")}
                </div>
                <div
                  className="text-2xl hover:scale-105 hover:text-red-300"
                  onClick={() => khaakh()}
                >
                  <CloseCircleOutlined />
                </div>
              </div>,
            ],
            icon: <FileExcelOutlined />,
            content: (
              <PlanKharakh
                ref={ref}
                plan={a.planZurag}
                baiguullaga={baiguullaga}
                barilgiinId={barilgiinId}
                token={token}
                points={points}
                talbainuud={data?.jagsaalt}
              />
            ),
            footer: [],
          });
        }
      });
  }
  return (
    <div className="wrap grid grid-cols-3 gap-3 bg-gray-50 p-8 text-white dark:bg-gray-700">
      {planzuragiinId?.davkharuud.map((a) => (
        <div className="col-span-1 space-y-2 p-2 hover:scale-105 hover:border-2 hover:border-green-300 hover:shadow-2xl">
          <div className="flex justify-center font-bold text-black dark:text-white">
            {t("-р давхар", { too: a.davkhar })}
          </div>
          <hr />
          <img
            onClick={() => zuragKharakh(a)}
            className="w-full "
            src={`${url}/zuragAvya/plan/${baiguullaga?._id}/${a?.planZurag}`}
          />
          {/* {jagsaalt.map((mur) =>
            mur.davkhar === a.davkhar ? <div>{mur.davkhar}</div> : ""
          )} */}
        </div>
      ))}
    </div>
  );
}
export default tailan;
