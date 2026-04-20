import React, { useImperativeHandle, useRef } from "react";
import { BsBackspaceFill } from "react-icons/bs";

const DugaarKeyboard = ({
  handleUrgeljluulekh,
  dugaar,
  setDugaar,
  dugaarRef,
  shineTurul,
  setRegister,
  eBarimtTurul,
  baiguullagaNer,
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
    [dugaar],
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
    <div className="flex flex-col items-center justify-between gap-12">
      {!shineTurul ? (
        <div className="mt-4 text-5xl font-bold text-white dark:text-white md:text-[20px]">
          Улсын дугаар оруулна уу
        </div>
      ) : (
        <div className="text-5xl font-bold">{baiguullagaNer?.name || ""}</div>
      )}
      {!shineTurul ? (
        <div className="flex gap-2">
          {dugaar.map((mur, index) => (
            <input
              key={index}
              className="h-[150px] w-[150px] select-none rounded-2xl border-4 border-zinc-200 bg-[#1E1E1E] text-center text-3xl font-bold text-zinc-200 caret-transparent focus:outline-none md:h-[80px] md:w-[80px] xl:text-5xl"
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
        <div className="flex gap-2">
          <input
            className="h-[130px] w-full select-none rounded-xl border-4 border-zinc-200 bg-[#1E1E1E] text-center text-5xl font-bold caret-transparent focus:outline-none "
            type="text"
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
        <div className="grid grid-cols-4 place-items-center gap-2 text-5xl font-bold md:gap-[4px]">
          {numbers.map((num, index) => (
            <div
              key={index}
              className={`col-span-1 flex items-center justify-center rounded-xl ${
                num === "Butsakh"
                  ? "row-span-2 h-full w-[130px] bg-[#EB3223] bg-opacity-20 text-red-500  md:w-[90px]"
                  : "h-[130px] w-[130px] bg-[#414143] md:h-[90px] md:w-[90px]"
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
        className="flex h-[90px] w-[490px] items-center justify-center gap-4 rounded-xl border-4 border-green-400 bg-green-800 bg-opacity-70 px-4 py-2 text-4xl font-bold text-green-400 focus:outline-none md:h-[70px] md:w-[400px] md:text-2xl"
      >
        <div>Үргэлжлүүлэх</div>
        <div className="mt-2 font-[800]">
          <img src="/rightCadet.png" />
        </div>
      </button>
    </div>
  );
};

export default DugaarKeyboard;
