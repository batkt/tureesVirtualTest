const khatuuZagvarUranGan = (medeelel, ajiltan, baiguullaga, barilga, barilgiinId) => {
  return `
  <div style="display: block; height: 100%; width: 100%; page-break-after: always; h-[5.845in]; font-size: 0.75rem; line-height: 1rem;">
    <div style="display: flex; width: 100%; margin-top: 2rem;">
      <div style="display: block; width: 35%;">
        &lt;barilgiinlogo&gt;
      </div
      <div style="display: block; width: 65%;">
        <b>НЭХЭМЖЛЭХ №${medeelel?.gereeniiDugaar}</b>
      </div
    </div>
    <div style="display: flex; width: 100%; align-items: flex-start; justify-content: space-between; gap: 0.5rem;">
      <div style="display: block; width: 50%;">
        <p style="font-weight: 600;">Нэхэмжлэгч:</p>
        <div style="display: flex; align-items: flex-start; justify-content: space-between;">
          <p style="white-space: nowrap;">Байгууллагын нэр:</p>
          <p style="width: 100%; text-align: left; font-weight: 600;">
            ${barilgiinId === "679aea9032299b7ba8462a78" || barilgiinId === "67a067e8e87d437b4a45a4a1" ? "УРАНГАН ХХК" : 
                barilgiinId === "67a067eee87d437b4a45b39d" || barilgiinId === "67b6c9cbff52df36f5725515" ? "БЭСТТОВЕР ХХК" :
                  baiguullaga.ner}
          </p>
        </div>
        <div style="display: flex; align-items: flex-start; justify-content: space-between;">
          <p style="white-space: nowrap;">Хаяг:</p>
          <p style="width: 100%; text-align: left; font-weight: 600;">
            ${baiguullaga?.khayag || ""}
          </p>
        </div>
        <div style="display: flex; align-items: flex-start; justify-content: space-between;">
          <p style="white-space: nowrap;">Утас, Факс:</p>
          <p style="width: 100%; text-align: left; font-weight: 600;">
          ${baiguullaga?.utas?.join(",")}
          </p>
        </div>
        <div style="display: flex; align-items: flex-start; justify-content: space-between;">
          <p style="white-space: nowrap;">И-мэйл:</p>
          <p style="width: 100%; text-align: left; font-weight: 600;">
          ${baiguullaga?.mail?.join(",")}
          </p>
        </div>
        <div style="display: flex; align-items: flex-start; justify-content: space-between;">
          <p style="white-space: nowrap;">Регистрийн дугаар:</p>
          <p style="width: 100%; text-align: left; font-weight: 600;">
            ${barilga?.register}
          </p>
        </div>
        <div style="display: flex; align-items: flex-start; justify-content: space-between;">
          <p style="white-space: nowrap;">Банкны нэр:</p>
          <p style="width: 100%; text-align: left; font-weight: 600;">
            &lt;bank&gt;
          </p>
        </div>
        <div style="display: flex; align-items: flex-start; justify-content: space-between;">
          <p style="white-space: nowrap;">Банкны дансны дугаар:</p>
          <p style="width: 100%; text-align: left; font-weight: 600;">
            &lt;dans&gt;
          </p>
        </div>
        <div style="display: flex; align-items: flex-start; justify-content: space-between;">
          <p style="white-space: nowrap;">IBAN дугаар:</p>
          <p style="width: 100%; text-align: left; font-weight: 600;">
            &lt;ibanDugaar&gt;
          </p>
        </div>
        <div style="display: flex; align-items: flex-start; justify-content: space-between;">
          <p style="white-space: nowrap;">Банкны нэр:</p>
          <p style="width: 100%; text-align: left; font-weight: 600;">
            ${barilgiinId === "679aea9032299b7ba8462a78" || barilgiinId === "67a067e8e87d437b4a45a4a1" ? "УРАНГАН ХХК" : "БЭСТТОВЕР ХХК"}
          </p>
        </div>
        <div style="display: flex; align-items: flex-start; justify-content: space-between;">
          <p style="white-space: nowrap;">Банкны дансны дугаар:</p>
          <p style="width: 100%; text-align: left; font-weight: 600;">
            ${barilgiinId === "679aea9032299b7ba8462a78" || barilgiinId === "67a067e8e87d437b4a45a4a1" ? "1601003598" : "2105191070"}
          </p>
        </div>
      </div>
      <div style="display: block; width: 50%;">
        <p style="font-weight: 600;">Төлөгч:</p>
        <div style="display: flex; align-items: flex-start; justify-content: space-between;">
          <p style="white-space: nowrap;">${medeelel?.turul}:</p>
          <p style="width: 100%; text-align: left; font-weight: 600;">
            &lt;ner&gt;
          </p>
        </div>
        <div style="display: flex; align-items: flex-start; justify-content: space-between;">
          <p style="white-space: nowrap;">Хаяг:</p>
          <p style="width: 100%; text-align: left; font-weight: 600;">
            ${medeelel?.khayag || ""}
          </p>
        </div>
        <div style="display: flex; align-items: flex-start; justify-content: space-between;">
          <p style="white-space: nowrap;">Утас:</p>
          <p style="width: 100%; text-align: left; font-weight: 600;">
            ${medeelel?.utas}
          </p>
        </div>
        <div style="display: flex; align-items: flex-start; justify-content: space-between;">
          <p style="white-space: nowrap;">И-мэйл:</p>
          <p style="width: 100%; text-align: left; font-weight: 600;">
            ${medeelel?.mail}          
          </p>
        </div>
        <div style="display: flex; align-items: flex-start; justify-content: space-between;">
          <p style="white-space: nowrap;">Регистрийн дугаар:</p>
          <p style="width: 100%; text-align: left; font-weight: 600;">
            ${medeelel?.register}
          </p>
        </div>
        <div style="display: flex; align-items: flex-start; justify-content: space-between;">
          <p style="white-space: nowrap;">Нэхэмжилсэн огноо:</p>
          <p style="width: 100%; text-align: left; font-weight: 600;">
            &lt;ekhlekhOn&gt;.&lt;ekhelkhSar&gt;.&lt;ekhlekhUdur&gt;
          </p>
        </div>
        <div style="display: flex; align-items: flex-start; justify-content: space-between;">
          <p style="white-space: nowrap;">Төлбөл зохих огноо:</p>
          <p style="width: 100%; text-align: left; font-weight: 600;">
            &lt;duusakhOn&gt;.&lt;duusakhSar&gt;.&lt;duusakhUdur&gt;
          </p>
        </div>
      </div>
    </div>
    <div style="text-align: right;">
      <b>Эхний үлдэгдэл: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;umnukhSariinUrTulbur&gt;&nbsp;&nbsp;</b><br />
    </div>
    <table style="width: 100%;">
      <thead style="background-color: #d1d5db; font-weight: 600;">
        <tr>
          <td style="border: 1px solid #000; text-align: center;">№</td>
          <td style="border: 1px solid #000; text-align: center;">Ажил үйлчилгээний нэр</td>
          <td style="border: 1px solid #000; text-align: center;">Хэмжих нэгж</td>
          <td style="border: 1px solid #000; text-align: center;">Тоо ширхэг</td>
          <td style="border: 1px solid #000; text-align: center;">Нэг бүрийн үнэ</td>
          <td style="border: 1px solid #000; text-align: center; width: 20%;">Бүгд үнэ</td>
          <td style="border: 1px solid #000; text-align: center; width: 20%;">Тайлбар</td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="border: 1px solid #000; text-align: center;">1</td>
          <td style="border: 1px solid #000; text-align: left;">Түрээсийн төлбөр</td>
          <td style="border: 1px solid #000; text-align: center;">м2</td>
          <td style="border: 1px solid #000; text-align: center;">&lt;talbainKhemjee&gt;</td>
          <td style="border: 1px solid #000; text-align: center;">&lt;talbainNegjUne&gt;</td>
          <td style="border: 1px solid #000; text-align: right; width: 20%;">&lt;sariinTurees&gt;</td>
          <td style="border: 1px solid #000; text-align: right; width: 20%;">&lt;tureesEkhlehUdur&gt;-&lt;tureesDuusakhUdur&gt;</td>
        </tr>
        <tr>
          <td style="border: 1px solid #000; text-align: center;">2</td>
          <td style="border: 1px solid #000; text-align: left;">Хөнгөлөлт</td>
          <td style="border: 1px solid #000; text-align: center;"></td>
          <td style="border: 1px solid #000; text-align: center;"></td>
          <td style="border: 1px solid #000; text-align: center;"></td>
          <td style="border: 1px solid #000; text-align: right; width: 20%;">&lt;khungulult&gt;</td>
          <td style="border: 1px solid #000; text-align: right; width: 20%;">&lt;tureesEkhlehUdur&gt;-&lt;tureesDuusakhUdur&gt;</td>
        </tr>
        <tr>
          <td colspan="5" rowspan="4">Мөнгөн дүн (үсгээр): &lt;uranganTureesNiitDunUsgeer&gt; болно</td>
          <td style="border: 1px solid #000; text-align: center;">Дүн:</td>
          <td style="border: 1px solid #000; text-align: right;">&lt;khungulsunTalbainNiitUneNuatgui&gt;</td>
        </tr>
        <tr>
          <td style="border: 1px solid #000; text-align: center;">НӨАТ:</td>
          <td style="border: 1px solid #000; text-align: right;">&lt;khungulsunTalbainNiitUneNuat&gt;</td>
        </tr>
        <tr>
          <td style="border: 1px solid #000; text-align: center;">Нийт Алданги:</td>
          <td style="border: 1px solid #000; text-align: right;">&lt;aldangiinUldegdel&gt;</td>
        </tr>
        <tr>
          <td style="border: 1px solid #000; text-align: center;">Нийт дүн:</td>
          <td style="border: 1px solid #000; text-align: right;">&lt;uranganTureesNiitDun&gt;</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="7">&nbsp;&nbsp;&nbsp;</td>
        </tr>
        <tr>
          <td style="text-align: center;" colspan="7">Жич: Төлбөл зохих огноонд төлөөгүй тохиолдолд Түрээсийн гэрээний 6.1-д заасны дагуу Түрээслэгчийн үйл ажиллагааг зогсоож, хаалга</td>
        </tr>
        <tr>
          <td style="text-align: center;" colspan="7">лацдаж, цахилгаан хязгаарлан, цаашлан хууль хүчний байгууллагад шилжүүлэхийг үүгээр мэдэгдэж байна.</td>
        </tr>
        <tr>
          <td colspan="7">&nbsp;&nbsp;&nbsp;</td>
        </tr>
        <tr>
          <td colspan="7">&nbsp;&nbsp;&nbsp;</td>
        </tr>
        <tr>
          <td colspan="7">&nbsp;&nbsp;&nbsp;</td>
        </tr>
        <tr style="margin-top: 1rem;">
          <td colspan="2" rowspan="3">Тамга:</td>
          <td colspan="2" rowspan="3">&lt;tamga&gt;</td>
          <td colspan="3">
            <div style="width: 100%; display: flex; align-items: flex-start; justify-content: space-between;">
              <p style="white-space: nowrap;">Нягтлан бодогч: &nbsp;&nbsp;&nbsp;&lt;gariinUseg&gt;</p>
              <p style="width: 40%; text-align: left; font-weight: 600;">
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; /Б.Туул/ 
              </p>
            </div>
          </td>
        </tr>
        <tr style="margin-top: 1rem;">
          <td colspan="3">Хүлээгсэн өгсөн:</td>
        </tr>
        <tr style="margin-top: 1rem;">
          <td colspan="3">Хүлээн авсан:</td>
        </tr>
      </tfoot>
    </table>
    <div style="display: flex; width: 100%; margin-top: 3rem; page-break-before: always;">
    </div>
    <div style="display: flex; width: 100%; margin-top: 5rem;">
      <div style="display: block; width: 35%;">
        &lt;barilgiinlogo&gt;
      </div
      <div style="display: block; width: 65%;">
        <b>НЭХЭМЖЛЭХ №${medeelel?.gereeniiDugaar}</b>
      </div
    </div>
    <div style="display: flex; width: 100%; align-items: flex-start; justify-content: space-between; gap: 0.5rem;">
      <div style="display: block; width: 50%;">
        <p style="font-weight: 600;">Нэхэмжлэгч:</p>
        <div style="display: flex; align-items: flex-start; justify-content: space-between;">
          <p style="white-space: nowrap;">Байгууллагын нэр:</p>
          <p style="width: 100%; text-align: left; font-weight: 600;">
            ${barilgiinId === "679aea9032299b7ba8462a78" || barilgiinId === "67a067e8e87d437b4a45a4a1" ? "УРАНГАН ХХК" : 
                barilgiinId === "67a067eee87d437b4a45b39d" || barilgiinId === "67b6c9cbff52df36f5725515" ? "БЭСТТОВЕР ХХК" :
                  baiguullaga.ner}
          </p>
        </div>
        <div style="display: flex; align-items: flex-start; justify-content: space-between;">
          <p style="white-space: nowrap;">Хаяг:</p>
          <p style="width: 100%; text-align: left; font-weight: 600;">
            ${baiguullaga?.khayag || ""}
          </p>
        </div>
        <div style="display: flex; align-items: flex-start; justify-content: space-between;">
          <p style="white-space: nowrap;">Утас, Факс:</p>
          <p style="width: 100%; text-align: left; font-weight: 600;">
          ${baiguullaga?.utas?.join(",")}
          </p>
        </div>
        <div style="display: flex; align-items: flex-start; justify-content: space-between;">
          <p style="white-space: nowrap;">И-мэйл:</p>
          <p style="width: 100%; text-align: left; font-weight: 600;">
          ${baiguullaga?.mail?.join(",")}
          </p>
        </div>
        <div style="display: flex; align-items: flex-start; justify-content: space-between;">
          <p style="white-space: nowrap;">Регистрийн дугаар:</p>
          <p style="width: 100%; text-align: left; font-weight: 600;">
            ${barilga?.register}
          </p>
        </div>
        <div style="display: flex; align-items: flex-start; justify-content: space-between;">
          <p style="white-space: nowrap;">Банкны нэр:</p>
          <p style="width: 100%; text-align: left; font-weight: 600;">
            &lt;bank&gt;
          </p>
        </div>
        <div style="display: flex; align-items: flex-start; justify-content: space-between;">
          <p style="white-space: nowrap;">Банкны дансны дугаар:</p>
          <p style="width: 100%; text-align: left; font-weight: 600;">
            &lt;dans&gt;
          </p>
        </div>
        <div style="display: flex; align-items: flex-start; justify-content: space-between;">
          <p style="white-space: nowrap;">IBAN дугаар:</p>
          <p style="width: 100%; text-align: left; font-weight: 600;">
            &lt;ibanDugaar&gt;
          </p>
        </div>
        <div style="display: flex; align-items: flex-start; justify-content: space-between;">
          <p style="white-space: nowrap;">Банкны нэр:</p>
          <p style="width: 100%; text-align: left; font-weight: 600;">
            ${barilgiinId === "679aea9032299b7ba8462a78" || barilgiinId === "67a067e8e87d437b4a45a4a1" ? "УРАНГАН ХХК" : "БЭСТТОВЕР ХХК"}
          </p>
        </div>
        <div style="display: flex; align-items: flex-start; justify-content: space-between;">
          <p style="white-space: nowrap;">Банкны дансны дугаар:</p>
          <p style="width: 100%; text-align: left; font-weight: 600;">
            ${barilgiinId === "679aea9032299b7ba8462a78" || barilgiinId === "67a067e8e87d437b4a45a4a1" ? "1601003598" : "2105191070"}
          </p>
        </div>
      </div>
      <div style="display: block; width: 50%;">
        <p style="font-weight: 600;">Төлөгч:</p>
        <div style="display: flex; align-items: flex-start; justify-content: space-between;">
          <p style="white-space: nowrap;">${medeelel?.turul}:</p>
          <p style="width: 100%; text-align: left; font-weight: 600;">
            &lt;ner&gt;
          </p>
        </div>
        <div style="display: flex; align-items: flex-start; justify-content: space-between;">
          <p style="white-space: nowrap;">Хаяг:</p>
          <p style="width: 100%; text-align: left; font-weight: 600;">
            ${medeelel?.khayag || ""}
          </p>
        </div>
        <div style="display: flex; align-items: flex-start; justify-content: space-between;">
          <p style="white-space: nowrap;">Утас:</p>
          <p style="width: 100%; text-align: left; font-weight: 600;">
            ${medeelel?.utas}
          </p>
        </div>
        <div style="display: flex; align-items: flex-start; justify-content: space-between;">
          <p style="white-space: nowrap;">И-мэйл:</p>
          <p style="width: 100%; text-align: left; font-weight: 600;">
            ${medeelel?.mail}          
          </p>
        </div>
        <div style="display: flex; align-items: flex-start; justify-content: space-between;">
          <p style="white-space: nowrap;">Регистрийн дугаар:</p>
          <p style="width: 100%; text-align: left; font-weight: 600;">
            ${medeelel?.register}
          </p>
        </div>
        <div style="display: flex; align-items: flex-start; justify-content: space-between;">
          <p style="white-space: nowrap;">Нэхэмжилсэн огноо:</p>
          <p style="width: 100%; text-align: left; font-weight: 600;">
            &lt;ekhlekhOn&gt;.&lt;ekhelkhSar&gt;.&lt;ekhlekhUdur&gt;
          </p>
        </div>
        <div style="display: flex; align-items: flex-start; justify-content: space-between;">
          <p style="white-space: nowrap;">Төлбөл зохих огноо:</p>
          <p style="width: 100%; text-align: left; font-weight: 600;">
            &lt;duusakhOn&gt;.&lt;duusakhSar&gt;.&lt;duusakhUdur&gt;
          </p>
        </div>
      </div>
    </div>
    <table style="width: 100%;">
      <thead style="background-color: #d1d5db; font-weight: 600;">
        <tr>
          <td style="border: 1px solid #000; text-align: center;">№</td>
          <td style="border: 1px solid #000; text-align: center;">Материал</td>
          <td style="border: 1px solid #000; text-align: center;">
            Өмнөх заалт
          </td>
          <td style="border: 1px solid #000; text-align: center;">
            Сүүлийн заалт
          </td>
          <td style="border: 1px solid #000; text-align: center;">НӨАТ</td>
          <td style="border: 1px solid #000; text-align: center;">
            НӨАТ-гүй дүн
          </td>
          <td style="border: 1px solid #000; text-align: center;">Хөнгөлөлт</td>
          <td style="border: 1px solid #000; text-align: center;">Нийт дүн</td>
        </tr>
      </thead>
      <tbody>
      ${medeelel.zardluud
        .filter(a => a.tailbar != "Хөнгөлөлт")
        .sort((a, b) => {
          return a.tailbar.localeCompare(b.tailbar, "en", {
            sensitivity: "base",
          });
        })
        .map((mur, index) => {
          return `
            <tr key=${index}>
              <td style="border: 1px solid #000; text-align: center;">${
                index + 1
              }</td>
              <td style="border: 1px solid #000; text-align: left;">
                ${mur.tailbar}
              </td>
              <td style="border: 1px solid #000; text-align: center;">${
                mur.umnukhZaalt === null ? "" : mur.umnukhZaalt
              }</td>
              <td style="border: 1px solid #000; text-align: center;">${
                mur.suuliinZaalt === null ? "" : mur.suuliinZaalt
              }</td>
              <td style="border: 1px solid #000; text-align: right;">&lt;${mur.tailbar}.khungulultKhassanTulukhDunNuat&gt;</td>
              <td style="border: 1px solid #000; text-align: right;">&lt;${mur.tailbar}.khungulultKhassanTulukhDunNuatgui&gt;</td>
              <td style="border: 1px solid #000; text-align: right;">&lt;${
                mur.tailbar
              }.khungulult&gt;</td>
              <td style="border: 1px solid #000; text-align: right; width: 20%;">&lt;${
                mur.tailbar
              }.khungulultKhassanTulukhDun&gt;</td>
            </tr>
          `;
        })
        .join("")}
        <tr>
          <td colspan="6" rowspan="3">Мөнгөн дүн (үсгээр): &lt;niilberDunUranganUsgeer&gt; болно</td>
          <td style="border: 1px solid #000; text-align: center;">Дүн:</td>
          <td style="border: 1px solid #000; text-align: right;">&lt;niilberDunUranganNUATgui&gt;</td>
        </tr>
        <tr>
          <td style="border: 1px solid #000; text-align: center;">НӨАТ:</td>
          <td style="border: 1px solid #000; text-align: right;">&lt;niilberDunUranganNUAT&gt;</td>
        </tr>
        <tr>
          <td style="border: 1px solid #000; text-align: center;">&lt;sar&gt; -Р САРЫН НЭХЭМЖИЛСЭН ДҮН:</td>
          <td style="border: 1px solid #000; text-align: right;">&lt;niilberDunUrangan&gt;</td>
        </tr>
        <tr>
          <td colspan="8">&nbsp;&nbsp;&nbsp;</td>
        </tr>
        <tr>
          <td style="text-align: center;" colspan="8">Жич: Төлбөл зохих огноонд төлөөгүй тохиолдолд Түрээсийн гэрээний 6.1-д заасны дагуу Түрээслэгчийн үйл ажиллагааг зогсоож, хаалга</td>
        </tr>
        <tr>
          <td style="text-align: center;" colspan="8">лацдаж, цахилгаан хязгаарлан, цаашлан хууль хүчний байгууллагад шилжүүлэхийг үүгээр мэдэгдэж байна.</td>
        </tr>
        <tr>
          <td colspan="8">&nbsp;&nbsp;&nbsp;</td>
        </tr>
        <tr>
          <td colspan="8">&nbsp;&nbsp;&nbsp;</td>
        </tr>
        <tr>
          <td colspan="8">&nbsp;&nbsp;&nbsp;</td>
        </tr>
        <tr style="margin-top: 1rem;">
          <td colspan="2" rowspan="3">Тамга:</td>
          <td colspan="3" rowspan="3">&lt;tamga&gt;</td>
          <td colspan="3">
            <div style="width: 100%; display: flex; align-items: flex-start; justify-content: space-between;">
              <p style="white-space: nowrap;">Нягтлан бодогч: &nbsp;&nbsp;&nbsp;&lt;gariinUseg&gt;</p>
              <p style="width: 40%; text-align: left; font-weight: 600;">
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; /Б.Туул/ 
              </p>
            </div>
          </td>
        </tr>
        <tr style="margin-top: 1rem;">
          <td colspan="3">Хүлээгсэн өгсөн:</td>
        </tr>
        <tr style="margin-top: 1rem;">
          <td colspan="3">Хүлээн авсан:</td>
        </tr>
      </tbody>
    </table>
  </div>`;
};
export default khatuuZagvarUranGan;
