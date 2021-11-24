import Admin from "components/Admin";
import { useMemo, useState } from "react";
import shalgaltKhiikh from "services/shalgaltKhiikh";
import App,{AppContent} from "components/pageComponents/medegdel/App";
import Mail,{MailContent} from "components/pageComponents/medegdel/Mail";
import SMS,{SMSContent} from "components/pageComponents/medegdel/SMS";

function Khyanalt({token}) {
    const [turul,setTurul] = useState('Апп')

    const Tab = useMemo(()=>{
        if(turul === 'Апп')
            return App
        else if(turul === 'Мэйл')
            return Mail
        else if(turul === 'СМС')
            return SMS
    },[turul])

    const Content = useMemo(()=>{
        if(turul === 'Апп')
            return AppContent
        else if(turul === 'Мэйл')
            return MailContent
        else if(turul === 'СМС')
            return SMSContent
    },[])

  return <Admin title="Мэдэгдэл" khuudasniiNer='medegdel' className='p-0 md:p-4'>
      <div className='col-span-12 lg:col-span-4 xl:col-span-3'>
        <div class="intro-y pr-1">
            <div class="box p-2">
                <div class="grid grid-cols-3 gap-1 font-medium" role="tablist"> 
                {
                        ['Апп','Мэйл','СМС'].map((mur)=>
                            <div className={`cursor-pointer flex-1 py-2 rounded-md text-center ${turul === mur ? 'bg-green-500 text-white' : ''}`} onClick={()=>setTurul(mur)}>
                                {mur}
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
        <div>
            <Tab token={token}/>
        </div>
      </div>
      <div className='intro-y col-span-12 lg:col-span-8 xl:col-span-9' style={{height:'calc(100vh - 7rem)'}}>
        <Content/>
      </div>
  </Admin>;
}

export const getServerSideProps = shalgaltKhiikh;

export default Khyanalt;
