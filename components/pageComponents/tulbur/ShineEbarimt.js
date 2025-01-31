import { Input } from "antd";
import Aos from "aos";
import React, { useEffect } from "react";
import uilchilgee from "services/uilchilgee";
import colors from "tailwindcss/colors";

function ShineEbarimt({
  alkham,
  register,
  setRegister,
  setTin,
  baiguullagaEsekh,
  setBaiguullagaEsekh,
  baiguullagiinMedeelel,
  setBaiguullaga,
  irgenEsekh,
  setIrgenEsekh,
}) {
  function handleUurchlult(turul, v) {
    if (turul === "irgen" && v === true) {
      setBaiguullagaEsekh(false);
      setIrgenEsekh(true);
    }
    if (turul === "AAN" && v === true) {
      setBaiguullagaEsekh(true);
      setIrgenEsekh(false);
    }
  }
  useEffect(() => {
    Aos.init();
  });
  

  function registerShalgaya(register) {
    setRegister(register);
    // setCustomerTin(customerTin);
    setTin(null);
    setBaiguullaga(null);
    if (register?.toString().length === 7 && baiguullagaEsekh)
      uilchilgee()
        .get(`/tatvaraasBaiguullagaAvya/${register}`)
        .then(({ data }) => {
          setBaiguullaga(data); 
          setTin(data?.tin);
        });
  }
  if (alkham === 2)
    return (
      <div
        data-aos="zoom-in-up"
        data-aos-duration="500"
        className="flex flex-col items-center gap-7"
      >
        <div className="flex h-[53px] w-[394px] items-center justify-between rounded-full bg-green-400 p-1">
          <div
            onClick={() => handleUurchlult("irgen", true)}
            className={`flex w-1/2 cursor-pointer items-center justify-center rounded-full ${
              irgenEsekh && "bg-white"
            }`}
          >
            <div className="px-4 py-2 text-[15px] font-[700]">Иргэн</div>
          </div>
          <div
            onClick={() => handleUurchlult("AAN", true)}
            className={`flex w-1/2 cursor-pointer items-center justify-center rounded-full ${
              baiguullagaEsekh && "bg-white"
            } `}
          >
            <div className=" px-4 py-2 text-[15px] font-[700]">ААН</div>
          </div>
        </div>
        <div className="flex w-[50%] flex-col items-center gap-2">
          <Input
            onChange={({ target }) => registerShalgaya(target.value)}
            value={register}
            autoComplete="off"
            style={{
              height: "36px",
              borderColor: colors.green[400],
              borderRadius: "25px",
              borderWidth: 1,
            }}
            placeholder={`${irgenEsekh ? "Иргэн" : "ААН"}`}
          />
          <div className="text-[15px] font-[700] dark:text-gray-200">
            {baiguullagiinMedeelel?.name}
          </div>
        </div>
      </div>
    );
  return <></>;
}
export default ShineEbarimt;
