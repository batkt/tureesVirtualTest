import React from 'react'
import moment from 'moment'

function Kharakh({data,print},ref) {
    const {geree , ...gereeniiZagvar} = data

    React.useEffect(()=>{
      document.addEventListener('keydown',(e)=>{
        if(e.ctrlKey === true && e.key === "p" && print){
          e.preventDefault()
          e.stopPropagation()
          print()
        }  
      })
    },[])

    return (
        <div className="w-full space-y-2 p-5" ref={ref}>
              {gereeniiZagvar?.ner && (
                <>
                  <div className="flex flex-row justify-between">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: gereeniiZagvar?.zuunTolgoi,
                      }}
                    />
                    <div
                      dangerouslySetInnerHTML={{
                        __html: gereeniiZagvar?.baruunTolgoi,
                      }}
                    />
                  </div>
                  <div className="flex flex-row justify-between">
                    <div>
                      {moment(geree.ognoo).format("YYYY")} он{" "}
                      {moment(geree.ognoo).format("MM")} сар{" "}
                      {moment(geree.ognoo).format("DD")} өдөр
                    </div>
                    <div>№:{geree.gereeniiDugaar}</div>
                    <div>Улаанбаатар хот</div>
                  </div>
                  <div className="w-full text-center font-medium">
                    АЖЛЫН БАЙРНЫ ТҮРЭЭСИЙН ГЭРЭЭ
                  </div>
                </>
              )}
              {gereeniiZagvar?.dedKhesguud?.map((mur, index) => {
                return (
                  <div
                    key={`alkhamiinGereeniiZagvar${index}`}
                    className="flex flex-row w-full p-1 relative group hover:bg-gray-100 rounded-md"
                  >
                    {mur.kharagdakhDugaar ? (
                      <>
                        <div className="text-center">
                          {mur.kharagdakhDugaar}
                        </div>
                        <div
                          className="ml-5"
                          dangerouslySetInnerHTML={{ __html: mur.zaalt }}
                        />
                      </>
                    ) : (
                      <div
                        className="w-full text-center font-medium"
                        dangerouslySetInnerHTML={{ __html: mur.zaalt }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
    )
}

export default React.forwardRef(Kharakh)
