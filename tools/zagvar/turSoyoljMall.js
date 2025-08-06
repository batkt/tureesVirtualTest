const khatuuZagvarSoyoljMall = (
  medeelel,
  ajiltan,
  baiguullaga,
  barilga,
  barilgiinId
) => {
  const ashiglaltZardluud = medeelel.zardluud
    ?.filter(
      (a) =>
        a.tailbar?.includes("Цахилгаан") ||
        a.tailbar?.includes("Халуун ус") ||
        a.tailbar?.includes("Хүйтэн ус") ||
        a.tailbar?.includes("Газ")
    )
    .sort((a, b) =>
      a.tailbar.localeCompare(b.tailbar, "en", { sensitivity: "base" })
    );

  const ashiglaltTable =
    ashiglaltZardluud.length > 0
      ? `
    <table style="width:100%; margin-top:20px; border-collapse:collapse;">
      <thead style="background-color:#d1d5db;">
        <tr>
          <td style="border: 1px solid #000; text-align: center; font-weight: bold">№</td>
          <td style="border:1px solid #000; text-align: center; font-weight: bold">Утга</td>
          <td style="border:1px solid #000;text-align: center; font-weight: bold">Өмнөх заалт</td>
          <td style="border:1px solid #000;text-align: center; font-weight: bold">Одоогийн заалт</td>
          <td style="border:1px solid #000;text-align: center; font-weight: bold">Хэрэглээ</td>
          <td style="border:1px solid #000; text-align: center; font-weight: bold">Нэгж үнэ</td>
        </tr>
      </thead>
      <tbody>
        ${ashiglaltZardluud
          .map((mur, index) => {
            return `
              <tr key=${index}>
                <td style="border: 1px solid #000; text-align: center;">${
                  index + 1
                }</td>
                <td style="border: 1px solid #000; text-align: left;">${
                  mur.tailbar
                }</td>
                <td style="border: 1px solid #000; text-align: center;">&lt;${
                  mur.tailbar
                }.umnukhZaalt&gt;</td>
                <td style="border: 1px solid #000; text-align: center;">&lt;${
                  mur.tailbar
                }.suuliinZaalt&gt;</td>
                <td style="border: 1px solid #000; text-align: center; width: 16%;">&lt;${
                  mur.tailbar
                }.zuruuZaalt&gt;</td>
                <td style="border: 1px solid #000; text-align: center; width: 16%;">&lt;${
                  mur.tailbar
                }.tariff&gt;</td>
              </tr>`;
          })
          .join("")}
      </tbody>
    </table>`
      : "";
  const rows = [];

  if (
    Number(medeelel.baritsaaAvakhDun || 0) -
      Number(medeelel.baritsaaniiUldegdel || 0) >
    0
  ) {
    rows.push(`
      <tr>
        <td style="border: 1px solid #000; text-align: center; font-size: 12px;">1</td>
        <td style="border: 1px solid #000; text-align: left; font-size: 12px;">Барьцаа үлдэгдэл</td>
        <td style="border: 1px solid #000; text-align: center; font-size: 12px;"></td>
        <td style="border: 1px solid #000; text-align: left; font-size: 12px;"></td>
        <td style="border: 1px solid #000; text-align: right; font-size: 12px;"></td>
        <td style="border: 1px solid #000; text-align: right; font-size: 12px;">&lt;baritsaaUldegdel&gt;</td>
      </tr>
    `);
  }

  if (Number(medeelel.aldangiinUldegdel) > 0) {
    rows.push(`
      <tr>
        <td style="border: 1px solid #000; text-align: center; font-size: 12px;">2</td>
        <td style="border: 1px solid #000; text-align: left; font-size: 12px;">Алданги</td>
        <td style="border: 1px solid #000; text-align: center; font-size: 12px;"></td>
        <td style="border: 1px solid #000; text-align: left; font-size: 12px;"></td>
        <td style="border: 1px solid #000; text-align: right; font-size: 12px;"></td>
        <td style="border: 1px solid #000; text-align: right; font-size: 12px;">&lt;aldangiinUldegdel&gt;</td>
      </tr>
    `);
  }

  return `
  <div style="width: 100%; padding: 1rem; page-break-after: always;">
     <div style="display: flex; width: 100%; justify-content: space-between; align-items: flex-start; margin-top: 2rem;">
        <div style="display: block; width: 35%; top: 0; background-color: white;">
          &lt;barilgiinlogo&gt;
        </div>
        <div style="text-align: right; font-size: 12px; line-height: 1.5;">
            <p style="margin: 0;">
            Сангийн сайдын 2017 оны 12-р сарын 347-р<br/>
            тоот тушаалын хавсралт
            </p>
        </div>
    </div>
        
        
    <div style="text-align: center; margin-top: 10px; font-size: 16px; font-weight: bold;">
      НЭХЭМЖЛЭХ №........
    </div>

    <div style="display: flex; justify-content: space-between; margin-top: 20px;">
      <div style="padding: 1rem; flex: 1;">
        <p style="font-weight: bold;">Нэхэмжлэгч:</p>
        <div style="display: flex; justify-content: space-between;">
          <span>Байгууллагын нэр:</span>
          <span style="">${
            barilgiinId === "622ec99a8e64e5b4f0c3acb6"
              ? "Их наяд зүүн өндөр"
              : barilga?.ner
          }</span> 
        </div>

        <div style="display: flex; justify-content: space-between;">
          <span>РД:</span>
          <span style=""> 5010071 </span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span>Хаяг:</span>
          <span style="">&nbsp;${baiguullaga?.khayag || ""}</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span>Утас:</span>
          <span style="">&nbsp;${
            barilgiinId === "6731b43bc23730ac1908da2e"
              ? "7777-5040"
              : baiguullaga?.utas?.join(",")
          }</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span>Э-шуудан:</span>
          <span style="">&nbsp;${
            barilgiinId === "6731b43bc23730ac1908da2e"
              ? "invoice@soyoljmall.mn"
              : baiguullaga?.mail?.join(",")
          }</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span>Банкны нэр:</span>
          <span style="">&nbsp;&lt;bank&gt;&nbsp;&lt;dansniiNer&gt;</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span>IBAN дансны дугаар:</span>
          <span style="">&lt;dans&gt;</span>
        </div>
      </div>

      <div style="padding: 1rem; flex: 1;">
        <p style="font-weight: bold;">Хариуцагч:</p>
        <div style="display: flex; justify-content: space-between;">
          <span>Харилцагчын нэр:</span>
          <span style="">&lt;ner&gt;</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span>РД:</span>
          <span style="">&lt;register&gt;</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span>Талбайн дугаар:</span>
          <span style="">&lt;talbainDugaar&gt;</span>
        </div>
       <div style="display: flex; justify-content: space-between;">
          <span style="">Нэхэмжилсэн огноо:</span>
          <span style="">&lt;ekhelkhSar&gt;/&lt;ekhlekhUdur&gt;/&lt;ekhlekhOn&gt;</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span style="">Төлбөр хийх хугацаа:</span>
          <span style="">&lt;duusakhSar&gt;/&lt;duusakhUdur&gt;/&lt;duusakhOn&gt;</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span>&nbsp;&nbsp;&nbsp;</span>
          <span style="">&nbsp;&nbsp;&nbsp;</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span>&nbsp;&nbsp;&nbsp;</span>
          <span style="">&nbsp;&nbsp;&nbsp;</span>
        </div>
      </div>
    </div>

    <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
      <thead style="background-color: #d1d5db;">
      <tr>
          <th style="border: none; " colspan="2">
          <span style= "font-weight: normal;">
          Хамрах хугацаа: &lt;ekhlekhOn&gt; оны &lt;ekhelkhSar&gt;-р сар
          </span>
          </th>
          <th style="border: none;"></th>
          <th style="border: 1px solid #000;" colspan="2">
             Өмнөх сарын үлдэгдэл 
          </th>
          <th style="border: 1px solid #000; text-align: right;">
           &lt;umnukhSariinUrTulbur&gt;
          </th>
      </tr>
        <tr>
          <th style="border: 1px solid #000;">№</th>
          <th style="border: 1px solid #000;">Гүйлгээний утга</th>
          <th style="border: 1px solid #000;">Тоо хэмжээ</th>
          <th style="border: 1px solid #000;">Нэгж үнэ</th>
          <th style="border: 1px solid #000;">Хөнгөлөлт</th>
          <th style="border: 1px solid #000;">Нийт</th>
        </tr>
      </thead>
      <tbody>
     ${rows.join("\n")}
        <tr>
          <td style="border: 1px solid #000; text-align: center; font-size: 12px;">3</td>
          <td style="border: 1px solid #000; text-align: left; font-size: 12px;">Түрээсийн төлбөр</td>
          <td style="border: 1px solid #000; text-align: center; font-size: 12px;">&lt;talbainKhemjee&gt;</td>
          <td style="border: 1px solid #000; text-align: center; font-size: 12px; width: 15%;">&lt;talbainNegjUne&gt;</td>
          <td style="border: 1px solid #000; text-align: right; font-size: 12px; width: 15%;">&lt;khungulult&gt;</td>
          <td style="border: 1px solid #000; text-align: right; font-size: 12px; width: 25%;">&lt;khungulsunTalbainNiitUne&gt;</td>
        </tr>
         ${medeelel.zardluud
           .sort((a, b) => {
             return a.tailbar.localeCompare(b.tailbar, "en", {
               sensitivity: "base",
             });
           })
           .filter((a) => a.tailbar?.includes("менежмент"))
           .map((mur, index) => {
             return `
              <tr key=${index}>
                <td style="border: 1px solid #000; text-align: center;">${
                  index + 1
                }</td>
                <td style="border: 1px solid #000; text-align: left;">
                  ${mur.tailbar}
                </td>
                <td style="border: 1px solid #000; text-align: center;">
                  &lt;talbainKhemjee&gt;
                </td>
                <td style="border: 1px solid #000; text-align: center; width: 16%;">
                  &lt;${mur.tailbar}.tariff&gt;
                </td>
                <td style="border: 1px solid #000; text-align: right; ">
                  &lt;${mur.tailbar}.khungulult&gt;
                </td>
                <td style="border: 1px solid #000; text-align: right; font-size: 12px;">&lt;${
                  mur.tailbar
                }.khungulultKhassanTulukhDun&gt;</td>
              </tr>
            `;
           })
           .join("")}

        ${medeelel.zardluud
          .filter(
            (a) => !a.tailbar?.includes("менежмент") && a.tailbar != "Хөнгөлөлт"
          )
          .map(
            (mur, index) => `
          <tr>
            <td style="border: 1px solid #000; text-align:center;">${
              index + 2
            }</td>
            <td style="border: 1px solid #000;">${mur.tailbar || ""}</td>
            <td style="border: 1px solid #000; text-align:center;">1</td>
            <td style="border: 1px solid #000; text-align: center;">
                  &lt;${mur.tailbar}.tariff&gt;
            </td>
            <td style="border: 1px solid #000; text-align: right; width: 16%;">
              &lt;${mur.tailbar}.khungulult&gt;
            </td>
            <td style="border: 1px solid #000; text-align: right; font-size: 12px;">&lt;${
              mur.tailbar
            }.khungulultKhassanTulukhDun&gt;
            </td>
          </tr>`
          )
          .join("")}
      </tbody>
       <tfoot style="border: none;">
          ${
            ajiltan?.baiguullagiinId === "6731b43bc23730ac1908da2d"
              ? `<tr style="background-color: #d1d5db; font-weight: bold; border: none;">
              <td style="border: none; text-align: center; justify-content: center; font-weight: normal;" colspan="4" rowspan="3" >&lt;garaasBodsonNiitDunUsgeer&gt; болно</td>
            </tr>`
              : `<tr style="background-color: #d1d5db; font-weight: bold; border: none;">
              <td style="border: none; text-align: center; justify-content: center; font-weight: normal;" colspan="4" rowspan="3" >&lt;garaasBodsonNiitDunUsgeer&gt; болно</td>
              <td style="border: 1px solid #000;">Дүн</td>
              <td style="text-align: right; font-size: 12px; border: 1px solid #000;">&lt;garaasBodsonNiitDunNuatgui&gt;</td>
            </tr>
            <tr style="background-color: #d1d5db; font-weight: bold; border: none;">
              <td style="border: none; border: 1px solid #000;" >НӨАТ</td>
              <td style="text-align: right; font-size: 12px; border: 1px solid #000;">&lt;garaasBodsonNiitDunNuat&gt;</td>
            </tr>`
          }
            <tr style="background-color: #d1d5db; font-weight: bold; border: none;">
              <td style="border: none; border: 1px solid #000;" >Нийт үнэ</td>
              <td style="text-align: right; font-size: 12px; border: 1px solid #000;">&lt;garaasBodsonNiitDun&gt;</td>
            </tr>
            <tr>
              <td colspan="6"></br></td>
            </tr>
            <tr>
              <td colspan="6"></br></td>
            </tr>
            <tr>
              <td colspan="6"></br></td>
            </tr>
        <tr>
            <td colspan="6" style="border: none; text-align: left; ">
                <p style="font-size: 12px;">Жич: Гүйлгээний утга дээр талбайн тоот, регистерийн дугаараа заавал бичнэ үү!</p>
            </td>
        </tr>
            <tr>
              <td colspan="6"></br></td>
            </tr>
            
            <tr>
              <td colspan="6"></br></td>
            </tr>
            
            <tr>
              <td colspan="6"></br></td>
            </tr>
       
        <tr>
          <td style="border: none;"></td>
          <td style="border: none;  position: relative;" rowspan="2">&lt;tamga&gt;</td>
          <td style="border: none;"></td>
          <td colspan="3" style="border: none; text-align: center;">
            <p style="font-size: 12px;">Хүлээн авсан .............../.............../</p>
          </td>
        </tr>
        <tr>
          <td style="border: none;"></td>
          <td style="border: none;"></td>
          <td colspan="3" style="border: none; text-align: center;">
            <p style="font-size: 12px;">Нягтлан бодогч ............&lt;gariinUseg&gt;.../.............../</p>
          </td>
        </tr>
        <tr>
              <td colspan="6"></br></td>
            </tr>
            <tr>
              <td colspan="6"></br></td>
            </tr>
      </tfoot>
    </table>

    ${ashiglaltTable}
  </div>`;
};

export default khatuuZagvarSoyoljMall;
