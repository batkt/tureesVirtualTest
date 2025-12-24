import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { message, Upload } from "antd";
import { RightOutlined, FileImageOutlined } from "@ant-design/icons";
import uilchilgee, { url } from "services/uilchilgee";
import { useTranslation } from "react-i18next";

const GereeZuragOruulakh = (
  { token, destroy, garchig, tailbar, onFinish, gereeniiId },
  ref
) => {
  const [zurguud, setZurguud] = useState([]);
  const { t } = useTranslation();

  useImperativeHandle(ref, () => ({
    khaaya() {
      if (typeof onFinish === "function") onFinish();
      destroy();
    },

    async khadgalya() {
      try {
        const successfulFiles = zurguud.filter(
          (f) => f.status === "done" && f.response?.id
        );

        if (!successfulFiles.length) {
          toast.warning(t("Зураг хадгалагдсангүй"));
          return;
        }

        const response = await uilchilgee(token).post(
          "/gereeniiZurguudKhadgalakh",
          {
            gereeniiId,
            zurguud: successfulFiles.map((f) => f.response.id),
          }
        );

        if (response.data === "Amjilttai" || response.data?.success) {
          toast.success(t("Амжилттай хадгалагдлаа"));
          if (typeof onFinish === "function") onFinish();
          destroy();
        } else {
          toast.error(t("Зураг хадгалах үед алдаа гарлаа"));
        }
      } catch (err) {
        toast.error(t("Зураг хадгалах үед алдаа гарлаа"));
      }
    },
  }));

  useEffect(() => {
    const handleKeyUp = (e) => {
      if (e.key === "Escape") destroy();
    };
    document.addEventListener("keyup", handleKeyUp);
    return () => document.removeEventListener("keyup", handleKeyUp);
  }, [destroy]);

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-medium dark:text-gray-200">{garchig}</h3>
        <p className="text-sm text-gray-500">{tailbar}</p>
      </div>

      <Upload
        multiple
        accept="image/*"
        name="file"
        listType="picture"
        action={`${url}/zuragKhadgalya`}
        method="POST"
        fileList={zurguud}
        data={{ turul: "jpg" }}
        headers={{ Authorization: `Bearer ${token}` }}
        onChange={({ fileList }) => setZurguud(fileList)}
      >
        <div className="flex w-full cursor-pointer justify-between rounded-xl bg-gray-200 p-5 transition-colors duration-500 hover:bg-green-400 hover:text-white dark:bg-gray-600 dark:hover:bg-green-800">
          <div className="flex gap-5">
            <FileImageOutlined className="text-xl" />
            <div>
              <div className="text-lg font-medium">{t("Зураг")}</div>
              <div>{t("Та зураг сонгоно уу")}</div>
            </div>
          </div>
          <div>
            <RightOutlined className="items-end self-center" />
          </div>
        </div>
      </Upload>
    </div>
  );
};

export default forwardRef(GereeZuragOruulakh);
