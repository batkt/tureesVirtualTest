import React, { useRef, useState } from "react";
import { Button, Input, message } from "antd";
import { url } from "services/uilchilgee";
import updateMethod from "tools/function/crud/updateMethod";
import getBase64 from "tools/function/getBase64";
import { useTranslation } from "react-i18next";

const { TextArea } = Input;

function KhuviinMedeelel({
  ajiltan,
  token,
  ajiltanMutate,
  khadgalsniiDaraa,
  setSongogdsonTsonkhniiIndex,
}) {
  const { t } = useTranslation();
  const [state, setstate] = useState(ajiltan);
  const zuragRef = useRef(null);

  function onChange({ target }, key) {
    setstate((s) => ({ ...s, [key]: target.value }));
  }

  function khadgalakh() {
    const { zurag, shineNuutsUg, shineNuutsUgDavtan, ...ajiltanObject } = state;
    if (shineNuutsUg === shineNuutsUgDavtan)
      ajiltanObject.nuutsUg = shineNuutsUg;

    updateMethod("ajiltan", token, ajiltanObject).then(({ data, status }) => {
      if (status === 200 && "Amjilttai" === data) {
        toast.success(t("Амжилттай засагдлаа"));
        ajiltanMutate({ ...ajiltanObject });
        setSongogdsonTsonkhniiIndex(1);
      }
    });
  }

  function zuragSolikh({ target }) {
    getBase64(target.files[0], (base64) => {
      if (zuragRef.current) {
        zuragRef.current.src = base64;
      }
    });
    setstate((s) => ({ ...s, [target.name]: target.files[0] }));
  }

  function zuragUstgakh() {
    setstate((prev) => {
      const copy = { ...prev };
      delete copy.zurag;
      return copy;
    });

    if (zuragRef.current) {
      zuragRef.current.src = "";
    }
  }

  return (
    <div className="xxl:col-span-9 col-span-12 lg:col-span-12">
      <div className="box lg:mt-5">
        <div className="dark:border-dark-5 flex items-center border-b border-gray-200 p-5">
          <h2 className="mr-auto text-base font-medium dark:text-gray-200">
            {t("Хувийн мэдээлэл")}
          </h2>
        </div>
        <div className="p-5">
          <div className="flex flex-col xl:flex-row">
            <div className="mt-6 flex-1 xl:mt-0">
              <div className="grid grid-cols-12 gap-x-5">
                <div className="xxl:col-span-6 col-span-12">
                  <div className="mt-3">
                    <label className="form-label">{t("Овог")}</label>
                    <Input
                      name="ovog"
                      placeholder={t("Овог")}
                      defaultValue={ajiltan.ovog}
                      onChange={(e) => onChange(e, "ovog")}
                    />
                  </div>
                </div>
                <div className="xxl:col-span-6 col-span-12">
                  <div className="mt-3">
                    <label className="form-label">{t("Нэр")}</label>
                    <Input
                      name="ner"
                      placeholder={t("Нэр")}
                      defaultValue={ajiltan.ner}
                      onChange={(e) => onChange(e, "ner")}
                    />
                  </div>
                </div>
                <div className="xxl:col-span-6 col-span-12">
                  <div className="mt-3">
                    <label className="form-label">{t("Нэвтрэх нэр")}</label>
                    <Input
                      name="nevtrekhNer"
                      placeholder="Нэвтрэх нэр"
                      defaultValue={ajiltan.nevtrekhNer}
                      onChange={(e) => onChange(e, "nevtrekhNer")}
                    />
                  </div>
                </div>
                <div className="col-span-12">
                  <div className="mt-3">
                    <label className="form-label">{t("Шинэ нууц үг")}</label>
                    <Input.Password
                      className="form-control"
                      placeholder={t("Шинэ нууц үг")}
                      name="shineNuutsUg"
                      onChange={(e) => onChange(e, "shineNuutsUg")}
                    />
                  </div>
                  <div className="mt-3">
                    <label className="form-label">
                      {t("Шинэ нууц үг давтан")}
                    </label>
                    <Input.Password
                      className="form-control"
                      placeholder={t("Шинэ нууц үг давтан")}
                      name="shineNuutsUgDavtan"
                      onChange={(e) => onChange(e, "shineNuutsUgDavtan")}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-3 flex w-full justify-end">
                <Button type="primary" onClick={khadgalakh}>
                  {t("Хадгалах")}
                </Button>
              </div>
            </div>
            <div className="mx-auto w-52 xl:ml-6 xl:mr-0">
              <div className="dark:border-dark-5 rounded-md border-2 border-dashed border-gray-200 p-5 shadow-sm">
                <div className="image-fit relative mx-auto h-40 cursor-pointer">
                  <img
                    className="h-40 w-40 rounded-md"
                    alt="ProfileZurag"
                    ref={zuragRef}
                    src={
                      state.zurag
                        ? URL.createObjectURL(state.zurag)
                        : ajiltan?.zurgiinNer
                        ? `${url}/ajiltniiZuragAvya/${ajiltan?.baiguullagiinId}/${ajiltan?.zurgiinNer}`
                        : ((ajiltan?.register?.replace(/^\D+/g, "") % 100) /
                            10) %
                            2 <
                          1
                        ? "/profileFemale.svg"
                        : "/profile.svg"
                    }
                  />

                  {state.zurag && (
                    <div
                      className="tooltip bg-theme-6 absolute right-0 top-0 -mr-2 -mt-2 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full text-white"
                      onClick={zuragUstgakh}
                      title={t("Зураг устгах")}
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
                        className="feather feather-x h-4 w-4"
                      >
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </div>
                  )}
                </div>
                <div className="mt-5 flex items-center gap-2">
                  <label
                    className="relative mx-auto mt-5 w-full"
                    style={{ cursor: "pointer" }}
                  >
                    <Button
                      type="primary"
                      className="upload-button w-full bg-blue-500 font-semibold text-white transition duration-200 hover:bg-blue-600"
                    >
                      {t("Зураг солих")}
                    </Button>
                    <input
                      type="file"
                      name="zurag"
                      accept="image/*"
                      className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                      onChange={zuragSolikh}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default KhuviinMedeelel;
