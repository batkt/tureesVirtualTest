import { AiOutlineExclamationCircle } from "react-icons/ai";
import { BiBellPlus, BiDesktop, BiCommentError, BiUser } from "react-icons/bi";
import { BsGraphUp, BsPcDisplay } from "react-icons/bs";
import { VscGitPullRequestGoToChanges } from "react-icons/vsc";
import { MdOutlineAnalytics } from "react-icons/md";
import { TbReportMoney } from "react-icons/tb";
import { FiHome } from "react-icons/fi";
import { FaSteam } from "react-icons/fa";
import { SiRiotgames } from "react-icons/si";
import { TbLego } from "react-icons/tb";
import useKhuudasniiJagsaalt from "hooks/useKhuudasniiJagsaalt";
import uilchilgee, { aldaaBarigch } from "services/uilchilgee";
import { toast } from "sonner";
import { t } from "i18next";
import {
  MobileFilled,
  MobileOutlined,
  PhoneOutlined,
  HourglassOutlined,
} from "@ant-design/icons";

export const tsonknuud = [
  {
    key: "/khyanalt/ajiltan/tokhirgoo",
    ner: "Ажилтанд эрх олгох",
    tailbar: "",
    tokhirgoo: [],
    nuuya: true,
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
        ner: "Дуудлага үйлчилгээ",
        utga: "duudlagaUilchilgee",
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
    ner: "Машин бүртгэл",
    key: "/khyanalt/zogsool/mashinBurtgel",
  },
  {
    ner: "Камер - Касс",
    key: "/khyanalt/zogsool/camera",
  },
  {
    ner: "Камерын хяналт",
    key: "/khyanalt/zogsool/cameraVals",
  },
  {
    ner: "Оршин суугч",
    key: "/khyanalt/zogsool/orshinSuugch",
  },
  {
    key: "/khyanalt/anket",
    ner: "Анкет",
    tokhirgoo: [],
  },
  {
    key: "/khyanalt/zg",
    ner: "Зогсоолын тайлан",
    tokhirgoo: [],
  },

  {
    ner: "Даалгавар",
    key: "/khyanalt/daalgavar",
  },
  {
    ner: "Устгасан түүх",
    key: "/khyanalt/ustsanTuukh",
  },
  {
    ner: "Зассан түүх",
    key: "/khyanalt/zassanTuukh",
  },
  {
    ner: "Тоглоомын төв",
    key: "/khyanalt/togloom/togloomTuv",
  },
  {
    ner: "Тоглоомын киоск",
    key: "/khyanalt/togloomKiosk",
  },

  {
    key: "/khyanalt/tailan",
    ner: "Тайлан",
    tailbar:
      "Борлуулалтын\nАшигийн тооцоо\nЗардлын тооцоо\nАвлагын насжилтаар\n",
    tokhirgoo: [],
  },
  {
    key: "/khyanalt/todorkhoilolt",
    ner: "Тодорхойлолт",
  },
];

export const khereglegchiinErkhuud = [
  {
    erkh: "ZokhionBaiguulagch",
    tailbar: "Зохион байгуулагч",
    tsonkhnuud: [
      "/khyanalt/geree/gereeBurtgel",
      "/khyanalt/geree/gereeBaiguulakh",
      "/khyanalt/geree/zagvar",
      "/khyanalt/talbaiBurtgel/talbaiBurtgekh",
      "/khyanalt/khariltsagchBurtgel",
      "/khyanalt/medegdel",
      "khyanalt/anket",
    ],
  },
  {
    erkh: "Sankhuu",
    tailbar: "Санхүү",
    tsonkhnuud: [
      "/khyanalt/togloom/togloomTuv",
      "/khyanalt/tulburTootsoo",
      "/khyanalt/eBarimt",
      "/khyanalt/tulburTootsoo/khungulult",
      "/khyanalt/medegdel",
      "/khyanalt/tulburTootsoo/guilgeeniiTuukh",
    ],
  },
];

export function undsenKhuudasOlyo(url) {
  if (url.includes("khyanalt/tokhirgoo")) return "khyanalt/tokhirgoo";
  if (!!tsonknuud.find((a) => url === a.key))
    return tsonknuud.find((a) => url === a.key)?.key;
  return tsonknuud.find((a) => url.includes(a.key))?.key;
}

