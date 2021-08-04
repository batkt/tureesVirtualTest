import { parseCookies } from "nookies";
const shalgaltKhiikh = async (ctx) => {
  try {
    let session = await parseCookies(ctx)
    if (!session.hitoken)
      throw new Error('aldaa')
    return {
      props: { token: session.hitoken },
    };
  } catch (error) {
    ctx.res.writeHead(302, { location: "/" })
    ctx.res.end()
    return { props: {} }
  }
};

export default shalgaltKhiikh