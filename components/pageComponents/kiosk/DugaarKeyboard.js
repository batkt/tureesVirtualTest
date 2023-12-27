import React, { useImperativeHandle, useRef } from "react";
import { BsBackspaceFill } from "react-icons/bs";

const DugaarKeyboard = ({
  handleUrgeljluulekh,
  dugaar,
  setDugaar,
  dugaarRef,
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

  const handleButtonClick = (num) => {
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
  };

  const numbers = [1, 2, 3, "Butsakh", 4, 5, 6, 7, 8, 9, 0];

  return (
    <div className="flex flex-col items-center justify-between gap-12">
      <div className="text-5xl font-bold">Улсын дугаар оруулна уу</div>
      <div className="flex gap-2">
        {dugaar.map((mur, index) => (
          <input
            key={index}
            className="h-[150px] w-[150px] rounded-2xl border-4 border-zinc-200 bg-zinc-800 text-center text-5xl font-bold text-zinc-200"
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
      <div className="grid grid-cols-4 place-items-center gap-2 text-5xl font-bold">
        {numbers.map((num, index) => (
          <div
            key={index}
            className={`col-span-1 flex items-center justify-center rounded-xl ${
              num === "Butsakh"
                ? "row-span-2 h-full w-[130px] bg-red-800 bg-opacity-50 text-red-500"
                : "h-[130px] w-[130px] bg-zinc-600"
            }`}
            onClick={() => handleButtonClick(num)}
          >
            {num === "Butsakh" ? <BsBackspaceFill /> : num}
          </div>
        ))}
      </div>
      <button
        onClick={handleUrgeljluulekh}
        className="flex h-[90px] w-[490px] items-center justify-center gap-2 rounded-xl border-4 border-green-400 bg-green-800 bg-opacity-70 px-4 py-2 text-4xl font-bold text-green-400"
      >
        Үргэлжлүүлэх
        <div className="font-[800]">
          <svg
            viewBox="64 64 896 896"
            focusable="false"
            data-icon="right"
            width="1em"
            height="1em"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M765.7 486.8L314.9 134.7A7.97 7.97 0 00302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 000-50.4z"></path>
          </svg>
        </div>
      </button>
    </div>
  );
};

export default DugaarKeyboard;
