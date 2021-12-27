
export const tsonknuud = [
  {
    key: "/khyanalt/ajiltan/tokhirgoo",
    ner: "Ажилтанд эрх олгох",
    tailbar:"",
    tokhirgoo: [],
  },
  {
    key: "/khyanalt/geree/gereeBurtgel",
    ner: "Гэрээний жагсаалт",
    tailbar:
      "Нийт түрээслэгчтэй байгуулсан гэрээний төлөв хөтлөх, засвар оруулах, дэлгэрэнгүй мэдээллийг нь харах боломжтой\n",
    tokhirgoo: [],
  },
  {
    key: "/khyanalt/geree/gereeBaiguulakh",
    ner: "Гэрээ байгуулах",
    tailbar:
      "Шинээр харилцагчтай алхамын дагуу, нөхцлөө тохиролцон уян хатан байдлаар гэрээ байгуулах боломтой.",
    tokhirgoo: [],
  },
  {
    key: "/khyanalt/geree/zagvar",
    ner: "Гэрээний загвар",
    tailbar:
      "Байгууллага өөрсдийн үйлчилгээнд санал болгох гэрээний загваруудыг динамик хэлбэрээр оруулах боломжтой ба гэрээ байгуулах үед гэрээний загвар сонгож дуусгасны дараа систем тухайн гэрээний нөхцлийн дагуу хугацаа, төлбөр гэх мэт тооцоолуурууд ажиллана.\n",
    tokhirgoo: [
      {
        ner: "Бүх гэрээг харах",
        utga: "bukhGereeKharakhEsekh",
        tailbar: "Бүх гэрээг харах эрхтэй эсэх.",
      },
      {
        ner: "Бүх гэрээг засах",
        utga: "bukhGereeZasakhEsekh",
        tailbar: "Бүх гэрээг засах эрхтэй эсэх.",
      },
    ],
  },
  {
    key: "/khyanalt/barilgaBurtgel",
    ner: "Барилга бүртгэл",
    tailbar:
      "Байгууллага систем ашиглах барилгын мэдээллийн үүнд бүртгэж өгөх юм. Түүний дагуу ажилтан болон удирдах албаны хүмүүс барилга тус бүрийн үйл ажиллагаатай танилцах, явцын мэдээллийг харж болох юм. Мөн олон барилга бүртгэх боломжтой.\n",
    tokhirgoo: [
      {
        ner: "Барилга бүртгэх эрх",
        utga: "barilgaBurtgekhEsekh",
      },
    ],
  },
  {
    key: "/khyanalt/talbaiBurtgel/talbaiBurtgekh",
    ner: "Талбай бүртгэл",
    tailbar:
      "Түрээсээр олгох талбайн дугаар, үнэ, м2, хөрөнгийн бүртгэл, давхар, тухайн талбайн ашиглалтын зардал тус бүрийг оруулан бүртгэх\n",
    tokhirgoo: [
      {
        ner: "Талбай бүртгэх эрх",
        utga: "talbaiBurtgekhEsekh",
      },
    ],
  },
  {
    key: "/khyanalt/ajiltan/ajiltanBurtgel",
    ner: "Ажилтан бүртгэл",
    tailbar:
      "Барилгын үйл ажиллагааг хариуцсан ажилчдын бүртгэл мэдээлэл болон ажлын эрх үүргийг оруулж тохиргоо хийх боломжтой.\n",
    tokhirgoo: [
      {
        ner: "Ажилтан бүртгэх эрх",
        utga: "ajiltanBurtgekhEsekh",
      },
    ],
  },
  {
    key: "/khyanalt/khariltsagchBurtgel",
    ner: "Харилцагч бүртгэх",
    tailbar:
      "Гэрээ байгуулсан иргэн болон харилцагчийн дэлгэрэнгүй мэдээллийг хөтлөх, түүхийг хадгална.",
    tokhirgoo: [
      {
        ner: "Харилцагч бүртгэх эрх",
        utga: "khariltsagchBurtgekhEsekh",
      },
    ],
  },
  {
    key: "/khyanalt/medegdel",
    ner: "Мэдэгдэл",
    tailbar:
      "Мэдээ мэдээлэл, төлбөрийг мэдэгдэл, санал хүсэлтийг- майл, мессеж, апп ашиглах илгээх, хүлээн авах юм.",
    tokhirgoo: [
      {
        ner: "Мэдэгдэл олноор илгээх эсэх",
        utga: "medegdelOlnoorIlgeekhEsekh",
      },
      {
        ner: "Мэдэгдэл илгээх эсэх",
        utga: "medegdelIlgeekhEsekh",
      },
      {
        ner: "Санал хүсэлт шийдвэрлэх эсэх",
        utga: "sanalKhuseltShiidverlekhEsekh",
      },
      {
        ner: "Мэйл илгээх эсэх",
        utga: "mailIlgeekhEsekh",
      },
    ],
  },
  {
    key: "/khyanalt/tulburTootsoo",
    ner: "Дансны хуулга",
    tailbar:
      "Байгууллагын харилцахын төлбөр хүлээж авах банкны дансны орлогын хуулгыг таниж систем түрээслэгчдийн авлага, түрээсийн төлбөрийг автоматаар гүйлгээнд холбох юм.",
    tokhirgoo: [
      {
        ner: "Гүйлгээ холбох эрхтэй эсэх",
        utga: "guilgeeKholbokhEsekh",
      },
    ],
  },
  {
    key: "/khyanalt/tulburTootsoo/guilgeeniiTuukh",
    ner: "Гүйлгээний жагсаалт",
    tailbar:
      "Түрээслэгчдийн сарын төлбөр, өмнө хуримтлагдсан төлбөр, дансны гүйлгээ, кассын гүйлгээ, авлага үүсгэх, төлөвлөгөө, гүйцэтгэл, авлагын түүхийн мэдээллийг хөтлөх гүйлгээний цонх юм.\n",
    tokhirgoo: [
      {
        ner: "Бүх гүйлгээг харах эсэх",
        utga: "bukhGuilgeeKharakhEsekh",
      },
    ],
  },
  {
    key: "/khyanalt/tulburTootsoo/nekhemjlel",
    ner: "Нэхэмжлэл хэвлэх",
    tailbar:
      "Түрээслэгч тус бүрээр өмнө авлага, сарын түрээсийн дүнгээр нийтээр давхраар, дансаар гэх мэт ялгаж олноор хэвлэх боломжтой.\n",
    tokhirgoo: [],
  },
  {
    key: "/khyanalt/tulburTootsoo/khungulult",
    ner: "Хөнгөлөлт",
    tailbar:
      "Харилцагчдадаа хадгалах, урамшуулах зорилгоор давхар, үйл ажиллагаагаар нь хамааруулан олон төрлийн сонголтоор хөнгөлөлт оруулах. Мөн хөнгөлөлтийн зориулалт, шалтгаан түүхийн мэдээллийг хөтлөнө.",
    tokhirgoo: [],
  },
  {
    key: "/khyanalt/eBarimt",
    ner: "И-Баримт",
    tailbar:
      "Дансаар орж ирсэн болон кассаар хийгдсэн төлбөрийн гүйлгээнд системээс и-баримт автоматаар хэвлэх олгож илгээх боломжтой.",
    tokhirgoo: [],
  },
  {
    key: "/khyanalt/zogsool",
    ner: "Зогсоол",
    tailbar:
      "Барилгын үүдэнд байрлах зогсоолын удирдлага, хяналт, тооцооллыг таны гарт олгоно.",
    tokhirgoo: [],
  },
  {
    key: "/khyanalt/tailan",
    ner: "Тайлан",
    tailbar:
      "Борлуулалтын\nАшигийн тооцоо\nЗардлын тооцоо\nАвлагын насжилтаар\n",
    tokhirgoo: [],
  },
];

