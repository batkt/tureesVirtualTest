import Admin from "components/Admin"
import { useEffect, useMemo, useState } from "react"
import shalgaltKhiikh from "services/shalgaltKhiikh"
import App, { AppContent } from "components/pageComponents/medegdel/App"
import Mail, { MailContent } from "components/pageComponents/medegdel/Mail"
import SMS, { SMSContent } from "components/pageComponents/medegdel/SMS"
import { useAuth } from "services/auth"

var setKhuudaslalt = null
export function putSetter(setter) {
  setKhuudaslalt = setter
}
function Khyanalt({ token }) {
  const { baiguullaga } = useAuth()
  const [turul, setTurul] = useState("СМС")
  const [khariltsagch, setKhariltsagch] = useState(null)
  const [davkhar, setDavkhar] = useState(null)
  /**Илгээх төрөл
   * enum {buunuur | davkharaar | avlagaar | gantsaar}
   *  */
  const [ilgeekhTurul, setIlgeekhTurul] = useState("gantsaar")

  useEffect(() => {
    setKhariltsagch(null)
    if (ilgeekhTurul !== "davkharaar") setDavkhar(null)
  }, [ilgeekhTurul])

  useEffect(() => {
    setKhariltsagch(null)
    setDavkhar(null)
  }, [turul])

  const Tab = useMemo(() => {
    if (turul === "Апп") return App
    else if (turul === "Мэйл") return Mail
    else if (turul === "СМС") return SMS
  }, [turul])

  const Content = useMemo(() => {
    if (turul === "Апп") return AppContent
    else if (turul === "Мэйл") return MailContent
    else if (turul === "СМС") return SMSContent
  }, [turul])

  return (
    <Admin title="Мэдэгдэл" khuudasniiNer="medegdel" className="p-0 md:p-4" onSearch={(search) => setKhuudaslalt && setKhuudaslalt(a=>({...a,search}))}>
      <Tab
        token={token}
        baiguullaga={baiguullaga}
        setKhariltsagch={setKhariltsagch}
        khariltsagch={khariltsagch}
        ilgeekhTurul={ilgeekhTurul}
        setIlgeekhTurul={setIlgeekhTurul}
        davkhar={davkhar}
        setTurul={setTurul}
        turul={turul}
      />
      <div
        className={`intro-y col-span-12 lg:col-span-6 xl:col-span-6 ${ilgeekhTurul === "gantsaar" ? 'lg:col-span-6 xl:col-span-6' : 'lg:col-span-9 xl:col-span-9'}`}
        style={{ height: "calc(100vh - 7rem)" }}
      >
        <Content
          token={token}
          khariltsagch={khariltsagch}
          ilgeekhTurul={ilgeekhTurul}
          baiguullaga={baiguullaga}
          davkhar={davkhar}
          setDavkhar={setDavkhar}
        />
      </div>
    </Admin>
  )
}

export const getServerSideProps = shalgaltKhiikh

export default Khyanalt
