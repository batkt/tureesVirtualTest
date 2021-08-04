import { useRouter } from "next/router";

const khereglegchiinErkh = [
  {
    erkh: "Admin",
    tsonkhnuud: [
      "/khyanalt"
    ],
  }
];

export function ekhniiTsonkhruuOchyo(erkh, zam = '') {
  switch (erkh) {
    case "Admin":
      window.location.href = "/khyanalt";
      break;
    default:
      break;
  }
}

const khuudasnuud = [
  {
    ner: "Захиалгын хяналт",
    khuudasniiNer: "zakhialgiinKhyanalt",
    href: "/khyanalt",
  }
];

function useErkh(ajiltan) {
  const router = useRouter();
  if (!ajiltan) return [];
  const erkh = khereglegchiinErkh.find((x) => x.erkh === ajiltan.erkh);
  if (!erkh || !erkh.tsonkhnuud.find((x) => !!router.pathname.includes(x))) {
    router.replace("/404");
    return [];
  }
  return khuudasnuud.filter(
    (x) => !!erkh.tsonkhnuud.find((y) => x.href.includes(y))
  );
}

export default useErkh