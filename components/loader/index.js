import React from "react";

export default function Loader() {
  return (
    <div className="absolute z-50 flex h-full w-full select-none items-center justify-center rounded-xl bg-white bg-opacity-60 transition-all dark:bg-black dark:bg-opacity-60">
      <div className="absolute flex h-56 w-56 items-center justify-center self-center justify-self-center rounded-full bg-gray-200 before:absolute before:h-56 before:w-56 before:animate-spin before:rounded-full before:bg-gradient-to-b before:from-blue-700 before:via-transparent after:absolute after:inset-1 after:rounded-full after:bg-gray-50 dark:bg-gray-900 dark:after:bg-gray-700 lg:h-[20vw] lg:w-[20vw] lg:before:h-[20vw]  lg:before:w-[20vw] ">
        <div className="relative z-10 h-5 w-56 animate-spin overflow-visible lg:w-[20vw]">
          <div className="absolute top-3 h-6 w-6 rounded-full bg-green-600 lg:-right-[10px]  lg:-top-5" />
        </div>
      </div>
      <div className="z-20 flex h-44 w-44 items-center justify-center overflow-hidden rounded-full bg-green-600 p-2  shadow-xl dark:bg-gray-900 dark:bg-gray-800 lg:h-[15vw] lg:w-[15vw]">
        <img src="/rent.ico" draggable={false} />
      </div>
    </div>
  );
}
