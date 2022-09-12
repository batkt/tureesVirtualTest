import React from "react";
import moment from "moment";

function Kharakh({ data, print }, ref) {
  const { geree, ...gereeniiZagvar } = data;

  React.useEffect(() => {
    const keydown = (e) => {
      if (e.ctrlKey === true && e.key === "p" && print) {
        e.preventDefault();
        e.stopPropagation();
        print();
      }
    };
    document.addEventListener("keydown", keydown);
    return () => document.removeEventListener("keydown", keydown);
  }, []);

  return (
    <div className="w-full space-y-2 p-5" ref={ref}>
      {gereeniiZagvar?.ner && (
        <>
          <div className="flex flex-row justify-between">
            <div
              dangerouslySetInnerHTML={{
                __html: gereeniiZagvar?.zuunTolgoi,
              }}
            />
            <div
              dangerouslySetInnerHTML={{
                __html: gereeniiZagvar?.baruunTolgoi,
              }}
            />
          </div>
          <div className="flex flex-row justify-between">
            <div>
              {moment(geree.ognoo).format("YYYY")} он{" "}
              {moment(geree.ognoo).format("MM")} сар{" "}
              {moment(geree.ognoo).format("DD")} өдөр
            </div>
            <div>№:{geree.gereeniiDugaar}</div>
            <div>Улаанбаатар хот</div>
          </div>
          <div className="w-full text-center font-medium">
            АЖЛЫН БАЙРНЫ ТҮРЭЭСИЙН ГЭРЭЭ
          </div>
        </>
      )}
      {gereeniiZagvar?.dedKhesguud?.map((mur, index) => {
        return (
          <div
            key={`alkhamiinGereeniiZagvar${index}`}
            className="group relative flex w-full flex-row rounded-md p-1 hover:bg-gray-100 dark:hover:bg-gray-900 "
          >
            {mur.kharagdakhDugaar ? (
              <>
                <div className="text-center">{mur.kharagdakhDugaar}</div>
                <div
                  className={`${
                    mur.zaalt?.includes("table") ? "sun-editor-editable" : ""
                  } ml-5 w-full p-0`}
                  dangerouslySetInnerHTML={{ __html: mur.zaalt }}
                />
              </>
            ) : (
              <div
                className="w-full text-center"
                dangerouslySetInnerHTML={{ __html: mur.zaalt }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default React.forwardRef(Kharakh);
