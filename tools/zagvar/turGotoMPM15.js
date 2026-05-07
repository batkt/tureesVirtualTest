const khatuuZagvarGotoMPM15 = (medeelel, ajiltan, baiguullaga, barilgiinId) => {
  const barilga = baiguullaga?.barilguud?.find((a) => a._id === barilgiinId);
  return `

  <div style="height: 100%; width: 100%; page-break-after: always; font-family: 'Arial', serif; font-size: 8pt; line-height: 1.2;">
    <div style="display: block; width: 100%; text-align: center; padding-top:1.5rem;">
      <b>НЭХЭМЖЛЭХ</b>
    </div>
    <div style="display: flex; width: 100%; align-items: flex-start; justify-content: space-between; gap: 4px;">
  <div style="display: block; width: 30%; gap: 2px;">
    <p style="white-space: nowrap; margin: 0;">Төлөгч:</p>
    <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 2px;">
      <p style="white-space: nowrap; margin: 0;">Нэр:</p>
    </div>
    <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 2px;">
      <p style="white-space: nowrap; margin: 0;">Регистрийн дугаар:</p>
    </div>
    <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 2px;">
      <p style="white-space: nowrap; margin: 0;">Гэрээний дугаар:</p>
    </div>
    <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 2px;">
      <p style="white-space: nowrap; margin: 0;">Талбайн дугаар:</p>
    </div>
    <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 2px;">
      <p style="white-space: nowrap; margin: 0;">Талбайн хэмжээ:</p>
    </div>
    <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 2px;">
      <p style="white-space: nowrap; margin: 0;">Нэхэмжилсэн огноо:</p>
    </div>
    <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 2px;">
      <p style="white-space: nowrap; margin: 0;">Төлбөр хийх хугацаа: ${
        !!medeelel?.nekhemjlekhTulukhUdur
          ? medeelel.nekhemjlekhTulukhUdur
          : "&lt;duusakhSar&gt;/&lt;duusakhUdur&gt;/&lt;duusakhOn&gt;"
      }</p>
    </div>
  </div>

  <div style="display: block; width: 70%; gap: 2px;">
  <p style="font-weight: 600; margin: 0;">&nbsp;&nbsp;&nbsp;</p>

  <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 2px;">
    <p style="white-space: nowrap; margin: 0;"></p>
    <p style="width: 100%; text-align: left; font-weight: 600; margin: 0;">
      &lt;ner&gt;
    </p>
  </div>

  <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 2px;">
    <p style="white-space: nowrap; margin: 0;"></p>
    <p style="width: 100%; text-align: left; font-weight: 600; margin: 0;">
      ${medeelel?.register || ""}
    </p>
  </div>

  <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 2px;">
    <p style="white-space: nowrap; margin: 0;"></p>
    <p style="width: 100%; text-align: left; font-weight: 600; margin: 0;">
      &lt;gereeniiDugaar&gt;
    </p>
  </div>

  <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 2px;">
    <p style="white-space: nowrap; margin: 0;"></p>
    <p style="width: 100%; text-align: left; font-weight: 600; margin: 0;">
      &lt;talbainDugaar&gt;
    </p>
  </div>

  <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 2px;">
    <p style="white-space: nowrap; margin: 0;"></p>
    <p style="width: 100%; text-align: left; font-weight: 600; margin: 0;">
      &lt;talbainKhemjee&gt;
    </p>
  </div>

  <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 2px;">
    <p style="white-space: nowrap; margin: 0;"></p>
    <p style="width: 100%; text-align: left; font-weight: 600; margin: 0;">
      &lt;ekhelkhSar&gt;/&lt;ekhlekhUdur&gt;/&lt;ekhlekhOn&gt;
    </p>
  </div>

  <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 2px;">
    <p style="white-space: nowrap; margin: 0;"></p>
    <p style="width: 100%; text-align: left; font-weight: 600; margin: 0;">
      &lt;duusakhSar&gt;/&lt;duusakhUdur&gt;/&lt;duusakhOn&gt;
    </p>
  </div>
</div>

</div>

    <table style="margin-top: 0.5rem; width: 100%; font-weight: bold; font-family: 'Arial', serif; font-size: 8pt; line-height: 1.2;">
      <thead style="background-color: #d1d5db; font-weight: 600;">
        <tr>
          <td style="border: 0.2px solid #000; text-align: center; " colspan="3">Төлбөрийн төрөл</td>
          <td style="border: 0.2px solid #000; text-align: center;">Төлөх дүн</td>
          <td style="border: 0.2px solid #000; text-align: center;">Санамж</td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="border: 0.2px solid #000; text-align: left; font-weight: 600;" colspan="3">
            Эхний үлдэгдэл
          </td>
          <td style="border: 0.2px solid #000; text-align: right;">
            &lt;umnukhSariinUrTulbur&gt;
          </td>
          <td style="border: 0.2px solid #000; text-align: left;" rowspan="2"></td>
        </tr>
        <tr>
          <td style="border: 0.2px solid #000; text-align: left; font-weight: 600;" colspan="3">
            Алданги
          </td>
          <td style="border: 0.2px solid #000; text-align: right;">
            &lt;aldangiinUldegdel&gt;
          </td>
        </tr>
      </tbody>
    </table>
    <table style="margin-top: 0.5rem; width: 100%; font-family: 'Arial', serif; font-size: 8pt; line-height: 1.2;">
      <thead style="background-color: #d1d5db; font-weight: 600;">
        <tr>
          <td style="border: 0.2px solid #000; text-align: center;">Төлбөрийн төрөл</td>
          <td style="border: 0.2px solid #000; text-align: center;">Хугацаа</td>
          <td style="border: 0.2px solid #000; text-align: center;">Дүн</td>
          <td style="border: 0.2px solid #000; text-align: center;">Төлөх дүн</td>
          <td style="border: 0.2px solid #000; text-align: center;">Нэхэмжлэгч байгууллага</td>
        </tr>
      </thead>
      <tbody>
        ${
          medeelel.zardluud.filter(
            (a) =>
              a.tailbar?.includes("Хөрөнгийн менежмент") ||
              a.tailbar === "Худалдааны менежмент",
          ).length > 0
            ? ""
            : `
        <tr>
          <td style="border: 0.2px solid #000; text-align: left;">&nbsp;</td>
          <td style="border: 0.2px solid #000; text-align: left;">&nbsp;</td>
          <td style="border: 0.2px solid #000; text-align: left;">&nbsp;</td>
          <td style="border: 0.2px solid #000; text-align: left;">&nbsp;</td>
          <td style="border: 0.2px solid #000; text-align: center;" rowspan=&lt;gotoMPMCount&gt;>
            <div style="display: block;">
              Мастер проперти
            </div>
            <div style="display: block;">
              менежмент ХХК Хаан 
            </div>
            <div style="display: block;">
              банк: &lt;dans&gt; 
            </div>
            <div style="display: block;">
              IBAN: &lt;ibanDugaar&gt; 
            </div>
          </td>
        </tr>
        `
        }
        ${medeelel.zardluud
          .sort((a, b) => {
            return a.tailbar.localeCompare(b.tailbar, "en", {
              sensitivity: "base",
            });
          })
          .filter(
            (a) =>
              a.tailbar?.includes("Хөрөнгийн менежмент") ||
              a.tailbar?.includes("Худалдааны менежмент"),
          )
          .map((mur, index) => {
            return `
            <tr key=${index}>
              <td style="border: 0.2px solid #000; text-align: left;">
                ${mur.tailbar}
              </td>
              <td style="border: 0.2px solid #000; text-align: center;">
                &lt;KhhurunguEkhlekhSar&gt;/&lt;KhhurunguEkhlekhUdur&gt;-&lt;KhhurunguDuusakhSar&gt;/&lt;KhhurunguDuusakhUdur&gt;
              </td>
              <td style="border: 0.2px solid #000; text-align: left;">
              </td>
              <td style="border: 0.2px solid #000; text-align: right;">&lt;${
                mur.tailbar
              }.khungulultKhassanTulukhDun&gt;</td>
              ${
                index === 0
                  ? `<td style="border: 0.2px solid #000; text-align: center;" rowspan=&lt;gotoMPMCount&gt;>
                <div style="display: block;">
                  Мастер проперти
                </div>
                <div style="display: block;">
                  менежмент ХХК Хаан 
                </div>
                <div style="display: block;">
                  банк: &lt;dans&gt; 
                </div>
                <div style="display: block;">
                  IBAN: &lt;ibanDugaar&gt; 
                </div>
              </td>`
                  : ""
              }
            </tr>
          `;
          })
          .join("")}
        <tr>
          <td style="border: 0.2px solid #000; text-align: left; font-weight: 600;">
            Ашиглалт
          </td>
          <td style="border: 0.2px solid #000; text-align: right;"></td>
          <td style="border: 0.2px solid #000; text-align: left;"></td>
          <td style="border: 0.2px solid #000; text-align: right;">
            &lt;niilberAshiglaltDunGoTo&gt;
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
              a.tailbar?.includes("Цахилгаан") ||
              a.tailbar === "Эрүүл ахуйч" ||
              a.tailbar === "Харуул хамгаалалт, ОБЕГ, ХАБ" ||
              a.tailbar === "Дулаан" ||
              a.tailbar === "Ус",
          )
          .map((mur, index) => {
            return `
            <tr key=${index}>
              <td style="border: 0.2px solid #000; text-align: left;">
                ${mur.tailbar}
              </td>
              <td style="border: 0.2px solid #000; text-align: center;">
                &lt;ashiglaltEkhlehUdur&gt;-&lt;ashiglaltDuusakhUdur&gt;
              </td>
              <td style="border: 0.2px solid #000; text-align: right;">&lt;${
                mur.tailbar
              }.khungulultKhassanTulukhDun&gt;</td>
              ${
                index === 0
                  ? `<td style="border: 0.2px solid #000; text-align: left;" rowspan=&lt;ashiglaltCount&gt;>`
                  : ""
              }
            </tr>
          `;
          })
          .join("")}
          <tr>
            <td style="border: 0.2px solid #000; text-align: left; font-weight: 600;">
              Түрээс
            </td>
            <td style="border: 0.2px solid #000; text-align: center;">
              &lt;tureesEkhlehUdur&gt;-&lt;tureesDuusakhUdur&gt;
            </td>
            <td style="border: 0.2px solid #000; text-align: left;"></td>
            <td style="border: 0.2px solid #000; text-align: right;">&lt;khungulsunTalbainNiitUne&gt;</td>
          </tr>
          <tr>
            <td style="border: 0.2px solid #000; text-align: right; font-weight: 600;" colspan="3">
              НЭХЭМЖЛЭЛ ДҮН
            </td>
            <td style="border: 0.2px solid #000; text-align: right; font-weight: bold;">
              &lt;niilberNekhemjlelDunGoto&gt;
            </td>
          </tr>
          <tr>
            <td style="border: 0.2px solid #000; text-align: center; font-weight: 600;" colspan="3">
              НИЙТ ТӨЛӨХ ДҮН
            </td>
            <td style="border: 0.2px solid #000; text-align: right; font-weight: bold;">
              &lt;niilberDunGoto&gt;
            </td>
          </tr>
          <tr>
            <td style="border: 0.2px solid #000; text-align: center; font-weight: bold;" colspan="4">
              &lt;niilberDunGotoUsgeer&gt;
            </td>
          </tr>
      </tbody>
    </table>
    <table style="margin-top: 2rem; width: 100%; margin-bottom:2rem; font-family: 'Arial', serif; font-size: 8pt; line-height: 1.2;">
      <thead style="background-color: #d1d5db; font-weight: 600;">
        <tr>
          <td style="border: 0.2px solid #000; text-align: right; font-weight: bold;">ГҮЙЛГЭЭНИЙ УТГА:</td>
          <td style="border: 0.2px solid #000; text-align: left; font-weight: bold;" colspan="4">РЕГИСТРИЙН ДУГААР БОЛОН ТАЛБАЙН ДУГААР БИЧНЭ ҮҮ</td>
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
  <div style="display: block; width: 100%; text-align: left; margin-top: 0; ">
      Мастер проперти менежмент ХХК
  </div>
  <div style="display: flex; width: 100%; align-items: flex-start;">
      <div style="width: 80%;">
        <div style="margin-top: 0; display: flex; align-items: flex-start; justify-content: space-between;">
          <p style="white-space: nowrap; z-index:-10;">Нягтлан бодогч: &nbsp;&nbsp;&nbsp;&nbsp;&lt;gariinUseg1&gt;</p>
          <p style="width: 40%; text-align: left; font-weight: 600;">
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; /${barilga?.nyagtlan || ""}/
          </p>  
        </div>
        <div style="margin-top: 1rem; display: flex; align-items: flex-start; justify-content: space-between;">
          Холбогдох утас: 9990-0335
        </div>
        <div style="margin-top: 0; display: flex; align-items: flex-start; justify-content: space-between;">
          <p style="white-space: nowrap;">Хүлээн зөвшөөрсөн...................................</p>
          <p style="width: 40%; text-align: left; font-weight: 600;">
            &lt;ner&gt;
          </p>
        </div>
      </div>
      <div style="width: 20%;">
        &lt;tamga1&gt;
      </div>
  </div>
  </div>`;
};
export default khatuuZagvarGotoMPM15;
