import { parseCookies } from "nookies";
import _ from "lodash";
import erkhteiEsekh from 'tools/function/erkhteiEsekh'
import {undsenKhuudasOlyo} from 'tools/logic/khereglegchiinErkhiinTokhirgoo'

const shalgaltKhiikh = async (ctx,ugudulAvchirya) => {
  try {
    let session = await parseCookies(ctx)
    let data = null
    let erkh = null
    if(_.isFunction(ugudulAvchirya))
      data = await ugudulAvchirya(ctx,session)
    if(!!session?.tureestoken)
      erkh = await erkhteiEsekh(session?.tureestoken,undsenKhuudasOlyo(ctx.resolvedUrl))
    else
      throw new Error('aldaa')
    return {
      notFound: !erkh && '/khyanalt/tokhirgoo' !== ctx.resolvedUrl,
      props: { token: session.tureestoken ,data},
    };
  } catch (error) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }
};

export default shalgaltKhiikh