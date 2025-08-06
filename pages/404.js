import React from "react";

function Aldaa() {
  function butsakh() {
    window.history.back();
  }
  return (
    <div className="w-screen bg-blue-700 dark:bg-gray-800">
      <div className="container">
        <div className="error-page flex h-screen flex-col items-center justify-center text-center lg:flex-row lg:text-left">
          <div className="-intro-x lg:mr-20">
            <img
              alt="error"
              className="h-48 lg:h-auto"
              src="/error-illustration.svg"
            />
          </div>
          <div className="mt-10 text-white lg:mt-0">
            <div className="intro-x text-8xl font-medium">404</div>
            <div className="intro-x mt-5 text-xl font-medium lg:text-3xl">
              Уучлаарай хуудас олдсонгүй.
            </div>
            <div className="intro-x mt-3 text-lg">
              Та хуудасны замыг буруу оруулсан бололтой эсвэл энэ хуудас
              устгагдсан байна.
            </div>
            <br />
            <button
              className="intro-x btn dark:border-dark-5 mt-10 border border-white px-4 py-3 text-white dark:text-gray-300"
              onClick={butsakh}
            >
              Нүүр хуудас руу буцах
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Aldaa;
