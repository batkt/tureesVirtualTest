import React, { useImperativeHandle, useRef } from "react";
import { BsBackspaceFill } from "react-icons/bs";

const DugaarKeyboardMobile = ({
  handleUrgeljluulekh,
  dugaar,
  setDugaar,
  dugaarRef,
  shineTurul,
  setRegister,
  eBarimtTurul,
  baiguullagaNer,
  className,
}) => {
  const inputRefs = useRef([]);

  useImperativeHandle(
    dugaarRef,
    () => ({
      khoosonInputFocusliy() {
        const khoosonIndex = dugaar?.findIndex((val) => val === "");
        inputRefs?.current[khoosonIndex]?.focus();
      },
    }),
    [dugaar]
  );

  const handleChange = (e, index) => {
    const shineCode = [...dugaar];
    shineCode[index] = e.target.value.slice(-1);
    setDugaar(shineCode);

    if (e.target.value && index < 3) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyUp = (e, index) => {
    if (e.keyCode === 8 && !e.target.value && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleButtonClick = (num, shineTurul) => {
    if (shineTurul) {
      if (num !== "Butsakh") {
        if (dugaar.length < 7) {
          setDugaar((prevDugaar) => prevDugaar + num);
        }
      }
      if (num === "Butsakh") {
        if (dugaar.length > 0) {
          setDugaar((prevDugaar) => prevDugaar.slice(0, -1));
        }
      }
    } else {
      const shineDugaar = [...dugaar];
      const khoosonIndex = shineDugaar.findIndex((val) => val === "");
      if (khoosonIndex !== -1) {
        if (num !== "Butsakh") {
          shineDugaar[khoosonIndex] = num;
          setDugaar(shineDugaar);
          if (khoosonIndex < 3) {
            inputRefs.current[khoosonIndex + 1].focus();
          }
        }
      }
      if (num === "Butsakh") {
        const khoosonBishIndex = shineDugaar.findLastIndex((val) => val !== "");
        if (khoosonBishIndex >= 0) {
          shineDugaar[khoosonBishIndex] = "";
          setDugaar(shineDugaar);
          inputRefs.current[khoosonBishIndex].focus();
        }
      }
    }
  };

  const numbers = [1, 2, 3, "Butsakh", 4, 5, 6, 7, 8, 9, 0];

  if (shineTurul && eBarimtTurul === "") return null;

  return (
    <div
      className={`gap flex h-full flex-col items-center justify-center ${className}`}
    >
      {!shineTurul ? (
        <div className="text-base font-bold text-zinc-200">
          Улсын дугаар оруулна уу
        </div>
      ) : (
        <div className="text-base font-bold text-zinc-200">
          {baiguullagaNer?.name || ""}
        </div>
      )}
      {!shineTurul ? (
        <div className="flex w-full justify-center gap-1 pt-2">
          {dugaar.map((mur, index) => (
            <input
              key={index}
              readOnly={true}
              className="h-[60px] w-[60px] select-none rounded-md border border-zinc-200 bg-[#1E1E1E] text-center text-base font-bold text-zinc-200 caret-transparent focus:outline-none"
              type="text"
              maxLength="1"
              value={mur}
              onChange={(e) => handleChange(e, index)}
              onKeyUp={(e) => handleKeyUp(e, index)}
              ref={(input) => (inputRefs.current[index] = input)}
              autoFocus={index === 0}
            />
          ))}
        </div>
      ) : eBarimtTurul === "baiguullaga" ? (
        <div className="flex gap-1 pt-2">
          <input
            className="w-full select-none rounded-xl border border-zinc-200 bg-[#1E1E1E] text-center text-base font-bold caret-transparent focus:outline-none "
            type="text"
            readOnly={true}
            onChange={(e) => setRegister(e.target.value)}
            value={dugaar}
            maxLength={7}
            ref={dugaarRef}
          />
        </div>
      ) : (
        ""
      )}
      {(!shineTurul || eBarimtTurul !== "khuviKhun") && (
        <div className="grid grid-cols-4 place-items-center gap-1 pt-4 text-base font-bold">
          {numbers.map((num, index) => (
            <div
              key={index}
              className={`col-span-1 flex items-center justify-center rounded-xl ${
                num === "Butsakh"
                  ? "row-span-2 h-full w-[75px] bg-[#EB3223] bg-opacity-20 text-red-500"
                  : "h-[75px] w-[75px] bg-[#414143]"
              }`}
              onClick={() => handleButtonClick(num, shineTurul)}
            >
              {num === "Butsakh" ? <BsBackspaceFill /> : num}
            </div>
          ))}
        </div>
      )}
      <button
        onClick={handleUrgeljluulekh}
        className="my-4 flex items-center justify-center gap-1 rounded-xl border border-green-400 bg-green-800 bg-opacity-70 px-4 py-2 text-base font-bold text-green-400 focus:outline-none"
      >
        <div>Үргэлжлүүлэх</div>
        <div className="">
          <img style={{ width: 12, height: 12 }} src="/rightCadet.png" />
        </div>
      </button>
    </div>
  );
};

export default DugaarKeyboardMobile;
