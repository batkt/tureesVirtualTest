const khatuuZagvarGotoMT15 = (medeelel, ajiltan, baiguullaga, barilgiinId) => {
  return `
  <div style="height: 100%; width: 100%; page-break-after: always;">
    <div style="display: block; width: 100%; text-align: center; padding-top:1.5rem;">
      <b>НЭХЭМЖЛЭХ</b>
    </div>
    <div style="display: flex; width: 100%; align-items: flex-start; justify-content: space-between;">
  <!-- LEFT COLUMN -->
  <div style="display: block; width: 30%;">
    <p style="font-weight: 600; margin: 0;">Төлөгч:</p>
    <div><p style="white-space: nowrap; margin: 0;">Нэр:</p></div>
    <div><p style="white-space: nowrap; margin: 0;">Регистрийн дугаар:</p></div>
    <div><p style="white-space: nowrap; margin: 0;">Гэрээний дугаар:</p></div>
    <div><p style="white-space: nowrap; margin: 0;">Талбайн дугаар:</p></div>
    <div><p style="white-space: nowrap; margin: 0;">Талбайн хэмжээ:</p></div>
    <div><p style="white-space: nowrap; margin: 0;">Нэхэмжилсэн огноо:</p></div>
    <div><p style="white-space: nowrap; margin: 0;">Төлбөр хийх хугацаа:</p></div>
  </div>

  <!-- RIGHT COLUMN -->
  <div style="display: block; width: 70%;">
    <p style="font-weight: 600; margin: 0;">&nbsp;&nbsp;&nbsp;</p>

    <div style="display: flex; align-items: flex-start; justify-content: space-between;">
      <p style="white-space: nowrap; margin: 0;"></p>
      <p style="width: 100%; text-align: left; font-weight: 600; margin: 0;">&lt;ner&gt;</p>
    </div>

    <div style="display: flex; align-items: flex-start; justify-content: space-between;">
      <p style="white-space: nowrap; margin: 0;"></p>
      <p style="width: 100%; text-align: left; font-weight: 600; margin: 0;">
        ${medeelel?.register || ""}
      </p>
    </div>

    <div style="display: flex; align-items: flex-start; justify-content: space-between;">
      <p style="white-space: nowrap; margin: 0;"></p>
      <p style="width: 100%; text-align: left; font-weight: 600; margin: 0;">&lt;gereeniiDugaar&gt;</p>
    </div>

    <div style="display: flex; align-items: flex-start; justify-content: space-between;">
      <p style="white-space: nowrap; margin: 0;"></p>
      <p style="width: 100%; text-align: left; font-weight: 600; margin: 0;">&lt;talbainDugaar&gt;</p>
    </div>

    <div style="display: flex; align-items: flex-start; justify-content: space-between;">
      <p style="white-space: nowrap; margin: 0;"></p>
      <p style="width: 100%; text-align: left; font-weight: 600; margin: 0;">&lt;talbainKhemjee&gt;</p>
    </div>

    <div style="display: flex; align-items: flex-start; justify-content: space-between;">
      <p style="white-space: nowrap; margin: 0;"></p>
      <p style="width: 100%; text-align: left; font-weight: 600; margin: 0;">
        &lt;ekhelkhSar&gt;/&lt;ekhlekhUdur&gt;/&lt;ekhlekhOn&gt;
      </p>
    </div>

    <div style="display: flex; align-items: flex-start; justify-content: space-between;">
      <p style="white-space: nowrap; margin: 0;"></p>
      <p style="width: 100%; text-align: left; font-weight: 600; margin: 0;">
        ${
          !!medeelel?.nekhemjlekhTulukhUdur
            ? "&lt;nekhemjlekhTulukhUdur&gt;"
            : "&lt;duusakhSar&gt;/&lt;duusakhUdur&gt;/&lt;duusakhOn&gt;"
        }
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
          <td style="border: 1px solid #000; text-align: center;" rowspan=&lt;gotoMTCount&gt;>
            <div style="display: block;">
              ХААН БАНК
            </div>
            <div style="display: block;">
              "Мастер түншлэл"
            </div>
            <div style="display: block;">
              ХХК: &lt;dans&gt; 
            </div>
            <div style="display: block;">
              IBAN: &lt;ibanDugaar&gt; 
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
          .filter(
            (a) =>
              a.tailbar === "Тавилга түрээс" ||
              a.tailbar === "Худалдааны менежмент" ||
              a.tailbar === "Түрээсийн төлбөр нэмэлт",
          )
          .map((mur, index) => {
            return `
            <tr key=${index}>
              <td style="border: 1px solid #000; text-align: left; font-weight: 600;">
                ${mur.tailbar}
              </td>
              <td style="border: 1px solid #000; text-align: center;">
                &lt;tureesEkhlehUdur&gt;-&lt;tureesDuusakhUdur&gt;
              </td>
              <td style="border: 1px solid #000; text-align: right;">&lt;${mur.tailbar}.khungulultKhassanTulukhDun&gt;</td>
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
          <td style="border: 1px solid #000; text-align: center; font-weight: bold;" colspan="3">
            &lt;niilberDunGotoUsgeer&gt;
          </td>
        </tr>
      </tbody>
    </table>
    <table style="margin-top: 2rem; width: 100%; margin-bottom:0;">
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
      1. Гэрээний заалтын дагуу төлбөрийг сар бүрийн 15-нд багтаан төлөх.
    </div>
    <div style="width: 100%; text-align: left;">
      2. Түрээсийн төлбөр хугацаандаа төлөгдөөгүй тохиолдолд хугацаа хэтэрсэн хоног тутамд 0.5% -иар алданги тооцно.
    </div>
    <div style="display: block; width: 100%; text-align: left;">
      3. Хөрөнгийн менежмент, ашиглалтын төлбөр хугацаандаа төлөгдөөгүй тохиолдолд хугацаа хэтэрсэн хоног тутамд 0.5%-р алданги тооцно
    </div>
    <div style="display: block; width: 100%; text-align: left;">
      4. Гүйлгээний утга дээр гэрээлсэн байгууллага, хувь хүний регистрийн дугаар болон талбайн дугаарыг бичнэ үү.
    </div>
    <div style="display: block; width: 100%; text-align: left; margin: 0; padding:0;">
      Мастер түншлэл ХХК
    </div>
    <div style="display: flex; width: 100%; align-items: flex-start; margin-top: 0; padding:0;">
      <div style="width: 80%;">
        <div style="margin-top: 1rem; display: flex; align-items: flex-start; justify-content: space-between;">
          <p style="white-space: nowrap;">Нягтлан бодогч: &nbsp;&lt;gariinUseg&gt;</p>
          <p style="width: 40%; text-align: left; margin-top: 3.3rem; font-weight: 600;">
            &nbsp;&nbsp;&nbsp;&nbsp;/Б.Бат-Өлзий/
          </p>  
        </div>
        <div style="margin-top: 0; display: flex; align-items: flex-start; justify-content: space-between;">
          Холбогдох утас: 9990-0335
        </div>
        <div style="margin-top: 0; display: flex; align-items: flex-start; justify-content: space-between;">
          <p style="white-space: nowrap;">Хүлээн зөвшөөрсөн...................................</p>
          <p style="width: 40%; text-align: left; font-weight: 600;">
            &lt;ner&gt; 
          </p>
        <div>
      </div>
      <div style="width: 20%; z-index:999">
        &lt;tamga&gt;
      </div>
    </div>
  </div>`;
};
export default khatuuZagvarGotoMT15;