export const khereglegchiinErkhuud = [
  {
    erkh: "ZokhionBaiguulagch",
    tailbar:'Зохион байгуулагч',
    tsonkhnuud: [
      "/khyanalt/geree/gereeBurtgel",
      "/khyanalt/geree/gereeBaiguulakh",
      "/khyanalt/geree/zagvar",
      "/khyanalt/talbaiBurtgel/talbaiBurtgekh",
      "/khyanalt/khariltsagchBurtgel",
      "/khyanalt/medegdel"
    ],
  },
  {
    erkh: "Sankhuu",
    tailbar:'Санхүү',
    tsonkhnuud: [
      "/khyanalt/tulburTootsoo",
      '/khyanalt/eBarimt',
      "/khyanalt/tulburTootsoo/khungulult",
      "/khyanalt/medegdel",
      "/khyanalt/tulburTootsoo/guilgeeniiTuukh"
    ],
  },
];

export function undsenKhuudasOlyo(url){
  if(url.includes("khyanalt/tokhirgoo"))
    return 'khyanalt/tokhirgoo'
  return tsonknuud.find(a=> url.includes(a.key))?.key
}

export function ekhniiTsonkhruuOchyo(ajiltan) {
  if(ajiltan?.erkh === 'Admin')
    window.location.href = "/khyanalt/geree/gereeBurtgel";
  else
    window.location.href = ajiltan.tsonkhniiErkhuud[0]
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
    ner: "Барилга",
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
    ner: "Мэдэгдэл",
    khuudasniiNer: "medegdel",
    href: "/khyanalt/medegdel",
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
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
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
    sub: [
      {
        ner: "Дансны хуулга",
        khuudasniiNer: "khuulga",
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
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
            <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
          </svg>
        ),
      },
      {
        ner: "Гүйлгээний түүх",
        khuudasniiNer: "guilgeeniiTuukh",
        href: "/khyanalt/tulburTootsoo/guilgeeniiTuukh",
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
            <line x1="8" y1="6" x2="21" y2="6"></line>
            <line x1="8" y1="12" x2="21" y2="12"></line>
            <line x1="8" y1="18" x2="21" y2="18"></line>
            <line x1="3" y1="6" x2="3.01" y2="6"></line>
            <line x1="3" y1="12" x2="3.01" y2="12"></line>
            <line x1="3" y1="18" x2="3.01" y2="18"></line>
          </svg>
        ),
      },
      {
        ner: "Нэхэмжлэл",
        khuudasniiNer: "nekhemjlel",
        href: "/khyanalt/tulburTootsoo/nekhemjlel",
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
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
        ),
      },
      {
        ner: "Хөнгөлөлт",
        khuudasniiNer: "khungulult",
        href: "/khyanalt/tulburTootsoo/khungulult",
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
            <line x1="19" y1="5" x2="5" y2="19" />
            <circle cx="6.5" cy="6.5" r="2.5" />
            <circle cx="17.5" cy="17.5" r="2.5" />
          </svg>
        ),
      },
    ],
  },
  {
    ner: "И-баримт",
    khuudasniiNer: "eBarimt",
    href: "/khyanalt/eBarimt",
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
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
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
];

function useErkh(ajiltan) {
  if (!ajiltan) return [];
  
  return khuudasnuud.map(x=>{
    if(x.href.includes("khyanalt/tokhirgoo"))
      return x
    if(ajiltan.erkh === 'Admin')
      return x
    else if(x.sub?.length > 0){
      x.sub = x.sub.filter(g=>!!ajiltan?.tsonkhniiErkhuud.find(a=>g.href.includes(a)))
      if(x.sub.length > 0)
        return x
    }
    else if(!!ajiltan?.tsonkhniiErkhuud.find(a=>x.href.includes(a)))
      return x
  }).filter(
    (x) => !!x
  )
}

export default useErkh;
