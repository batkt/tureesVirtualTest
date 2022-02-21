import React, { useEffect, useState } from "react";
import { Button, Input, notification } from "antd";
import useDans from "hooks/useDans"
import updateMethod from "tools/function/crud/updateMethod";

function QPay({
  token,
  baiguullaga,
  baiguullagaMutate
}) {
  
  return (
    <>
      <div className='col-span-12 lg:col-span-5 xxl:col-span-4 mt-5'>
        <div className='intro-y box mt-5 lg:mt-0'>
          <div className="flex items-center pt-5 px-5 pb-2 border-b border-gray-200 dark:border-dark-5">
            <h2 className="font-medium text-base mr-auto dark:text-gray-200">
              Зогсоол тохиргоо
            </h2>
          </div>
          <div className="box">
            <div className="flex items-center p-5">
              <div className="border-l-2 border-green-500 pl-4">
                  <div className="font-medium">Төлбөр тооцох хугацаа</div> 
                  <div className="text-gray-600"></div>
              </div>
              <div className="ml-auto">
                <Input />
              </div>
            </div>
          </div>
          <div className="box">
            <div className="flex items-center p-5">
              <div className="border-l-2 border-green-500 pl-4">
                  <div className="font-medium">Хугацааны үнэ</div> 
                  <div className="text-gray-600"></div>
              </div>
              <div className="ml-auto">
                <Input />
              </div>
            </div>
          </div>
          <div className={`flex items-center pt-2 px-5 pb-2 border-b justify-end border-gray-200 dark:border-dark-5`}>
            <Button type='primary' >Хадгалах</Button>
          </div>
        </div>
      </div>
      <div className='col-span-12 lg:col-span-5 xxl:col-span-4 mt-5'>
      </div>
    </>
  );
}

export default QPay;
