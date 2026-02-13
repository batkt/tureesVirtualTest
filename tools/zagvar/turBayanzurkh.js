import formatNumber from "tools/function/formatNumber";
const khatuuZagvarBayanzurkh = (medeelel, ajiltan, baiguullaga) => {
    console.log(medeelel);

     let currentDugaar = 0;
     const rows = [];
  return `
  <div style="height: 100%; width: 100%; font-family: Arial, sans-serif; padding: 20px;">
    <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
      <div style="display: block;">
      </div>
      <div style="display: block; text-align: right;">
        <div style="font-size: 11px;">
          Санхүү, эдийн засгийн сайд, Үндэсний
        </div>
        <div style="font-size: 11px;">
          статистикийн газрын даргын 2017 оны 347
        </div>
        <div style="font-size: 11px;">
          дугаар тушаалын хавсралт
        </div>
      </div>
    </div>
    <div style="text-align: center; margin: 30px 0;">
      <b style="font-size: 18px;">НЭХЭМЖЛЭХ № &lt;nekhemjlekhiinDugaar&gt;</b>
    </div>
    <div style="display: flex; width: 100%; gap: 20px; margin-bottom: 20px;">
      <div style="flex: 1; padding: 5px;">
        <p style="font-size: 13px; font-weight: bold; margin: 0 0 10px 0;">Нэхэмжлэгч:</p>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="font-size: 11px; padding: 3px 5px;">Байгууллагын нэр:</td>
            <td style="font-size: 11px; padding: 3px 5px; border-bottom: 1px dotted #999; text-align: right;">${baiguullaga?.ner || ''}</td>
          </tr>
          <tr>
            <td style="font-size: 11px; padding: 3px 5px;">НӨАТ төлөгчийн дугаар:</td>
            <td style="font-size: 11px; padding: 3px 5px; border-bottom: 1px dotted #999; text-align: right;">${baiguullaga?.register || ''}</td>
          </tr>
          <tr>
            <td style="font-size: 11px; padding: 3px 5px;">Хаяг:</td>
            <td style="font-size: 11px; padding: 3px 5px; border-bottom: 1px dotted #999; text-align: right;">${baiguullaga?.khayag || ''}</td>
          </tr>
           <tr>
            <td style="font-size: 11px; padding: 3px 5px;">Утас, Факс:</td>
            <td style="font-size: 11px; padding: 3px 5px; border-bottom: 1px dotted #999; text-align: right;">${baiguullaga?.utas?.join(", ") || ''}</td>
          </tr>
          <tr>
            <td style="font-size: 11px; padding: 3px 5px;">Электрон шуудан:</td>
            <td style="font-size: 11px; padding: 3px 5px; border-bottom: 1px dotted #999; text-align: right;">${ajiltan?.mail || ''}</td>
          </tr>
          <tr>
            <td style="font-size: 11px; padding: 3px 5px;">Төлбөр хийх хугацаа:</td>
            <td style="font-size: 11px; padding: 3px 5px; border-bottom: 1px dotted #999; text-align: right;">&lt;duusakhSar&gt;/&lt;duusakhUdur&gt;/&lt;duusakhOn&gt;</td>
          </tr>
          <tr>
            <td style="font-size: 11px; padding: 3px 5px;">Банкны нэр:</td>
            <td style="font-size: 11px; padding: 3px 5px; border-bottom: 1px dotted #999; text-align: right;">&lt;bank&gt;</td>
          </tr>
        </table>
      </div>
      <div style="flex: 1; padding: 10px;">
        <p style="font-size: 13px; font-weight: bold; margin: 0 0 10px 0;">Төлөгч:</p>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="font-size: 11px; padding: 3px 5px; border-bottom: 1px dotted #999;">Байгууллагын нэр:</td>
            <td style="font-size: 11px; padding: 3px 5px; border-bottom: 1px dotted #999; text-align: right;">${medeelel?.ner || ''}</td>
          </tr> 
          <tr>
            <td style="font-size: 11px; padding: 3px 5px; border-bottom: 1px dotted #999;">НӨАТ төлөгчийн дугаар:</td>
            <td style="font-size: 11px; padding: 3px 5px; border-bottom: 1px dotted #999; text-align: right;">${medeelel?.register || ''}</td>
          </tr>
          <tr>
            <td style="font-size: 11px; padding: 3px 5px; border-bottom: 1px dotted #999;">Хаяг:</td>
            <td style="font-size: 11px; padding: 3px 5px; border-bottom: 1px dotted #999; text-align: right;">${medeelel?.khayag || ''}</td>
          </tr>
          <tr>
            <td style="font-size: 11px; padding: 3px 5px; border-bottom: 1px dotted #999;">Гэрээний дугаар:</td>
            <td style="font-size: 11px; padding: 3px 5px; border-bottom: 1px dotted #999; text-align: right;">${medeelel?.gereeniiDugaar || ''}</td>
          </tr>
          <tr>
            <td style="font-size: 11px; padding: 3px 5px; border-bottom: 1px dotted #999;">Нэхэмжилсэн огноо:</td>
            <td style="font-size: 11px; padding: 3px 5px; border-bottom: 1px dotted #999; text-align: right;">&lt;ekhelkhSar&gt;/&lt;ekhlekhUdur&gt;/&lt;ekhlekhOn&gt;</td>
          </tr>
          <tr>
            <td style="font-size: 11px; padding: 3px 5px;">Дансны дугаар:</td>
            <td style="font-size: 11px; padding: 3px 5px;  border-bottom: 1px dotted #999; text-align: right;">&lt;dans&gt;</td>
          </tr>
        </table>
      </div>
    </div>
     <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
  <thead>
    <tr style="background-color: #e5e7eb;">
      <th style="border: 1px solid #9ca3af; padding: 8px; font-size: 11px; text-align: center; width: 40px;">№</th>
      <th style="border: 1px solid #9ca3af; padding: 8px; font-size: 11px; text-align: center;">Барааны нэр үйлчилгээ</th>
      <th style="border: 1px solid #9ca3af; padding: 8px; font-size: 11px; text-align: center; width: 80px;">Тоо ширхэг</th>
      <th style="border: 1px solid #9ca3af; padding: 8px; font-size: 11px; text-align: center; width: 100px;">Нэгж үнэ</th>
      <th style="border: 1px solid #9ca3af; padding: 8px; font-size: 11px; text-align: center; width: 120px;">Нийт үнэ</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="border: 1px solid #9ca3af; padding: 6px; font-size: 11px; text-align: center;">1</td>
      <td style="border: 1px solid #9ca3af; padding: 6px; font-size: 11px;">Түрээсийн төлбөр</td>
      <td style="border: 1px solid #9ca3af; padding: 6px; font-size: 11px; text-align: center;">
        &lt;talbainKhemjee&gt;
      </td>
      <td style="border: 1px solid #9ca3af; padding: 6px; font-size: 11px; text-align: center;">
        &lt;talbainNegjUne&gt;
      </td>
      <td style="border: 1px solid #9ca3af; padding: 6px; font-size: 11px; text-align: right;">
        &lt;khungulsunTalbainNiitUne&gt;
      </td>
    </tr>
    ${medeelel.zardluud
      .map(
        (mur, index) => `
      <tr>
        <td style="border: 1px solid #9ca3af; padding: 6px; font-size: 11px; text-align: center;">
          ${index + 2}
        </td>
        <td style="border: 1px solid #9ca3af; padding: 6px; font-size: 11px;">
          ${mur.tailbar || ""}
        </td>
        <td style="border: 1px solid #9ca3af; padding: 6px; font-size: 11px; text-align: center;"></td>
        <td style="border: 1px solid #9ca3af; padding: 6px; font-size: 11px; text-align: center;">
          ${mur.tariff || ""}
        </td>
        <td style="border: 1px solid #9ca3af; padding: 6px; font-size: 11px; text-align: right;">
          ${formatNumber(mur?.tulukhDun, 2) || 0}
        </td>
      </tr>
    `
      )
      .join("")}
    <tr>
      <td colspan="2" rowspan="3" style="border: 1px solid #9ca3af; padding: 8px; font-size: 11px; vertical-align: top;">
        <p>Мөнгөн дүн үсгээр:&nbsp;&lt;garaasBodsonNiitDunUsgeer&gt; болно</p>
      </td>
      <td colspan="2" style="border: 1px solid #9ca3af; padding: 8px; font-size: 11px; text-align: right; font-weight: bold;">
        Бүх дүн, НӨАТ-гүй:
      </td>
      <td style="border: 1px solid #9ca3af; padding: 8px; font-size: 11px; text-align: right; font-weight: bold;">
        &lt;garaasBodsonNiitDunNuatgui&gt;
      </td>
    </tr>
    <tr>
      <td colspan="2" style="border: 1px solid #9ca3af; padding: 8px; font-size: 11px; text-align: right; font-weight: bold;">
        НӨАТ (10%):
      </td>
      <td style="border: 1px solid #9ca3af; padding: 8px; font-size: 11px; text-align: right; font-weight: bold;">
        &lt;garaasBodsonNiitDunNuat&gt;
      </td>
    </tr>
    <tr>
      <td colspan="2" style="border: 1px solid #9ca3af; padding: 8px; font-size: 11px; text-align: right; font-weight: bold;">
        Нийт дүн:
      </td>
      <td style="border: 1px solid #9ca3af; padding: 8px; font-size: 11px; text-align: right; font-weight: bold;">
        &lt;garaasBodsonNiitDun&gt;
      </td>
    </tr>
  </tbody>
</table>
   <div style="margin-top: 40px; text-align: center;">
  <table style="border-collapse: collapse; margin: 0 auto;">
 <tbody>
  <tr>
    <td style="width: 80px;"></td>
    <td style="text-align: left;">
      <div style="display: flex; align-items: center; margin-right: 20px;">
        <span>Гүйцэтгэх захирал:</span>
        <span style="flex: 1; border-bottom: 1px dotted #000; margin: 0 10px; position: relative; min-width: 100px; height: 30px;">
          <span style="position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); background: white; padding: 0 10px; min-width: 300px; text-align: center;">
            &lt;tamga&gt;
          </span>
        </span>
      </div>
      <div style="margin-bottom: 10px; font-size: 12px;">
        Нягтлан:
        <span style="display: inline-block; width: 180px; border-bottom: 1px dotted #000; text-align: center;">
          &lt;gariinUseg&gt;
        </span>
      </div>
    </td>
    <td style="width: 120px; font-size: 11px; padding: 5px;">
      <div>/М. Баясгалан/</div>
      <div>Ш. Гүлжан</div>
    </td>
  </tr>
</tbody>
  </table>
</div>

  </div>`;
};

export default khatuuZagvarBayanzurkh;