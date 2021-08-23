import { parseCookies } from "nookies";
import _ from "lodash";
const shalgaltKhiikh = async (ctx,ugudulAvchirya) => {
  try {
    let session = await parseCookies(ctx)
    let data = null
    if(_.isFunction(ugudulAvchirya))
      data = await ugudulAvchirya(ctx,session)
    if (!session.tureestoken)
      throw new Error('aldaa')
    return {
      props: { token: session.tureestoken ,data},
    };
  } catch (error) {
    console.log(error)
    // ctx.res.writeHead(302, { location: "/" })
    // ctx.res.end()
    return { props: {} }
  }
};

export default shalgaltKhiikh