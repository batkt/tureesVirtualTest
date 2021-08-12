import { useRouter } from "next/router"

const khereglegchiinErkh = [
  {
    role: "Admin",
    tsonkhnuud: [
      "/khyanalt/geree",
      "/khyanalt/ajiltan/ajiltanBurtgel"
    ]
  }
]

export function ekhniiTsonkhruuOchyo(role, zam = "") {
  switch (role) {
    case "Admin":
      window.location.href = "/khyanalt/geree/gereeBurtgel"
      break
    default:
      break
  }
}

const khuudasnuud = [
  {
    ner: "Гэрээний жагсаалт",
    khuudasniiNer: "gereeBurtgel",
    href: "/khyanalt/geree/gereeBurtgel",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-file-text"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
  },
  {
    ner: "Гэрээ байгуулах",
    khuudasniiNer: "gereeBaiguulakh",
    href: "/khyanalt/geree/gereeBaiguulakh",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-edit"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
  },
  {
    ner: "Гэрээний загвар",
    khuudasniiNer: "gereeniiZagvar",
    href: "/khyanalt/geree/zagvar",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-file-text"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
  },
  {
    ner: "Харилцагч жагсаалт",
    khuudasniiNer: "geree/gereeBurtgel",
    href: "/khyanalt/geree/gereeBurtgel",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-users"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
  },
  {
    ner: "Ажилтан бүртгэл",
    khuudasniiNer: "ajiltanBurtgel",
    href: "/khyanalt/ajiltan/ajiltanBurtgel",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-users"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
  },
  {
    ner: "Тайлан",
    khuudasniiNer: "geree/gereeBurtgel",
    href: "/khyanalt/geree/gereeBurtgel",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-file-text"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
  }
]

function useErkh(ajiltan) {
  const router = useRouter()
  if (!ajiltan) return []
  const role = khereglegchiinErkh.find((x) => x.role === ajiltan.role)
  if (!role || !role.tsonkhnuud.find((x) => !!router.pathname.includes(x))) {
    router.replace("/404")
    return []
  }
  return khuudasnuud.filter(
    (x) => !!role.tsonkhnuud.find((y) => x.href.includes(y))
  )
}

export default useErkh
