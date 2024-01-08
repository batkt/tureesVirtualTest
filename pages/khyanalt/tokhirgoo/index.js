import shalgaltKhiikh from "services/shalgaltKhiikh";
import Admin from "components/Admin";
import { useAuth } from "services/auth";
import { url } from "services/uilchilgee";
import KhuviinMedeelel from "components/pageComponents/tokhirgoo/KhuviinMedeelel";
import NuutsUgSolikh from "components/pageComponents/tokhirgoo/NuutsUgSolikh";
import UndsenMedeelel from "components/pageComponents/tokhirgoo/UndsenMedeelel";

import GereeniiTokhirgoo from "components/pageComponents/tokhirgoo/GereeniiTokhirgoo";
import KhungulultiinTokhirgoo from "components/pageComponents/tokhirgoo/KhungulultiinTokhirgoo";
import TalbainTokhirgoo from "components/pageComponents/tokhirgoo/TalbainTokhirgoo";
import AshiglaltiinZardal from "components/pageComponents/tokhirgoo/AshiglaltiinZardal";
import Medegdel from "components/pageComponents/tokhirgoo/Medegdel";
import Dans from "components/pageComponents/tokhirgoo/Dans";
import Email from "components/pageComponents/tokhirgoo/EmailTokhirgoo";
import Zogsool from "components/pageComponents/tokhirgoo/Zogsool";
import AppTokhirgoo from "components/pageComponents/tokhirgoo/AppTokhirgoo";
import SegmentTokhirgo from "components/pageComponents/tokhirgoo/SegmentTokhirgo";

