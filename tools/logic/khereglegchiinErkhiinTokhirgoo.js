import { useRouter } from "next/router";

const khereglegchiinErkh = [
  {
    erkh: "Admin",
    tsonkhnuud: [
      "/khyanalt/geree",
      "/khyanalt/ajiltan/ajiltanBurtgel",
      "/khyanalt/barilgaBurtgel",
      "/khyanalt/khariltsagchBurtgel",
      "khyanalt/talbaiBurtgel",
      "khyanalt/tailan",
      "khyanalt/tulburTootsoo",
      "khyanalt/tokhirgoo",
      "khyanalt/zogsool",
    ],
  },
  {
    erkh: "ZokhionBaiguulagch",
    tsonkhnuud: [
      "/khyanalt/geree",
      "/khyanalt/ajiltan/ajiltanBurtgel",
      "/khyanalt/barilgaBurtgel",
      "/khyanalt/khariltsagchBurtgel",
      "khyanalt/talbaiBurtgel",
      "khyanalt/tailan",
      "khyanalt/tokhirgoo",
    ],
  },
  {
    erkh: "Sankhuu",
    tsonkhnuud: [
      "/khyanalt/geree",
      "/khyanalt/ajiltan/ajiltanBurtgel",
      "/khyanalt/barilgaBurtgel",
      "/khyanalt/khariltsagchBurtgel",
      "khyanalt/talbaiBurtgel",
      "khyanalt/tailan",
      "khyanalt/tokhirgoo",
    ],
  },
];

export function ekhniiTsonkhruuOchyo(erkh, zam = "") {
  switch (erkh) {
    case "Admin":
    case "Sankhuu":
    case "ZokhionBaiguulagch":
      window.location.href = "/khyanalt/geree/gereeBurtgel";
      break;
    default:
      break;
  }
}

const khuudasnuud = [
  {
    ner: "Гэрээ",
    khuudasniiNer: "geree",
    href: "/khyanalt/geree",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="feather feather-file-text"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
      </svg>
    ),
    sub: [
      {
        ner: "Гэрээний жагсаалт",
        khuudasniiNer: "gereeBurtgel",
        href: "/khyanalt/geree/gereeBurtgel",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="feather feather-file-text"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
        ),
      },
      {
        ner: "Гэрээ байгуулах",
        khuudasniiNer: "gereeBaiguulakh",
        href: "/khyanalt/geree/gereeBaiguulakh",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="feather feather-edit"
          >
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        ),
      },
      {
        ner: "Гэрээний загвар",
        khuudasniiNer: "gereeniiZagvar",
        href: "/khyanalt/geree/zagvar",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="feather feather-file-text"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
        ),
      },
    ],
  },

  {
    ner: "Байгууллага бүртгэл",
    khuudasniiNer: "barilgaBurtgel",
    href: "/khyanalt/barilgaBurtgel",
    icon: (
      <svg
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
        />
      </svg>
    ),
  },
  {
    ner: "Талбай бүртгэл",
    khuudasniiNer: "talbaiBurtgekh",
    href: "/khyanalt/talbaiBurtgel/talbaiBurtgekh",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="currentColor"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {" "}
        <path stroke="none" d="M0 0h24v24H0z" />{" "}
        <rect x="3" y="4" width="18" height="16" rx="3" />{" "}
        <circle cx="9" cy="10" r="2" /> <line x1="15" y1="8" x2="17" y2="8" />{" "}
        <line x1="15" y1="12" x2="17" y2="12" />{" "}
        <line x1="7" y1="16" x2="17" y2="16" />
      </svg>
    ),
  },
  {
    ner: "Ажилтан бүртгэл",
    khuudasniiNer: "ajiltanBurtgel",
    href: "/khyanalt/ajiltan/ajiltanBurtgel",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="feather feather-users"
      >
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
    ),
  },
  {
    ner: "Харилцагч жагсаалт",
    khuudasniiNer: "khariltsagchBurtgel",
    href: "/khyanalt/khariltsagchBurtgel",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {" "}
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />{" "}
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    ner: "Тайлан",
    khuudasniiNer: "tailan",
    href: "/khyanalt/tailan",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="currentColor"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {" "}
        <path stroke="none" d="M0 0h24v24H0z" />{" "}
        <path d="M10 3.2a9 9 0 1 0 10.8 10.8a1 1 0 0 0 -1 -1h-6.8a2 2 0 0 1 -2 -2v-7a.9 .9 0 0 0 -1 -.8" />{" "}
        <path d="M15 3.5a9 9 0 0 1 5.5 5.5h-4.5a1 1 0 0 1 -1 -1v-4.5" />
      </svg>
    ),
  },
  {
    ner: "Төлбөр тооцоо",
    khuudasniiNer: "tulburTootsoo",
    href: "/khyanalt/tulburTootsoo",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="12" y1="1" x2="12" y2="23"></line>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
      </svg>
    ),
  },
  {
    ner: "Зогсоол",
    khuudasniiNer: "zogsool",
    href: "/khyanalt/zogsool",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="1" y="3" width="15" height="13"></rect>
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
        <circle cx="5.5" cy="18.5" r="2.5"></circle>
        <circle cx="18.5" cy="18.5" r="2.5"></circle>
      </svg>
    ),
  },
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

export default useErkh;
