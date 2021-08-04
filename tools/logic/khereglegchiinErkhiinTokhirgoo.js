import { useRouter } from "next/router"

const khereglegchiinErkh = [
  {
    erkh: "Admin",
    tsonkhnuud: ["/khyanalt/gereeBurtgel", "/khyanalt/gereeBaiguulakh"]
  }
]

export function ekhniiTsonkhruuOchyo(erkh, zam = "") {
  switch (erkh) {
    case "Admin":
      window.location.href = "/khyanalt/gereeBurtgel"
      break
    default:
      break
  }
}

const khuudasnuud = [
  {
    ner: "Гэрээний жагсаалт",
    khuudasniiNer: "gereeBurtgel",
    href: "/khyanalt/gereeBurtgel"
  },
  {
    ner: "Гэрээ байгуулах",
    khuudasniiNer: "gereeBaiguulakh",
    href: "/khyanalt/gereeBaiguulakh"
  },
  {
    ner: "Харилцагчийн жагсаалт",
    khuudasniiNer: "gereeBurtgel",
    href: "/khyanalt/gereeBurtgel"
  },
  {
    ner: "Ажилчдын бүртгэл",
    khuudasniiNer: "gereeBurtgel",
    href: "/khyanalt/gereeBurtgel"
  },
  {
    ner: "Тайлан",
    khuudasniiNer: "gereeBurtgel",
    href: "/khyanalt/gereeBurtgel"
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
