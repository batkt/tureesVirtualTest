import React, { useRef, useState } from "react";
import { Button, Input, message } from "antd";
import moment from "moment";
import { url } from "services/uilchilgee";
import updateMethod from "tools/function/crud/updateMethod";
import getBase64 from "tools/function/getBase64";

const { TextArea } = Input;

function KhuviinMedeelel({ ajiltan, token, ajiltanMutate, khadgalsniiDaraa }) {
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
        message.success("Амжилттай заслаа");
        ajiltanMutate({ ...ajiltanObject });
      }
    });
  }

  function zuragSolikh({ target }) {
    getBase64(target.files[0], (base64) => (zuragRef.current.src = base64));
    setstate((s) => ({ ...s, [target.name]: target.files[0] }));
  }

  return (
    <div className="xxl:col-span-10 col-span-12 lg:col-span-10">
      <div className="box lg:mt-5">
        <div className="dark:border-dark-5 flex items-center border-b border-gray-200 p-5">
          <h2 className="mr-auto text-base font-medium dark:text-gray-200">
            Хувийн мэдээлэл
          </h2>
        </div>
        <div className="p-5">
          <div className="flex flex-col xl:flex-row">
            <div className="mt-6 flex-1 xl:mt-0">
              <div className="grid grid-cols-12 gap-x-5">
                <div className="xxl:col-span-6 col-span-12">
                  <div className="mt-3">
                    <label className="form-label">Овог</label>
                    <Input
                      name="ovog"
                      placeholder="Овог"
                      defaultValue={ajiltan.ovog}
                      onChange={(e) => onChange(e, "ovog")}
                    />
                  </div>
                </div>
                <div className="xxl:col-span-6 col-span-12">
                  <div className="mt-3">
                    <label className="form-label">Нэр</label>
                    <Input
                      name="ner"
                      placeholder="Нэр"
                      defaultValue={ajiltan.ner}
                      onChange={(e) => onChange(e, "ner")}
                    />
                  </div>
                </div>
                <div className="xxl:col-span-6 col-span-12">
                  <div className="mt-3">
                    <label className="form-label">Нэвтрэх нэр</label>
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
                    <label className="form-label">Шинэ нууц үг</label>
                    <Input.Password
                      className="form-control"
                      placeholder="Шинэ нууц үг"
                      name="shineNuutsUg"
                      onChange={(e) => onChange(e, "shineNuutsUg")}
                    />
                  </div>
                  <div className="mt-3">
                    <label className="form-label">Шинэ нууц үг давтан</label>
                    <Input.Password
                      className="form-control"
                      placeholder="Шинэ нууц үг давтан"
                      name="shineNuutsUgDavtan"
                      onChange={(e) => onChange(e, "shineNuutsUgDavtan")}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <Button type="primary" onClick={khadgalakh}>
                  Хадгалах
                </Button>
              </div>
            </div>
            <div className="mx-auto w-52 xl:mr-0 xl:ml-6">
              <div className="dark:border-dark-5 rounded-md border-2 border-dashed border-gray-200 p-5 shadow-sm">
                <div className="image-fit zoom-in relative mx-auto h-40 cursor-pointer">
                  <img
                    className="h-40 w-40 rounded-md"
                    alt="Rubick Tailwind HTML Admin Template"
                    ref={zuragRef}
                    src={
                      ajiltan?.zurgiinNer
                        ? `${url}/ajiltniiZuragAvya/${ajiltan?.baiguullagiinId}/${ajiltan?.zurgiinNer}`
                        : ((ajiltan?.register?.replace(/^\D+/g, "") % 100) /
                            10) %
                            2 <
                          1
                        ? "/profileFemale.svg"
                        : "/profile.svg"
                    }
                  />
                  <div className="tooltip bg-theme-6 absolute right-0 top-0 -mr-2 -mt-2 flex h-5 w-5 items-center justify-center rounded-full text-white">
                    {" "}
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
                    </svg>{" "}
                  </div>
                </div>
                <div className="relative mx-auto mt-5 cursor-pointer">
                  <Button type="primary" className="w-full">
                    Зураг солих
                  </Button>
                  <input
                    type="file"
                    name="zurag"
                    className="absolute top-0 left-0 h-full w-full opacity-0"
                    onChange={zuragSolikh}
                  />
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
