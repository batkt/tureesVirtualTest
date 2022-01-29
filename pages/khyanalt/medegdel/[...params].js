import { useRouter } from 'next/dist/client/router';
import React from 'react';
import Admin from "components/Admin"
function index() {
    const router = useRouter()
    const {params=[]} = router.query
    console.log(router.query)
  return (
    <Admin dedKhuudas title="Мэдэгдэл" khuudasniiNer="medegdel" className="p-0 md:p-4" onSearch={(search) => setKhuudaslalt && setKhuudaslalt(a=>({...a,search}))}>
      {params[0]}/{params[1]}
    </Admin>
  );
}

export default index;