import { useMemo, useState } from "react";
import EBarimt from "components/pageComponents/tokhirgoo/EBarimt";
import Baaz from "components/pageComponents/tokhirgoo/Baaz";
import {
  BuildFilled,
  DatabaseOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import NevtreltiinTuukh from "components/pageComponents/tokhirgoo/NevtreltiinTuukh";
import { useTranslation } from "react-i18next";
import TogloominTuv from "components/pageComponents/tokhirgoo/TogloominTuv";
import { TbLego } from "react-icons/tb";
import BarilgiinTokhirgoo from "components/pageComponents/tokhirgoo/BarilgiinTokhirgoo";
import { BiBuilding } from "react-icons/bi";

function AjiltanBurtgel({ token }) {
  const { t } = useTranslation();
  const {
    ajiltan,
    ajiltanMutate,
    baiguullaga,
    barilgiinId,
    baiguullagaMutate,
  } = useAuth();
  const [songogdsonTsonkhniiIndex, setSongogdsonTsonkhniiIndex] = useState(0);

  const tokhirgoo = useMemo(() => {
    if (ajiltan?.erkh === "Admin")
      return [
        {
          icon: (
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
              className="feather feather-settings mr-2 h-4 w-4">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
          ),
          text: "Үндсэн тохиргоо",
          tsonkh: UndsenMedeelel,
        },
        {
          icon: (
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
              className="feather feather-settings mr-2 h-4 w-4">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
            </svg>
          ),
          text: "Хөнгөлөлт",
          tsonkh: KhungulultiinTokhirgoo,
        },
        {
          icon: (
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
              className="feather feather-settings mr-2 h-4 w-4">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          ),
          text: "Гэрээний удирдлага",
          tsonkh: GereeniiTokhirgoo,
        },
        {
          icon: <BuildFilled className="mr-2" />,
          text: "Барилгын тохиргоо",
          tsonkh: BarilgiinTokhirgoo,
        },
        // {
        //   icon: (
        //     <svg
        //       xmlns="http://www.w3.org/2000/svg"
        //       width="24"
        //       height="24"
        //       viewBox="0 0 24 24"
        //       fill="none"
        //       stroke="currentColor"
        //       strokeWidth="1.5"
        //       strokeLinecap="round"
        //       strokeLinejoin="round"
        //       className="feather feather-settings mr-2 h-4 w-4"
        //     >
        //       <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        //       <polyline points="9 22 9 12 15 12 15 22"></polyline>
        //     </svg>
        //   ),
        //   text: "Талбайн удирдлага",
        //   tsonkh: TalbainTokhirgoo
        // },
        {
          icon: (
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
              className="feather feather-settings mr-2 h-4 w-4">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
            </svg>
          ),
          text: "Ашиглалтын зардал",
          tsonkh: AshiglaltiinZardal,
        },
        {
          icon: (
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
              className="feather feather-settings mr-2 h-4 w-4">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          ),
          text: "Мэдэгдэл",
          tsonkh: Medegdel,
        },
        {
          icon: (
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
              className="feather feather-settings mr-2 h-4 w-4">
              {" "}
              <path stroke="none" d="M0 0h24v24H0z" />{" "}
              <rect x="3" y="5" width="18" height="14" rx="2" />{" "}
              <polyline points="3 7 12 13 21 7" />
            </svg>
          ),
          text: "И-мэйл тохиргоо",
          tsonkh: Email,
        },
        {
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              className="feather feather-settings mr-2 h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              dataLucide="stop-circle">
              <circle cx="12" cy="12" r="10"></circle>
              <rect x="9" y="9" width="6" height="6"></rect>
            </svg>
          ),
          text: "И-Баримт",
          tsonkh: EBarimt,
        },
        {
          icon: (
            <svg
              version="1.0"
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 861.000000 1024.000000"
              className="feather feather-settings mr-2 h-4 w-4"
              preserveAspectRatio="xMidYMid meet"
              stroke="currentColor">
              <g
                transform="translate(0.000000,1024.000000) scale(0.100000,-0.100000)"
                fill="currentColor"
                stroke="none">
                {" "}
                <path
                  d="M116 10218 c-5 -25 -117 -2289 -116 -2350 l0 -38 144 0 c159 0 156
         -1 156 68 0 72 41 319 76 462 129 521 383 868 779 1061 145 71 252 102 433
         128 235 34 443 41 1215 41 l747 0 0 -1809 0 -1808 -727 -318 c-401 -174 -828
         -360 -950 -413 l-223 -97 0 -312 c0 -238 3 -313 12 -313 10 0 1302 560 1791
         776 l97 43 -2 -540 -3 -541 -945 -412 -945 -412 -3 -318 c-2 -253 0 -317 10
         -313 7 3 426 185 931 405 505 221 927 404 938 407 20 7 20 5 16 -1127 -3 -769
         -8 -1168 -16 -1243 -17 -158 -49 -348 -73 -424 -65 -212 -226 -379 -459 -474
         -176 -72 -353 -97 -696 -97 l-213 0 0 -125 0 -125 2185 0 2185 0 0 125 0 125
         -207 0 c-462 0 -693 52 -908 205 -195 138 -267 316 -316 785 -8 70 -13 595
         -16 1561 l-4 1456 940 409 941 409 0 318 0 317 -32 -14 c-42 -17 -1726 -751
         -1796 -782 l-52 -23 2 540 3 540 935 408 935 407 3 318 c2 253 0 317 -10 313
         -7 -3 -422 -184 -923 -402 -500 -218 -918 -399 -927 -402 -17 -5 -18 70 -18
         1486 l0 1491 803 0 c850 0 957 -5 1173 -50 451 -93 795 -314 1023 -655 147
         -220 213 -415 287 -850 18 -110 34 -201 34 -202 0 -2 63 -3 140 -3 l140 0 0
         163 c0 147 -82 2001 -96 2175 l-6 72 -4194 0 -4194 0 -4 -22z"
                />
              </g>
            </svg>
          ),
          text: "Данс",
          tsonkh: Dans,
        },
        {
          icon: (
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
              className="feather feather-settings mr-2 h-4 w-4">
              <rect x="1" y="3" width="15" height="13"></rect>
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
              <circle cx="5.5" cy="18.5" r="2.5"></circle>
              <circle cx="18.5" cy="18.5" r="2.5"></circle>
            </svg>
          ),
          text: "Зогсоол",
          tsonkh: Zogsool,
        },
        {
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="64 64 896 896"
              focusable="false"
              data-icon="calendar"
              width="24"
              height="24"
              fill="currentColor"
              aria-hidden="true"
              className="feather feather-settings mr-2 h-4 w-4">
              <path d="M880 184H712v-64c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v64H384v-64c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v64H144c-17.7 0-32 14.3-32 32v664c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V216c0-17.7-14.3-32-32-32zm-40 656H184V460h656v380zM184 392V256h128v48c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-48h256v48c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-48h128v136H184z"></path>
            </svg>
          ),
          text: "Хэрэглэгчийн Апп",
          tsonkh: AppTokhirgoo,
        },
        {
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="64 64 896 896"
              focusable="false"
              data-icon="calendar"
              width="24"
              height="24"
              fill="currentColor"
              aria-hidden="true"
              className="feather feather-settings mr-2 h-4 w-4">
              <path d="M872 476H548V144h-72v332H152c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h324v332h72V548h324c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0-166h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 498h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0-664h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 498h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM650 216h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm56 592h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm-332 0h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm-56-592h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm-166 0h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm56 592h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm-56-426h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm56 260h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z"></path>
            </svg>
          ),
          text: "Төрөлжүүлэх",
          tsonkh: SegmentTokhirgo,
        },
        {
          icon: (
            <div className="mr-2 flex items-center justify-center text-base">
              <HistoryOutlined />
            </div>
          ),
          text: "Нэвтрэлтийн түүх",
          tsonkh: NevtreltiinTuukh,
        },
        {
          icon: (
            <div className="mr-2 flex items-center justify-center text-base">
              <TbLego />
            </div>
          ),
          text: "Тоглоомын төв",
          tsonkh: TogloominTuv,
        },
        {
          icon: (
            <div className="mr-2 flex items-center justify-center text-base">
              <DatabaseOutlined />
            </div>
          ),
          text: "Бааз",
          tsonkh: Baaz,
        },
      ];
    else
      return [
        {
          icon: (
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
              className="feather feather-activity mr-2 h-4 w-4">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
            </svg>
          ),
          text: "Хувийн мэдээлэл",
          tsonkh: KhuviinMedeelel,
        },
        {
          icon: (
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
              className="feather feather-lock mr-2 h-4 w-4">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          ),
          text: "Нууц үг солих",
          tsonkh: NuutsUgSolikh,
        },
      ];
  }, [ajiltan, baiguullaga, barilgiinId]);

  const Tsonkh = useMemo(() => {
    return tokhirgoo[songogdsonTsonkhniiIndex].tsonkh;
  }, [tokhirgoo, songogdsonTsonkhniiIndex]);

  return (
    <Admin
      title="Тохиргоо"
      khuudasniiNer="tokhirgoo"
      className="grid grid-cols-12 gap-6 px-4 pb-5">
      <div className="col-span-12 mt-5 flex flex-col-reverse lg:col-span-3 lg:block xl:col-span-3">
        <div className="box mt-5 lg:mt-0">
          <div className="relative flex items-center p-5">
            <div className="image-fit h-12 w-12">
              <img
                alt={ajiltan?.ner}
                src={
                  ajiltan?.zurgiinNer
                    ? `${url}/ajiltniiZuragAvya/${ajiltan?.baiguullagiinId}/${ajiltan?.zurgiinNer}`
                    : ((ajiltan?.register?.replace(/^\D+/g, "") % 100) / 10) %
                        2 <
                      1
                    ? "/profileFemale.svg"
                    : "/profile.svg"
                }
                className="h-12 w-12 rounded-full ring-2 ring-green-600 ring-opacity-50"
              />
            </div>
            <div className="ml-4 mr-auto">
              <div className="text-base font-medium">{`${ajiltan?.ovog} ${ajiltan?.ner}`}</div>
              <div className="text-gray-600">{ajiltan?.albanTushaal}</div>
            </div>
          </div>
          <div className="dark:border-dark-5 border-t border-gray-200 p-5 text-green-600">
            {tokhirgoo?.map((mur, index) => (
              <div
                className={`mt-5 flex cursor-pointer items-center ${
                  index === songogdsonTsonkhniiIndex
                    ? "text-yellow-500 dark:text-white"
                    : ""
                } `}
                onClick={() => setSongogdsonTsonkhniiIndex(index)}>
                {mur.icon} {t(mur.text)}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="col-span-12 grid grid-cols-12 gap-5 md:col-span-12 lg:col-span-9">
        {ajiltan && (
          <Tsonkh
            {...{
              ajiltan,
              ajiltanMutate,
              baiguullaga,
              barilgiinId,
              baiguullagaMutate,
              token,
              setSongogdsonTsonkhniiIndex,
            }}
          />
        )}
      </div>
    </Admin>
  );
}

export const getServerSideProps = shalgaltKhiikh;

export default AjiltanBurtgel;
