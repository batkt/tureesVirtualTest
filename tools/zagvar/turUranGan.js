const khatuuZagvarUranGan = (
  medeelel,
  ajiltan,
  baiguullaga,
  barilga,
  barilgiinId,
) => {
  return `
  <div style="display: block; height: 100%; width: 100%; page-break-after: always; h-[5.845in]; font-size: 0.75rem; line-height: 1;">
    <div style="display: flex; width: 100%; margin-top: 2rem;">
      <div style="display: block; width: 35%; top: 0; background-color: white;">
        &lt;barilgiinlogo&gt;
      </div>
    <div style="display: block; width: 65%; padding-left: 1rem;">
      <b>ТҮРЭЭСИЙН НЭХЭМЖЛЭХ №${medeelel?.gereeniiDugaar}</b>
    </div>
  </div>

   <div style="display: flex; width: 100%; align-items: flex-start; justify-content: space-between; gap: 0.5rem;">
  <div style="padding: 1rem; background-color: #fff; flex: 1; text-align: center;">
    <p style="font-weight: 600; text-align: center; margin-bottom: 2rem">Нэхэмжлэгч</p>

    <div style="margin-bottom: 4px; display: flex; justify-content: space-between; line-height: 1.2;">
      <p style="color: #4b5563; font-size: 12px;margin: 0;">Байгууллагын нэр:</p>
      <p style="text-align: right; font-weight: 600;margin: 0;">
      ${
        barilgiinId === "679aea9032299b7ba8462a78" ||
        barilgiinId === "67a067e8e87d437b4a45a4a1"
          ? "УРАНГАН ХХК"
          : barilgiinId === "67a067eee87d437b4a45b39d" ||
            barilgiinId === "67b6c9cbff52df36f5725515"
          ? "БЭСТТОВЕР ХХК"
          : baiguullaga.ner
      }
      </p>
    </div>

    <div style="margin-bottom: 4px; display: flex; justify-content: space-between; line-height: 1.2;">
      <p style="color: #4b5563; font-size: 12px;margin: 0;">Хаяг:</p>
      <p style="font-weight: bold; font-size: 12px;margin: 0;">${
        baiguullaga?.khayag || ""
      }</p>
    </div>

    <div style="margin-bottom: 4px; display: flex; justify-content: space-between; line-height: 1.2;">
      <p style="color: #4b5563; font-size: 12px;margin: 0;">Утас, Факс:</p>
      <p style="font-weight: bold; font-size: 12px;margin: 0;">${baiguullaga?.utas?.join(
        ",",
      )}</p>
    </div>

    <div style="margin-bottom: 4px; display: flex; justify-content: space-between; line-height: 1.2;">
      <p style="color: #4b5563; font-size: 12px;margin: 0;">И-мэйл:</p>
      <p style="font-weight: bold; font-size: 12px;margin: 0;">${baiguullaga?.mail?.join(
        ",",
      )}</p>
    </div>

    <div style="margin-bottom: 4px; display: flex; justify-content: space-between; line-height: 1.2;">
      <p style="color: #4b5563; font-size: 12px;margin: 0;">Регистрийн дугаар:</p>
      <p style="font-weight: bold; font-size: 12px;margin: 0;">${
        barilga?.register
      }</p>
    </div>

    <div style="margin-bottom: 4px; display: flex; justify-content: space-between; line-height: 1.2;">
      <p style="color: #4b5563; font-size: 12px;margin: 0;">Банкны нэр:</p>
      <p style="font-weight: bold; font-size: 12px;margin: 0;">&lt;bank&gt;</p>
    </div>

    <div style="margin-bottom: 4px; display: flex; justify-content: space-between; line-height: 1.2;">
      <p style="color: #4b5563; font-size: 12px;margin: 0;">Банкны дансны дугаар:</p>
      <p style="font-weight: bold; font-size: 12px;margin: 0;">&lt;dans&gt;</p>
    </div>

    <div style="margin-bottom: 4px; display: flex; justify-content: space-between; line-height: 1.2;">
      <p style="color: #4b5563; font-size: 12px; margin: 0;">IBAN дугаар:</p>
      <p style="font-weight: bold; font-size: 12px;margin: 0;">&lt;ibanDugaar&gt;</p>
    </div>
  </div>

  <!-- Төлөгч хэсэг -->
  <div style="padding: 1rem; background-color: #fff; flex: 1; text-align: center;">
    <p style="font-weight: 600; text-align: center; margin: 0; margin-bottom: 2rem;">Төлөгч</p>

    <div style="margin-bottom: 4px; display: flex; justify-content: space-between; line-height: 1.2;">
      <p style="color: #4b5563; font-size: 12px; margin: 0;">${
        medeelel?.turul
      }:</p>
      <p style="font-weight: bold; font-size: 12px; margin: 0;">&lt;ner&gt;</p>
    </div>

    <div style="margin-bottom: 4px; display: flex; justify-content: space-between; line-height: 1.2;">
      <p style="color: #4b5563; font-size: 12px; margin: 0;">Хаяг:</p>
      <p style="font-weight: bold; font-size: 12px; margin: 0;">${
        medeelel?.khayag || ""
      }</p>
    </div>

    <div style="margin-bottom: 4px; display: flex; justify-content: space-between; line-height: 1.2;">
      <p style="color: #4b5563; font-size: 12px; margin: 0;">Утас:</p>
      <p style="font-weight: bold; font-size: 12px; margin: 0;">${
        medeelel?.utas
      }</p>
    </div>

    <div style="margin-bottom: 4px; display: flex; justify-content: space-between; line-height: 1.2;">
      <p style="color: #4b5563; font-size: 12px; margin: 0;">И-мэйл:</p>
      <p style="font-weight: bold; font-size: 12px; margin: 0;">${
        medeelel?.mail
      }</p>
    </div>

    <div style="margin-bottom: 4px; display: flex; justify-content: space-between; line-height: 1.2;">
      <p style="color: #4b5563; font-size: 12px; margin: 0;">Регистрийн дугаар:</p>
      <p style="font-weight: bold; font-size: 12px; margin: 0;">${
        medeelel?.register
      }</p>
    </div>

    <div style="margin-bottom: 4px; display: flex; justify-content: space-between; line-height: 1.2;">
      <p style="color: #4b5563; font-size: 12px; margin: 0;">Нэхэмжилсэн огноо:</p>
      <p style="font-weight: bold; font-size: 12px; margin: 0;">&lt;ekhlekhOn&gt;.&lt;ekhelkhSar&gt;.&lt;ekhlekhUdur&gt;</p>
    </div>

    <div style="margin-bottom: 4px; display: flex; justify-content: space-between; line-height: 1.2;">
      <p style="color: #4b5563; font-size: 12px; margin: 0;">Төлбөл зохих огноо:</p>
      <p style="font-weight: bold; font-size: 12px; margin: 0;">&lt;duusakhOn&gt;.&lt;duusakhSar&gt;.&lt;duusakhUdur&gt;</p>
    </div>
  </div>
</div>

   <table style="width: 100%; border-collapse: collapse; font-family: sans-serif; margin-top: 20px;">
  <thead style="background-color: #f0f0f0; font-weight: bold;">
    <tr>
      <th style="border: 1px solid #ddd; padding: 10px; text-align: center; font-size: 14px;">№</th>
      <th style="border: 1px solid #ddd; padding: 10px; text-align: center; font-size: 14px;">Ажил үйлчилгээний нэр</th>
      <th style="border: 1px solid #ddd; padding: 10px; text-align: center; font-size: 14px;">Хэмжих нэгж</th>
      <th style="border: 1px solid #ddd; padding: 10px; text-align: center; font-size: 14px;">м²</th>
      <th style="border: 1px solid #ddd; padding: 10px; text-align: center; font-size: 14px;">Нэг бүрийн үнэ</th>
      <th style="border: 1px solid #ddd; padding: 10px; text-align: center; font-size: 14px;">Бүгд үнэ</th>
      <th style="border: 1px solid #ddd; padding: 10px; text-align: center; font-size: 14px;">Тайлбар</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="border: 1px solid #ddd; text-align: center; padding: 8px;">1</td>
      <td style="border: 1px solid #ddd; text-align: left; padding: 8px;">Түрээсийн төлбөр</td>
      <td style="border: 1px solid #ddd; text-align: center; padding: 8px;">м²</td>
      <td style="border: 1px solid #ddd; text-align: center; padding: 8px;">&lt;talbainKhemjee&gt;</td>
      <td style="border: 1px solid #ddd; text-align: center; padding: 8px;">&lt;talbainNegjUne&gt;</td>
      <td style="border: 1px solid #ddd; text-align: right; padding: 8px;">&lt;sariinTurees&gt;</td>
      <td style="border: 1px solid #ddd; text-align: right; padding: 8px;">&lt;tureesEkhlehUdur&gt;-&lt;tureesDuusakhUdur&gt;</td>
    </tr>
    <tr>
      <td style="border: 1px solid #ddd; text-align: center; padding: 8px;">2</td>
      <td style="border: 1px solid #ddd; text-align: left; padding: 8px;">Хөнгөлөлт</td>
      <td style="border: 1px solid #ddd;"></td>
      <td style="border: 1px solid #ddd;"></td>
      <td style="border: 1px solid #ddd;"></td>
      <td style="border: 1px solid #ddd; text-align: right; padding: 8px;">&lt;khungulult&gt;</td>
      <td style="border: 1px solid #ddd; text-align: right; padding: 8px;">&lt;tureesEkhlehUdur&gt;-&lt;tureesDuusakhUdur&gt;</td>
    </tr>
    <tr style="background-color: #f9f9f9; font-weight: bold;">
      <td colspan="5" style="padding: 8px; text-align: center; border: none;">Мөнгөн дүн (үсгээр): &lt;uranganTureesNiitDunUsgeer&gt; болно</td>
      <td style="border: 1px solid #ddd; text-align: center; padding: 8px;">Дүн:</td>
      <td style="border: 1px solid #ddd; text-align: right; padding: 8px;">&lt;khungulsunTalbainNiitUneNuatgui&gt;</td>
    </tr>
    <tr style="background-color: #f9f9f9; font-weight: bold;">
      <td colspan="5"></td>
      <td style="border: 1px solid #ddd; text-align: center; padding: 8px;">НӨАТ:</td>
      <td style="border: 1px solid #ddd; text-align: right; padding: 8px;">&lt;khungulsunTalbainNiitUneNuat&gt;</td>
    </tr>
    <tr style="background-color: #f0f0f0; font-weight: bold;">
      <td colspan="5"></td>
      <td style="border: 1px solid #ddd; text-align: center; padding: 8px;">Нийт дүн:</td>
      <td style="border: 1px solid #ddd; text-align: right; padding: 8px; font-size: 16px;"><b>&lt;uranganTureesNiitDun&gt;</b></td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td colspan="7">&nbsp;&nbsp;&nbsp;</td>
    </tr>
    <tr>
      <td style="border: 1px solid #ddd; text-align: center; font-weight: 600;">№</td>
      <td style="border: 1px solid #ddd; text-align: center; font-weight: 600;">Ажил үйлчилгээний нэр</td>
      <td style="border: 1px solid #ddd; text-align: center; font-weight: 600;">НӨАТ</td>
      <td style="border: 1px solid #ddd; text-align: center; font-weight: 600;">НӨАТ-гүй дүн</td>
      <td style="border: 1px solid #ddd; text-align: center; font-weight: 600;">Бүгд үнэ</td>
      <td colspan="2" style="border: 1px solid #ddd; text-align: center; font-weight: 600;">Тайлбар</td>
    </tr>
    <tr>
      <td style="border: 1px solid #ddd; text-align: center; font-weight: 600;">1</td>
      <td style="border: 1px solid #ddd; text-align: left;">Өмнөх сарын үлдэгдэл</td>
      <td style="border: 1px solid #ddd; text-align: right;">&lt;umnukhSariinUrTulburNuat&gt;</td>
      <td style="border: 1px solid #ddd; text-align: right;">&lt;umnukhSariinUrTulburNuatgui&gt;</td>
      <td style="border: 1px solid #ddd; text-align: right;">&lt;umnukhSariinUrTulbur&gt;</td>
      <td colspan="2" style="border: 1px solid #ddd; text-align: left;">&lt;umnukhSar&gt; - р сарын ашиглалтын үлдэгдэл болон &lt;umnukhSar&gt; - р сарын түрээсийн үлдэгдэл</td>
    </tr>
    <tr>
      <td style="border: 1px solid #ddd; text-align: center; font-weight: 600;">2</td>
      <td style="border: 1px solid #ddd; text-align: left;">Алданги</td>
      <td style="border: 1px solid #ddd; text-align: right;">&lt;aldangiinUldegdelNuat&gt;</td>
      <td style="border: 1px solid #ddd; text-align: right;">&lt;aldangiinUldegdelNuatgui&gt;</td>
      <td style="border: 1px solid #ddd; text-align: right;">&lt;aldangiinUldegdel&gt;</td>
      <td colspan="2" style="border: 1px solid #ddd; text-align: center;">Нийт Алданги: <b>&lt;aldangiinUldegdel&gt;</b></td>
    </tr>
    <tr>
      <td colspan="5" rowspan="3"></td>
      <td style="border: 1px solid #ddd; text-align: center;">Дүн:</td>
      <td style="border: 1px solid #ddd; text-align: right;">&lt;umnukhSariinUldegdelNUATgui&gt;</td>
    </tr>
    <tr>
      <td style="border: 1px solid #ddd; text-align: center;">НӨАТ:</td>
      <td style="border: 1px solid #ddd; text-align: right;">&lt;umnukhSariinUldegdelNUAT&gt;</td>
    </tr>
    <tr>
      <td style="border: 1px solid #ddd; text-align: center;">Өмнөх сарын нийт дүн:</td>
      <td style="border: 1px solid #ddd; text-align: right;"><b>&lt;umnukhSariinUldegdel&gt;</b></td>
    </tr>
    <tr>
      <td colspan="7"><b>Анхааруулга:</b> &nbsp;&nbsp;&nbsp;</td>
    </tr>
    <tr>
      <td colspan="7" style="text-align: left;">1. Төлбөл зохих огноонд төлөөгүй тохиолдолд Түрээсийн гэрээний 6.1-д заасны дагуу Түрээслэгчийн үйл ажиллагааг зогсоож, хаалга лацдаж, цахилгаан хязгаарлан, цаашлан хууль хүчний байгууллагад шилжүүлэхийг үүгээр мэдэгдэж байна.</td>
    </tr>
    <tr>
      <td colspan="7" style="text-align: left;">2. Эрхэм харилцагч та төлбөрөө төлөхдөө 5-ний дотор төлж байгаа тохиолдолд зөвхөн түрээсийн төлбөрөөс 10%-ийн хөнгөлөлтийг хасаж шилжүүлнэ үү</td>
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
    <tr>
      <td colspan="2" rowspan="3">Тамга:</td>
      <td colspan="2" rowspan="3">&lt;tamga&gt;</td>
      <td colspan="3">
        <div style="width: 100%; display: flex; align-items: flex-start; justify-content: space-between;">
          <p style="color: #4b5563;">Нягтлан бодогч: &nbsp;&nbsp;&nbsp;&lt;gariinUseg&gt;</p>
          <p style="width: 40%; text-align: left; font-weight: 600;">
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; /${medeelel?.nyagtlan || ""}/
          </p>
        </div>
      </td>
    </tr>
    <tr>
      <td colspan="3">Хүлээгсэн өгсөн:</td>
    </tr>
    <tr>
      <td colspan="3">Хүлээн авсан:</td>
    </tr>
  </tfoot>
</table>
  ${
    medeelel.barilgiinId === "67a067eee87d437b4a45b39d"
      ? ``
      : `<div style="display: flex; width: 100%; margin-top: 3rem; page-break-before: always;">
    </div> 
    <div style="display: flex; width: 100%; margin-top: 5rem;">
      <div style="display: block; width: 35%;">
        &lt;barilgiinlogo&gt;
      </div
      <div style="display: block; width: 65%;">
        <b>АШИГЛАЛТЫН НЭХЭМЖЛЭХ №${medeelel?.gereeniiDugaar}</b>
      </div
    </div>
    <div style="display: flex; width: 100%; align-items: flex-start; justify-content: space-between; gap: 0.5rem;">
      <div style="padding: 1rem; background-color: #fff; flex: 1; text-align: center;">
        <p style="font-weight: 600; text-align: center; margin-bottom: 2rem">Нэхэмжлэгч</p>
       <div style="margin-bottom: 0px; display: flex; justify-content: space-between; line-height: 1.2;">
         <p style="color: #4b5563; font-size: 12px; margin: 0">Байгууллагын нэр:</p>
          <p style="text-align: right; font-weight: 600; margin: 0">
         ${
           barilgiinId === "679aea9032299b7ba8462a78" ||
           barilgiinId === "67a067e8e87d437b4a45a4a1"
             ? "УРАНГАН ХХК"
             : barilgiinId === "67a067eee87d437b4a45b39d" ||
               barilgiinId === "67b6c9cbff52df36f5725515"
             ? "БЭСТТОВЕР ХХК"
             : baiguullaga.ner
         }
         </p>
        </div>
      <div style="margin-bottom: 0px; display: flex; justify-content: space-between; line-height: 1.2;">
      <p style="color: #4b5563; font-size: 12px; margin: 0">Хаяг:</p>
      <p style="font-weight: bold;  margin: 0">${baiguullaga?.khayag || ""}</p>
    </div>
    <div style="margin-bottom: 0px; display: flex; justify-content: space-between; line-height: 1.2;">
      <p style="color: #4b5563;font-size: 12px;  margin: 0">Утас, Факс:</p>
      <p style="font-weight: bold;  margin: 0">${baiguullaga?.utas?.join(
        ",",
      )}</p>
    </div>
    <div style="margin-bottom: 0px; display: flex; justify-content: space-between; line-height: 1.2;">
      <p style="color: #4b5563;  margin: 0">И-мэйл:</p>
      <p style="font-weight: bold;  margin: 0">${baiguullaga?.mail?.join(
        ",",
      )}</p>
    </div>
    <div style="margin-bottom: 0px; display: flex; justify-content: space-between; line-height: 1.2;">
      <p style="color: #4b5563;  margin: 0">Регистрийн дугаар:</p>
      <p style="font-weight: bold;  margin: 0">${barilga?.register}</p>
    </div>
    <div style="margin-bottom: 0px; display: flex; justify-content: space-between; line-height: 1.2;">
      <p style="color: #4b5563;  margin: 0">Банкны нэр:</p>
      <p style="font-weight: bold;  margin: 0">&lt;bank&gt;</p>
    </div>
    <div style="margin-bottom: 0px; display: flex; justify-content: space-between; line-height: 1.2;">
      <p style="color: #4b5563;  margin: 0">Банкны дансны дугаар:</p>
      <p style="font-weight: bold;  margin: 0">&lt;dans&gt;</p>
    </div>
    <div style="margin-bottom: 0px; display: flex; justify-content: space-between; line-height: 1.2;">
      <p style="color: #4b5563;  margin: 0">IBAN дугаар:</p>
      <p style="font-weight: bold; margin: 0 ">&lt;ibanDugaar&gt;</p>
    </div>
    <div style="margin-bottom: 0px; display: flex; justify-content: space-between; line-height: 1.2;">
      <p style="color: #4b5563; margin: 0 ">Банкны нэр:</p>
      <p style="font-weight: bold; margin: 0 ">
        ${
          barilgiinId === "679aea9032299b7ba8462a78" ||
          barilgiinId === "67a067e8e87d437b4a45a4a1"
            ? "УРАНГАН ХХК"
            : "БЭСТТОВЕР ХХК"
        }
      </p>
    </div>
    <div style="margin-bottom: 0px; display: flex; justify-content: space-between;">
      <p style="color: #4b5563; margin: 0 ">Банкны дансны дугаар:</p>
      <p style="font-weight: bold; margin: 0 ">
        ${
          barilgiinId === "679aea9032299b7ba8462a78" ||
          barilgiinId === "67a067e8e87d437b4a45a4a1"
            ? "1601003598"
            : "2105191070"
        }
      </p>
    </div>
  </div>

  <!-- Төлөгч хэсэг -->
  <div style="padding: 1rem; background-color: #fff; flex: 1; text-align: center;">
    <p style="font-weight: 600; text-align: center;margin: 0; margin-bottom: 2rem;">Төлөгч</p>
    <div style="margin-bottom: 4px; display: flex; justify-content: space-between;">
      <p style="color: #4b5563;font-size: 12px; margin: 0 ">${
        medeelel?.turul
      }:</p>
      <p style="font-weight: bold; margin: 0 ">&lt;ner&gt;</p>
    </div>
    <div style="margin-bottom: 4px; display: flex; justify-content: space-between;">
      <p style="color: #4b5563; font-size: 12px; margin: 0">Хаяг:</p>
      <p style="font-weight: bold;  margin: 0">${medeelel?.khayag || ""}</p>
    </div>
    <div style="margin-bottom: 4px; display: flex; justify-content: space-between;">
      <p style="color: #4b5563; font-size: 12px; margin: 0">Утас:</p>
      <p style="font-weight: bold;  margin: 0">${medeelel?.utas}</p>
    </div>
    <div style="margin-bottom: 4px; display: flex; justify-content: space-between;">
      <p style="color: #4b5563; font-size: 12px; margin: 0">И-мэйл:</p>
      <p style="font-weight: bold;  margin: 0">${medeelel?.mail}</p>
    </div>
    <div style="margin-bottom: 2px; display: flex; justify-content: space-between;">
      <p style="color: #4b5563; font-size: 12px; margin: 0">Регистрийн дугаар:</p>
      <p style="font-weight: bold; margin: 0 ">${medeelel?.register}</p>
    </div>
    <div style="margin-bottom: 2px; display: flex; justify-content: space-between;">
      <p style="color: #4b5563;font-size: 12px; margin: 0 ;">Нэхэмжилсэн огноо:</p>
      <p style="font-weight: bold;  margin: 0 ;">&lt;ekhlekhOn&gt;.&lt;ekhelkhSar&gt;.&lt;ekhlekhUdur&gt;</p>
    </div>
    <div style="margin-bottom: 2px; display: flex; margin: 0 ; justify-content: space-between;">
      <p style="color: #4b5563;font-size: 12px;  margin: 0 ;">Төлбөл зохих огноо:</p>
      <p style="font-weight: bold;  margin: 0 ;">&lt;duusakhOn&gt;.&lt;duusakhSar&gt;.&lt;duusakhUdur&gt;</p>
    </div>
  </div>
    </div>
   <table style="width: 100%; border-collapse: collapse; font-family: sans-serif; margin-top: 20px;">
  <thead style="background-color: #f0f0f0; font-weight: bold;">
    <tr>
      <th style="border: 1px solid #ddd; padding: 10px; text-align: center; font-size: 14px;">№</th>
      <th style="border: 1px solid #ddd; padding: 10px; text-align: center; font-size: 14px;">Материал</th>
      <th style="border: 1px solid #ddd; padding: 10px; text-align: center; font-size: 14px;">Өмнөх заалт</th>
      <th style="border: 1px solid #ddd; padding: 10px; text-align: center; font-size: 14px;">Сүүлийн заалт</th>
      <th style="border: 1px solid #ddd; padding: 10px; text-align: center; font-size: 14px;">НӨАТ</th>
      <th style="border: 1px solid #ddd; padding: 10px; text-align: center; font-size: 14px;">НӨАТ-гүй дүн</th>
      <th style="border: 1px solid #ddd; padding: 10px; text-align: center; font-size: 14px;">Хөнгөлөлт</th>
      <th style="border: 1px solid #ddd; padding: 10px; text-align: center; font-size: 14px;">Нийт дүн</th>
    </tr>
  </thead>
  <tbody>
    ${medeelel.zardluud
      .filter((a) => a.tailbar != "Хөнгөлөлт")
      .sort((a, b) => {
        return a.tailbar.localeCompare(b.tailbar, "en", {
          sensitivity: "base",
        });
      })
      .map((mur, index) => {
        return `
          <tr key=${index}>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: center; font-size: 14px;">${
              index + 1
            }</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 14px;">${
              mur.tailbar
            }</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: center; font-size: 14px;">${
              mur.umnukhZaalt === null ? "" : mur.umnukhZaalt
            }</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: center; font-size: 14px;">${
              mur.suuliinZaalt === null ? "" : mur.suuliinZaalt
            }</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: right; font-size: 14px;">&lt;${
              mur.tailbar
            }.khungulultKhassanTulukhDunNuat&gt;</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: right; font-size: 14px;">&lt;${
              mur.tailbar
            }.khungulultKhassanTulukhDunNuatgui&gt;</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: right; font-size: 14px;">&lt;${
              mur.tailbar
            }.khungulult&gt;</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: right; font-size: 14px;">&lt;${
              mur.tailbar
            }.khungulultKhassanTulukhDun&gt;</td>
          </tr>
        `;
      })
      .join("")}
    <tr>
      <td colspan="6" rowspan="3" style="border: none; text-align: center; padding: 10px 0; font-size: 14px;">Мөнгөн дүн (үсгээр): &lt;niilberDunUranganUsgeer&gt; болно</td>
      <td style="border: 1px solid #ddd; padding: 8px; text-align: center; font-size: 14px;">Дүн:</td>
      <td style="border: 1px solid #ddd; padding: 8px; text-align: right; font-size: 14px;">&lt;niilberDunUranganNUATgui&gt;</td>
    </tr>
    <tr>
      <td style="border: 1px solid #ddd; padding: 8px; text-align: center; font-size: 14px;">НӨАТ:</td>
      <td style="border: 1px solid #ddd; padding: 8px; text-align: right; font-size: 14px;">&lt;niilberDunUranganNUAT&gt;</td>
    </tr>
    <tr>
      <td style="border: 1px solid #ddd; padding: 8px; text-align: center; font-size: 14px;">&lt;sar&gt; -Р САРЫН НЭХЭМЖИЛСЭН ДҮН:</td>
      <td style="border: 1px solid #ddd; padding: 8px; text-align: right; font-size: 14px;"><b>&lt;niilberDunUrangan&gt;</b></td>
    </tr>
    <tr>
      <td colspan="8"><b>Анхааруулга:</b> &nbsp;&nbsp;&nbsp;</td>
    </tr>
    <tr>
      <td colspan="8" style="text-align: left;">1. Төлбөл зохих огноонд төлөөгүй тохиолдолд Түрээсийн гэрээний 6.1-д заасны дагуу Түрээслэгчийн үйл ажиллагааг зогсоож, хаалга лацдаж, цахилгаан хязгаарлан, цаашлан хууль хүчний байгууллагад шилжүүлэхийг үүгээр мэдэгдэж байна.</td>
    </tr>
    <tr>
      <td colspan="8" style="text-align: left;">2. Эрхэм харилцагч та төлбөрөө төлөхдөө 5-ний дотор төлж байгаа тохиолдолд зөвхөн түрээсийн төлбөрөөс 10%-ийн хөнгөлөлтийг хасаж шилжүүлнэ үү</td>
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
      <td style="position: relative;" colspan="3">
        <div style="width: 100%; display: flex; align-items: flex-start; justify-content: space-between;">
          <p style="color: #4b5563;">Нягтлан бодогч: &nbsp;&nbsp;&nbsp;&lt;gariinUseg&gt;</p>
          <p style="width: 40%; text-align: left; font-weight: 600;">
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; /${medeelel?.nyagtlan || ""}/
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
  </div>`
  }`;
};
export default khatuuZagvarUranGan;
