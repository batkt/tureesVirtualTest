import React, { useEffect, useImperativeHandle } from "react";
import { Form, Modal } from "antd";
import moment from "moment";
function MedegdelKharakh({ data, destroy }, ref) {
  const [form] = Form.useForm();

  useImperativeHandle(
    ref,
    () => ({
      khaaya() {
        destroy();
      },
    }),
    [form]
  );

  function garya() {
    Modal.confirm({
      content: `Та гарахдаа итгэлтэй байна уу?`,
      okText: "Тийм",
      cancelText: "Үгүй",
      onOk: destroy,
    });
  }

  useEffect(() => {
    function keyUp(e) {
      if (e.key === "Escape") {
        e.preventDefault();
        garya();
      }
    }
    document.addEventListener("keyup", keyUp);
    return () => document.removeEventListener("keyup", keyUp);
  }, []);

  return (
    <>
      <div>
        <div>
          {!!data.object.ner ? (
            <div className="flex w-full justify-between ">
              <div> Нэр:</div>
              <div> {data.object.ner} </div>
            </div>
          ) : (
            <div className="flex justify-between">
              <div> Тайлбар:</div>
              <div> {data.object.tailbar}</div>{" "}
            </div>
          )}
        </div>

        <div className="flex justify-between">
          <div>Хийсэн ажилтан: </div>
          <div>{data.object.guilgeeKhiisenAjiltniiNer || data.ajiltniiNer}</div>
        </div>

        <div className="flex justify-between">
          <div>Хийсэн огноо:</div>
          <div>
            {moment(
              data.object.guilgeeKhiisenOgnoo || data.object.createdAt
            ).format("YYYY-MM-DD")}
          </div>
        </div>
        {data.object.tulsunAldangi ? (
          <div className="flex justify-between">
            <div>Төлсөн алдаги :</div>
            <div
              className={`${
                data.object.tulsunAldangi > 0
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {data.object.tulsunAldangi}
            </div>
          </div>
        ) : (
          ""
        )}
        {data.object.tulsunDun ? (
          <div className="flex justify-between">
            <div>Төлсөн дүн :</div>
            <div
              className={`${
                data.object.tulsunDun > 0
                  ? "font-bold text-green-600"
                  : "text-red-500"
              }`}
            >
              {data.object.tulsunDun}
            </div>
          </div>
        ) : (
          ""
        )}
        {data.object.tulukhAldangi ? (
          <div className="flex justify-between">
            <div>Төлөх алдаги :</div>
            <div
              className={`${
                data.object.tulukhAldangi > 0
                  ? "font-bold text-green-600"
                  : "text-red-500"
              }`}
            >
              {data.object.tulukhAldangi}
            </div>
          </div>
        ) : (
          ""
        )}
        {data.object.tulukhDun ? (
          <div className="flex justify-between">
            <div> Төлөх дүн: </div>
            <div
              className={`${
                data.object.tulukhDun > 0
                  ? "font-bold text-green-600"
                  : "text-red-500"
              }`}
            >
              {data.object.tulukhDun}
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
}

export default React.forwardRef(MedegdelKharakh);