export function ekhniiTsonkhruuOchyo(ajiltan, token) {
  uilchilgee(token)
    .post("/erkhiinMedeelelAvya")
    .then(({ data }) => {
      localStorage.setItem(
        "baiguulgiinErkhiinJagsaalt",
        JSON.stringify(data?.moduluud)
      );
      var AdminErkhShalgakh = data?.moduluud?.find(
        (b) => b.zam === "/khyanalt/barilgaBurtgel"
      );
      var erkhShalgakh = ajiltan.tsonkhniiErkhuud.filter((element) => {
        return data?.moduluud?.find((b) => b.zam === element);
      });
      if (ajiltan?.erkh === "Admin") {
        if (AdminErkhShalgakh !== undefined) {
          toast.success(t("Тавтай морил"), {
            duration: 3000,
          });
          window.location.href = "/khyanalt/barilgaBurtgel";
        } else if (data?.moduluud?.length > 0) {
          toast.success(t("Тавтай морил"), {
            duration: 3000,
          });
          window.location.href = data?.moduluud[0]?.zam;
        } else {
          toast.warning("Байгууллагын эрхийн тохиргоог шалгуулна уу", {
            duration: 5000,
          });
        }
      } else if (erkhShalgakh.length > 0) {
        toast.success(t("Тавтай морил"), {
          duration: 3000,
        });
        window.location.href = erkhShalgakh[0];
      } else if (ajiltan?.tsonkhniiErkhuud?.length > 0) {
        // If user has permissions but they don't match modules, redirect to first permission anyway
        toast.success(t("Тавтай морил"), {
          duration: 3000,
        });
        window.location.href = ajiltan.tsonkhniiErkhuud[0];
      } else {
        toast.error("Ажилтны эрхийн тохиргоо хийгдээгүй байна", {
          duration: 5000,
        });
      }
    })
    .catch(aldaaBarigch);
}

