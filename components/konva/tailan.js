import React, { useEffect, useMemo, useState } from "react";
import uilchilgee, { url } from "services/uilchilgee";
import PlanKharakh from "components/konva/plan";
import { Button } from "antd";
import { modal } from "components/ant/Modal";
import {
  ClockCircleOutlined,
  CloseCircleOutlined,
  FileExcelOutlined,
} from "@ant-design/icons";
import { useAuth } from "services/auth";
import useJagsaalt from "hooks/useJagsaalt";
import { bairshilKhurvuuljAvakh } from ".";

function tailan(token, points) {
  const ref = React.useRef(null);
  const { baiguullaga, barilgiinId } = useAuth();
  const query = useMemo(() => {
    return {
      barilgiinId: barilgiinId,
      "bairshil.1": { $exists: true },
    };
  }, [barilgiinId]);
  const select = {
    bairshil: 1,
    _id: 1,
    idevkhiteiEsekh: 1,
    kod: 1,
    talbainKhemjee: 1,
    talbainNiitUne: 1,
    davkhar: 1,
  };
  const talbainuud = useJagsaalt("/talbai", query, undefined, select);
  talbainuud.jagsaalt.map(
    (mur) => (mur.bairshil = bairshilKhurvuuljAvakh(mur.bairshil))
  );
  const planzuragiinId = baiguullaga?.barilguud.find(
    (a) => a._id === barilgiinId
  );

  function zuragKharakh(a) {
    modal({
      footer: <Button onClick={() => ref.current.destroy()}>Хаах</Button>,
      title: [
        <div className=" flex justify-between">
          <div className="flex items-center justify-start bg-gray-50">
            Дэлгэрэнгүй Мэдээлэл
          </div>
          <div
            className="text-2xl hover:scale-105 hover:text-red-300"
            onClick={() => ref.current.destroy()}
          >
            <CloseCircleOutlined />
          </div>
        </div>,
      ],
      icon: <FileExcelOutlined />,
      content: (
        <PlanKharakh
          ref={ref}
          davkhar={a.davkhar}
          plan={a.planZurag}
          baiguullaga={baiguullaga}
          barilgiinId={barilgiinId}
          token={token}
          points={points}
          talbainuud={talbainuud.jagsaalt}
        />
      ),
      width: "100vw",
    });
  }
  return (
    <div className="grid grid-cols-3 gap-3 bg-gray-50 p-8">
      {planzuragiinId?.davkharuud.map((a) => (
        <div className="col-span-1  space-y-2 p-2 hover:scale-105 hover:border-2 hover:border-green-300 hover:shadow-2xl">
          <div className="flex justify-center font-bold">
            {a.davkhar}-р давхар
          </div>
          <hr />
          <img
            onClick={() => zuragKharakh(a)}
            className="w-full "
            src={`${url}/zuragAvya/plan/${baiguullaga?._id}/${a?.planZurag}`}
          />
          <div>
            {talbainuud.jagsaalt.map((mur) => {
              <div>{mur.davkhar}</div>;
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
export default tailan;
