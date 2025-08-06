import React from "react";
import { Pagination } from "antd";
function CardList({
  className,
  jagsaalt = [],
  keyValue,
  pagination,
  Component,
  tileProps,
  componentProps,
  cardListTuluv,
}) {
  return (
    <div>
      <div
        className={`mt-1 space-y-3 p-1 ${
          cardListTuluv === "utas" && "h-medegdelHariltsagchPhone overflow-auto"
        } dark:bg-gray-800 ${className}`}
      >
        {Component &&
          jagsaalt.map((mur, index) => (
            <Component
              {...mur}
              {...componentProps}
              tileProps={tileProps}
              key={`${keyValue}${index}`}
            />
          ))}
      </div>
      {!!pagination && !!pagination?.pageSize && (
        <Pagination
          className={`hideScroll transition-all duration-500 md:hidden ${
            cardListTuluv === "utas" &&
            "absolute -bottom-5 left-6 flex w-2/5 overflow-hidden overflow-x-auto"
          }`}
          {...pagination}
        />
      )}
    </div>
  );
}

export default CardList;
