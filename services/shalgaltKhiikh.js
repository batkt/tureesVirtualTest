import { parseCookies } from "nookies";
const shalgaltKhiikh = async (ctx) => {
  try {
    let session = await parseCookies(ctx)
    if (!session.tureestoken)
      throw new Error('aldaa')
    return {
      props: { token: session.tureestoken },
    };
  } catch (error) {
    ctx.res.writeHead(302, { location: "/" })
    ctx.res.end()
    return { props: {} }
  }
};

export default shalgaltKhiikh