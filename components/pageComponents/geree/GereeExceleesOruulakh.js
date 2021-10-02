import React from "react";
import { message, Select, Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { url } from "services/uilchilgee";
import useGereeniiZagvar from 'hooks/useGereeniiZagvar'
import _ from "lodash";

function GereeExceleesOruulakh(
  { token, destroy, zam, garchig, tailbar, zagvariinZam, onFinish ,baiguullaga},
  ref
) {

  const [zagvariinId,setGereeniiZagvar] = React.useState(null)
  const [aldaa,setAldaa] = React.useState(null)

  const { gereeniiZagvarGaralt, setGereeniiZagvarKhuudaslalt } =
    useGereeniiZagvar(token, baiguullaga?._id);

  React.useImperativeHandle(
    ref,
    () => ({
      khaaya() {
        _.isFunction(onFinish) && onFinish();
        destroy();
      },
    }),
    []
  );

  return (
    <div>
      <Select placeholder='Гэрээний загвар' onChange={setGereeniiZagvar} style={{width:'100%'}}>
        {gereeniiZagvarGaralt?.jagsaalt?.map(a=><Select.Option value={a._id}>{a.ner}</Select.Option>)}
      </Select>
      <div className='mt-5'/>
      {!!zagvariinId && <Upload
        type="drag"
        showUploadList={false}
        multiple={false}
        name="file"
        data={{zagvariinId}}
        action={`${url}/${zam}`}
        method="POST"
        headers={{ Authorization: `bearer ${token}` }}
        beforeUpload={(file)=>{
          if(!zagvariinId){
            message.warning('Гэрээний загвар сонгоно уу')
            return false
          }
          return file
        }}
        onChange={({ file }) => {
          if (file.response === "Amjilttai") {
            message.success("Гэрээний заалт Excel -ээс амжилттай орууллаа");
            _.isFunction(onFinish) && onFinish();
            destroy();
          }
          else if(!!file.response?.aldaa)
            setAldaa(file.response?.aldaa);
        }}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">{garchig}</p>
        <p className="ant-upload-hint">{tailbar}</p>
      </Upload>}
      {aldaa && <div
                className='max-h-52 overflow-auto text-red-600'
                dangerouslySetInnerHTML={{
                    __html: aldaa
                }} />}
      {zagvariinZam && (
        <a
          className="cursor-pointer text-blue-600 font-medium"
          href={url + `/${zagvariinZam}`}
          download
        >
          Загвар татах
        </a>
      )}
    </div>
  );
}

export default React.forwardRef(GereeExceleesOruulakh);
