import Aos from "aos";
import _ from "lodash";
import Link from "next/link";
import React, { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { url } from "services/uilchilgee";

function MenuItem({ mur, selected, khuudasniiNer }) {
  const { t, i18n } = useTranslation()
  const [open, setOpen] = React.useState(
    !!mur?.sub?.find((a) => a.khuudasniiNer === khuudasniiNer)
  );

  const ner = useMemo(() => {
    var utga = undefined
    switch (mur.ner) {
      case "Хяналт":
        utga = "Dashboard"
        break;
      case "Гэрээ":
        utga = "Contracts"
        break;
      case "Гэрээний жагсаалт":
        utga = "ContractList"
        break;
      case "Гэрээ байгуулах":
        utga = "SingContractExecutingAContract"
        break;
      case "Гэрээний загвар":
        utga = "ContractDrafts"
        break;
      case "Талбай бүртгэл":
        utga = "AreaRegisteration"
        break;
      case "Ажилтан бүртгэл":
        utga = "UserRegisteration"
        break;
      case "Харилцагч":
        utga = "Tenant"
        break;
      case "Мэдэгдэл":
        utga = "Announcement"
        break;
      case "Шаардлага":
        utga = "Requirement"
        break;
      case "Санал хүсэлт":
        utga = "Feedback"
        break;
      case "Төлбөр тооцоо":
        utga = "Payment"
        break;
      case "Дансны хуулга":
        utga = "AccountStatement"
        break;
      case "Гүйлгээний түүх":
        utga = "TransactionHistory"
        break;
      case "Нэхэмжлэл":
        utga = "Invoice"
        break;
      case "Зардал":
        utga = "Costs"
        break;
      case "И-баримт":
        utga = "E-Barimt"
        break;
      case "Зогсоол":
        utga = "Park"
        break;
      case "Жагсаалт":
        utga = "List"
        break;
      case "Машин бүртгэл":
        utga = "VehicleRegistration"
        break;
      case "Анкет":
        utga = "application"
        break;
      case "Тайлан":
        utga = "Statement"
        break;
      case "График":
        utga = "Graphic"
        break;
      case "Аналитик":
        utga = "Analytics"
        break;
      case "Даалгавар":
        utga = "Tasks"
        break;
      case "Устгасан түүх":
        utga = "DeletedHistory"
        break;


      default:
        utga = mur.ner
        break;
    }
    return utga
  }, [mur])

  if (mur.sub) {
    return (
      <div className="">
        <li className={"menu-item"} onClick={() => setOpen(!open)}>
          <div className={"flex flex-row p-1"}>
            <div className={`mr-2 ${selected ? "text-green-600" : ""}`}>
              {mur.icon}
            </div>
            {t(`${ner}`)}
            <div
              className={`transform ${open ? "rotate-180" : ""} ml-auto`}
              style={{ transitionDuration: ".1s" }}
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
                className="feather feather-chevron-down"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
          </div>
        </li>
        <ul
          style={{ height: open ? `${2.5 * mur.sub.length}rem` : "0rem" }}
          className={`sub-menu flex flex-col transition-all duration-500`}
        >
          {mur.sub.map((a) => {
            var utga = undefined
            switch (a.ner) {
              case "Гэрээний жагсаалт":
                utga = "ContractList"
                break;
              case "Мэдэгдэл":
                utga = "Announcement"
                break;
              case "Гэрээ байгуулах":
                utga = "SingContractExecutingAContract"
                break;
              case "Гэрээний загвар":
                utga = "ContractDrafts"
                break;
              case "Шаардлага":
                utga = "Requirement"
                break;
              case "Санал хүсэлт":
                utga = "Feedback"
                break;
              case "Дансны хуулга":
                utga = "AccountStatement"
                break;
              case "Гүйлгээний түүх":
                utga = "TransactionHistory"
                break;
              case "Нэхэмжлэл":
                utga = "Invoice"
                break;
              case "Зардал":
                utga = "Costs"
                break;
              case "Жагсаалт":
                utga = "List"
                break;
              case "Машин бүртгэл":
                utga = "VehicleRegistration"
                break;
              case "График":
                utga = "Graphic"
                break;
              case "Аналитик":
                utga = "Analytics"
                break;
              default:
                utga = mur.ner
                break;
            }
            return (
              <Link href={a.href} key={a.href}>
                <a>
                  <li
                    className={`relative cursor-pointer rounded-l-lg transition-all duration-300 ${open ? "ml-0" : "ml-56"
                      } p-2 text-white ${a.khuudasniiNer === khuudasniiNer
                        ? "bg-white dark:bg-gray-800"
                        : ""
                      }`}
                  >
                    <div className={"flex flex-row px-1"}>
                      <div
                        className={`${a.khuudasniiNer === khuudasniiNer
                            ? "font-medium text-green-500"
                            : ""
                          } flex flex-row whitespace-nowrap`}
                      >
                        <div className={`mr-2`}>{a.icon}</div>
                        {t(`${utga}`)}
                      </div>
                    </div>
                  </li>
                </a>
              </Link>
            );
          })}
        </ul>
      </div>
    );
  }
  return (
    <Link href={mur.href}>
      <a>
        <li className={selected ? "selected-menu" : "menu-item"}>
          <div className="flex flex-row p-1">
            <div className={`mr-2 ${selected ? "text-green-600" : ""}`}>
              {mur.icon}
            </div>
            {t(`${ner}`)}
          </div>
        </li>
      </a>
    </Link>
  );
}

function NTses({
  khuudasnuud,
  khuudasniiNer,
  baiguullaga,
  ajiltan,
  barilgaSoliyo,
  onChangeBarilga,
  barilgiinId,
}) {
  const barilguud = baiguullaga?.barilguud?.filter(
    (a) =>
      !!ajiltan?.barilguud?.find((b) => b === a._id) ||
      ajiltan?.erkh === "Admin"
  );

  return (
    <nav className="hidden h-full w-44 md:block">
      <ul>
        <li className="mb-10 px-2">
          <div className="border-b px-2 pb-2">
            <div className="flex flex-col items-center">
              <img
                className="h-16 w-16 "
                alt={baiguullaga?.ner}
                src={
                  baiguullaga?.zurgiinNer
                    ? `${url}/logoAvya/${baiguullaga?.zurgiinNer}`
                    : "/rent.png"
                }
              />
              {barilguud?.length > 0 ? (
                <div className="relative mt-2 inline-block">
                  <select
                    defaultValue={barilgiinId}
                    onChange={({ target }) => {
                      onChangeBarilga && onChangeBarilga();
                      barilgaSoliyo(target.value);
                    }}
                    className="focus:shadow-outline block w-full appearance-none rounded border border-gray-400 bg-white px-4 py-1 pr-8 leading-tight shadow hover:border-gray-500 focus:outline-none dark:bg-gray-800"
                  >
                    {barilguud?.map((a) => (
                      <option key={a?._id} className="" value={a?._id}>
                        {a?.ner}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                      className="h-4 w-4 fill-current"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              ) : (
                _.get(barilguud, "0.ner")
              )}
            </div>
          </div>
        </li>
        <div style={{height: "calc( 100vh - 12rem )"}} className="overflow-y-auto">
        {khuudasnuud.map((mur) => (
          <MenuItem
            key={mur.href}
            mur={mur}
            selected={mur.khuudasniiNer === khuudasniiNer}
            khuudasniiNer={khuudasniiNer}
          />
        ))}
        </div>
      </ul>
    </nav>
  );
}

export default NTses;
