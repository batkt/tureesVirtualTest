import _ from "lodash";
import React from "react";
const str = "A";

function anketBurtgel({ token, destroy, data, id }, ref) {
  React.useImperativeHandle(
    ref,
    () => ({
      khaaya() {
        destroy();
      },
    }),
    []
  );

  return (
    <div className="rounded-md border-2 p-2 dark:border-gray-600">
      <div className="flex justify-between">
        <div className="flex gap-2 text-base font-medium dark:text-gray-200">
          <p className="normal-case">Нэр:</p>
          {data.ner}
        </div>
        <div className="flex gap-2 dark:text-gray-200">
          <p className="font-medium">Төрөл:</p> {data.turul}
        </div>
      </div>
      <div className="py-2 px-4 pb-5">
        <div>
          <p className="font-medium dark:text-gray-200">Асуултууд:</p>{" "}
          <div className="overflow-auto">
            {data.asuultuud.map((mur, i) => {
              return (
                <div className="pl-2 dark:text-gray-200" key={i}>
                  <div className="flex gap-2">
                    <p className="font-medium">{i + 1}).</p>
                    {mur.asuult}
                  </div>
                  <div className="ml-5 flex gap-5">
                    {mur.khariultuud.map((a, i) => {
                      return (
                        <div className="flex gap-2">
                          <p className="font-medium">
                            {String.fromCharCode(
                              str.charCodeAt(str.length - 1) + i
                            )}
                            .
                          </p>
                          {a}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.forwardRef(anketBurtgel);
