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
const AuthContext = createContext({});

export const useBarilga = () => {
  const [barilgiinId, setBarilgiinId] = useState(null);

  useEffect(async () => {
    const { barilgiinId } = await parseCookies();
    if (barilgiinId && barilgiinId !== "undefined") setBarilgiinId(barilgiinId);
  }, []);

  const barilgaSoliyo = (id) => {
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
  const { baiguullaga, baiguullagaMutate } = useBaiguullaga(
    token,
    ajiltan?.baiguullagiinId
  );
  const { barilgaSoliyo, barilgiinId } = useBarilga();

  useEffect(() => {
    if (
      (!barilgiinId && !!baiguullaga?.barilguud) ||
      (!!barilgiinId &&
        !!baiguullaga &&
        !baiguullaga?.barilguud?.find((mur) => mur._id === barilgiinId))
    ) {
      barilgaSoliyo(_.get(baiguullaga, "barilguud.0._id"));
    }
  }, [barilgiinId, baiguullaga]);

  useEffect(() => {
    const t = parseCookies();
    setToken(t?.tureestoken);

    window.addEventListener("online", () =>
      message.success("Интернэт ертөнцөд тавтай морил")
    );
    window.addEventListener("offline", () =>
      message.warning("Таны интернэт тасарсан байна")
    );
    return () => {
      window.removeEventListener("online", () =>
        message.success("Интернэт ертөнцөд тавтай морил")
      );
      window.removeEventListener("offline", () =>
        message.warning("Таны интернэт тасарсан байна")
      );
    };
  }, []);

  const auth = useMemo(
    () => ({
      newterya: async (khereglech) => {
        if (!khereglech.nevtrekhNer) {
          message.warning("Нэвтрэх нэр талбарыг бөглөнө үү");
          return;
        }
        if (!khereglech.nuutsUg) {
          message.warning("Нууц үг талбарыг бөглөнө үү");
          return;
        }
        if (khereglech.namaigsana)
          localStorage.setItem("newtrekhNerTurees", khereglech.nevtrekhNer);

        uilchilgee()
          .post("/ajiltanNevtrey", khereglech)
          .then(({ data, status }) => {
            if (status === 200) {
              if (!!data) {
                setCookie(null, "tureestoken", data.token, {
                  maxAge: 30 * 24 * 60 * 60,
                  path: "/",
                });
                setToken(data.token);
                ajiltanMutate(data.result);
                data?.result?.barilguud?.length > 0 &&
                  barilgaSoliyo(data.result.barilguud[0]);
                ekhniiTsonkhruuOchyo(data.result);
                message.success("Тавтай морил");
              } else message.error("Хэрэглэгчийн мэдээлэл буруу байна");
            } else message.error("Хэрэглэгчийн мэдээлэл буруу байна");
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
    }),
    [token, ajiltan, baiguullaga, barilgiinId]
  );

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
