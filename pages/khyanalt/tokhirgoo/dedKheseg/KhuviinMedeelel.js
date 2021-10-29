import React, { useRef, useState } from "react";
import { Input, message } from "antd";
import moment from "moment";
import { url } from "services/uilchilgee";
import updateMethod from "tools/function/crud/updateMethod";
import getBase64 from "tools/function/getBase64";

const { TextArea } = Input;

function KhuviinMedeelel({
  ajiltan = {},
  token,
  ajiltanMutate,
  khadgalsniiDaraa,
}) {
  const [state, setstate] = useState(ajiltan);
  const zuragRef = useRef(null);

  function onChange({ target }, key) {
    setstate((s) => ({ ...s, [key]: target.value }));
  }

  function khadgalakh() {
    const { zurag, ...ajiltanObject } = state;
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
    <div className="col-span-12 lg:col-span-8 xxl:col-span-9">
      <div className="intro-y box lg:mt-5">
        <div className="flex items-center p-5 border-b border-gray-200 dark:border-dark-5">
          <h2 className="font-medium text-base mr-auto dark:text-gray-200">
            Хувийн мэдээлэл
          </h2>
        </div>
        <div className="p-5">
          <div className="flex flex-col-reverse xl:flex-row flex-col">
            <div className="flex-1 mt-6 xl:mt-0">
              <div className="grid grid-cols-12 gap-x-5">
                <div className="col-span-12 xl:col-span-6">
                  <div className="mt-3">
                    <label className="form-label">Овог</label>
                    <Input defaultValue={ajiltan.ovog} disabled />
                  </div>
                </div>
                <div className="col-span-12 xl:col-span-6">
                  <div className="mt-3">
                    <label className="form-label">Нэр</label>
                    <Input defaultValue={ajiltan.ner} disabled />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-12 gap-x-5">
                <div className="col-span-12 xl:col-span-6">
                  <div className="mt-3">
                    <label className="form-label">Регистр</label>
                    <Input defaultValue={ajiltan.register} disabled />
                  </div>
                </div>
                <div className="col-span-12 xl:col-span-6">
                  <div className="mt-3">
                    <label className="form-label">Ажилд орсон огноо</label>
                    <Input
                      defaultValue={moment(ajiltan.ajildOrsonOgnoo).format(
                        "YYYY-MM-DD"
                      )}
                      disabled
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-12 gap-x-5">
                <div className="col-span-12 xxl:col-span-6">
                  <div className="mt-3">
                    <label className="form-label">Утасны дугаар</label>
                    <Input
                      name="utas"
                      placeholder="Input text"
                      defaultValue={ajiltan.utas}
                      onChange={(e) => onChange(e, "utas")}
                    />
                  </div>
                </div>
                <div className="col-span-12">
                  <div className="mt-3">
                    <label className="form-label">Address</label>
                    <TextArea
                      defaultValue={ajiltan.khayag}
                      onChange={(e) => onChange(e, "khayag")}
                    />
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="btn text-white bg-blue-800 w-20 mt-3"
                onClick={khadgalakh}
              >
                Хадгалах
              </button>
            </div>
            <div className="w-52 mx-auto xl:mr-0 xl:ml-6">
              <div className="border-2 border-dashed shadow-sm border-gray-200 dark:border-dark-5 rounded-md p-5">
                <div className="h-40 relative image-fit cursor-pointer zoom-in mx-auto">
                  <img
                    className="rounded-md h-40 w-40"
                    alt="Rubick Tailwind HTML Admin Template"
                    ref={zuragRef}
                    src={
                      ajiltan?.zurgiinNer
                        ? `${url}/ajiltniiZuragAvya/${ajiltan?.baiguullagiinId}/${ajiltan?.zurgiinNer}`
                        : "/profile.svg"
                    }
                  />
                  <div className="tooltip w-5 h-5 flex items-center justify-center absolute rounded-full text-white bg-theme-6 right-0 top-0 -mr-2 -mt-2">
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
                      className="feather feather-x w-4 h-4"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>{" "}
                  </div>
                </div>
                <div className="mx-auto cursor-pointer relative mt-5">
                  <button
                    type="button"
                    className="btn text-white bg-blue-800 w-full"
                  >
                    Зураг солих
                  </button>
                  <input
                    type="file"
                    name="zurag"
                    className="w-full h-full top-0 left-0 absolute opacity-0"
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
