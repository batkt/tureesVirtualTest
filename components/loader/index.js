import React from "react";


export default function Loader() {
  return (
    <div className="bg-white bg-opacity-60 select-none dark:bg-black transition-all dark:bg-opacity-60 flex justify-center items-center w-full h-full absolute z-10">
      <div className="absolute lg:w-[20vw] w-56 h-56 lg:h-[20vw] self-center justify-self-center flex justify-center items-center bg-gray-200 dark:bg-gray-900 before:animate-spin before:absolute lg:before:w-[20vw] before:w-56 before:h-56 lg:before:h-[20vw] before:bg-gradient-to-b before:from-blue-700 before:rounded-full rounded-full before:via-transparent after:absolute after:inset-1 after:bg-gray-50  after:rounded-full ">
        <div className="relative h-5 w-56 lg:w-[20vw] animate-spin overflow-visible z-10">
          <div className="absolute h-6 w-6 rounded-full bg-green-600 lg:-right-[10px] lg:-top-5  top-3" />
        </div>
      </div>
      <div className="lg:h-[15vw] p-2 w-44 h-44 lg:w-[15vw] flex justify-center items-center bg-white dark:bg-gray-800 overflow-hidden shadow-xl z-20 rounded-full">
        <img  src="/rent.ico" />
      </div>
    </div>
  );
}
