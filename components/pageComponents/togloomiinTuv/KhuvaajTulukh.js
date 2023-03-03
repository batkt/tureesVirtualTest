import { InputNumber } from "antd";
import React, { useEffect } from "react";

function KhuvaajTulukh({ tulburiinKhelber, data, tulbur, setTulbur, ajiltan }) {
  const belenRef = React.useRef();
  const khariltsakhRef = React.useRef();
  const zeelRef = React.useRef();

  const khaanRef = React.useRef();
  const tdbRef = React.useRef();
  const khasRef = React.useRef();
  const golomtRef = React.useRef();
  const kapitronRef = React.useRef();
  const turRef = React.useRef();

  const value = React.useMemo(() => {
    const belen = tulbur.find((a) => a.turul === "belen")?.dun;
    const khariltsakh = tulbur.find((a) => a.turul === "khariltsakh")?.dun;
    const zeel = tulbur.find((a) => a.turul === "zeel")?.dun;
    const khaan = tulbur.find((a) => a.turul === "khaan")?.dun;
    const tdb = tulbur.find((a) => a.turul === "tdb")?.dun;
    const khas = tulbur.find((a) => a.turul === "khas")?.dun;
    const golomt = tulbur.find((a) => a.turul === "golomt")?.dun;
    const kapitron = tulbur.find((a) => a.turul === "kapitron")?.dun;
    const tur = tulbur.find((a) => a.turul === "tur")?.dun;
    return {
      belen,
      khariltsakh,
      zeel,
      khaan,
      tdb,
      khas,
      golomt,
      kapitron,
      tur,
    };
  }, [tulbur]);

  function onChangeDun(v, k) {
    const index = tulbur.findIndex((a) => a.turul === k);
    if (index !== -1) tulbur[index] = { turul: k, dun: v };
    else tulbur.push({ turul: k, dun: v });
    if (data?.niitDun < tulbur.reduce((a, b) => a + b.dun, 0)) {
      const khi = tulbur.findIndex((a) => a.turul === "khariult");
      if (khi !== -1)
        tulbur[khi] = {
          turul: "khariult",
          dun: tulbur.reduce((a, b) => a + b.dun, 0) - data?.niitDun,
        };
      else
        tulbur.push({
          turul: "khariult",
          dun: tulbur.reduce((a, b) => a + b.dun, 0) - data?.niitDun,
        });
    }

    setTulbur([...tulbur]);
  }

  useEffect(() => {
    if (tulburiinKhelber === "khuvaajTulukh") belenRef.current.focus();
  }, [tulburiinKhelber]);

  function onKeyDown(e) {
    if (e.key === "Enter") {
      switch (e.target.name) {
        case "belen":
          khariltsakhRef.current.focus();
          khariltsakhRef.current.select();
          break;
        case "khariltsakh":
          zeelRef.current.focus();
          zeelRef.current.select();
          break;
        case "zeel":
          khaanRef.current.focus();
          khaanRef.current.select();
          break;

        default:
          break;
      }
    }
  }

  function onDoubleClick(e) {
    const tulukhDun =
      data?.niitDun -
      tulbur
        .filter((a) => a.turul !== e.target.name)
        .reduce((a, b) => a + b.dun, 0);
    if (tulukhDun > 0) {
      const undsenModel = {
        ognoo: new Date(),
        zakhialgiinDugaar: data?.zakhialgiinDugaar,
        baiguullagiinId: data?.baiguullagiinId,
        burtgesenAjiltan: ajiltan?._id,
        burtgesenAjiltaniiNer: ajiltan?.ner,
      };
      const index = tulbur.findIndex((a) => a.turul === e.target.name);
      if (index !== -1)
        tulbur[index] = {
          ...undsenModel,
          turul: e.target.name,
          dun: tulukhDun,
          ognoo: new Date(),
        };
      else
        tulbur.push({ ...undsenModel, turul: e.target.name, dun: tulukhDun });
      setTulbur([...tulbur]);
    }
  }

  const terminaluud = [
    {
      ner: "Хаан банк",
      talbar: "khaan",
      ref: khaanRef,
    },
    {
      ner: "TDB банк",
      talbar: "tdb",
      ref: tdbRef,
    },
    {
      ner: "Xac банк",
      talbar: "khas",
      ref: khasRef,
    },
    {
      ner: "Голомт банк",
      talbar: "golomt",
      ref: golomtRef,
    },
    {
      ner: "Капитрон банк",
      talbar: "kapitron",
      ref: kapitronRef,
    },
    {
      ner: "Төрийн банк",
      talbar: "tur",
      ref: turRef,
    },
  ];

  return (
    <div className={`grid grid-cols-3 gap-4 mt-5 border-2 p-4`}>
      <div className="col-span-3 flex flex-col text-center cursor-pointer font-medium text-lg">
        <div className="w-full flex flex-row bg-gray-100 dark:bg-gray-900">
          <div className="w-3/4 pl-10 text-left border-b border-t border-l dark:text-gray-200">
            Бэлэн
          </div>
          <InputNumber
            autoComplete="off"
            ref={belenRef}
            value={value.belen}
            name="belen"
            onDoubleClick={onDoubleClick}
            onKeyDown={onKeyDown}
            onChange={(v) => onChangeDun(v, "belen")}
            style={{ width: "25%" }}
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
          />
        </div>
        <div className="w-full border-l border-r h-2" />
        <div className="w-full flex flex-row bg-gray-100 dark:bg-gray-900">
          <div className="w-3/4 pl-10 text-left border-b border-t border-l dark:text-gray-200">
            Харилцах
          </div>
          <InputNumber
            autoComplete="off"
            ref={khariltsakhRef}
            value={value.khariltsakh}
            name="khariltsakh"
            onDoubleClick={onDoubleClick}
            onKeyDown={onKeyDown}
            onChange={(v) => onChangeDun(v, "khariltsakh")}
            style={{ width: "25%" }}
            max={
              data?.niitDun -
              tulbur
                .filter((a) => a.turul !== "khariltsakh")
                .reduce((a, b) => a + b.dun, 0)
            }
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
          />
        </div>
        <div className="w-full border-l border-r h-2 " />
        <div className="w-full flex flex-row bg-gray-100 dark:bg-gray-900">
          <div className="w-3/4 pl-10 text-left border-b border-t border-l dark:text-gray-200">
            Зээл
          </div>
          <InputNumber
            autoComplete="off"
            ref={zeelRef}
            value={value.zeel}
            name="zeel"
            onDoubleClick={onDoubleClick}
            onKeyDown={onKeyDown}
            onChange={(v) => onChangeDun(v, "zeel")}
            style={{ width: "25%" }}
            max={
              data?.niitDun -
              tulbur
                .filter((a) => a.turul !== "zeel")
                .reduce((a, b) => a + b.dun, 0)
            }
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
          />
        </div>
        {terminaluud?.map((mur) => (
          <div key={mur.ner}>
            <div className="w-full border-l border-r h-2 " />
            <div className="w-full flex flex-row bg-gray-100 dark:bg-gray-900">
              <div className="w-3/4 pl-10 border-b border-t text-left border-l dark:text-gray-200">
                {mur.ner}
              </div>
              <InputNumber
                autoComplete="off"
                ref={mur.ref}
                value={value[mur.talbar]}
                name={mur.talbar}
                onDoubleClick={onDoubleClick}
                onKeyDown={onKeyDown}
                onChange={(v) => onChangeDun(v, mur.talbar)}
                style={{ width: "25%" }}
                max={
                  data?.niitDun -
                  tulbur
                    .filter((a) => a.turul !== mur.talbar)
                    .reduce((a, b) => a + b.dun, 0)
                }
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default KhuvaajTulukh;