export const khuudasnuud = [
  {
    ner: "Хяналт",
    khuudasniiNer: "barilgaBurtgel",
    href: "/khyanalt/barilgaBurtgel",
    icon: <FiHome className="text-2xl" />,
    align: "center",
  },
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
            className="feather feather-folder d-block mx-auto"
          >
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
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
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            icon-name="paperclip"
            data-lucide="paperclip"
            className="lucide lucide-paperclip mx-auto block"
          >
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"></path>
          </svg>
        ),
      },
    ],
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
    ner: "Харилцагч",
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
    khuudasniiNer: "",
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
    sub: [
      {
        ner: "Мэдэгдэл",
        khuudasniiNer: "medegdel",
        href: "/khyanalt/medegdel",
        icon: <BiBellPlus style={{ width: "24", height: "24" }} />,
      },
      {
        ner: "Шаардлага",
        khuudasniiNer: "shaardlaga",
        href: "/khyanalt/medegdel/shaardlaga",
        icon: (
          <AiOutlineExclamationCircle style={{ width: "24", height: "24" }} />
        ),
      },
      {
        ner: "Дуудлага",
        khuudasniiNer: "duudlaga",
        href: "/khyanalt/medegdel/duudlaga",
        icon: <PhoneOutlined className="text-2xl" />,
      },

      {
        ner: "Санал хүсэлт",
        khuudasniiNer: "sanalKhuselt",
        href: "/khyanalt/medegdel/sanalKhuselt",
        icon: <BiCommentError style={{ width: "24", height: "24" }} />,
      },
    ],
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
      {
        ner: "Зардал",
        khuudasniiNer: "zardal",
        href: "/khyanalt/tulburTootsoo/zardal",
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
            <path d="M14.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7.5L14.5 2z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="9" y1="15" x2="15" y2="15"></line>
          </svg>
        ),
      },
    ],
  },
  {
    ner: "И-Баримт",
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
    ner: "Тодорхойлолт",
    khuudasniiNer: "todorkhoilolt",
    href: "/khyanalt/todorkhoilolt",
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
        <path d="M6 2h9l5 5v15a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
    ),
  },

  {
    ner: "Зогсоол",
    href: "/khyanalt/zogsool",
    icon: (
      <svg
        width="24"
        height="24"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <g>
          <path
            stroke="null"
            id="svg_1"
            d="m10.2904,11.95549l0,-3.38007l2.51312,0c0.92671,0 1.67541,0.75523 1.67541,1.69003c0,0.9348 -0.7487,1.69003 -1.67541,1.69003l-2.51312,0zm10.05247,-11.83023c1.84819,0 3.35082,1.51311 3.35082,3.38007l0,16.90033c0,1.86432 -1.50263,3.38007 -3.35082,3.38007l-16.75412,0c-1.85081,0 -3.35082,-1.51575 -3.35082,-3.38007l0,-16.90033c0,-1.86696 1.50002,-3.38007 3.35082,-3.38007l16.75412,0zm-2.51312,10.1402c0,-2.84665 -2.25133,-5.0701 -5.02624,-5.0701l-3.76968,0c-1.15708,0 -2.09426,0.94536 -2.09426,2.11254l0,9.71769c0,0.9348 0.7487,1.69003 1.67541,1.69003c0.92671,0 1.67541,-0.75523 1.67541,-1.69003l0,-1.69003l2.51312,0c2.7749,0 5.02624,-2.27098 5.02624,-5.0701z"
          />
        </g>
      </svg>
    ),
    sub: [
      {
        ner: "Жагсаалт",
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
        ner: "Машин бүртгэл",
        khuudasniiNer: "mashinBurtgel",
        href: "/khyanalt/zogsool/mashinBurtgel",
        icon: (
          <svg
            width="24"
            height="24"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <g>
              <path
                stroke="null"
                id="svg_1"
                d="m8.83312,11.91732c1.41155,0 2.55556,-1.21507 2.55556,-2.71429c0,-1.49922 -1.14401,-2.71429 -2.55556,-2.71429s-2.55556,1.21507 -2.55556,2.71429c0,1.4971 1.14601,2.71429 2.55556,2.71429zm10.22222,-1.01786l-3.83333,0c-0.52908,0 -0.95833,0.45592 -0.95833,1.01786s0.42925,1.01786 0.95833,1.01786l3.83333,0c0.52908,0 0.95833,-0.45592 0.95833,-1.01786s-0.42726,-1.01786 -0.95833,-1.01786zm-8.94445,2.375l-2.55556,0c-1.76493,0 -3.19444,1.5183 -3.19444,3.39286c0,0.37321 0.2875,0.67857 0.63889,0.67857l7.66667,0c0.35283,0 0.63889,-0.30383 0.63889,-0.67857c0,-1.87455 -1.42951,-3.39286 -3.19444,-3.39286zm8.94445,-5.76786l-3.83333,0c-0.52908,0 -0.95833,0.45592 -0.95833,1.01786s0.42925,1.01786 0.95833,1.01786l3.83333,0c0.52908,0 0.95833,-0.45592 0.95833,-1.01786s-0.42726,-1.01786 -0.95833,-1.01786zm1.91667,-5.08929l-17.88889,0c-1.41155,0 -2.55556,1.21507 -2.55556,2.71429l0,13.57143c0,1.49922 1.14401,2.71429 2.55556,2.71429l17.88889,0c1.41155,0 2.55556,-1.21507 2.55556,-2.71429l0,-13.57143c0,-1.49922 -1.14601,-2.71429 -2.55556,-2.71429zm0.63889,16.28571c0,0.37415 -0.28662,0.67857 -0.63889,0.67857l-17.88889,0c-0.35227,0 -0.63889,-0.30442 -0.63889,-0.67857l0,-13.57143c0,-0.37415 0.28662,-0.67857 0.63889,-0.67857l17.88889,0c0.35227,0 0.63889,0.30442 0.63889,0.67857l0,13.57143z"
              />
            </g>
          </svg>
        ),
      },
      {
        ner: "Камер - Касс",
        khuudasniiNer: "Camera",
        href: "/khyanalt/zogsool/camera",
        icon: <BiDesktop style={{ width: "24", height: "24" }} />,
      },
      {
        ner: "Камерын хяналт",
        khuudasniiNer: "CameraVals",
        href: "/khyanalt/zogsool/cameraVals",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            icon-name="video"
            data-lucide="video"
            className="lucide lucide-video mx-auto block"
          >
            <polygon points="23 7 16 12 23 17 23 7"></polygon>
            <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
          </svg>
        ),
      },
      {
        ner: "Оршин суугч",
        khuudasniiNer: "orshinSuugch",
        href: "/khyanalt/zogsool/orshinSuugch",
        icon: <BiUser style={{ width: "24", height: "24" }} />,
      },
    ],
  },
  {
    ner: "Анкет",
    khuudasniiNer: "anket",
    href: "/khyanalt/anket",
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
    ner: "Зогсоолын тайлан",
    khuudasniiNer: "zg",
    href: "/khyanalt/zg",
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
    ner: "Тайлан",
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
    sub: [
      {
        ner: "График",
        khuudasniiNer: "tailan",
        href: "/khyanalt/tailan",
        icon: <BsGraphUp style={{ width: "24", height: "24" }} />,
      },
      {
        ner: "Аналитик",
        khuudasniiNer: "analytictailan",
        href: "/khyanalt/tailan/analytic",
        icon: <MdOutlineAnalytics style={{ width: "24", height: "24" }} />,
      },
      {
        ner: "Нэгтгэл тайлан",
        khuudasniiNer: "negtgelTailan",
        href: "/khyanalt/tailan/negtgelTailan",
        icon: <TbReportMoney style={{ width: "24", height: "24" }} />,
      },
      {
        ner: "Насжилтын тайлан",
        khuudasniiNer: "nasjiltinTailan",
        href: "/khyanalt/tailan/nasjiltinTailan",
        icon: (
          <HourglassOutlined
            style={{
              width: "30",
              height: "30",
              marginLeft: "5px",
              marginRight: "5px",
            }}
          />
        ),
      },
    ],
  },
  {
    ner: "Даалгавар",
    khuudasniiNer: "daalgavar",
    href: "/khyanalt/daalgavar",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        icon-name="plus-square"
        data-lucide="plus-square"
        className="lucide lucide-plus-square mx-auto block"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="12" y1="8" x2="12" y2="16"></line>
        <line x1="8" y1="12" x2="16" y2="12"></line>
      </svg>
    ),
  },
  {
    ner: "Устгасан түүх",
    khuudasniiNer: "ustsanTuukh",
    href: "/khyanalt/ustsanTuukh",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        preserveAspectRatio="xMidYMid meet"
        viewBox="0 0 24 24"
      >
        <path
          fill="currentColor"
          d="M19 19H5V5h6V3H5a2.006 2.006 0 0 0-2 2v14a2.006 2.006 0 0 0 2 2h14a2.006 2.006 0 0 0 2-2v-4h-2Z"
        />
        <path
          fill="currentColor"
          d="M15 5h6v6a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V5Zm7-2h-2l-.571-1h-2.858L16 3h-2v1h8V3z"
        />
      </svg>
    ),
  },
  {
    ner: "Зассан түүх",
    khuudasniiNer: "zassanTuukh",
    href: "/khyanalt/zassanTuukh",
    icon: (
      <VscGitPullRequestGoToChanges style={{ width: "24", height: "24" }} />
    ),
  },
  {
    ner: "Киоск",
    khuudasniiNer: "kiosk",
    href: "/khyanalt/kiosk",
    icon: <MobileOutlined className="text-2xl" />,
  },
  {
    ner: "Тоглоомын киоск",
    khuudasniiNer: "togloomKiosk",
    href: "/khyanalt/togloomKiosk",
    icon: <MobileOutlined className="text-2xl" />,
  },
  {
    ner: "Тоглоомын төв",
    khuudasniiNer: "togloomTuv",
    href: "/khyanalt/togloom/togloomTuv",
    icon: <TbLego style={{ width: "24", height: "24" }} />,
    // sub: [
    //   {
    //     ner: "Жагсаалт",
    //     khuudasniiNer: "togloom2",
    //     href: "/khyanalt/togloom/togloom2",
    //     icon: <FaSteam style={{ width: "24", height: "24" }} />,
    //   },
    //   {
    //     ner: "Тоглоомын төв",
    //     khuudasniiNer: "togloomTuv",
    //     href: "/khyanalt/togloom/togloomTuv",
    //     icon: <TbLego style={{ width: "24", height: "24" }} />,
    //   },
    // ],
  },
];

