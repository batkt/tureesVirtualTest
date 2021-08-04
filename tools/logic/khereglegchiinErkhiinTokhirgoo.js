import { useRouter } from "next/router"

const khereglegchiinErkh = [
  {
    erkh: "Admin",
    tsonkhnuud: ["/khyanalt/geree/gereeBurtgel", "/khyanalt/geree/gereeBaiguulakh"]
  }
]

export function ekhniiTsonkhruuOchyo(erkh, zam = "") {
  switch (erkh) {
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
    ner: "Харилцагчийн жагсаалт",
    khuudasniiNer: "geree/gereeBurtgel",
    href: "/khyanalt/geree/gereeBurtgel"
  },
  {
    ner: "Ажилчдын бүртгэл",
    khuudasniiNer: "geree/gereeBurtgel",
    href: "/khyanalt/geree/gereeBurtgel"
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
  const erkh = khereglegchiinErkh.find((x) => x.erkh === ajiltan.erkh)
  if (!erkh || !erkh.tsonkhnuud.find((x) => !!router.pathname.includes(x))) {
    router.replace("/404")
    return []
  }
  return khuudasnuud.filter(
    (x) => !!erkh.tsonkhnuud.find((y) => x.href.includes(y))
  )
}

export default useErkh
