import React, { useMemo, useState } from "react";
import {
  Button,
  Form,
  Image,
  InputNumber,
  notification,
  Switch,
  Upload,
  Modal,
} from "antd";
import ImgCrop from "antd-img-crop";
import { useTranslation } from "react-i18next";
import uilchilgee, { url } from "services/uilchilgee";
import { useAjiltniiJagsaalt } from "hooks/useAjiltan";
import { EditOutlined, EyeOutlined, UploadOutlined } from "@ant-design/icons";
import updateMethod from "tools/function/crud/updateMethod";
import { DeleteOutlined } from "@ant-design/icons";

function KhuviinMedeelel({
  ajiltan = {},
  token,
  barilgiinId,
  baiguullaga,
  baiguullagaMutate,
  setSongogdsonTsonkhniiIndex,
}) {
  const { t } = useTranslation();
  const { ajilchdiinGaralt, ajiltniiJagsaaltMutate } = useAjiltniiJagsaalt(
    token,
    ajiltan?.baiguullagiinId
  );

  const [form] = Form.useForm();
  const [tamga, setTamga] = useState();
  const [gariinUseg, setGariinUseg] = useState();
  const [gariinUseg1, setGariinUseg1] = useState();

  const [deleteTamga, setDeleteTamga] = useState(false);
  const [deleteGariinUseg, setDeleteGariinUseg] = useState(false);
  const [deleteGariinUseg1, setDeleteGariinUseg1] = useState(false);

  const barilga = useMemo(
    () => baiguullaga.barilguud.find((a) => a._id === barilgiinId),
    [barilgiinId]
  );
  const [kharakhZurgiinZam, setKharakhZurgiinZam] = useState(false);
  const [gariinUsegKharakhZam, setGariinUsegKharakhZam] = useState(false);
  const [gereeTokhirgoo, setGereeTokhirgoo] = useState({
    gereeAvtomataarSungakhEsekh:
      baiguullaga?.tokhirgoo?.gereeAvtomataarSungakhEsekh,
    bukhAjiltanGereendZasvarOruulakhEsekh:
      baiguullaga?.tokhirgoo?.bukhAjiltanGereendZasvarOruulakhEsekh,
    qpayShimtgelTusdaa: baiguullaga.tokhirgoo?.qpayShimtgelTusdaa,

    baritsaaAvakhEsekh: baiguullaga?.tokhirgoo?.baritsaaAvakhEsekh,
    baritsaaAvakhSar: baiguullaga?.tokhirgoo?.baritsaaAvakhSar,

    baritsaaUneAdiltgakhEsekh:
      baiguullaga?.tokhirgoo?.baritsaaUneAdiltgakhEsekh,

    aktAshiglakhEsekh: baiguullaga?.tokhirgoo?.aktAshiglakhEsekh,

    guidelBuchiltKhonogEsekh: baiguullaga?.tokhirgoo?.guidelBuchiltKhonogEsekh,
    sekhDemjikhTulburAvakhEsekh:
      baiguullaga?.tokhirgoo?.sekhDemjikhTulburAvakhEsekh,
    bichiltKhonog: baiguullaga?.tokhirgoo?.bichiltKhonog || 0,

    udruurBodokhEsekh: baiguullaga?.tokhirgoo?.udruurBodokhEsekh,
  });

  const [barilgaTokhirgoo, setBarilgaTokhirgoo] = useState({
    jilBurTalbaiTulburNemekhEsekh:
      barilga?.tokhirgoo?.jilBurTalbaiTulburNemekhEsekh,
    jilBurTulbur: barilga?.tokhirgoo?.jilBurTulbur,
    gereeDuusakhTalbaiTulburNemekhEsekh:
      barilga?.tokhirgoo?.gereeDuusakhTalbaiTulburNemekhEsekh,
    gereeDuusakhTulbur: barilga?.tokhirgoo?.gereeDuusakhTulbur,
  });

  const zuragKhadgalakh = (v, turul) => {
    if (v.file.status === "done") {
      if (turul === "tamga" && tamga?.url) {
        URL.revokeObjectURL(tamga.url);
      } else if (turul === "gariinUseg" && gariinUseg?.url) {
        URL.revokeObjectURL(gariinUseg.url);
      } else if (turul === "gariinUseg1" && gariinUseg1?.url) {
        URL.revokeObjectURL(gariinUseg1.url);
      }

      const imageData = {
        id: v.file.response?.id,
        url: v.file.originFileObj
          ? URL.createObjectURL(v.file.originFileObj)
          : null,
      };

      if (turul === "tamga") {
        setTamga(imageData);
        setDeleteTamga(false);
      } else if (turul === "gariinUseg") {
        setGariinUseg(imageData);
        setDeleteGariinUseg(false);
      } else if (turul === "gariinUseg1") {
        setGariinUseg1(imageData);
        setDeleteGariinUseg1(false);
      }
    }
  };
  const { confirm } = Modal;
  const handleTamgaDelete = () => {
    confirm({
      title: t("Устгах уу?"),
      okText: t("Тийм"),
      cancelText: t("Үгүй"),
      onOk() {
        setTamga(undefined);
        setDeleteTamga(true);
      },
      onCancel() {},
    });
  };

  const handleGariinUsegDelete = () => {
    confirm({
      title: t("Устгах уу?"),
      okText: t("Тийм"),
      cancelText: t("Үгүй"),
      onOk() {
        setGariinUseg(undefined);
        setDeleteGariinUseg(true);
      },
    });
  };

  const handleGariinUseg1Delete = () => {
    confirm({
      title: t("Устгах уу?"),
      okText: t("Тийм"),
      cancelText: t("Үгүй"),
      onOk() {
        setGariinUseg1(undefined);
        setDeleteGariinUseg1(true);
      },
    });
  };

  const gereeTokhirgooKhadgalya = () => {
    const payload = {
      baiguullagiinId: baiguullaga?._id,
      tokhirgoo: {
        gereeAvtomataarSungakhEsekh:
          gereeTokhirgoo?.gereeAvtomataarSungakhEsekh,
        bukhAjiltanGereendZasvarOruulakhEsekh:
          gereeTokhirgoo?.bukhAjiltanGereendZasvarOruulakhEsekh,
        qpayShimtgelTusdaa: baiguullaga.tokhirgoo?.qpayShimtgelTusdaa,

        baritsaaAvakhEsekh: gereeTokhirgoo?.baritsaaAvakhEsekh,
        baritsaaAvakhSar: gereeTokhirgoo?.baritsaaAvakhSar,

        baritsaaUneAdiltgakhEsekh: gereeTokhirgoo?.baritsaaUneAdiltgakhEsekh,

        aktAshiglakhEsekh: gereeTokhirgoo?.aktAshiglakhEsekh,

        guidelBuchiltKhonogEsekh: gereeTokhirgoo?.guidelBuchiltKhonogEsekh,
        sekhDemjikhTulburAvakhEsekh:
          gereeTokhirgoo?.sekhDemjikhTulburAvakhEsekh,
        guidliinKoepEsekh: gereeTokhirgoo?.guidliinKoepEsekh,
        bichiltKhonog: gereeTokhirgoo?.bichiltKhonog,

        udruurBodokhEsekh: gereeTokhirgoo?.udruurBodokhEsekh,

        jilBurTalbaiTulburNemekhEsekh:
          barilgaTokhirgoo?.jilBurTalbaiTulburNemekhEsekh,
        jilBurTulbur: barilgaTokhirgoo?.jilBurTulbur,
        gereeDuusakhTalbaiTulburNemekhEsekh:
          barilgaTokhirgoo?.gereeDuusakhTalbaiTulburNemekhEsekh,
        gereeDuusakhTulbur: barilgaTokhirgoo?.gereeDuusakhTulbur,
        qpayShimtgelTusdaa: gereeTokhirgoo?.qpayShimtgelTusdaa,
      },
    };

    uilchilgee(token)
      .post("/baiguullagaTokhirgooZasya", payload)
      .then(({ data }) => {
        if (data === "Amjilttai") {
          notification.success({ message: t("Амжилттай засагдлаа") });
          baiguullagaMutate();
          setSongogdsonTsonkhniiIndex(3);
        }
      });
  };
  React.useEffect(() => {
    return () => {
      if (tamga?.url) URL.revokeObjectURL(tamga.url);
      if (gariinUseg?.url) URL.revokeObjectURL(gariinUseg.url);
      if (gariinUseg1?.url) URL.revokeObjectURL(gariinUseg1.url);
    };
  }, [tamga, gariinUseg, gariinUseg1]);

  function khadgalakh() {
    const index = baiguullaga.barilguud.findIndex((a) => a._id === barilgiinId);

    if (deleteTamga) {
      baiguullaga.barilguud[index].tamga = null;
    } else if (tamga) {
      baiguullaga.barilguud[index].tamga = tamga.id || tamga;
    }

    if (deleteGariinUseg) {
      baiguullaga.barilguud[index].gariinUseg = null;
    } else if (gariinUseg) {
      baiguullaga.barilguud[index].gariinUseg = gariinUseg.id || gariinUseg;
    }

    if (deleteGariinUseg1) {
      baiguullaga.barilguud[index].gariinUseg1 = null;
    } else if (gariinUseg1) {
      baiguullaga.barilguud[index].gariinUseg1 = gariinUseg1.id || gariinUseg1;
    }

    if (!!barilgaTokhirgoo) {
      baiguullaga.barilguud[index].tokhirgoo.jilBurTalbaiTulburNemekhEsekh =
        barilgaTokhirgoo?.jilBurTalbaiTulburNemekhEsekh;
      baiguullaga.barilguud[index].tokhirgoo.jilBurTulbur =
        barilgaTokhirgoo?.jilBurTulbur;
      baiguullaga.barilguud[
        index
      ].tokhirgoo.gereeDuusakhTalbaiTulburNemekhEsekh =
        barilgaTokhirgoo?.gereeDuusakhTalbaiTulburNemekhEsekh;
      baiguullaga.barilguud[index].tokhirgoo.gereeDuusakhTulbur =
        barilgaTokhirgoo?.gereeDuusakhTulbur;
    }
    _.set(baiguullaga, `barilguud.${index}`, baiguullaga.barilguud[index]);
    updateMethod("baiguullaga", token, baiguullaga).then(({ data }) => {
      if (data === "Amjilttai") {
        notification.success({ message: t("Амжилттай хадгаллаа") });
        baiguullagaMutate();
        setSongogdsonTsonkhniiIndex(3);

        setDeleteTamga(false);
        setDeleteGariinUseg(false);
        setDeleteGariinUseg1(false);
      } else notification.warning({ message: t("Алдаа гарлаа") });
    });
  }

  function tamgaZuragKharakh(e, turul, id) {
    setKharakhZurgiinZam(`zuragAvya/${turul}/${baiguullaga?._id}/${id}`);
    e.preventDefault();
    e.stopPropagation();
  }

  function gariinUsegKharakh(e, turul, id) {
    setGariinUsegKharakhZam(`zuragAvya/${turul}/${baiguullaga?._id}/${id}`);
    e.preventDefault();
    e.stopPropagation();
  }

  const shouldShowTamga = () => {
    return tamga || (barilga?.tamga && !deleteTamga);
  };

  const shouldShowGariinUseg = () => {
    return gariinUseg || (barilga?.gariinUseg && !deleteGariinUseg);
  };

  const shouldShowGariinUseg1 = () => {
    return gariinUseg1 || (barilga?.gariinUseg1 && !deleteGariinUseg1);
  };

  return (
    <>
      <div className="col-span-12 grid grid-cols-1 xl:grid-cols-3 xl:gap-5">
        <div className="box relative col-span-2 mt-5 pb-20">
          <div className="dark:border-dark-5 flex items-center border-b border-gray-200 px-5 pb-2 pt-5">
            <h2 className="mr-auto text-base font-medium dark:text-gray-200">
              {t("Нийтээр тохируулах")}
            </h2>
          </div>
          <div className="box">
            <div className="flex items-center p-5">
              <div className="border-l-2 border-green-500 pl-4">
                <div className="font-medium">
                  {t("Гэрээ автоматаар сунгах")}
                </div>
                <div className="text-gray-600"></div>
              </div>
              <div className="ml-auto">
                <Switch
                  defaultChecked={
                    baiguullaga?.tokhirgoo?.gereeAvtomataarSungakhEsekh
                  }
                  onChange={(v) =>
                    setGereeTokhirgoo((a) => ({
                      ...(a || {}),
                      gereeAvtomataarSungakhEsekh: v,
                    }))
                  }
                />
              </div>
            </div>
          </div>
          <div className="box">
            <div className="flex items-center p-5">
              <div className="border-l-2 border-green-500 pl-4">
                <div className="font-medium">
                  {t("Гэрээ нийтээр засвар оруулах")}
                </div>
                <div className="text-gray-600"></div>
              </div>
              <div className="ml-auto">
                <Switch
                  defaultChecked={
                    baiguullaga?.tokhirgoo
                      ?.bukhAjiltanGereendZasvarOruulakhEsekh
                  }
                  onChange={(v) =>
                    setGereeTokhirgoo((a) => ({
                      ...(a || {}),
                      bukhAjiltanGereendZasvarOruulakhEsekh: v,
                    }))
                  }
                />
              </div>
            </div>
          </div>
          <div className="box">
            <div className="flex items-center p-5">
              <div className="border-l-2 border-green-500 pl-4">
                <div className="font-medium">
                  {t("Гэрээний түрээсийн үнэ тогтмол төлбөр нэмэх эсэх")}
                </div>
                <div className="text-gray-600">
                  {t(
                    "Урт хугацааны гэрээтэй үед автоматаар жил бүр сарын талбайн төлбөр идэвхжүүлэх эсэх"
                  )}{" "}
                </div>
              </div>
              <div className="ml-auto">
                <Switch
                  defaultChecked={
                    barilga?.tokhirgoo?.jilBurTalbaiTulburNemekhEsekh
                  }
                  onChange={(v) =>
                    setBarilgaTokhirgoo((a) => ({
                      ...(a || {}),
                      jilBurTalbaiTulburNemekhEsekh: v,
                    }))
                  }
                />
              </div>
            </div>
          </div>
          {barilgaTokhirgoo?.jilBurTalbaiTulburNemekhEsekh ? (
            <div className="box">
              <div className="flex items-center p-5">
                <div className="border-l-2 border-green-500 pl-4">
                  <div className="font-medium">
                    {t("Урт хугацааны гэрээтэй үед төлбөр оруулах")}
                  </div>
                  <div className="text-gray-600">{t("")}</div>
                </div>
                <div className="ml-auto">
                  <InputNumber
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                    style={{ width: "100%", textAlign: "center" }}
                    min={0}
                    defaultValue={barilga?.tokhirgoo?.jilBurTulbur}
                    onChange={(v) =>
                      setBarilgaTokhirgoo((a) => ({
                        ...(a || {}),
                        jilBurTulbur: v,
                      }))
                    }
                  />
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
          <div className="box">
            <div className="flex items-center p-5">
              <div className="border-l-2 border-green-500 pl-4">
                <div className="font-medium">
                  {t(
                    "Гэрээ дуусах үед түрээсийн үнэ тогтмол төлбөр нэмэх эсэх"
                  )}
                </div>
                <div className="text-gray-600">
                  {t(
                    "Гэрээ дуусах үед автоматаар жил бүр сарын талбайн төлбөр идэвхжүүлэх эсэх"
                  )}{" "}
                </div>
              </div>
              <div className="ml-auto">
                <Switch
                  defaultChecked={
                    barilga?.tokhirgoo?.gereeDuusakhTalbaiTulburNemekhEsekh
                  }
                  onChange={(v) =>
                    setBarilgaTokhirgoo((a) => ({
                      ...(a || {}),
                      gereeDuusakhTalbaiTulburNemekhEsekh: v,
                    }))
                  }
                />
              </div>
            </div>
          </div>
          {barilgaTokhirgoo?.gereeDuusakhTalbaiTulburNemekhEsekh ? (
            <div className="box">
              <div className="flex items-center p-5">
                <div className="border-l-2 border-green-500 pl-4">
                  <div className="font-medium">
                    {t("Гэрээ дуусах үед төлбөр оруулах")}
                  </div>
                  <div className="text-gray-600">{t("")}</div>
                </div>
                <div className="ml-auto">
                  <InputNumber
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                    style={{ width: "100%", textAlign: "center" }}
                    min={0}
                    defaultValue={barilga?.tokhirgoo?.gereeDuusakhTulbur}
                    onChange={(v) =>
                      setBarilgaTokhirgoo((a) => ({
                        ...(a || {}),
                        gereeDuusakhTulbur: v,
                      }))
                    }
                  />
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
          <div className="box">
            <div className="flex items-center p-5">
              <div className="border-l-2 border-green-500 pl-4">
                <div className="font-medium">{t("Барьцаа авах /сараар/")}</div>
                <div className="text-gray-600">
                  {t("Гэрээ байгуулсны дараа сараар тооцож барьцаа авна")}
                </div>
              </div>
              <div className="ml-auto">
                <InputNumber
                  min={0}
                  defaultValue={baiguullaga?.tokhirgoo?.baritsaaAvakhSar}
                  onChange={(v) =>
                    setGereeTokhirgoo((a) => ({
                      ...(a || {}),
                      baritsaaAvakhSar: v,
                    }))
                  }
                />
              </div>
            </div>
          </div>
          <div className="box">
            <div className="flex items-center p-5">
              <div className="border-l-2 border-green-500 pl-4">
                <div className="font-medium">
                  {t("Барьцаа хөрөнгө авах эсэх")}
                </div>
                <div className="text-gray-600">
                  {t("Гэрээ байгуулахад барьцаа хөрөнгө авах эсэх")}
                </div>
              </div>
              <div className="ml-auto">
                <Switch
                  defaultChecked={baiguullaga?.tokhirgoo?.baritsaaAvakhEsekh}
                  onChange={(v) =>
                    setGereeTokhirgoo((a) => ({
                      ...(a || {}),
                      baritsaaAvakhEsekh: v,
                    }))
                  }
                />
              </div>
            </div>
          </div>
          <div className="box">
            <div className="flex items-center p-5">
              <div className="border-l-2 border-green-500 pl-4">
                <div className="font-medium">
                  {t("Гэрээнд 'Акт' ашиглах эсэх")}
                </div>
                <div className="text-gray-600">
                  {t("Гэрээнд дуусах үед хүлээлцэх актыг идэвхжүүлэх")}
                </div>
              </div>
              <div className="ml-auto">
                <Switch
                  defaultChecked={baiguullaga?.tokhirgoo?.aktAshiglakhEsekh}
                  onChange={(v) =>
                    setGereeTokhirgoo((a) => ({
                      ...(a || {}),
                      aktAshiglakhEsekh: v,
                    }))
                  }
                />
              </div>
            </div>
          </div>
          <div className="box">
            <div className="flex items-center p-5">
              <div className="border-l-2 border-green-500 pl-4">
                <div className="font-medium">
                  {t("Цахилгааны тооцоололд ашиглах эсэх")}
                </div>
                <div className="text-gray-600">
                  {t("Гүйдлийн коэффициент болон бичилтийн хоног идэвхжүүлэх")}
                </div>
              </div>
              <div className="ml-auto">
                <Switch
                  defaultChecked={
                    baiguullaga?.tokhirgoo?.guidelBuchiltKhonogEsekh
                  }
                  onChange={(v) =>
                    setGereeTokhirgoo((a) => ({
                      ...(a || {}),
                      guidelBuchiltKhonogEsekh: v,
                      bichiltKhonog: v ? 30 : 0,
                    }))
                  }
                />
              </div>
            </div>
          </div>
          {gereeTokhirgoo?.guidelBuchiltKhonogEsekh && (
            <div className="box">
              <div className="flex items-center p-5">
                <div className="border-l-2 border-green-500 pl-4">
                  <div className="font-medium">
                    {t("Цахилгааны тооцоололд ашиглах эсэх")}
                  </div>
                  <div className="text-gray-600">
                    {t("Тухайн сарын бичилтийн хоног тохируулах")}
                  </div>
                </div>
                <div className="ml-auto">
                  <InputNumber
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                    style={{ width: "100%", textAlign: "center" }}
                    value={gereeTokhirgoo?.bichiltKhonog}
                    onChange={(v) =>
                      setGereeTokhirgoo((a) => ({
                        ...(a || {}),
                        bichiltKhonog: v,
                      }))
                    }
                    min={0}
                  />
                </div>
              </div>
              <div className="flex items-center p-5">
                <div className="border-l-2 border-green-500 pl-4">
                  <div className="font-medium">
                    {t("Цахилгааны тооцоололд ашиглах эсэх")}
                  </div>
                  <div className="text-gray-600">
                    {t("Сэх дэмжих төлбөр идэвхжүүлэх")}
                  </div>
                </div>
                <div className="ml-auto">
                  <Switch
                    defaultChecked={
                      baiguullaga?.tokhirgoo?.sekhDemjikhTulburAvakhEsekh
                    }
                    onChange={(v) =>
                      setGereeTokhirgoo((a) => ({
                        ...(a || {}),
                        sekhDemjikhTulburAvakhEsekh: v,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="flex items-center p-5">
                <div className="border-l-2 border-green-500 pl-4">
                  <div className="font-medium">
                    {t("Цахилгааны тооцоололд ашиглах эсэх")}
                  </div>
                  <div className="text-gray-600">
                    {t("Гүйдлийн коэффициент 23.79")}
                  </div>
                </div>
                <div className="ml-auto">
                  <Switch
                    defaultChecked={baiguullaga?.tokhirgoo?.guidliinKoepEsekh}
                    onChange={(v) =>
                      setGereeTokhirgoo((a) => ({
                        ...(a || {}),
                        guidliinKoepEsekh: v,
                      }))
                    }
                  />
                </div>
              </div>
            </div>
          )}
          <div className="box">
            <div className="flex items-center p-5">
              <div className="border-l-2 border-green-500 pl-4">
                <div className="font-medium">
                  {t("Цуцлах үед өдрөөр тооцоололд ашиглах эсэх")}
                </div>
                <div className="text-gray-600">
                  {t("Гэрээ цуцлах үед өдрөөр тооцоолол идэвхжүүлэх")}
                </div>
              </div>
              <div className="ml-auto">
                <Switch
                  defaultChecked={baiguullaga?.tokhirgoo?.udruurBodokhEsekh}
                  onChange={(v) =>
                    setGereeTokhirgoo((a) => ({
                      ...(a || {}),
                      udruurBodokhEsekh: v,
                    }))
                  }
                />
              </div>
            </div>
          </div>
          <div className="box">
            <div className="flex items-center p-5">
              <div className="border-l-2 border-green-500 pl-4">
                <div className="font-medium">
                  {t("Талбайн үнэ засах үед барьцаа дүн өөрчлөх эсэх")}
                </div>
                <div className="text-gray-600">
                  {t(
                    "Талбайн үнэ засах үед түрээсийн үнэ барьцаа үнэтэй адилтгах идэвхжүүлэх"
                  )}
                </div>
              </div>
              <div className="ml-auto">
                <Switch
                  defaultChecked={
                    baiguullaga?.tokhirgoo?.baritsaaUneAdiltgakhEsekh
                  }
                  onChange={(v) =>
                    setGereeTokhirgoo((a) => ({
                      ...(a || {}),
                      baritsaaUneAdiltgakhEsekh: v,
                    }))
                  }
                />
              </div>
            </div>
          </div>
          <div className="box">
            <div className="flex items-center p-5">
              <div className="border-l-2 border-green-500 pl-4">
                <div className="font-medium">
                  {t("QPAY шимтгэл 300₮ нэмж нэхэмжлэх эсэх")}
                </div>
                <div className="text-gray-600">
                  {t("QPAY шимтгэл 300₮ -г үндсэн дүн дээр нэмж нэхэмжилнэ.")}
                </div>
              </div>
              <div className="ml-auto">
                <Switch
                  defaultChecked={baiguullaga.tokhirgoo?.qpayShimtgelTusdaa}
                  onChange={(v) =>
                    setGereeTokhirgoo((a) => ({
                      ...(a || {}),
                      qpayShimtgelTusdaa: v,
                    }))
                  }
                />
              </div>
            </div>
          </div>
          <div
            className={`dark:border-dark-5 absolute bottom-5 right-1 flex items-center justify-end border-gray-200 px-5 pb-2 pt-2 ${
              !!gereeTokhirgoo ? "flex" : "hidden"
            }`}
          >
            <div className="dark:border-dark-5 absolute bottom-5 right-1 flex items-center justify-end border-gray-200 px-5 pb-2 pt-2">
              <Button onClick={gereeTokhirgooKhadgalya} type="primary">
                {t("Хадгалах")}
              </Button>
            </div>
          </div>
        </div>

        <div className="box relative mt-5 pb-10 lg:mt-5">
          <div className="dark:border-dark-5 flex items-center border-b border-gray-200 px-5 pb-5 pt-5">
            <h2 className="mr-auto text-base font-medium dark:text-gray-200">
              {t("Тамга болон гарын үсэг")}
            </h2>
          </div>
          <div className="flex justify-between p-5 ">
            <div>
              <Form form={form} autoComplete="off" className="">
                <div className="flex w-full flex-col ">
                  <Form.Item name="turul">
                    <div className="flex flex-row items-center gap-2">
                      {!!barilga?.tamga && !deleteTamga && (
                        <Button
                          icon={<EyeOutlined />}
                          onClick={(e) =>
                            tamgaZuragKharakh(e, "tamga", barilga.tamga)
                          }
                          className="h-9 !text-gray-500 dark:!border-white dark:!bg-gray-800 dark:!text-gray-400"
                          type="button"
                        >
                          {t("Тамга зураг харах")}
                        </Button>
                      )}

                      <ImgCrop modalTitle="Зураг засах" rotationSlider>
                        <Upload
                          showUploadList={false}
                          multiple={false}
                          name="file"
                          action={`${url}/zuragKhadgalya`}
                          method="POST"
                          data={{
                            turul: "tamga",
                            baiguullagiinId: baiguullaga?._id,
                          }}
                          headers={{ Authorization: `bearer ${token}` }}
                          onChange={(v) => zuragKhadgalakh(v, "tamga")}
                        >
                          <div className="flex flex-row items-center gap-2">
                            {!shouldShowTamga() && (
                              <Button icon={<UploadOutlined />} className="h-9">
                                {t("Тамга зураг оруулах")}
                              </Button>
                            )}

                            {shouldShowTamga() && (
                              <Button
                                icon={<EditOutlined />}
                                className="h-9 !text-gray-500 dark:!border-white dark:!bg-gray-800 dark:!text-gray-400"
                                type="button"
                              />
                            )}
                          </div>
                        </Upload>
                      </ImgCrop>

                      {shouldShowTamga() && (
                        <Button
                          danger
                          icon={<DeleteOutlined />}
                          onClick={handleTamgaDelete}
                          className="h-9"
                          type="button"
                        />
                      )}
                    </div>
                  </Form.Item>

                  {shouldShowTamga() && (
                    <div className="h-[54px] w-[115px] border">
                      {!!tamga ? (
                        <>
                          <img
                            src={
                              tamga.url ||
                              `${url}/zuragAvya/tamga/${baiguullaga?._id}/${
                                tamga.id || tamga
                              }`
                            }
                            alt="image"
                            style={{
                              height: "50px",
                              width: "115px",
                              objectFit: "contain",
                            }}
                          />
                        </>
                      ) : (
                        barilga?.tamga &&
                        !deleteTamga && (
                          <>
                            <img
                              src={`${url}/zuragAvya/tamga/${baiguullaga?._id}/${barilga.tamga}`}
                              alt="image"
                              style={{
                                height: "50px",
                                width: "115px",
                                objectFit: "contain",
                              }}
                            />
                          </>
                        )
                      )}
                    </div>
                  )}
                </div>
                <div className="mt-3 flex w-full flex-col">
                  <Form.Item name="turul">
                    <div className="flex flex-row items-center gap-2">
                      <ImgCrop
                        modalTitle="Зураг засах"
                        rotationSlider
                        quality={1}
                        fillColor="transparent"
                        modalProps={{
                          maskClosable: false,
                        }}
                      >
                        <Upload
                          showUploadList={false}
                          multiple={false}
                          name="file"
                          action={`${url}/zuragKhadgalya`}
                          method="POST"
                          data={{
                            turul: "gariinUseg",
                            baiguullagiinId: baiguullaga?._id,
                          }}
                          headers={{ Authorization: `bearer ${token}` }}
                          onChange={(v) => zuragKhadgalakh(v, "gariinUseg")}
                        >
                          <Button
                            className="h-9 !text-gray-400 dark:!border-white dark:!bg-gray-800 dark:!text-gray-400"
                            icon={<UploadOutlined />}
                          >
                            {t("Гарын үсэг зураг оруулах")}
                          </Button>
                        </Upload>
                      </ImgCrop>

                      {shouldShowGariinUseg() && (
                        <Button
                          danger
                          multiple={true}
                          icon={<DeleteOutlined />}
                          type="button"
                          onClick={handleGariinUsegDelete}
                          className="h-9"
                        />
                      )}
                    </div>
                  </Form.Item>

                  {shouldShowGariinUseg() && (
                    <div className="flex h-[54px] w-[115px] items-center justify-center border">
                      {!!gariinUseg ? (
                        <img
                          src={
                            gariinUseg.url ||
                            `${url}/zuragAvya/gariinUseg/${baiguullaga?._id}/${
                              gariinUseg.id || gariinUseg
                            }`
                          }
                          alt="image"
                          style={{
                            height: "50px",
                            width: "115px",
                            objectFit: "contain",
                          }}
                        />
                      ) : (
                        barilga?.gariinUseg &&
                        !deleteGariinUseg && (
                          <img
                            src={`${url}/zuragAvya/gariinUseg/${baiguullaga?._id}/${barilga.gariinUseg}`}
                            alt="image"
                            style={{
                              height: "50px",
                              width: "115px",
                              objectFit: "contain",
                            }}
                          />
                        )
                      )}
                    </div>
                  )}
                  <br></br>
                  <Form.Item name="turul">
                    <div className="flex flex-row items-center gap-2">
                      <ImgCrop
                        modalTitle="Зураг засах"
                        rotationSlider
                        quality={1}
                        fillColor="transparent"
                        modalProps={{
                          maskClosable: false,
                        }}
                      >
                        <Upload
                          showUploadList={false}
                          multiple={false}
                          name="file"
                          action={`${url}/zuragKhadgalya`}
                          method="POST"
                          data={{
                            turul: "gariinUseg1",
                            baiguullagiinId: baiguullaga?._id,
                          }}
                          headers={{ Authorization: `bearer ${token}` }}
                          onChange={(v) => zuragKhadgalakh(v, "gariinUseg1")}
                          accept="image/jpeg,image/jpg,image/png"
                        >
                          <Button
                            className="h-9 !text-gray-400 dark:!border-white dark:!bg-gray-800 dark:!text-gray-400"
                            icon={<UploadOutlined />}
                          >
                            {t("Гарын үсэг зураг оруулах")}
                          </Button>
                        </Upload>
                      </ImgCrop>

                      {shouldShowGariinUseg1() && (
                        <Button
                          danger
                          multiple={true}
                          icon={<DeleteOutlined />}
                          type="button"
                          onClick={handleGariinUseg1Delete}
                          className="h-9"
                        />
                      )}
                    </div>
                  </Form.Item>

                  {shouldShowGariinUseg1() && (
                    <div className="flex h-[54px] w-[115px] items-center justify-center border">
                      {!!gariinUseg1 ? (
                        <img
                          src={
                            gariinUseg1.url ||
                            `${url}/zuragAvya/gariinUseg1/${baiguullaga?._id}/${
                              gariinUseg1.id || gariinUseg1
                            }`
                          }
                          alt="image"
                          style={{
                            height: "50px",
                            width: "115px",
                            objectFit: "contain",
                          }}
                        />
                      ) : (
                        barilga?.gariinUseg1 &&
                        !deleteGariinUseg1 && (
                          <img
                            src={`${url}/zuragAvya/gariinUseg1/${baiguullaga?._id}/${barilga.gariinUseg1}`}
                            alt="image"
                            style={{
                              height: "50px",
                              width: "115px",
                              objectFit: "contain",
                            }}
                          />
                        )
                      )}
                    </div>
                  )}
                </div>
              </Form>

              <Image
                width={200}
                preview={{
                  visible: !!kharakhZurgiinZam,
                  src: `${url}/${kharakhZurgiinZam}`,
                  onVisibleChange: (value) => {
                    setKharakhZurgiinZam(undefined);
                  },
                }}
              />
              <Image
                width={200}
                preview={{
                  visible: !!gariinUsegKharakhZam,
                  src: `${url}/file?path=${gariinUsegKharakhZam}`,
                  onVisibleChange: (value) => {
                    setGariinUsegKharakhZam(undefined);
                  },
                }}
              />
            </div>
          </div>
          <div className="absolute bottom-3 right-2 flex w-full justify-end px-3 pb-3">
            <Button onClick={khadgalakh} type="primary">
              {t("Хадгалах")}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default KhuviinMedeelel;
