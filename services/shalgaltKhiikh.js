import { parseCookies } from "nookies";
import _ from "lodash";
import erkhteiEsekh from "tools/function/erkhteiEsekh";
import { undsenKhuudasOlyo } from "tools/logic/khereglegchiinErkhiinTokhirgoo";

const redirectToLogin = {
  redirect: {
    destination: "/",
    permanent: false,
  },
  props: {},
};

const shalgaltKhiikh = async (ctx, ugudulAvchirya) => {
  const session = parseCookies(ctx);
  const token = session?.tureestoken;

  if (!token) {
    return redirectToLogin;
  }

  let data = null;
  let dataFallback = false;

  if (_.isFunction(ugudulAvchirya)) {
    try {
      data = await ugudulAvchirya(ctx, session);
    } catch (error) {
      // Allow offline refreshes to continue when data prefetch fails
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        return redirectToLogin;
      }
      dataFallback = true;
    }
  }

  let erkh = true;
  let erkhFallback = false;

  try {
    erkh = await erkhteiEsekh(token, undsenKhuudasOlyo(ctx.resolvedUrl));
  } catch (error) {
    // If backend is unreachable (offline), skip redirect and let the client continue with the cookie
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      return redirectToLogin;
    }
    erkhFallback = true;
    erkh = true;
  }

  if (!erkh && "/khyanalt/tokhirgoo" !== ctx.resolvedUrl) {
    return { notFound: true };
  }

  return {
    props: {
      token,
      data,
      offlineFallback: erkhFallback || dataFallback,
    },
  };
};

export default shalgaltKhiikh;
