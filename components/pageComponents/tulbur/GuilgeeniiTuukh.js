import {Badge, Table} from 'antd';
import React from 'react'
import axios, { aldaaBarigch } from "services/uilchilgee";
import useSWR from "swr";
import moment from 'moment'
import formatNumber from 'tools/function/formatNumber';
const fetcher = (
  url,
  token,
  gereeniiId
) =>
  axios(token)
    .get(`${url}/${gereeniiId}`)
    .then((res) => res.data)
    .catch(aldaaBarigch);

function useGuilgee(token, gereeniiId) {
  const { data, mutate } = useSWR(
    !!token ? ["/gereeniiTulultAvya", token, gereeniiId]
      : null,
    fetcher,
    { revalidateOnFocus: false }
  );
  return {
    guilgeeniiTuukh: data,
    guilgeeniiTuukhMutate: mutate,
  };
}


function GuilgeeniiTuukh({token,data}) {
    const {guilgeeniiTuukh} =useGuilgee(token,data?._id)
    /*'/gereeniiTulultAvya/:gereeniiId'*/
    return (
        <div className='py-3'>
            <Table
                rowKey={(a) => a.ognoo}
                columns={[{
                    title: "№",
                    key: "index",
                    className: "text-center",
                    render: (text, record, index) =>index +1,
                  },
                  {title:'Огноо',dataIndex:'ognoo',render(o){return moment(o).format('YYYY-MM-DD')}},
                  {title:'Сарын түрээс',dataIndex:'undsenDun',render(a){return formatNumber(a,0)}},
                  {title:'Хөнгөлөлт',dataIndex:'khyamdral',render(a){return formatNumber(a,0)}},
                  {title:'Төлөх дүн',dataIndex:'tulukhDun',render(a){return formatNumber(a,0)}},
                  {title:'Төлсөн дүн',dataIndex:'tulsunDun',render(a){return formatNumber(a,0)}},
                  {title:'Хэлбэр',dataIndex:'turul',render(a){return <Badge>{a}</Badge>}}]}
                dataSource={guilgeeniiTuukh}
            />
        </div>
    )
}

export default GuilgeeniiTuukh