function useErkh(ajiltan, baiguulgiinErkhiinJagsaalt) {
  if (!ajiltan) return [];
  var erkhteiTsonkhnuud = khuudasnuud.filter((a) => {
    if (a.href === "/khyanalt/daalgavar/admin") {
      a.href = "/khyanalt/daalgavar";
    }
    return baiguulgiinErkhiinJagsaalt?.find(
      (b) => b.zam === a.href || (a.sub && a.sub?.find((c) => c.href === b.zam))
    );
  });
  erkhteiTsonkhnuud.forEach((a) => {
    if (a.sub && a.sub.length > 0) {
      a.sub = a.sub.filter((d) =>
        baiguulgiinErkhiinJagsaalt.find((e) => e.zam === d.href)
      );
    }
  });
  return erkhteiTsonkhnuud
    ?.map((x) => {
      if (x.href.includes("khyanalt/tokhirgoo")) return x;
      if (ajiltan.erkh === "Admin") {
        if (x.href === "/khyanalt/daalgavar")
          x.href = "/khyanalt/daalgavar/admin";
        return x;
      } else if (x.sub?.length > 0) {
        x.sub = x.sub.filter(
          (g) => !!ajiltan?.tsonkhniiErkhuud?.find((a) => a === g.href)
        );
        return x;
      } else if (!!ajiltan?.tsonkhniiErkhuud?.find((a) => x.href === a))
        return x;
    })
    .filter((x) => !!x);
}

export default useErkh;
