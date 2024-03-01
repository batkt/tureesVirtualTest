import React, {
  useState,
  useContext,
  createContext,
  useMemo,
  useEffect,
} from "react";
import { message } from "antd";
import { setCookie, parseCookies } from "nookies";
import uilchilgee, { aldaaBarigch } from "./uilchilgee";
import { ekhniiTsonkhruuOchyo } from "tools/logic/khereglegchiinErkhiinTokhirgoo";
import useAjiltan from "hooks/useAjiltan";
import useBaiguullaga from "hooks/useBaiguullaga";
import { t } from "i18next";
import { useTranslation } from "react-i18next";
import moment from "moment";
const AuthContext = createContext({});

export const useBarilga = () => {
  const [barilgiinId, setBarilgiinId] = useState(null);

  useEffect(async () => {
    const { barilgiinId } = await parseCookies();
    if (barilgiinId && barilgiinId !== "undefined") setBarilgiinId(barilgiinId);
  }, []);

  const barilgaSoliyo = (id, ajiltan) => {
    const tukhainBarilga = ajiltan?.salbaruud?.find(
      (salbar) => salbar?.salbariinId === id
    );
    if (!tukhainBarilga && ajiltan?.erkh !== "Admin") {
      return message.warn("Ажилтанд барилгын тохиргоо хийгдээгүй байна");
    } else {
      if (
        moment(tukhainBarilga?.duusakhOgnoo)
          .startOf("day")
          .isBefore(moment().startOf("day"))
      ) {
        return message.warn("Тухайн барилгын лиценз дууссан байна");
      }
    } //guard clause oruulya
    setBarilgiinId(id);
    setCookie(null, "barilgiinId", id, {
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });
  };

  return { barilgiinId, barilgaSoliyo };
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const { ajiltan, ajiltanMutate } = useAjiltan(token);
  const [baiguulgiinErkhiinJagsaalt, setBaiguulgiinErkhiinJagsaalt] = useState(
    []
  );
  const { baiguullaga, baiguullagaMutate } = useBaiguullaga(
    token,
    ajiltan?.baiguullagiinId
  );
  const { barilgaSoliyo, barilgiinId } = useBarilga();

  const { t } = useTranslation();

  useEffect(() => {
    const d = parseCookies();
    setToken(d?.tureestoken);
    var erkh = localStorage.getItem("baiguulgiinErkhiinJagsaalt");
    setBaiguulgiinErkhiinJagsaalt(JSON.parse(erkh) || []);

    window.addEventListener("online", () =>
      message.success(t("Интернэтэд холбогдлоо"))
    );
    window.addEventListener("offline", () =>
      message.warning(t("Таны интернэт тасарсан байна"), 20)
    );
    return () => {
      window.removeEventListener("online", () =>
        message.success(t("Интернэтэд холбогдлоо"))
      );
      window.removeEventListener("offline", () =>
        message.warning(t("Таны интернэт тасарсан байна"), 20)
      );
    };
  }, []);

  const auth = useMemo(
    () => ({
      newterya: async (khereglech) => {
        if (!khereglech.nevtrekhNer) {
          message.warning(t("Нэвтрэх нэр талбарыг бөглөнө үү"));
          return;
        }
        if (!khereglech.nuutsUg) {
          message.warning(t("Нууц үг талбарыг бөглөнө үү"));
          return;
        }
        if (khereglech.namaigsana)
          localStorage.setItem("newtrekhNerTurees", khereglech.nevtrekhNer);

        uilchilgee()
          .post("/ajiltanNevtrey", khereglech)
          .then(({ data, status }) => {
            if (status === 200) {
              if (!!data) {
                uilchilgee(data.token)
                  .post("/erkhiinMedeelelAvya")
                  .then((res) => {
                    if (res.data && res.data?.moduluud?.length > 0) {
                      if (
                        data.result.erkh !== "Admin" &&
                        data.result.tsonkhniiErkhuud.length < 1
                      ) {
                        return message.error(
                          t("Хэрэглэгчийн эрхийн тохиргоо хийгдээгүй байна")
                        );
                      }
                      setCookie(null, "tureestoken", data.token, {
                        maxAge: 30 * 24 * 60 * 60,
                        path: "/",
                      });
                      setToken(data.token);
                      ajiltanMutate(data.result);
                      if (data?.result?.barilguud?.length > 0) {
                        let solikhBarilgaOldsonEsekh = false;
                        if (
                          Array.isArray(data?.result?.salbaruud) &&
                          data.result.erkh !== "Admin"
                        ) {
                          for (const salbar of data.result.salbaruud) {
                            for (const barilga of data.result.barilguud) {
                              if (salbar?.salbariinId === barilga) {
                                if (
                                  moment(salbar?.duusakhOgnoo)
                                    .startOf("day")
                                    .isAfter(moment().startOf("day"))
                                ) {
                                  solikhBarilgaOldsonEsekh = true;
                                  barilgaSoliyo(
                                    salbar?.salbariinId,
                                    data.result
                                  );
                                  break;
                                }
                              }
                            }
                            if (!solikhBarilgaOldsonEsekh) {
                              return message.warn(
                                t("Лицензийн хугацаа дууссан байна!")
                              );
                            }
                          }
                        } else {
                          barilgaSoliyo(data.result.barilguud[0], data.result);
                        }
                      }
                      ekhniiTsonkhruuOchyo(
                        data.result,
                        data.token,
                        setBaiguulgiinErkhiinJagsaalt
                      );
                    } else
                      message.error(
                        t("Байгууллагын эрхийн тохиргоо хийгдээгүй байна")
                      );
                  });
              } else message.error(t("Хэрэглэгчийн мэдээлэл буруу байна"));
            } else message.error(t("Хэрэглэгчийн мэдээлэл буруу байна"));
          })
          .catch(aldaaBarigch);
      },
      garya: () => {
        window.location.href = "/";
      },
      token,
      ajiltan,
      baiguullaga,
      baiguullagaMutate,
      ajiltanMutate,
      setToken,
      barilgaSoliyo,
      barilgiinId,
      baiguulgiinErkhiinJagsaalt,
    }),
    [token, ajiltan, baiguullaga, barilgiinId, baiguulgiinErkhiinJagsaalt]
  );

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
