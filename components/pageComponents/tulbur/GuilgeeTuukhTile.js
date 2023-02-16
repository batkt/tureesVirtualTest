import { DeleteOutlined, EditOutlined, FileExcelOutlined } from "@ant-design/icons"
import { Button, Progress, Tag } from "antd"
import { Tooltip } from "chart.js"
import { modal } from "components/ant/Modal"
import moment from "moment"
import React from "react"
import formatNumber from "tools/function/formatNumber"

const Delegrengui = React.forwardRef(({ destroy,
  ovog,
  ner,
  utas,
  gereeniiDugaar,
  talbainDugaar,
  talbainKhemjee,
  sariinTurees,
  gereeniiOgnoo,
  duusakhOgnoo,
  burtgesenAjiltaniiNer,
  tileProps,
  ugugdul }, ref) => {
  React.useImperativeHandle(
    ref,
    () => ({
      khaaya() {
        destroy();
      },
    }),
    []
  );

  const khuvi =
    ugugdul.baritsaaAvakhDun > 0
      ? (100 * ugugdul.baritsaaniiUldegdel) / ugugdul.baritsaaAvakhDun
      : 100;

  let strokeColor = "rgba(16, 185, 129,1)";
  if (!khuvi && khuvi < 0) strokeColor = "rgba(245, 158, 18,1)";

  return (
    <div className="space-y-5">
      <div className="dark:text-gray-200">
        <h1 className="font-medium text-base dark:text-gray-300 border-b">Гүйлгээний мэдээлэл</h1>
        <div>
          <div className="flex justify-between border-b p-1 bg-green-500 bg-opacity-10"><p className="font-medium ">Төлөх огноо:</p> <p>{moment(ugugdul.daraagiinTulukhOgnoo).format("YYYY-MM-DD, hh:mm")}</p></div>
          <div className="flex justify-between border-b p-1"><p className="font-medium ">Регистр:</p> <p>{ugugdul.register}</p></div>
          <div className="flex justify-between border-b p-1 bg-green-500 bg-opacity-10"><p className="font-medium ">Талбай:</p> <p>{talbainDugaar}</p></div>
          <div className="flex justify-between border-b p-1"><p className="font-medium ">Утас:</p> <p>{formatNumber(utas)}</p></div>
          <div className="flex justify-between border-b p-1 bg-green-500 bg-opacity-10"><p className="font-medium ">Үлдэгдэл:</p> <p>{ugugdul.uldegdel}</p></div>
          <div className="flex justify-between border-b p-1"><p className="font-medium ">Сарын түрээс:</p> <p>{formatNumber(sariinTurees)}₮</p></div>
          <div className="flex justify-between border-b p-1 bg-green-500 bg-opacity-10"><p className="font-medium ">Талбайн үнэ:</p> <p>{formatNumber(ugugdul.talbainNiitUne)}₮</p></div>
          <div className="flex justify-between border-b p-1"><p className="font-medium ">Давхар:</p> <p>{ugugdul.davkhar}</p></div>
          <div className="flex justify-between border-b p-1 bg-green-500 bg-opacity-10"><p className="font-medium ">Түрээслэгч:</p> <p>{ner}</p></div>
          <div className="flex justify-between border-b p-1"><p className="font-medium ">Гэрээний огноо:</p> <p>{moment(gereeniiOgnoo).format("YYYY-MM-DD, hh:mm")}</p></div>
          <div className="flex justify-between border-b p-1 bg-green-500 bg-opacity-10"><p className="font-medium ">Алдангийн үлдэгдэл:</p> <p>{formatNumber(ugugdul.aldangiinUldegdel)}</p></div>
          {tileProps?.turul === "voucher" && <div className="flex justify-between border-b p-1"><p className="font-medium ">Ваучерын дүн:</p> <p>{formatNumber(ugugdul.voucherDun)}</p></div>}
          {tileProps?.turul === "khungulult" && <div className="flex justify-between border-b p-1"><p className="font-medium ">Хөнгөлөлт:</p> <p>{formatNumber(ugugdul.khungulult)}</p></div>}
          {tileProps?.turul === "eneSardTulsun" && <div className="flex justify-between border-b p-1"><p className="font-medium ">Төлсөн дүн:</p> <p>{formatNumber(ugugdul.tulsunDun)}</p></div>}
          {tileProps?.turul === "eneSardTulukh" && <div className="flex justify-between border-b p-1"><p className="font-medium ">Төлөвлөгөөт:</p> <p>{formatNumber(ugugdul.tuluvluguut)}</p></div>}
        </div>
      </div>
      <div className="flex w-full gap-2 justify-between">
        <div className="flex w-full flex-row items-center justify-between">
          <a
            onClick={() => tileProps.nekhemjlelIlgeekh({
              ...ugugdul,
              ovog,
              ner,
              utas,
              gereeniiDugaar,
              talbainDugaar,
              talbainKhemjee,
              sariinTurees,
              gereeniiOgnoo,
              duusakhOgnoo,
              burtgesenAjiltaniiNer,
            })}
            className=" text-green-500 hover:scale-110"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect
                x="3"
                y="4"
                width="18"
                height="18"
                rx="2"
                ry="2"
              ></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </a>
          <a
            onClick={() => tileProps.khuulgaKharya({
              ...ugugdul,
              ovog,
              ner,
              utas,
              gereeniiDugaar,
              talbainDugaar,
              talbainKhemjee,
              sariinTurees,
              gereeniiOgnoo,
              duusakhOgnoo,
              burtgesenAjiltaniiNer,
            })}
            className="fill-current  text-green-500 hover:scale-110"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
            </svg>
          </a>
          <a
            onClick={() => tileProps.guilgeeKhiiya({
              ...ugugdul,
              ovog,
              ner,
              utas,
              gereeniiDugaar,
              talbainDugaar,
              talbainKhemjee,
              sariinTurees,
              gereeniiOgnoo,
              duusakhOgnoo,
              burtgesenAjiltaniiNer,
            })}
            className="fill-current  text-green-500  hover:scale-125"
          >
            <svg
              version="1.0"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 440.000000 377.000000"
              preserveAspectRatio="xMidYMid meet"
              className="h-6 w-8 fill-current  text-green-500"
            >
              <g transform="translate(0.000000,377.000000) scale(0.100000,-0.100000)">
                <path
                  d="M3080 3510 c-52 -14 -88 -40 -106 -77 -17 -34 -19 -67 -22 -285 l-3
                    -248 -549 0 c-418 0 -556 -3 -577 -12 -45 -21 -71 -48 -89 -94 -14 -36 -14
                    -48 -4 -81 20 -58 37 -80 86 -102 43 -21 56 -21 674 -21 545 0 636 2 667 15
                    87 37 103 75 103 246 0 71 3 129 7 129 10 0 693 -683 693 -693 0 -12 -678
                    -687 -690 -687 -6 0 -10 49 -10 130 0 133 -4 150 -44 198 -47 54 -10 52 -938
                    52 l-858 0 0 238 c0 227 -1 240 -22 282 -41 80 -119 110 -199 76 -36 -16
                    -1128 -1102 -1148 -1143 -14 -28 -14 -108 0 -136 6 -12 261 -273 568 -580 632
                    -634 603 -610 704 -564 88 40 91 54 95 350 l3 247 548 0 c581 0 591 1 633 47
                    10 10 25 36 33 58 32 75 -18 168 -102 193 -29 9 -209 12 -662 12 -537 0 -627
                    -2 -658 -15 -86 -36 -103 -76 -103 -241 0 -91 -3 -124 -12 -124 -13 0 -688
                    670 -688 682 0 12 678 688 690 688 6 0 10 -47 10 -124 0 -131 7 -166 43 -204
                    50 -53 24 -52 943 -52 l854 0 0 -236 c0 -215 2 -239 21 -283 14 -34 31 -54 58
                    -69 42 -24 109 -29 144 -11 28 14 1089 1071 1128 1123 23 31 29 50 29 88 0 27
                    -6 61 -14 76 -8 15 -266 277 -573 583 -488 486 -563 558 -598 566 -22 5 -51 6
                    -65 3z"
                />
              </g>
            </svg>
          </a>
          <div
            className=" text-red-500  hover:scale-110"
            onClick={() => tileProps.baritsaaUdirdya({
              ...ugugdul,
              ovog,
              ner,
              utas,
              gereeniiDugaar,
              talbainDugaar,
              talbainKhemjee,
              sariinTurees,
              gereeniiOgnoo,
              duusakhOgnoo,
              burtgesenAjiltaniiNer,
            })}
          >
            <Progress
              type="circle"
              percent={!khuvi && 1 > khuvi ? khuvi?.toFixed(1) : khuvi?.toFixed(0)}
              width={22}
              strokeColor={!strokeColor && strokeColor}
              trailColor={!khuvi && khuvi === 0 && "rgba(239, 68, 68,1)"}
            />
          </div>
        </div>
      </div>
    </div>
  )
})

