import { useRouter } from "next/router"

const khereglegchiinErkh = [
  {
    role: "Admin",
    tsonkhnuud: [
      "/khyanalt/geree/gereeBurtgel",
      "/khyanalt/geree/gereeBaiguulakh",
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
    href: "/khyanalt/geree/gereeBurtgel"
  },
  {
    ner: "Гэрээ байгуулах",
    khuudasniiNer: "gereeBaiguulakh",
    href: "/khyanalt/geree/gereeBaiguulakh"
  },
  {
    ner: "Харилцагч жагсаалт",
    khuudasniiNer: "geree/gereeBurtgel",
    href: "/khyanalt/geree/gereeBurtgel"
  },
  {
    ner: "Ажилтан бүртгэл",
    khuudasniiNer: "ajiltanBurtgel",
    href: "/khyanalt/ajiltan/ajiltanBurtgel"
  },
  {
    ner: "Тайлан",
    khuudasniiNer: "geree/gereeBurtgel",
    href: "/khyanalt/geree/gereeBurtgel"
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
