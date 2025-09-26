import { t } from "i18next";
import React, { useMemo } from "react";
import formatNumber from "tools/function/formatNumber";
export function useTailangiinZagvar(zagvar) {
  return useMemo(() => {
    if (zagvar === "borluulaltiinTailanAvya")
      return [
        {
          id: "expander",
          Header: ({ getToggleAllRowsExpandedProps, isAllRowsExpanded }) => (
            <span {...getToggleAllRowsExpandedProps()}>
              {isAllRowsExpanded ? "-" : "+"}
            </span>
          ),
          Cell: ({ row }) =>
            row.canExpand ? (
              <span
                {...row.getToggleRowExpandedProps({
                  style: {
                    paddingLeft: `${row.depth * 2}rem`,
                  },
                })}
                className="text-lg font-medium"
              >
                {row.isExpanded ? "-" : "+"}
              </span>
            ) : null,
        },
        {
          Header: "№",
          accessor: "number",
          Cell: ({ row }) => {
            return row.index + 1;
          },
          Footer: <>{t("Нийт")}</>,
        },
        {
          Header: "Захиалгын тоо",
          accessor: "zakhialga",
          Footer: (info) => {
            const total = React.useMemo(
              () =>
                info.rows.reduce((sum, row) => row.values.zakhialga + sum, 0),
              [info.rows]
            );

            return <>{formatNumber(total)}</>;
          },
        },
        {
          Header: "Үйлчилгээний тоо",
          accessor: "uichilgeeniiToo",
          Footer: (info) => {
            const total = React.useMemo(
              () =>
                info.rows.reduce(
                  (sum, row) => row.values.uichilgeeniiToo + sum,
                  0
                ),
              [info.rows]
            );

            return <>{formatNumber(total)}</>;
          },
        },
        {
          Header: "Борлуулалтын дүн",
          accessor: "niitDun",
          Footer: (info) => {
            const total = React.useMemo(
              () => info.rows.reduce((sum, row) => row.values.niitDun + sum, 0),
              [info.rows]
            );

            return <>{formatNumber(total)}₮</>;
          },
          Cell: ({ value }) => {
            return <>{formatNumber(value)}₮</>;
          },
        },
        {
          Header: "Үйлчилгээний хөлсний дүн",
          accessor: "uilchilgeeniiKhuls",
          Footer: (info) => {
            const total = React.useMemo(
              () =>
                info.rows.reduce(
                  (sum, row) => row.values.uilchilgeeniiKhuls + sum,
                  0
                ),
              [info.rows]
            );

            return <>{formatNumber(total)}₮</>;
          },
          Cell: ({ value }) => {
            return <>{formatNumber(value)}₮</>;
          },
        },
      ];
    else if (zagvar === "ajiltnaarTailanAvya")
      return [
        {
          id: "expander",
          Header: ({ getToggleAllRowsExpandedProps, isAllRowsExpanded }) => (
            <span {...getToggleAllRowsExpandedProps()}>
              {isAllRowsExpanded ? "-" : "+"}
            </span>
          ),
          Cell: ({ row }) =>
            row.canExpand ? (
              <span
                {...row.getToggleRowExpandedProps({
                  style: {
                    paddingLeft: `${row.depth * 2}rem`,
                  },
                })}
                className="text-lg font-medium"
              >
                {row.isExpanded ? "-" : "+"}
              </span>
            ) : null,
        },
        {
          Header: "№",
          accessor: "number",
          Cell: ({ row }) => {
            return row.index + 1;
          },
          Footer: <>{t("Нийт")}</>,
        },
        {
          Header: "Ажилчдын нэр",
          accessor: "_id.ajiltniiNer",
        },
        {
          Header: "Дууссан ажил",
          accessor: "duussanAjil",
          Footer: (info) => {
            const total = React.useMemo(
              () =>
                info.rows.reduce((sum, row) => row.values.duussanAjil + sum, 0),
              [info.rows]
            );

            return <>{formatNumber(total)}</>;
          },
        },
        {
          Header: "Үйлчилгээний тоо",
          accessor: "zakhialguud",
          Footer: (info) => {
            const total = React.useMemo(
              () =>
                info.rows.reduce((sum, row) => row.values.zakhialguud + sum, 0),
              [info.rows]
            );

            return <>{formatNumber(total)}</>;
          },
        },
        {
          Header: "Үйлчилгээний орлого",
          accessor: "uilchilgeeniiKhuls",
          Cell: ({ value }) => {
            return <>{formatNumber(value)}₮</>;
          },
          Footer: (info) => {
            const total = React.useMemo(
              () =>
                info.rows.reduce(
                  (sum, row) => row.values.uilchilgeeniiKhuls + sum,
                  0
                ),
              [info.rows]
            );

            return <>{formatNumber(total)}₮</>;
          },
        },
        {
          Header: "Зарцуулсан хугацаа",
          accessor: "zartsuulsanKhugatsaa",
        },
        {
          Header: "Үнэлгээний дундаж",
          accessor: "unelgee",
        },
      ];
    else return [];
  }, [zagvar]);
}
