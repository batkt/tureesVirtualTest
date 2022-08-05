import React, { useEffect, useState } from "react";
import Admin from "components/Admin";
import shalgaltKhiikh from "services/shalgaltKhiikh";
import _ from "lodash";
import { Button, Form, Input, InputNumber, notification, Table } from "antd";
import updateMethod from "tools/function/crud/updateMethod";
import Aos from "aos";

function davkharAvya(turul) {
  let butsakhUtga = [];
  switch (turul) {
    case "Үйлчилгээ":
      butsakhUtga = ["1", "2", "3", "4", "5", "6", "7", "8"];
      break;
    case "Оффис":
      butsakhUtga = ["9", "10", "11", "14"];
      break;
    case "Бар, Караоке":
      butsakhUtga = ["9", "10", "11", "14"];
      break;
    case "Ресторан, кофе шоп":
      butsakhUtga = ["1", "14", "15"];
      break;
    case "Фитнес, спортын төрлийн сургалтууд":
      butsakhUtga = ["1", "14", "15"];
      break;
    case "Ресторан, кофе шоп":
      butsakhUtga = ["15"];
      break;
    case "Бусад":
      butsakhUtga = [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
      ];
      break;
    default:
      break;
  }
  return butsakhUtga;
}

function AnketBurgekh({ token, data }) {
  const [turul, setTurul] = useState("Үйл ажилгааны чиглэл");
  const [survey, setSurvey] = useState({});

  function onSubmit(e) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    survey.barilgiinId = "622ec99a8e64e5b4f0c3acb6";
    survey.baiguullagiinId = "6115f350b35689cdbf1b9da3";
    var raw = JSON.stringify(survey);
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch("http://103.143.40.230:8081/surveyKhadgalya", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
        if (result === "Amjilttai") location.reload();
      })
      .catch((error) => console.log("error", error));
    e.preventDefault();
  }

  function onChange({ target }) {
    setSurvey((v) => ({ ...v, [target.name]: target.value }));
  }

  useEffect(() => {
    Aos.init({ once: true });
  });

  return (
    <Admin
      khuudasniiNer="anketIlgeekh"
      title="Анкет илгээх"
      className="grid grid-cols-12 gap-6 p-5"
      hideSearch
      dedKhuudas
    >
      <div className="box col-span-12 p-5 md:col-span-6 xl:col-span-4">
        <div className="mb-5 text-lg font-medium">
          <label>Анкет</label>
        </div>
        <div className="bg-slate-50 border-y-2 px-10">
          <form id="survey-form" onSubmit={onSubmit}>
            <div className="grid grid-cols-6 gap-3 ">
              <div
                className="col-span-6"
                data-aos="zoom-in"
                data-aos-duration="1500"
                data-aos-anchor-placement="bottom-bottom"
              >
                <label className="block text-sm font-medium text-gray-600">
                  Үйл ажилгааны чиглэл сонгоно уу.
                </label>
                <div className="mt-1 rounded-lg">
                  <div className="relative">
                    <select
                      id="dropdown"
                      name="chiglel"
                      className=" mb-1 block h-10 w-full appearance-none rounded-lg border border-gray-300 px-4 text-gray-600 placeholder-gray-400 sm:text-sm"
                      placeholder="Your email address"
                      value={turul}
                      onChange={({ target }) => {
                        setTurul(target.value);
                        onChange({ target });
                      }}
                    >
                      <option>Үйл ажилгааны чиглэл</option>
                      <option>Үйлчилгээ</option>
                      <option>Оффис</option>
                      <option>Бар, Караоке</option>
                      <option>Ресторан, кофе шоп</option>
                      <option>Фитнес, спортын төрлийн сургалтууд</option>
                      <option>Бусад</option>
                    </select>
                  </div>
                </div>
              </div>
              <div
                className={`col-span-6 ${
                  turul === "Ресторан, кофе шоп" ? "" : "sm:col-span-3"
                }`}
                data-aos="fade-left"
                data-aos-duration="1500"
                data-aos-anchor-placement="bottom-bottom"
              >
                <label className="block text-sm font-medium text-gray-600">
                  Байгууллагын нэр:
                </label>
                <div className="mt-1 flex rounded-lg">
                  <input
                    type="text"
                    id="first_name"
                    name="ner"
                    onChange={onChange}
                    className="form-input mb-1 block h-10 w-full rounded-lg border border-gray-300 px-4 placeholder-gray-400 sm:text-sm"
                    placeholder="Байгууллагын нэр:"
                  />
                </div>
              </div>
              <div
                className={`col-span-6 sm:col-span-3 ${
                  turul === "Ресторан, кофе шоп" || turul === "Бусад"
                    ? "hidden"
                    : ""
                }`}
                data-aos="fade-right"
                data-aos-duration="1500"
                data-aos-anchor-placement="bottom-bottom"
              >
                <label
                  id="number-label"
                  className="block text-sm font-medium text-gray-600"
                >
                  Ажилтнуудын тоо
                </label>
                <div className="mt-1 flex rounded-lg">
                  <input
                    type="number"
                    id="number"
                    min="1"
                    max="99"
                    onChange={onChange}
                    name="ajiltniiToo"
                    className="form-input mb-1 block h-10 w-full appearance-none rounded-lg border border-gray-300 px-4 sm:text-sm"
                    placeholder="Ажилтнуудын тоо"
                  />
                </div>
              </div>
              {turul === "Үйлчилгээ" && (
                <div className="col-span-6">
                  <label className="block text-sm font-medium text-gray-600">
                    Та ямар үйлчилгээ эрхлэхээр талбай сонирхож байгаа вэ?
                  </label>
                  <div className="mt-1 flex rounded-md">
                    <input
                      id="first_name"
                      type="text"
                      name="uilAjillagaa"
                      onChange={onChange}
                      className="form-input mb-1 block h-10 w-full rounded-md border
                          border-gray-300 px-4
                          placeholder-gray-400 sm:text-sm"
                      placeholder="Үйлчилгээ"
                      required
                    ></input>
                  </div>
                </div>
              )}
              <div
                className={`col-span-6 ${
                  turul === "Ресторан, кофе шоп" ||
                  turul === "Фитнес, спортын төрлийн сургалтууд" ||
                  turul === "Бусад"
                    ? "hidden"
                    : ""
                }`}
                data-aos="zoom-in"
                data-aos-duration="1500"
                data-aos-anchor-placement="bottom-bottom"
              >
                <label
                  id="name-label"
                  className="block text-sm font-medium text-gray-600"
                >
                  Одоо эрхэлж буй бизнесийн вэбсайт эсвэл фэйсбүүк хаягыг
                  оруулна уу.
                </label>
                <div className="mt-1 flex rounded-lg">
                  <input
                    type="text"
                    id="name"
                    onChange={onChange}
                    name="webKhuudas"
                    className="form-input mb-1 block h-10 w-full rounded-lg border border-gray-300 px-4 placeholder-gray-400 sm:text-sm"
                    placeholder="Фэйсбүүк хаяг"
                  />
                </div>
              </div>
              <div
                className="col-span-6 sm:col-span-3"
                data-aos="fade-right"
                data-aos-duration="1500"
                data-aos-anchor-placement="bottom-bottom"
              >
                <label className="block text-sm font-medium text-gray-600">
                  Давхар
                </label>
                <div className="mt-1 rounded-lg">
                  <div className="relative">
                    <select
                      id="dropdown"
                      name="davkhar"
                      onChange={onChange}
                      defaultValue={"Давхар"}
                      className=" mb-1 block h-10 w-full appearance-none rounded-lg border border-gray-300 px-4 text-gray-600 placeholder-gray-400 sm:text-sm"
                      placeholder="Your email address"
                    >
                      <option disabled>Давхар</option>
                      {davkharAvya(turul).map((davkhar) => (
                        <option key={davkhar}>{davkhar}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div
                className="col-span-6 sm:col-span-3"
                data-aos="fade-left"
                data-aos-duration="1500"
                data-aos-anchor-placement="bottom-bottom"
              >
                <label className="block text-sm font-medium text-gray-600">
                  Сонирхож буй талбайн м2
                </label>
                <div className="mt-1 rounded-lg">
                  <div className="relative">
                    <select
                      id="dropdown"
                      name="talbainKhemjee"
                      onChange={onChange}
                      defaultValue={"Талбайн м2"}
                      className="mb-1 block h-10 w-full appearance-none rounded-lg border border-gray-300 px-4 text-gray-600 placeholder-gray-400 sm:text-sm"
                      placeholder="Your email address"
                    >
                      <option>Талбайн м2</option>
                      <option>30-50м2</option>
                      <option>50-80м2</option>
                      <option>80-120м2</option>
                      <option>150-200м2</option>
                      <option>200-300м2</option>
                      <option>300+</option>
                    </select>
                  </div>
                </div>
              </div>
              <div
                className="col-span-6 sm:col-span-6"
                data-aos="fade-right"
                data-aos-duration="1500"
                data-aos-anchor-placement="bottom-bottom"
              >
                <label
                  id="email-label"
                  className="block text-sm font-medium text-gray-600"
                >
                  Утасны дугаар
                </label>
                <div className="mt-1 flex rounded-lg">
                  <input
                    type="phone"
                    id="phone"
                    name="utas"
                    onChange={onChange}
                    className="form-input mb-1 block h-10 w-full rounded-lg border border-gray-300 px-4 placeholder-gray-400 sm:text-sm"
                    placeholder="Утасны дугаар"
                    required
                  />
                </div>
              </div>
              <div
                className="col-span-6 sm:col-span-6"
                data-aos="fade-left"
                data-aos-duration="1500"
                data-aos-anchor-placement="bottom-bottom"
              >
                <label
                  id="email-label"
                  className="block text-sm font-medium text-gray-600"
                >
                  И-мэйл хаяг
                </label>
                <div className="mt-1 flex rounded-lg">
                  <input
                    type="email"
                    id="email"
                    name="mail"
                    onChange={onChange}
                    className="form-input mb-1 block h-10 w-full rounded-lg border border-gray-300 px-4 placeholder-gray-400 sm:text-sm"
                    placeholder="И-мэйл хаяг"
                    required
                  />
                </div>
              </div>
              <div
                className={`col-span-6 ${
                  turul === "Ресторан, кофе шоп" ||
                  turul === "Фитнес, спортын төрлийн сургалтууд" ||
                  turul === "Бусад"
                    ? "hidden"
                    : ""
                }`}
              >
                <label
                  id="email-label"
                  className="block text-sm font-medium text-gray-600"
                >
                  Хэрэв хуулийн этгээд бол нэрийг оруулна уу.
                </label>
                <div className="mt-1 flex rounded-md">
                  <input
                    id="email"
                    name="ner"
                    onChange={onChange}
                    className="form-input mb-1 block h-10 w-full rounded-md border
                            border-gray-300 px-4
                            placeholder-gray-400 sm:text-sm"
                    placeholder="Хэрэв хуулийн этгээд бол нэрийг оруулна уу."
                    required
                  ></input>
                </div>
              </div>
              <div
                className="col-span-6 mt-2 sm:col-span-6"
                data-aos="zoom-in"
                data-aos-duration="1500"
                data-aos-anchor-placement="bottom-bottom"
              >
                <label
                  id="textarea"
                  className="block text-sm font-medium text-gray-600"
                >
                  Нэмэлт хүсэлт байвал оруулна уу.
                </label>
                <div className="mt-1 flex rounded-md">
                  <textarea
                    id="textfield"
                    rows={3}
                    name="nemeltMedeelel"
                    onChange={onChange}
                    className="form-textarea mb-1 h-20 w-full appearance-none rounded-md border border-gray-300 px-2 py-2 placeholder-gray-400 sm:text-sm"
                  ></textarea>
                </div>
              </div>
              <div
                className="col-span-6 mt-2 sm:col-span-2"
                data-aos="zoom-in"
                data-aos-duration="1500"
                data-aos-anchor-placement="bottom-bottom"
              ></div>
            </div>
          </form>
        </div>
      </div>
    </Admin>
  );
}

export const getServerSideProps = (ctx) => shalgaltKhiikh(ctx);

export default AnketBurgekh;
