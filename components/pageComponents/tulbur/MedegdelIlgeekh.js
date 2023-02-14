import { Button, message, notification, Popconfirm, Select, } from "antd";
import _ from "lodash";
import React, { useMemo, useState } from "react";
import uilchilgee, { aldaaBarigch } from "services/uilchilgee";
import { useMailiinZagvarWithoutAuth } from "hooks/useMailiinZagvar";
import useMedegdel from "hooks/medegdel/useMedegdel";
import { toWords } from "mon_num";
import formatNumber from "tools/function/formatNumber";
import { t } from "i18next";


function GuilgeeKhiikh({ data, token, onFinish, destroy, }, ref) {
    const [turul, setTurul] = useState("SMS");
    const [barimt, setBarimt] = React.useState();
    const [title, setTitle] = useState("");
    const [msj, onTextChange] = useState("");
    const { mailiinZagvarGaralt } = useMailiinZagvarWithoutAuth(
        token,
        turul,
        data.barilgiinId,
        data.baiguullagiinId
    );
    
   
    
    
    function khaaya() {
        destroy();
    }

    function send() {
    switch (turul) {
      case "App":
        appIlgeeye();
        break;
      case "Mail":
        mailIlgeeye();
        break;
      default:
        msgIlgeeye();
        break;
        }
    }
    async function mailIlgeeye() {
        if ( !data?.mail) {
            notification.warning({ message: t("Гэрээнд и-мэйл бүртгэгдээгүй байна") });
            return;
          }
          const mailuud = [];
            var zagvar = barimt;
            for (const [key, value] of Object.entries(barimt)) {
              zagvar = barimt?.replace(new RegExp(`&lt;${key}&gt;`, "g"), value);
            }
            mailuud.push({
              mail: "csodhuu@gmail.com",
              content: zagvar,
            });
              
        uilchilgee(token)
          .post(`/mailOlnoorIlgeeye`, { mailuud, subject: "Mail мэдэгдэл"  })
          .then(({ data }) => {
            if (data === "Amjilttai") {
              notification.success({ message: t("И-мэйл Амжилттай илгээлээ") });
              setContent("");
              setTitle("");
            }
          })
          .catch((e) => {
            aldaaBarigch(e);
          });
    }
   
    // async function appIlgeeye() {
    //       var khariu = { successCount: 0, failureCount: 0 };
    //       let body;
    //           for (const [key, value] of Object.entries(barimt)) {
    //             body = barimt.mail?.replace(new RegExp(`<${key}>`, "g"), value);
    //           }
    //           uilchilgee(token)
    //             .post(`/sonorduulgaIlgeeye`, {
    //               firebaseToken: barimt?.firebaseToken,
    //               dataiinId: barimt?.dataiinId,
    //               barilgiinId: barimt.barilgiinId,
    //               dataiinNer: barimt.ner,
    //               medeelel: { title, body },
    //             })
    //             .then(({ data }) => {
    //               if (!!data?.successCount) khariu.successCount += 1;
    //               else if (!!data?.failureCount) khariu.failureCount += 1;
                 
    //                 notification.success({
    //                   message: `Notification Амжилттай ${khariu.successCount} ${
    //                     khariu.failureCount ? `Алдаатай ${khariu.failureCount}` : ""
    //                   } илгээлээ`,
    //                 });
    //               }
    //             );    
    //     uilchilgee(token)
    //       .post(`/sonorduulgaIlgeeye`, {
    //         firebaseToken: data?.firebaseToken,
    //         dataiinId: data?.dataiinId,
    //         barilgiinId: data.barilgiinId,
    //         dataiinNer: data.ner,
    //         medeelel: { title, body: ingeekhmSms },
    //       })
    //       .then(({ data }) => {
    //         if (!!data?.successCount) {
    //           sonorduulga.jagsaalt.unshift({
    //             dataiinId: data?.dataiinId,
    //             barilgiinId: data.barilgiinId,
    //             dataiinNer: data.ner,
    //             title,
    //             message: ingeekhmSms,
    //             turul: "medegdel",
    //           });
    //           sonorduulgaMutate({ ...sonorduulga }, false);
    //           notification.success({ message: "Notification Амжилттай илгээлээ" });
    //           setContent("");
    //           setTitle("");
    //         } else if (!!data?.failureCount) {
    //           notification.warning({
    //             description: _.get(data, "results.0.error.message"),
    //             message: _.get(data, "results.0.error.code"),
    //           });
    //         }
    //       })
    //       .catch((e) => {
    //         aldaaBarigch(e);
    //       });
    //   }

    async function msgIlgeeye() {
        
        var msgnuud = [];
        var text = barimt;
        for (const [key, value] of Object.entries(barimt)) {
          text = barimt?.replace(new RegExp(`&lt;${key}&gt;`, "g"), value);
        }
        
        if (!!data) {
          if (_.isArray(data?.utas))
            data?.utas.map((to) =>
              msgnuud.push({
                to: "80780740",
                text: text,
              })
            );
          else
            msgnuud.push({
              to: "80780740",
              text: text,
            });
        } else {
          message.warning("Та SMS илгээх гэрээгээ сонгоно уу");
          return;
        }
        uilchilgee(token)
          .post(`/msgIlgeeye`, {msgnuud })
          .then(({ data }) => {
            
              notification.success({ message: t("SMS Амжилттай илгээлээ") });
              setContent("");
              setTitle("");
            }
          )
          .catch((e) => {
            aldaaBarigch(e);
          });
      }
    
    


    React.useImperativeHandle(
        ref,
        () => ({
            khaaya() {
                destroy();
            },
            khadgalya() {
                uilchilgee(token)
                    .then(() => {
                        notification.success({
                            message: t("Амжилттай"),
                        });
                        destroy();
                    })
                    .catch(aldaaBarigch);
            },

        }),

        []
    );
    return (
        <div className=" space-y-3 flex flex-col" >
            <div className="pr-1" data-aos="fade-right" data-aos-duration="1000">
                <div className="box p-2">
                    <div className="grid grid-cols-3 gap-1 font-medium" role="tablist">
                        {["SMS", "App", "Mail"].map((mur) => (
                            <div
                                key={mur}
                                className={`flex-1 cursor-pointer rounded-md py-2 text-center ${turul === mur ? "bg-green-500 text-white" : ""
                                    }`}
                                onClick={() => setTurul(mur)}
                            >
                                {mur}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div data-aos="fade-right" data-aos-duration="1000">
                <Select placeholder={t("Загварын төрөл")} onChange={setBarimt} className="w-full rounded-md">
                    {mailiinZagvarGaralt?.jagsaalt?.map((a) => (
                        <Select.Option key={a._id} value={a.mail} >
                            {a.ner}
                        </Select.Option>
                    ))}
                </Select>
                <div data-aos="fade-right" data-aos-duration="1000" className="  w-full  flex justify-end flex-row">
                    <div className="space-x-3 space-y-3"> 
                    <Button onClick={khaaya}>{t("Хаах")}</Button>
                    <Button type="primary" onClick={send} >{t("Илгээх")}</Button>
                    </div>
                </div>
            </div>
            
        </div>
    );
}

export default React.forwardRef(GuilgeeKhiikh);
