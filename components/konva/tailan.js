import React from "react";
import uilchilgee, { url } from "services/uilchilgee";
import PlanKharakh from "components/konva/plan";

import { modal } from "components/ant/Modal";
import { CloseCircleOutlined, FileExcelOutlined } from "@ant-design/icons";
import { useAuth } from "services/auth";
import { bairshilKhurvuuljAvakh } from ".";
import _ from "lodash";
import { t } from "i18next";

function FloorTile({ a, baiguullaga, barilgiinId, token, zuragKharakh }) {
  const [hasError, setHasError] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [areas, setAreas] = React.useState([]);

  React.useEffect(() => {
    if (!a?.planZurag || hasError) {
      setLoading(true);
      uilchilgee(token)
        .get("/talbai", {
          params: {
            khuudasniiKhemjee: 100,
            query: JSON.stringify({
              davkhar: a.davkhar,
              barilgiinId: barilgiinId,
              "bairshil.1": { $exists: true },
            }),
            select: { bairshil: 1, idevkhiteiEsekh: 1 },
          },
        })
        .then(({ data }) => {
          if (data?.jagsaalt) {
            setAreas(data.jagsaalt.map(mur => ({
              ...mur,
              bairshil: bairshilKhurvuuljAvakh(mur.bairshil)
            })));
          }
        })
        .finally(() => setLoading(false));
    }
  }, [hasError, a?.planZurag, a.davkhar, barilgiinId, token]);

  const showPlaceholder = !a?.planZurag || hasError;

  return (
    <div 
      onClick={() => zuragKharakh(a)}
      className="col-span-1 cursor-pointer overflow-hidden rounded-xl bg-white shadow-sm transition-all hover:scale-[1.02] hover:shadow-md dark:bg-gray-800"
    >
      <div className="bg-gray-50 px-4 py-2 text-center font-bold text-gray-700 dark:bg-gray-900 dark:text-gray-200">
        {t("-р давхар", { too: a.davkhar })}
      </div>
      <div className="relative aspect-[4/3] w-full bg-gray-100 dark:bg-gray-900">
        {!showPlaceholder ? (
          <img
            onError={() => setHasError(true)}
            className="h-full w-full object-contain"
            src={`${url}/zuragAvya/plan/${baiguullaga?._id}/${a?.planZurag}`}
            alt={`Floor ${a.davkhar}`}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-900">
            {areas.length > 0 ? (
              <svg 
                viewBox="0 0 1000 1000" 
                className="h-[80%] w-[80%] opacity-40 transition-opacity hover:opacity-60"
                preserveAspectRatio="xMidYMid meet"
              >
                {areas.map((area, idx) => (
                  <polygon
                    key={idx}
                    points={area.bairshil.map(p => `${p[0]},${p[1]}`).join(' ')}
                    fill={area.idevkhiteiEsekh ? "#4ade80" : "#f87171"}
                    stroke="white"
                    strokeWidth="2"
                  />
                ))}
              </svg>
            ) : (
              <div className="flex flex-col items-center opacity-40">
                <FileExcelOutlined className="mb-2 text-3xl" />
                <span className="text-[10px]">{loading ? t("Ачаалж байна...") : t("План зураг оруулаагүй")}</span>
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center">
               <div className="rounded-full bg-black/30 p-2 text-white/50 backdrop-blur-sm">
                 <FileExcelOutlined />
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function tailan({ token, points }) {
  const ref = React.useRef(null);
  const { baiguullaga, barilgiinId } = useAuth();
  const planzuragiinId = baiguullaga?.barilguud.find(
    (a) => a._id === barilgiinId
  );

  function khaakh() {
    ref.current?.destroy();
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
            className: "top-0",
            width: "100%",
            height: "100%",
            title: [
              <div className="flex justify-between items-center px-4" key="title">
                <span className="text-lg font-bold">{t("Дэлгэрэнгүй Мэдээлэл")} - {a.davkhar} {t("давхар")}</span>
                <div
                  className="cursor-pointer text-2xl text-gray-400 hover:text-red-500 transition-colors"
                  onClick={() => khaakh()}
                >
                  <CloseCircleOutlined />
                </div>
              </div>,
            ],
            icon: null,
            content: (
              <PlanKharakh
                ref={ref}
                plan={a.planZurag}
                baiguullaga={baiguullaga}
                barilgiinId={barilgiinId}
                token={token}
                points={points}
                talbainuud={data?.jagsaalt}
                destroy={khaakh}
              />
            ),
            footer: [],
          });
        }
      });
  }

  return (
    <div className="wrap grid grid-cols-1 gap-6 bg-slate-100 p-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 dark:bg-slate-900">
      {planzuragiinId?.davkharuud.map((a) => (
        <FloorTile 
          key={a._id} 
          a={a} 
          baiguullaga={baiguullaga} 
          barilgiinId={barilgiinId} 
          token={token} 
          zuragKharakh={zuragKharakh} 
        />
      ))}
    </div>
  );
}

export default tailan;
