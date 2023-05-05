import React, { useState } from "react";
import shalgaltKhiikh from "services/shalgaltKhiikh";
import Admin from "components/Admin";
import _ from "lodash";
import dynamic from "next/dynamic";
import { Checkbox, Form, Input } from "antd";
import { t } from "i18next";
import Image from "next/image";

const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
});

function ZakhialgaNemekh({ token }) {
  const hemjee = [
    { label: "A4", value: "A4", width: "692", height: "595" },
    { label: "A5", value: "A5", width: "595", height: "420" },
  ];

  const [value, setValue] = useState("");
  const [hevteeBolgoh, setHevteeBolgoh] = useState(false);

  function handleChange(checkedValues) {
    setValue(checkedValues.target.value);
  }

  const selectedCategory = hemjee.find((item) => item.value === value);
  const height = hevteeBolgoh
    ? selectedCategory?.width || "842"
    : selectedCategory?.height || "595";
  const width = hevteeBolgoh
    ? selectedCategory?.height || "595"
    : selectedCategory?.width || "842";

  return (
    <Admin
      khuudasniiNer='actiinZagvarUgsrah'
      title='Актын загвар угсрах'
      hideSearch
      dedKhuudas
      className='p-4'>
      <div className='col-span-12 flex justify-center p-4 lg:col-span-9 lg:max-h-[50px] lg:justify-start xl:col-span-8'>
        <SunEditor
          height={height}
          width={width}
          showToolbar={true}
          autoFocus={true}
        />
      </div>
      <div className='col-span-12 lg:col-span-3 xl:col-span-4 '>
        <div className='box p-9 lg:h-[800px]'>
          <Form autoComplete={"off"}>
            <Form.Item name='ner'>
              <Input placeholder={t("Нэр")} />
            </Form.Item>
          </Form>
          <div className=''>
            <div className='col-sm-12 flex items-center justify-center px-3 py-2 lg:flex-col lg:justify-between lg:gap-3 xl:flex-row'>
              <div className='flex lg:justify-center'>
                {hemjee.map((item) => {
                  return (
                    <Checkbox
                      key={item.label}
                      onChange={handleChange}
                      checked={item.value == value}
                      value={item.value}>
                      {item.value}
                    </Checkbox>
                  );
                })}
              </div>
              <div
                className='flex h-7 w-28 cursor-pointer items-center justify-center gap-3 rounded border duration-300 ease-out hover:border-blue-400'
                onClick={() => setHevteeBolgoh(!hevteeBolgoh)}>
                Landscape
                <div className='h-5 w-5'>
                  <Image
                    src='/landscape-mode.png'
                    alt='Picture of the author'
                    width={100}
                    height={100}
                  />
                </div>
              </div>
            </div>
            <div className='mt-4 flex h-6 w-full cursor-pointer items-center justify-center rounded bg-green-700 text-white'>
              {t("Хадгалах")}
            </div>
          </div>
        </div>
      </div>
    </Admin>
  );
}

export const getServerSideProps = shalgaltKhiikh;

export default ZakhialgaNemekh;
