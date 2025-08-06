const khatuuZagvarFoodCity = (medeelel, ajiltan, baiguullaga) => {
  const today = new Date();
  const duusakhUdur = 20;
  const duusakhSar = today.getMonth() + 1;
  const duusakhOn = today.getFullYear();

  return `

  <div style="height: 100%; width: 100%; font-family: 'Times New Roman', serif; font-size: 10pt; line-height: 1.2;">
  <style>
    p {
      margin: 0;
      padding: 0;
    }
  </style>
    <div style="text-align: right;">
      <b>Санхүү, эдийн засгийн сайдын, &nbsp;&nbsp;<br />
      2017 оны 12 сарын 05-өдөр 347 <br />
        тоот тушаалын хавсралт&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      </b>
    </div>
    <div style="text-align: center;">
      <b>НЭХЭМЖЛЭХ №</b>
    </div>
    <div style="display: flex; width: 100%; align-items: flex-start; gap: 1%;">
      <div style="display: block; width: 50%;">
        <p style="font-weight: 600;"><b>Нэхэмжлэгч:</b></p>
        <div style="display: flex; align-items: flex-start; justify-content: space-between;">
          <p style="white-space: nowrap;">Байгууллагын нэр:</p>
          <p style="width: 100%; text-align: left; font-weight: 600;">
            &nbsp;${baiguullaga.ner} РД:2565935
          </p>
        </div>
        <div style="display: flex; align-items: flex-start; justify-content: space-between;">
          <p style="white-space: nowrap;">Хаяг:</p>
          <p style="width: 100%; text-align: left; font-weight: 600;">
            &nbsp;${baiguullaga?.khayag || ""}
          </p>
        </div>
        <div style="display: flex; align-items: flex-start; justify-content: space-between;">
          <p style="white-space: nowrap;">Утас, Факс:</p>
          <p style="width: 100%; text-align: left; font-weight: 600;">
            &nbsp;76081111
          </p>
        </div>

        <div style="display: flex; align-items: flex-start; justify-content: space-between;">
          <p style="white-space: nowrap;">Э-шуудан:</p>
          <p style="width: 100%; text-align: left; font-weight: 600;">
          &nbsp;${baiguullaga?.mail?.join(",")}
          </p>
        </div>
        <div style="display: flex; align-items: flex-start; justify-content: space-between;">
          <p style="white-space: nowrap;"><b>Банкны нэр:</b></p>
          <p style="width: 100%; text-align: left; font-weight: 600;">
            <b>&nbsp;&lt;bank&gt;&nbsp;&lt;dansniiNer&gt;</b>
          </p>
        </div>
        <div style="display: flex; align-items: flex-start; justify-content: space-between;">
          <p style="white-space: nowrap;"><b>Банкны данс:</b></p>
          <p style="width: 100%; text-align: left; font-weight: 600;">
            <b>&nbsp;&lt;dans&gt;</b>
          </p>
        </div>
        <div style="display: flex; align-items: flex-start; justify-content: space-between;">
          <p style="white-space: nowrap;">Хамрах хугацаа:</p>
          <p style="width: 100%; text-align: left; font-weight: 600;">
            &nbsp;&lt;eneEkhlehUdur&gt;-&lt;eneDuusakhUdur&gt;
          </p>
        </div>
      </div>
      <div style="display: block; width: 50%;">
        <p style="font-weight: 600;"><b>Төлөгч:</b></p>
        <div style="display: flex; align-items: flex-start; justify-content: space-between;">
          <p style="white-space: nowrap;">Байгууллагын нэр:</p>
          <p style="width: 100%; text-align: left; font-weight: 600;">
            &nbsp;&lt;ner&gt;
          </p>
        </div>
        <div style="display: flex; align-items: flex-start; justify-content: space-between;">
          <p style="white-space: nowrap;">Хаяг:</p>
          <p style="width: 100%; text-align: left; font-weight: 600;">
            &nbsp;${medeelel?.khayag || ""}
          </p>
        </div>
        <div style="display: flex; align-items: flex-start; justify-content: space-between;">
          <p style="white-space: nowrap;">Гэрээний №:</p>
          <p style="width: 100%; text-align: left; font-weight: 600;">
            &nbsp;&lt;gereeniiDugaar&gt;
          </p>
        </div>
        <div style="display: flex; align-items: flex-start; justify-content: space-between;">
          <br/>
        </div>
        <div style="display: flex; align-items: flex-start; justify-content: space-between;">
          <p style="white-space: nowrap;"><b>Нэхэмжилсэн огноо:</b></p>
          <p style="width: 100%; text-align: left; font-weight: 600;">
            <b>&nbsp;&lt;ekhelkhSar&gt;/&lt;ekhlekhUdur&gt;/&lt;ekhlekhOn&gt;</b>
          </p>
        </div>
        <div style="display: flex; align-items: flex-start; justify-content: space-between;">
          <p style="white-space: nowrap;"><b>Төлбөр хийх хугацаа:</b></p>
          <p style="width: 100%; text-align: left; font-weight: 600;">
            <b>&nbsp;${String(duusakhSar).padStart(2, "0")}/${String(
    duusakhUdur
  ).padStart(2, "0")}/${duusakhOn}</b>
          </p>

        </div>


      </div>
    </div>
    <div style="text-align: right;">
      <b>Эхний үлдэгдэл: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;umnukhSariinUrTulbur&gt;&nbsp;&nbsp;</b><br />
    </div>
    <div>
      <table style="width: 100%;">
        <thead style="font-weight: 600;">
          <tr>
            <td style="border: 1px solid #000; text-align: center;">№</td>
            <td style="border: 1px solid #000; text-align: center;" colspan="4">Гүйлгээний утга</td>
            <td style="border: 1px solid #000; text-align: center;">Талбайн хэмжээ</td>
            <td style="border: 1px solid #000; text-align: center;">Нэгжийн үнэ</td>
            <td style="border: 1px solid #000; text-align: center;">Хөнгөлөлт</td>
            <td style="border: 1px solid #000; text-align: center;" colspan="2">Нийт үнэ</td>
          </tr>
        </thead>  
        <tbody>
          ${medeelel.zardluud
            .sort((a, b) => {
              return a.tailbar.localeCompare(b.tailbar, "en", {
                sensitivity: "base",
              });
            })
            .filter(
              (a) =>
                a.tailbar === "Түрээс хуучин үнэ 8/01-8/15 хооронд" ||
                a.tailbar === "Түрээс шинэ үнэ 8/16-8/31 хооронд"
            )
            .map((mur, index) => {
              return `
              <tr key=${index}>
                <td style="border: 1px solid #000; text-align: center;">${
                  index + 1
                }</td>
                <td style="border: 1px solid #000; text-align: left;" colspan="4">
                  ${mur.tailbar}
                </td>
                <td style="border: 1px solid #000; text-align: right;">
                  &lt;${mur.tailbar}.negj&gt;
                </td>
                <td style="border: 1px solid #000; text-align: right;">
                  &lt;${mur.tailbar}.tariff&gt;
                </td>
                <td style="border: 1px solid #000; text-align: right; width: 16%;">
                  &lt;${mur.tailbar}.khungulult&gt;
                </td>
                <td style="border: 1px solid #000; text-align: right;">
                  &lt;${mur.tailbar}.tulukhDun&gt;
                </td>
              </tr>
            `;
            })
            .join("")}
        ${
          medeelel.zardluud.filter(
            (a) =>
              a.tailbar === "Түрээс хуучин үнэ 8/01-8/15 хооронд" ||
              a.tailbar === "Түрээс шинэ үнэ 8/16-8/31 хооронд" ||
              a.tailbar === "Түрээсийн төлбөр нэмэлт"
          ).length > 0
            ? ""
            : `
          <tr>
            <td style="border: 1px solid #000; text-align: center;">1</td>
            <td style="border: 1px solid #000; text-align: left;" colspan="4">Түрээсийн төлбөр</td>
            <td style="border: 1px solid #000; text-align: right;">&lt;talbainKhemjee&gt;</td>
            <td style="border: 1px solid #000; text-align: right;">&lt;talbainNegjUne&gt;</td>
            <td style="border: 1px solid #000; text-align: right; width: 16%;">&lt;khungulult&gt;</td>
            <td style="border: 1px solid #000; text-align: right;">&lt;khungulsunTalbainNiitUne&gt;</td>
          </tr>
          <tr>
            <td style="border: 1px solid #000; text-align: center;">2</td>
            <td style="border: 1px solid #000; text-align: left;" colspan="4">Алданги</td>
            <td style="border: 1px solid #000; text-align: right;"></td>
            <td style="border: 1px solid #000; text-align: right;">&lt;aldangiinUldegdelNuat&gt;</td>
            <td style="border: 1px solid #000; text-align: right; width: 16%;">&lt;aldangiinUldegdelNuatgui&gt;</td>
            <td style="border: 1px solid #000; text-align: right;">&lt;aldangiinUldegdel&gt;</td>
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
                a.tailbar?.includes("Менежментийн төлбөр") ||
                a.tailbar === "Менежментийн зардал" ||
                a.tailbar === "Менежмент" ||
                a.tailbar === "Менежментийн төлбөр нэмэлт" ||
                a.tailbar == "Түрээсийн төлбөр нэмэлт"
            )
            .map((mur, index) => {
              return `
                <tr key=${index}>
                  <td style="border: 1px solid #000; text-align: center;">${
                    index + 3
                  }</td>
                  <td style="border: 1px solid #000; text-align: left;" colspan="4">
                      ${mur.tailbar.replace(/11к|11k/gi, "").trim()}
                    </td>
                  <td style="border: 1px solid #000; text-align: right;">
                    &lt;talbainKhemjee&gt;
                  </td>
                  <td style="border: 1px solid #000; text-align: right;">
                    ${
                      mur.tailbar.toLowerCase().includes("11к") ||
                      mur.tailbar.toLowerCase().includes("11k")
                        ? "11,000.00"
                        : `&lt;${mur.tailbar}.negj&gt;`
                    }
                  </td>

                  <td style="border: 1px solid #000; text-align: right; width: 16%;">
                    &lt;${mur.tailbar}.khungulult&gt;
                  </td>
                  <td style="border: 1px solid #000; text-align: right;">
                    &lt;${mur.tailbar}.khungulultKhassanTulukhDun&gt;
                  </td>
                </tr>
              `;
            })
            .join("")}
          ${medeelel.zardluud
            .sort((a, b) => {
              return a.tailbar.localeCompare(b.tailbar, "en", {
                sensitivity: "base",
              });
            })
            .filter(
              (a) =>
                a.tailbar === "Менежмент төлбөр хуучин" ||
                a.tailbar === "Менежмент төлбөр шинэ" ||
                a.tailbar === "Дулааны төлбөр" ||
                a.tailbar === "Дулаан" ||
                a.tailbar === "Дулаан нэмэлт" ||
                a.tailbar?.includes("торгууль")
            )
            .map((mur, index) => {
              return `
                <tr key=${index}>
                  <td style="border: 1px solid #000; text-align: center;">${
                    index + 3
                  }</td>
                  <td style="border: 1px solid #000; text-align: left;" colspan="4">
                    ${mur.tailbar}
                  </td>
                  <td style="border: 1px solid #000; text-align: right;">
                    &lt;${mur.tailbar}.negj&gt;
                  </td>
                  <td style="border: 1px solid #000; text-align: right;">
                    &lt;${mur.tailbar}.tariff&gt;
                  </td>
                  <td style="border: 1px solid #000; text-align: right; width: 16%;">
                    &lt;${mur.tailbar}.khungulult&gt;
                  </td>
                  <td style="border: 1px solid #000; text-align: right;">
                    &lt;${mur.tailbar}.tulukhDun&gt;
                  </td>
                </tr>
              `;
            })
            .join("")}
            <tr>
              <td></br></td>
              <td colspan="4"></br></td>
              <td></br></td>
              <td></br></td>
              <td></br></td>
              <td></br></td>
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
                  a.tailbar === "Цахилгаан нэмэлт"
              )
              .map((mur, index) => {
                return `
                  <tr key=${index}>
                    <td style="border: 1px solid #000; text-align: center;" rowspan="2">4</td>
                    <td colspan="2" rowspan="2" style="border: 1px solid #000; text-align: center;">Цахилгааны төлбөр</td>
                    <td colspan="2" style="border: 1px solid #000; text-align: center;">Өмнөх заалт</td>
                    <td style="border: 1px solid #000; text-align: center;">Одоо заалт</td>
                    <td style="border: 1px solid #000; text-align: center;">Зөрүү</td>
                    <td style="border: 1px solid #000; text-align: center;">Тариф</td>
                    <td style="border: 1px solid #000; text-align: center;">Нийт дүн</td>
                  </tr>
                  <tr>
                    <td colspan="2" style="border: 1px solid #000; text-align: right;">&lt;${mur.tailbar}.umnukhZaalt&gt;</td>
                    <td style="border: 1px solid #000; text-align: right;">&lt;${mur.tailbar}.suuliinZaalt&gt;</td>
                    <td style="border: 1px solid #000; text-align: right;">&lt;${mur.tailbar}.zuruuZaalt&gt;</td>
                    <td style="border: 1px solid #000; text-align: right;">&lt;${mur.tailbar}.tariff&gt;/&lt;${mur.tailbar}.tsakhilgaanUrjver&gt;</td>
                    <td style="border: 1px solid #000; text-align: right;">&lt;${mur.tailbar}.tulukhDun&gt;</td>
                  </tr>

                `;
              })
              .join("")}
              ${
                medeelel.zardluud.filter(
                  (a) =>
                    a.tailbar?.includes("Хүйтэн ус") ||
                    a.tailbar === "Хүйтэн ус нэмэлт" ||
                    a.tailbar?.includes("Халуун ус") ||
                    a.tailbar === "Халуун ус нэмэлт"
                ).length > 0
                  ? `
              <tr>
                <td style="border: 1px solid #000; text-align: center;" rowspan="4">5</td>
                <td style="border: 1px solid #000; text-align: center;">Усны төлбөр</td>
                <td style="border: 1px solid #000; text-align: center;">Өмнөх</td>
                <td style="border: 1px solid #000; text-align: center;">Одоо</td>
                <td style="border: 1px solid #000; text-align: center;">Зөрүү</td>
                <td style="border: 1px solid #000; text-align: center;">Цэвэр усны тариф</td>
                <td style="border: 1px solid #000; text-align: center;">Бохир усны тариф</td>
                <td style="border: 1px solid #000; text-align: center;">Ус халаасны тариф</td>
                <td style="border: 1px solid #000; text-align: center;">Нийт дүн</td>
              </tr>
              `
                  : ``
              }
              ${medeelel.zardluud
                .sort((a, b) => {
                  return a.tailbar.localeCompare(b.tailbar, "en", {
                    sensitivity: "base",
                  });
                })
                .filter(
                  (a) =>
                    a.tailbar?.includes("Халуун ус") ||
                    a.tailbar === "Халуун ус нэмэлт"
                ) //  a.tailbar?.includes("Халуун ус")
                .map((mur, index) => {
                  return `
                    <tr key=${index}>
                      <td style="border: 1px solid #000; text-align: right;">
                        ${mur.tailbar}
                      </td>
                      <td style="border: 1px solid #000; text-align: right;">
                        &lt;${mur.tailbar}.umnukhZaalt&gt;
                      </td>
                      <td style="border: 1px solid #000; text-align: right;">
                        &lt;${mur.tailbar}.suuliinZaalt&gt;
                      </td>
                      <td style="border: 1px solid #000; text-align: right; width: 16%;">
                        &lt;${mur.tailbar}.zuruuZaalt&gt;
                      </td>
                      <td style="border: 1px solid #000; text-align: right; width: 16%;">
                        &lt;${mur.tailbar}.tseverusTariff&gt;
                      </td>
                      <td style="border: 1px solid #000; text-align: right; width: 16%;">
                        &lt;${mur.tailbar}.boxirusTariff&gt;
                      </td>
                      <td style="border: 1px solid #000; text-align: right; width: 16%;">
                        &lt;${mur.tailbar}.usxalaasniitulburTariff&gt;
                      </td>
                      <td style="border: 1px solid #000; text-align: right;">
                        
                      </td>
                    </tr>
                  `;
                })
                .join("")}
                ${medeelel.zardluud
                  .sort((a, b) => {
                    return a.tailbar.localeCompare(b.tailbar, "en", {
                      sensitivity: "base",
                    });
                  })
                  .filter(
                    (a) =>
                      a.tailbar?.includes("Хүйтэн ус") ||
                      a.tailbar === "Хүйтэн ус нэмэлт"
                  ) //  a.tailbar?.includes("Хүйтэн ус")
                  .map((mur, index) => {
                    return `
                      <tr key=${index}>
                        <td style="border: 1px solid #000; text-align: right;">
                          ${mur.tailbar}
                        </td>
                        <td style="border: 1px solid #000; text-align: right;">
                          &lt;${mur.tailbar}.umnukhZaalt&gt;
                        </td>
                        <td style="border: 1px solid #000; text-align: right;">
                          &lt;${mur.tailbar}.suuliinZaalt&gt;
                        </td>
                        <td style="border: 1px solid #000; text-align: right; width: 16%;">
                          &lt;${mur.tailbar}.zuruuZaalt&gt;
                        </td>
                        <td style="border: 1px solid #000; text-align: right; width: 16%;">
                          &lt;${mur.tailbar}.tseverusTariff&gt;
                        </td>
                        <td style="border: 1px solid #000; text-align: right; width: 16%;">
                          &lt;${mur.tailbar}.boxirusTariff&gt;
                        </td>
                        <td style="border: 1px solid #000; text-align: right; width: 16%;">
                          
                        </td>
                        <td style="border: 1px solid #000; text-align: right;">
                          
                        </td>
                      </tr>
                    `;
                  })
                  .join("")}   
                  ${
                    medeelel.zardluud.filter(
                      (a) =>
                        a.tailbar?.includes("Хүйтэн ус") ||
                        a.tailbar === "Хүйтэн ус нэмэлт" ||
                        a.tailbar?.includes("Халуун ус") ||
                        a.tailbar === "Халуун ус нэмэлт"
                    ).length > 0
                      ? `
                  <tr>
                    <td style="border: 1px solid #000; text-align: right;">
                      
                    </td>
                    <td style="border: 1px solid #000; text-align: right;">
                      
                    </td>
                    <td style="border: 1px solid #000; text-align: right;">
                      
                    </td>
                    <td style="border: 1px solid #000; text-align: right; width: 16%;">
                      &lt;zuruuDun&gt;
                    </td>
                    <td style="border: 1px solid #000; text-align: right; width: 16%;">
                      &lt;tseverusDun&gt;
                    </td>
                    <td style="border: 1px solid #000; text-align: right; width: 16%;">
                      &lt;boxirusDun&gt;
                    </td>
                    <td style="border: 1px solid #000; text-align: right; width: 16%;">
                      &lt;usxalaasniitulburDun&gt;
                    </td>
                    <td style="border: 1px solid #000; text-align: right;">
                      &lt;niilberDun&gt;
                    </td>
                  </tr>
                  `
                      : ``
                  }
          </tbody>
        <tfoot>
          <tr style="font-weight: 600;">
            <td style="text-align: right;" colspan="7">Нийт дүн</td>
            <td style="text-align: right;" colspan="2">&lt;garaasBodsonNiitDun&gt;</td>
          </tr>
          <tr>
            <td colspan="9"></br></td>
          </tr>
        </tfoot>
      </table>      
    </div>   
    <div style="display: flex; width: 100%; align-items: flex-start; justify-content: space-between; gap: 0.5rem;">
      <div style="display: block; width: 20%; margin: 4rem;">
        <div>
          &lt;khuviinTamga&gt;
        </div>
      </div>
      <div style="display: block; width: 60%;">
        <div>    
          <p>Мөнгөн дүн үсгээр:&nbsp;&lt;garaasBodsonNiitDunUsgeer&gt; болно</p>
        </div>
        <div style="margin-top: 1rem;"> 
          Дарга:&nbsp;..........................................&lt;signature1&gt;........................................................../П.Гүндэгмаа/
        </div>
        <div style="margin-top: 0.5rem;"> 
          Нягтлан бодогч:&nbsp;.................................&lt;signature2&gt;.............................................../Б.Үүртуяа/
        </div>
        <div style="margin-top: 0.5rem;"> 
          Хүлээн авсан:&nbsp;...................................................................................../&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/
        </div>
      </div>
      <div style="display: block; width: 20%;">
      </div>
    </div> 
    <div style="margin-left: 2rem;">
      <b>
        Санамж: Хугацаандаа төлөөгүй бол Гэрээний дагуу хоногийн 0.5% алданги төлөхийг анхааруулъя. <br/>
        Төлбөрөө хугацаандаа төлсөнд баярлалаа. Гүйлгээний утга дээр регистрийн дугаар болон тайлбайн дугаар бичнэ үү. <br/>
        <span style="color: red;">
          Гүйлгээний утга дээр регистрийн дугаар болон тайлбайн дугаар бичнэ үү.
        </span>
      </b>
    </div>

  </div>`;
};
export default khatuuZagvarFoodCity;
