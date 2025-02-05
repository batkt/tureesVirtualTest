const khatuuZagvarGotoMT = (medeelel, ajiltan, baiguullaga, barilgiinId) => {
  return `
  <div style="height: 100%; width: 100%; page-break-after: always;">
    <div style="display: block; width: 100%; text-align: center; padding-top:1.5rem;">
      <b>НЭХЭМЖЛЭХ</b>
    </div>
    <div style="display: flex; width: 100%; align-items: flex-start; justify-content: space-between;">
      <div style="display: block; width: 30%;">
        <p style="font-weight: 600;">Төлөгч:</p>
        <div style="display: flex; align-items: flex-start; justify-content: space-between;">
          <p style="white-space: nowrap;">Нэр:</p>
        </div>
        <div style="display: flex; align-items: flex-start; justify-content: space-between;">
          <p style="white-space: nowrap;">Регистрийн дугаар:</p>
        </div>
        <div style="display: flex; align-items: flex-start; justify-content: space-between;">
          <p style="white-space: nowrap;">Гэрээний дугаар:</p>
        </div>
        <div style="display: flex; align-items: flex-start; justify-content: space-between;">
          <p style="white-space: nowrap;">Талбайн дугаар:</p>
        </div>
        <div style="display: flex; align-items: flex-start; justify-content: space-between;">
          <p style="white-space: nowrap;">Талбайн хэмжээ:</p>
        </div>
        <div style="display: flex; align-items: flex-start; justify-content: space-between;">
          <p style="white-space: nowrap;">Нэхэмжилсэн огноо:</p>
        </div>
        <div style="display: flex; align-items: flex-start; justify-content: space-between;">
          <p style="white-space: nowrap;">Төлбөр хийх хугацаа:</p>
        </div>
      </div>
      <div style="display: block; width: 70%;">
        <p style="font-weight: 600;">&nbsp;&nbsp;&nbsp;</p>
        <div style="display: flex; align-items: flex-start; justify-content: space-between;">
          <p style="white-space: nowrap;"></p>
          <p style="width: 100%; text-align: left; font-weight: 600;">
            &lt;ner&gt;
          </p>
        </div>
        <div style="display: flex; align-items: flex-start; justify-content: space-between;">
          <p style="white-space: nowrap;"></p>
          <p style="width: 100%; text-align: left; font-weight: 600;">
            ${medeelel?.register || ""}
          </p>
        </div>
        <div style="display: flex; align-items: flex-start; justify-content: space-between;">
          <p style="white-space: nowrap;"></p>
          <p style="width: 100%; text-align: left; font-weight: 600;">
            &lt;gereeniiDugaar&gt;
          </p>
        </div>
        <div style="display: flex; align-items: flex-start; justify-content: space-between;">
          <p style="white-space: nowrap;"></p>
          <p style="width: 100%; text-align: left; font-weight: 600;">
            &lt;talbainDugaar&gt;
          </p>
        </div>
        <div style="display: flex; align-items: flex-start; justify-content: space-between;">
          <p style="white-space: nowrap;"></p>
          <p style="width: 100%; text-align: left; font-weight: 600;">
            &lt;talbainKhemjee&gt;
          </p>
        </div>
        <div style="display: flex; align-items: flex-start; justify-content: space-between;">
          <p style="white-space: nowrap;"></p>
          <p style="width: 100%; text-align: left; font-weight: 600;">
            &lt;ekhelkhSar&gt;/&lt;ekhlekhUdur&gt;/&lt;ekhlekhOn&gt;
          </p>
        </div>
        <div style="display: flex; align-items: flex-start; justify-content: space-between;">
          <p style="white-space: nowrap;"></p>
          <p style="width: 100%; text-align: left; font-weight: 600;">
            &lt;duusakhSar&gt;/&lt;duusakhUdur&gt;/&lt;duusakhOn&gt;
          </p>
        </div>
      </div>
    </div>
    <table style="margin-top: 2rem; width: 100%;">
      <thead style="background-color: #d1d5db; font-weight: 600;">
        <tr>
          <td style="border: 1px solid #000; text-align: center;">Төлбөрийн төрөл</td>
          <td style="border: 1px solid #000; text-align: center;">Хугацаа</td>
          <td style="border: 1px solid #000; text-align: center;">Төлөх дүн</td>
          <td style="border: 1px solid #000; text-align: center;">Нэхэмжлэгч байгууллага</td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="border: 1px solid #000; text-align: left; font-weight: 600;">
            Барьцаа
          </td>
          <td style="border: 1px solid #000; text-align: right;"></td>
          <td style="border: 1px solid #000; text-align: right;">
            &lt;baritsaaUldegdel&gt;
          </td>
          <td style="border: 1px solid #000; text-align: center;" rowspan="6">
            <div style="display: block;">
              ХААН БАНК
            </div>
            <div style="display: block;">
              "Мастер түншлэл"
            </div>
            <div style="display: block;">
              ХХК: &lt;dans&gt; 
            </div>
          </td>
        </tr>
        <tr>
          <td style="border: 1px solid #000; text-align: left; font-weight: 600;">
            Эхний үлдэгдэл
          </td>
          <td style="border: 1px solid #000; text-align: right;"></td>
          <td style="border: 1px solid #000; text-align: right;">
            &lt;umnukhSariinUrTulbur&gt;
          </td>
        </tr>
        <tr>
          <td style="border: 1px solid #000; text-align: left; font-weight: 600;">
            Алданги
          </td>
          <td style="border: 1px solid #000; text-align: right;"></td>
          <td style="border: 1px solid #000; text-align: right;">
            &lt;aldangiinUldegdel&gt;
          </td>
        </tr>
        ${medeelel.zardluud
          .sort((a, b) => {
          return a.tailbar.localeCompare(b.tailbar, "en", {
            sensitivity: "base",
          });
          })
          .filter(a => a.tailbar === "Тавилга түрээс" || a.tailbar === "Худалдааны менежмент")
          .map((mur, index) => {
          return `
            <tr key=${index}>
              <td style="border: 1px solid #000; text-align: left; font-weight: 600;">
                ${mur.tailbar}
              </td>
              <td style="border: 1px solid #000; text-align: center;">
                &lt;KhhurunguEkhlekhSar&gt;/&lt;KhhurunguEkhlekhUdur&gt;-&lt;KhhurunguDuusakhSar&gt;/&lt;KhhurunguDuusakhUdur&gt;
              </td>
              <td style="border: 1px solid #000; text-align: right;">&lt;${
                mur.tailbar
              }.khungulultKhassanTulukhDun&gt;</td>
            </tr>
          `;
          })
          .join("")}
        <tr>
          <td style="border: 1px solid #000; text-align: left; font-weight: 600;">
            Түрээс
          </td>
          <td style="border: 1px solid #000; text-align: center;">
            &lt;tureesEkhlehUdur&gt;-&lt;tureesDuusakhUdur&gt;
          </td>
          <td style="border: 1px solid #000; text-align: right;">&lt;khungulsunTalbainNiitUne&gt;</td>
        </tr>
        <tr>
          <td style="border: 1px solid #000; text-align: center; font-weight: 600;" colspan="2">
            НИЙТ ТӨЛӨХ ДҮН
          </td>
          <td style="border: 1px solid #000; text-align: right; font-weight: bold;">
            &lt;niilberDunGoto&gt;
          </td>
        </tr>
        <tr>
          <td style="border: 1px solid #000; text-align: center; font-weight: bold;" colspan="4">
            &lt;niilberDunGotoUsgeer&gt;
          </td>
        </tr>
      </tbody>
    </table>
    <table style="margin-top: 2rem; width: 100%; margin-bottom:2rem;">
      <thead style="background-color: #d1d5db; font-weight: 600;">
        <tr>
          <td style="border: 1px solid #000; text-align: right; font-weight: bold;">ГҮЙЛГЭЭНИЙ УТГА:</td>
          <td style="border: 1px solid #000; text-align: left; font-weight: bold;" colspan="4">РЕГИСТРИЙН ДУГААР БОЛОН ТАЛБАЙН ДУГААР БИЧНЭ ҮҮ</td>
        </tr>
      </thead>
    </table>
    <div style="width: 100%; text-align: left;">
      <b>АНХААРУУЛГА:</b>
    </div>
    <div style="width: 100%; text-align: left;">
      1. Гэрээний заалтын дагуу төлбөрийг сар бүрийн 20-нд багтаан төлөх.
    </div>
    <div style="width: 100%; text-align: left;">
      2. Түрээсийн төлбөр хугацаандаа төлөгдөөгүй тохиолдолд хугацаа хэтэрсэн хоног тутамд 0.08% -иар алданги тооцно.
    </div>
    <div style="display: block; width: 100%; text-align: left;">
      3. Хөрөнгийн менежмент, ашиглалтын төлбөр хугацаандаа төлөгдөөгүй тохиолдолд хугацаа хэтэрсэн хоног тутамд 0.5%-р алданги тооцно
    </div>
    <div style="display: block; width: 100%; text-align: left;">
      4. Гүйлгээний утга дээр гэрээлсэн байгууллага, хувь хүний регистрийн дугаар болон талбайн дугаарыг бичнэ үү.
    </div>
    <div style="display: block; width: 100%; text-align: left; margin-top: 2rem; ">
      Мастер түншлэл ХХК
    </div>
    <div style="display: flex; width: 100%; align-items: flex-start; justify-content: space-between;">
      <div style="width: 80%;">
        <div style="margin-top: 1rem; display: flex; align-items: flex-start; justify-content: space-between;">
          <p style="white-space: nowrap;">Нягтлан бодогч: &nbsp;&nbsp;&nbsp;&nbsp;&lt;gariinUseg&gt;</p>
          <p style="width: 40%; text-align: left; font-weight: 600;">
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; /С.Туяацэцэг/
          </p>  
        </div>
        <div style="margin-top: 1rem; display: flex; align-items: flex-start; justify-content: space-between;">
          Холбогдох утас: 99900335
        </div>
        <div style="margin-top: 1rem; display: flex; align-items: flex-start; justify-content: space-between;">
          <p style="white-space: nowrap;">Хүлээн зөвшөөрсөн...................................</p>
          <p style="width: 40%; text-align: left; font-weight: 600;">
            &lt;ner&gt;
          </p>
        <div>
      </div>
      <div style="width: 20%;">
        &lt;tamga&gt;
      </div>
    </div>
  </div>`;
};
export default khatuuZagvarGotoMT;
