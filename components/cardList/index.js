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
  neesenEsekh,
}) {
  return (
    <div className={`mt-1 space-y-3 p-1 ${cardListTuluv === "utas" && "h-medegdelHariltsagchPhone overflow-auto"} dark:bg-gray-800 ${className}`}>
      {Component &&
        jagsaalt.map((mur, index) => (
          <Component {...mur} {...componentProps} tileProps={tileProps} key={`${keyValue}${index}`} />
        ))}
      {!!pagination && !!pagination?.pageSize && <Pagination className={`transition-all duration-500 ${cardListTuluv === "utas" && neesenEsekh === true ? "fixed -left-full bottom-8" : "fixed bottom-8 w-2/5 overflow-x-auto hideScroll overflow-hidden flex left-6"}`} {...pagination} />}
    </div>
  );
}

export default CardList;