function GuilgeeTuukhTile({
  ovog,
  ner,
  utas,
  gereeniiDugaar,
  talbainDugaar,
  talbainKhemjee,
  sariinTurees,
  gereeniiOgnoo,
  duusakhOgnoo,
  burtgesenAjiltaniiNer,
  tileProps,
  ...ugugdul
}) {
  const delgerenguiRef = React.useRef(null)

  function delgerenguiKharakh() {
    const footer = [
      <Button onClick={() => delgerenguiRef.current.khaaya()}>{t("Хаах")}</Button>,
    ];
    modal({
      title: ``,
      icon: <FileExcelOutlined />,
      content: (
        <Delegrengui
          ref={delgerenguiRef}
          ovog={ovog}
          ner={ner}
          utas={utas}
          gereeniiDugaar={gereeniiDugaar}
          talbainDugaar={talbainDugaar}
          talbainKhemjee={talbainKhemjee}
          sariinTurees={sariinTurees}
          gereeniiOgnoo={gereeniiOgnoo}
          duusakhOgnoo={duusakhOgnoo}
          burtgesenAjiltaniiNer={burtgesenAjiltaniiNer}
          tileProps={tileProps}
          ugugdul={ugugdul}
        />
      ),
      footer,
    });
  }

  return (
    <div onClick={() => delgerenguiKharakh()} className="mb-3 rounded-md border border-solid border-gray-400 bg-white p-2 shadow-2xl dark:bg-gray-900">
      <div className="flex w-full flex-row">
        <div className="font-bold dark:text-gray-100">{ner}</div>
        <div className="ml-auto text-sm font-medium text-gray-600 dark:text-gray-200">
          {gereeniiDugaar}
        </div>
      </div>
      <div className="flex w-full flex-row dark:text-gray-100">
        <div>{utas}</div>
        <div className="ml-auto font-medium">{talbainDugaar}</div>
      </div>
      <div className="flex w-full flex-row dark:text-gray-100">
        <div>{moment(gereeniiOgnoo).format("YYYY-MM-DD")}</div>
        <div className="ml-auto font-medium">
          {moment(duusakhOgnoo).format("YYYY-MM-DD")}
        </div>
      </div>
      <div className="flex w-full flex-row dark:text-gray-100">
        <div>{talbainKhemjee + "м2"}</div>
        <div className="ml-auto font-medium">{formatNumber(sariinTurees)}₮</div>
      </div>
    </div>
  )
}

export default GuilgeeTuukhTile
