const khatuuZagvarFoodCity = (medeelel, ajiltan, baiguullaga) => {
  return `
  <div style="height: 100%; width: 100%;">
    <div style="text-align: right;">
      <b>Санхүү, эдийн засгийн сайдын, &nbsp;&nbsp;<br />
      2017 оны 12 сарын 05-өдөр 347 <br />
        тоот тушаалын хавсралт&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      </b>
    </div>
    <div style="text-align: center;">
      <b>НЭХЭМЖЛЭХ №</b>
    </div>
    <div style="display: flex; width: 100%; align-items: flex-start; justify-content: space-between; gap: 0.5rem;">
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
          &nbsp;${baiguullaga?.utas?.join(",")}
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
          <p style="white-space: nowrap;">Хамрах хугацааа:</p>
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
          <p style="white-space: nowrap;">Гэрчилгээний №:</p>
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
            <b>&nbsp;&lt;duusakhSar&gt;/&lt;duusakhUdur&gt;/&lt;duusakhOn&gt;</b>
          </p>
        </div>
      </div>
    </div>
    <div style="text-align: right;">
      <b>Эхний үлдэгдэл: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;umnukhSariinUrTulbur&gt;&nbsp;&nbsp;</b><br />
    </div>
    <div>
      <table style="width: 100%;">
        <thead style="background-color: #d1d5db; font-weight: 600;">
          <tr>
            <td style="border: 1px solid #000; text-align: center;">№</td>
            <td style="border: 1px solid #000; text-align: center;" colspan="4">Гүйлгээний утга</td>
            <td style="border: 1px solid #000; text-align: center;">Талбайн хэмжээ</td>
            <td style="border: 1px solid #000; text-align: center;">Нэгжийн үнэ</td>
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
          .filter(a => a.tailbar === "Түрээс хуучин үнэ 8/01-8/15 хооронд" || a.tailbar === "Түрээс шинэ үнэ 8/16-8/31 хооронд")
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
        ${medeelel.zardluud.filter(a => a.tailbar === "Түрээс хуучин үнэ 8/01-8/15 хооронд" || a.tailbar === "Түрээс шинэ үнэ 8/16-8/31 хооронд").length > 0 ? "" :
          `
          <tr>
            <td style="border: 1px solid #000; text-align: center;">1</td>
            <td style="border: 1px solid #000; text-align: left;" colspan="4">Түрээсийн төлбөр</td>
            <td style="border: 1px solid #000; text-align: right;">&lt;talbainKhemjee&gt;</td>
            <td style="border: 1px solid #000; text-align: right;">&lt;talbainNegjUne&gt;</td>
            <td style="border: 1px solid #000; text-align: right; width: 16%;">&lt;khungulult&gt;</td>
            <td style="border: 1px solid #000; text-align: right;">&lt;khungulsunTalbainNiitUne&gt;</td>
          </tr>
          `}
          ${medeelel.zardluud
            .sort((a, b) => {
              return a.tailbar.localeCompare(b.tailbar, "en", {
                sensitivity: "base",
              });
            })
            .filter(a => a.tailbar === "Менежментийн төлбөр" || a.tailbar === "Менежментийн зардал" || a.tailbar === "Менежмент")
            .map((mur, index) => {
              return `
                <tr key=${index}>
                  <td style="border: 1px solid #000; text-align: center;">${
                    index + 2
                  }</td>
                  <td style="border: 1px solid #000; text-align: left;" colspan="4">
                    ${mur.tailbar}
                  </td>
                  <td style="border: 1px solid #000; text-align: right;">
                    &lt;talbainKhemjee&gt;
                  </td>
                  <td style="border: 1px solid #000; text-align: right;">
                    &lt;${mur.tailbar}.tariff&gt;
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
            .filter(a => a.tailbar === "Хөнгөлөлт" || a.tailbar === "Менежмент төлбөр хуучин" || a.tailbar === "Менежмент төлбөр шинэ" || a.tailbar === "Дулааны төлбөр" || a.tailbar === "Дулаан")
            .map((mur, index) => {
              return `
                <tr key=${index}>
                  <td style="border: 1px solid #000; text-align: center;">${
                    index + 2
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
              .filter(a => a.tailbar === "Цахилгаан")
              .map((mur, index) => {
                return `
                  <tr>
                    <td style="border: 1px solid #000; text-align: center;" rowspan="2">4</td>
                    <td style="border: 1px solid #000; text-align: center;" rowspan="2" colspan="3">Цахилгааны төлбөр</td>
                    <td style="border: 1px solid #000; text-align: center;">Өмнөх заалт</td>
                    <td style="border: 1px solid #000; text-align: center;">Одоо заалт</td>
                    <td style="border: 1px solid #000; text-align: center;">Зөрүү</td>
                    <td style="border: 1px solid #000; text-align: center;">Тариф төг/квтц</td>
                    <td style="border: 1px solid #000; text-align: center;">Нийт дүн</td>
                  </tr>
                  <tr key=${index}>
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
                      &lt;${mur.tailbar}.tariff&gt;/
                      &lt;${mur.tailbar}.tsakhilgaanUrjver&gt;
                    </td>
                    <td style="border: 1px solid #000; text-align: right;">
                      &lt;${mur.tailbar}.tulukhDun&gt;
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
                .filter(a => a.tailbar === "Халуун ус") //  a.tailbar === "Халуун ус"
                .map((mur, index) => {
                  return `
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
                  .filter(a => a.tailbar === "Хүйтэн ус") //  a.tailbar === "Хүйтэн ус"
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
                    `;
                  })
                  .join("")}   
        </tbody>
        <tfoot>
          <tr style="background-color: #d1d5db; font-weight: 600;">
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
          Нягтлан бодогч:&nbsp;.................................&lt;signature2&gt;.............................................../Г. Хонгорзул/
        </div>
        <div style="margin-top: 0.5rem;"> 
          Хүлээн авсан:&nbsp;...................................................................................../&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/
        </div>
      </div>
      <div style="display: block; width: 20%;">
      </div>
    </div> 
    <div style="margin-left: 2rem;">
      <b>Санамж:&nbsp;Хугацаандаа төлөөгүй бол Гэрээний дагуу хоногийн 0.5% алданги төлөхийг анхааруулъя</br>Төлбөрөө хугацаандаа төлсөнд баярлалаа.</br>        
    </div>
  </div>`;
};
export default khatuuZagvarFoodCity;
