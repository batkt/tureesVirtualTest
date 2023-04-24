import React, { useState, useEffect, useMemo } from "react";
import { Button, Input, notification, InputNumber, Card } from "antd";
import {PlusOutlined, CloseCircleOutlined} from "@ant-design/icons"
import uilchilgee from "services/uilchilgee";
import { useTranslation } from "react-i18next";

function Zogsool({ token, baiguullaga, baiguullagaMutate, setSongogdsonTsonkhniiIndex }) {
  const [zogsoolTokhirgoo, setZogsoolTokhirgoo] = useState(null);
  const { t } = useTranslation()

  useEffect(() => {
    if (baiguullaga !== undefined) {
      setZogsoolTokhirgoo({
        zogsooliinMinut: baiguullaga?.tokhirgoo?.zogsooliinMinut,
        zogsooliinDun: baiguullaga?.tokhirgoo?.zogsooliinDun,
        zogsooliinKhungulukhMinut:
          baiguullaga?.tokhirgoo?.zogsooliinKhungulukhMinut,
      });
    }
  }, [baiguullaga]);

  function tokhirgooKhadgalakh() {
    uilchilgee(token)
      .post("/baiguullagaTokhirgooZasya", { tokhirgoo: zogsoolTokhirgoo })
      .then(({ data }) => {
        if (data === "Amjilttai") {
          notification.success({ message: t("Амжилттай засагдлаа") });
          baiguullagaMutate();
          setSongogdsonTsonkhniiIndex(10);
        }
      });
  }

  const isChanged = useMemo(() => {
    if (!zogsoolTokhirgoo) return false;
    return (
      baiguullaga?.tokhirgoo?.zogsooliinMinut !==
      zogsoolTokhirgoo["zogsooliinMinut"] ||
      baiguullaga?.tokhirgoo?.zogsooliinDun !==
      zogsoolTokhirgoo["zogsooliinDun"] ||
      baiguullaga?.tokhirgoo?.zogsooliinKhungulukhMinut !==
      zogsoolTokhirgoo["zogsooliinKhungulukhMinut"]
    );
  }, [zogsoolTokhirgoo, baiguullaga]);

  const [inputs, setInputs] = useState([{ input1: '', input2: '' }]);

  const handleAddInput = () => {
    setInputs([...inputs, { input1: '', input2: '' }]);
  }

  const handleInputChange = (e, index, inputType) => {
    const newInputs = [...inputs];
    newInputs[index][inputType] = e.target.value;
    setInputs(newInputs);
  }

  const handleDeleteInput = (index) => {
    const newInputs = [...inputs];
    newInputs.splice(index, 1);
    setInputs(newInputs);
  }

  return (
    <>
      <div className="xxl:col-span-4 col-span-12 mt-5 lg:col-span-6">
        <div className="box mt-5 lg:mt-0">
          <div className="dark:border-dark-5 flex items-center border-b border-gray-200 px-5 pt-5 pb-2">
            <h2 className="mr-auto text-base font-medium dark:text-gray-200">
              {t("Зогсоол тохиргоо")}
            </h2>
          </div>
          <div className="box">
            <div className="flex items-center p-5">
              <div className="border-l-2 border-green-500 pl-4">
                <div className="font-medium">{t("Төлбөр тооцох хугацаа/минут/")}</div>
                <div className="text-gray-600"></div>
              </div>
              <div className="ml-auto">
                <Input
                  value={zogsoolTokhirgoo?.["zogsooliinMinut"]}
                  onChange={({ target }) =>
                    setZogsoolTokhirgoo((a) => ({
                      ...(a || {}),
                      zogsooliinMinut: target.value,
                    }))
                  }
                />
              </div>
            </div>
          </div>
          <div className="box">
            <div className="flex items-center p-5">
              <div className="border-l-2 border-green-500 pl-4">
                <div className="font-medium">{t("Хугацааны үнэ")}</div>
                <div className="text-gray-600"></div>
              </div>
              <div className="ml-auto">
                <Input
                  value={zogsoolTokhirgoo?.["zogsooliinDun"]}
                  onChange={({ target }) =>
                    setZogsoolTokhirgoo((a) => ({
                      ...(a || {}),
                      zogsooliinDun: target.value,
                    }))
                  }
                />
              </div>
            </div>
          </div>
          <div className="box">
            <div className="flex items-center p-5">
              <div className="border-l-2 border-green-500 pl-4">
                <div className="font-medium">{t("Хөнгөлөх минут")}</div>
                <div className="text-gray-600"></div>
              </div>
              <div className="ml-auto">
                <Input
                  value={zogsoolTokhirgoo?.["zogsooliinKhungulukhMinut"]}
                  onChange={({ target }) =>
                    setZogsoolTokhirgoo((a) => ({
                      ...(a || {}),
                      zogsooliinKhungulukhMinut: target.value,
                    }))
                  }
                />
              </div>
            </div>
          </div>
          {isChanged && (
            <div
              className={`dark:border-dark-5 flex items-center justify-end border-b border-gray-200 px-5 pt-2 pb-2`}
            >
              <Button type="primary" onClick={tokhirgooKhadgalakh}>
                {t("Хадгалах")}
              </Button>
            </div>
          )}
        </div>
        <div className="box w-full rounded-md border p-5 py-8 flex flex-col justify-center items-center">
          <Button
            icon={<PlusOutlined />}
            className="mt-5 2xl:w-1/3 w-1/2 flex"
            type="dashed"
            onClick={handleAddInput}
          >
            Тариф нэмэх
          </Button>
          <div
            className="my-5 space-y-3 overflow-y-auto py-2"
            style={{ maxHeight: "calc( 100vh - 80vh )" }}
          >
            {inputs.map((input, index) => (
                <div key={index}
                  className="relative grid w-full grid-cols-4 place-items-center items-center justify-between  gap-5 rounded-md border bg-green-50 px-10 py-2 shadow-md 2xl:pr-20">
                  <div 
                  onClick={handleDeleteInput}
                  className="absolute right-2 top-[40%] flex text-lg transition-all hover:text-red-500">
                    <CloseCircleOutlined />
                  </div>
                  <div className="col-span-2">
                    <label className="text-end">Минут хүртэл:</label>
                    <InputNumber className="w-full" placeholder="Минут" onChange={(e)=>handleInputChange(e, index, 'input1')} value={input.input1}/>
                  </div>
                  <div className="col-span-2">
                    <label className="text-end">Тариф/₮/:</label>
                    <InputNumber
                      formatter={(value) =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                      className="w-full"
                      placeholder="Тариф"
                      onChange={(e)=>handleInputChange(e, index, 'input2')}
                      value={input.input2}
                  />
                  </div>
                </div>))}
          </div>
        </div>
        <div className="box mt-5 lg:mt-0">
          <div className="w-full flex py-8 px-5 2xl:flex-row flex-col justify-between items-center 2xl:gap-20 gap-8">
            <div className="flex flex-col items-center justify-center w-full gap-4">
              <h2 className="text-xl">Орох Камер</h2>
              <div className="border aspect-[3/2] w-full flex justify-center items-center bg-gray-400"><p>cameraOroh</p></div>
            </div>
            <div className="flex flex-col items-center justify-center w-full gap-4">
              <h2 className="text-xl">Гарах Камер</h2>
              <div className="border aspect-[3/2] w-full flex justify-center items-center bg-gray-400"><p>cameraGarah</p></div>
            </div>
          </div>
        </div>
      </div>
      <div className="xxl:col-span-4 col-span-12 mt-5 lg:col-span-6">
        <div className="box w-full p-5 flex flex-col 2xl:gap-10 gap-5">
          <div className="border 2xl:aspect-[3/2] aspect-square flex justify-center items-center bg-gray-400"><p>Camera1</p></div>
          <div className="grid 2xl:grid-cols-2 xl:grid-cols-1 lg:grid-cols-1 md:grid-cols-2 sm:grid-cols-2 grid-cols-1 gap-5 2xl:gap-20">
            <div className="border 2xl:aspect-[3/2] xl:aspect-[3/2] lg:aspect-[3/2] aspect-square bg-gray-400"><p>Camera2</p></div>
            <div className="border 2xl:aspect-[3/2] xl:aspect-[3/2] lg:aspect-[3/2] aspect-square bg-gray-400"><p>Camera3</p></div>
            <div className="border 2xl:aspect-[3/2] xl:aspect-[3/2] lg:aspect-[3/2] aspect-square bg-gray-400"><p>Camera4</p></div>
            <div className="border 2xl:aspect-[3/2] xl:aspect-[3/2] lg:aspect-[3/2] aspect-square bg-gray-400"><p>Camera5</p></div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Zogsool;
