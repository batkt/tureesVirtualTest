import AshiglaltiinZardal from "components/pageComponents/tokhirgoo/AshiglaltiinZardal";
import formatNumber from "tools/function/formatNumber";

const khatuuZagvarGumuda = (
  medeelel,
  ajiltan,
  baiguullaga,
  barilga,
  baiguullagiinId,
  barilgiinId,
  dugaarlalt = [0],
  ashiglaltDugaarlalt = [0],
  baritsaaDugaarlalt = [0],
) => {
  console.log(medeelel);
  const ashiglaltZardluud =
    medeelel.zardluud
      ?.filter(
        (a) =>
          a.tailbar?.includes("Цахилгаан") ||
          a.tailbar?.includes("Халуун ус") ||
          a.tailbar?.includes("Хүйтэн ус") ||
          a.tailbar?.includes("Газ"),
      )
      ?.sort((a, b) =>
        a.tailbar.localeCompare(b.tailbar, "mn", { sensitivity: "base" }),
      ) || [];

  // Цахилгааны зардлын мөрүүдийн нийт дүн (Цахилгааны зардлын төлөх дүн)
  const tsahilgaanMur = ashiglaltZardluud.find((a) =>
    a.tailbar?.includes("Цахилгаан"),
  );
  let tsahilgaanNiitDun = 0;
  let tsahilgaanRowspan = 1;

  if (tsahilgaanMur) {
    // Нийт дүнг бэкэнднаас ирсэн цахилгааны төлөх дүнгээр (tulukhDun) харуулна
    tsahilgaanNiitDun = Number(tsahilgaanMur.tulukhDun ?? 0) || 0;

    if (tsahilgaanMur.tsekhDun) tsahilgaanRowspan++;
    if (tsahilgaanMur.chadalDun) tsahilgaanRowspan++;
    if (tsahilgaanMur.sekhDemjikhTulburDun) tsahilgaanRowspan++;
  }

  const ashiglaltTable =
    ashiglaltZardluud.length > 0
      ? `
<table style="width:100%; border-collapse:collapse;">
  <thead>
    <tr>
      <td style="border:1px solid #000; text-align:center; font-size:12px; width:5%;">№</td>
      <td style="border:1px solid #000; text-align:center; font-size:12px; width:20%;">Утга</td>
      <td style="border:1px solid #000; text-align:center; font-size:12px;">Өмнөх заалт</td>
      <td style="border:1px solid #000; text-align:center; font-size:12px;">Одоогийн заалт</td>
      <td style="border:1px solid #000; text-align:center; font-size:12px;">Хэрэглээ</td>
      <td style="border:1px solid #000; text-align:center; font-size:12px;">Нэгж үнэ</td>
      <td style="border:1px solid #000; text-align:center; font-size:12px;">Нийт үнэ</td>
    </tr>
  </thead>
  <tbody>
    ${ashiglaltZardluud
      .map((mur, index) => {
        const isTsahilgaan = mur.tailbar?.includes("Цахилгаан");
        const negj = Number(mur.negj ?? 0) || 0;
        const tariff = Number(mur.tariff ?? 0) || 0;
        const niitUne = isTsahilgaan ? tsahilgaanNiitDun : negj * tariff;

        return `
        <tr>
          <td style="border:1px solid #000; text-align:center; font-size:12px;">${++ashiglaltDugaarlalt[0]}</td>
          <td style="border:1px solid #000; text-align:left; font-size:12px;">${
            mur.tailbar ?? ""
          }</td>
          <td style="border:1px solid #000; text-align:center; font-size:12px;">${
            mur.umnukhZaalt ?? 0
          }</td>
          <td style="border:1px solid #000; text-align:center; font-size:12px;">${
            mur.suuliinZaalt ?? 0
          }</td>
          <td style="border:1px solid #000; text-align:center; font-size:12px;">${formatNumber(
            mur.negj ?? 0,
            2,
          )}</td>
          <td style="border:1px solid #000; text-align:center; font-size:12px;">${formatNumber(
            mur.tariff ?? 0,
            2,
          )}</td>
          ${
            isTsahilgaan
              ? `<td style="border:1px solid #000; text-align:center; font-size:12px;" rowspan="${tsahilgaanRowspan}">${formatNumber(
                  niitUne,
                  2,
                )}</td>`
              : `<td style="border:1px solid #000; text-align:center; font-size:12px;">${formatNumber(
                  niitUne,
                  2,
                )}</td>`
          }
        </tr>
      `;
      })
      .join("")}

    ${ashiglaltZardluud
      .filter((a) => a.tailbar?.includes("Цахилгаан"))
      .map(
        (mur) => `
        <tr>
          <td style="border:1px solid #000; text-align:center; font-size:12px;">${++ashiglaltDugaarlalt[0]}</td>
          <td style="border:1px solid #000; text-align:left; font-size:12px;">ЦЕХ</td>
          <td style="border:1px solid #000; text-align:center; font-size:12px;"></td>
          <td style="border:1px solid #000; text-align:center; font-size:12px;"></td>
          <td style="border:1px solid #000; text-align:center; font-size:12px;">${formatNumber(
            mur.tsekhDun ?? 0,
            2,
          )}</td>
          <td style="border:1px solid #000; text-align:center; font-size:12px;"></td>
        </tr>

        <tr>
          <td style="border:1px solid #000; text-align:center; font-size:12px;">${++ashiglaltDugaarlalt[0]}</td>
          <td style="border:1px solid #000; text-align:left; font-size:12px;">Чадал</td>
          <td style="border:1px solid #000; text-align:center; font-size:12px;"></td>
          <td style="border:1px solid #000; text-align:center; font-size:12px;"></td>
          <td style="border:1px solid #000; text-align:center; font-size:12px;">${formatNumber(
            mur.chadalDun ?? 0,
            2,
          )}</td>
          <td style="border:1px solid #000; text-align:center; font-size:12px;"></td>
        </tr>

        <tr>
          <td style="border:1px solid #000; text-align:center; font-size:12px;">${++ashiglaltDugaarlalt[0]}</td>
          <td style="border:1px solid #000; text-align:left; font-size:12px;">СЭХ дэмжих</td>
          <td style="border:1px solid #000; text-align:center; font-size:12px;"></td>
          <td style="border:1px solid #000; text-align:center; font-size:12px;"></td>
          <td style="border:1px solid #000; text-align:center; font-size:12px;">${formatNumber(
            mur.sekhDemjikhTulburDun ?? 0,
            2,
          )}</td>
          <td style="border:1px solid #000; text-align:center; font-size:12px;"></td>
        </tr>
      `,
      )
      .join("")}
  </tbody>
</table>
`
      : "";

  const murNemekh = [];
  let currentDugaar = 0;
  murNemekh.push(`
    <tr>
      <td style="border: 1px solid #000; text-align: center; font-size: 12px;">${++currentDugaar}</td>
      <td style="border: 1px solid #000; text-align: left; font-size: 12px;">Менежментийн зардал</td>
      <td style="border: 1px solid #000; text-align: center; font-size: 12px;">&lt;talbainKhemjee&gt;</td>
      <td style="border: 1px solid #000; text-align: center; font-size: 12px; width: 15%;" colspan="2">&lt;talbainNegjUne&gt;</td>
      <td style="border: 1px solid #000; text-align: right; font-size: 12px;">${formatNumber(
        medeelel?.tukhainSariinTureesiinTulukhDun,
        2,
      )}</td>
    </tr>
  `);

  if (Number(medeelel.aldangiinUldegdel) > 0) {
    murNemekh.push(`
      <tr>
        <td style="border: 1px solid #000; text-align: center; font-size: 12px;">${++currentDugaar}</td>
        <td style="border: 1px solid #000; text-align: left; font-size: 12px;">Алданги</td>
        <td style="border: 1px solid #000; text-align: center; font-size: 12px;"></td>
        <td style="border: 1px solid #000; text-align: center; font-size: 12px;" colspan="2"></td>
        <td style="border: 1px solid #000; text-align: right; font-size: 12px;">&lt;aldangiinUldegdel&gt;</td>
      </tr>
    `);
  }

  medeelel.zardluud
    .sort((a, b) => {
      return a.tailbar.localeCompare(b.tailbar, "en", {
        sensitivity: "base",
      });
    })
    .filter((a) => a.tailbar?.includes("менежмент"))
    .forEach((mur) => {
      murNemekh.push(`
        <tr>
          <td style="border: 1px solid #000; font-size:12px; text-align: center;">${++currentDugaar}</td>
          <td style="border: 1px solid #000; font-size:12px; text-align: left;">
            ${mur.tailbar}
          </td>
        </tr>
      `);
    });

  medeelel.zardluud
    .filter(
      (a) => !a.tailbar?.includes("менежмент") && a.tailbar != "Хөнгөлөлт",
    )
    .forEach((mur) => {
      murNemekh.push(`
        <tr>
          <td style="border: 1px solid #000; font-size:12px; text-align:center;">${++currentDugaar}</td>
          <td style="border: 1px solid #000; font-size:12px;">${
            mur.tailbar || ""
          }</td>
          <td style="border: 1px solid #000; font-size:12px; text-align:center;">${
            mur.tailbar.includes("Дулаан")
              ? ` &lt;talbainKhemjeeMetrKube&gt;`
              : `1`
          }</td>
          <td style="border: 1px solid #000; font-size:12px; text-align: center;" colspan="2">
                ${formatNumber(mur.tariff ?? 0, 2)}
          </td>
          <td style="border: 1px solid #000; font-size:12px; text-align: right;" colspan="2">
                &lt;${mur.tailbar}.tulukhDun&gt;
          </td>
        </tr>
      `);
    });

  dugaarlalt[0] = currentDugaar;

  return `
  <div style="width: 100%; padding: 1rem; page-break-after: always;">
    <div style="display: flex; width: 100%; justify-content: space-between; align-items: flex-start; margin-top:0;">
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
    <div style="text-align: center; margin-top: 10px; font-size: 16px; ">
      НЭХЭМЖЛЭХ ДУГААР № &lt;nekhemjlekhiinDugaar&gt;
    </div>

    <div style="display: flex; justify-content: space-between; margin-top: 10px;">
      <div style="padding: 1rem; flex: 1;">
        <p style="font-weight: 600; font-size:14px;">Нэхэмжлэгч: Эмээлт дэнжийн тал ХХК</p>
        <div style="display: flex; font-size:12px; justify-content: space-between;">
          <span>Байгууллагын нэр:</span>
          <span style="font-size:12px;">Эмээлт дэнжийн тал ХХК
          </span> 
        </div>

        <div style="display: flex;font-size:12px; justify-content: space-between;">
          <span>РД: </span>
          <span style="">6684459</span>
        </div>
        <div style="display: flex; font-size:12px; justify-content: space-between;">
          <span>Хаяг:</span>
          <span style="">&nbsp;</span>
        </div>
        <div style="display: flex; font-size:12px; justify-content: space-between;">
          <span>Утас:</span>
          <span style="">88090146</span>
        </div>
        <div style="display: flex; font-size:12px; justify-content: space-between;">
          <span>Э-шуудан:</span>
          <span style="">munkhjargalbatbaatar413@gmail.com</span>
        </div>
        <div style="display: flex; font-size:12px; justify-content: space-between;">
          <span>Банкны нэр:</span>
          <span style="">Хаан банк</span>
        </div>
        <div style="display: flex; font-size:12px; justify-content: space-between;">
          <span>IBAN дансны дугаар:</span>
          <span style="">510005005653712667</span>
        </div>
      </div>

      <div style="padding: 1rem; flex: 1; font-size:12px;">
        <p style="font-weight: 600; font-size:14px;">Хариуцагч:</p>
        <div style="display: flex; font-size:12px; justify-content: space-between;">
          <span>Харилцагчын нэр:</span>
          <span style="">&lt;ner&gt;</span>
        </div>
        <div style="display: flex; font-size:12px; justify-content: space-between;">
          <span>РД:</span>
          <span style="">&lt;register&gt;</span>
        </div>
        <div style="display: flex; font-size:12px; justify-content: space-between;">
          <span>Талбайн дугаар:</span>
          <span style="">&lt;talbainDugaar&gt;</span>
        </div>
      <div style="display: flex; font-size:12px; justify-content: space-between;">
          <span style="">Нэхэмжилсэн огноо:</span>
          <span style="">&lt;ekhelkhSar&gt;/&lt;ekhlekhUdur&gt;/&lt;ekhlekhOn&gt;</span>
        </div>
        <div style="display: flex; font-size:12px; justify-content: space-between;">
          <span style="">Төлбөр хийх хугацаа:</span>
          <span style="">${
            !!medeelel?.nekhemjlekhTulukhUdur
              ? "&lt;nekhemjlekhTulukhUdur&gt;"
              : "&lt;duusakhSar&gt;/&lt;duusakhUdur&gt;/&lt;duusakhOn&gt;"
          }</span>
        </div>
        <div style="display: flex; font-size:12px; justify-content: space-between;">
          <span>&nbsp;&nbsp;&nbsp;</span>
          <span style="">&nbsp;&nbsp;&nbsp;</span>
        </div>
        <div style="display: flex; font-size:12px; justify-content: space-between;">
          <span>&nbsp;&nbsp;&nbsp;</span>
          <span style="">&nbsp;&nbsp;&nbsp;</span>
        </div>
      </div>
    </div>

    <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
      <thead>
      <tr>
          <th style="border: none; " colspan="2">
          <span style= "font-size:12px">
          Хамрах хугацаа: &lt;ekhlekhOn&gt; оны &lt;ekhelkhSar&gt;-р сар
          </span>
          </th>
          <th style="border: none;"></th>
          <th style="border: 1px solid #000; font-size:12px;" colspan="2">
            Өмнөх сарын үлдэгдэл 
          </th>
          <th style="border: 1px solid #000; font-size:12px; text-align: right;">
          &lt;umnukhSariinUrTulbur&gt;
          </th>
      </tr>
        <tr>
          <th style="border: 1px solid #000; font-size:12px">№</th>
          <th style="border: 1px solid #000; font-size:12px">Гүйлгээний утга</th>
          <th style="border: 1px solid #000; font-size:12px">Тоо хэмжээ</th>
          <th style="border: 1px solid #000; font-size:12px" colspan="2">Нэгж үнэ</th>
          <th style="border: 1px solid #000; font-size:12px">Нийт үнэ</th>
        </tr>
      </thead>
      <tbody>
        ${murNemekh.join("")}
      </tbody>
      <tfoot style="border: none;">
  ${
    ajiltan?.baiguullagiinId === "622ec99a8e64e5b4f0c3acb6"
      ? `
        <tr>
          <td
            colspan="4"
            rowspan="3"
            style="border: 1px solid #000; text-align: center; font-size: 12px;"
          >
            &lt;garaasBodsonNiitDunUsgeer&gt; болно
          </td>
        </tr>
      `
      : `
        <tr>
          <td
            colspan="4"
            rowspan="3"
            style="border: 1px solid #000; text-align: center; font-size: 12px;"
          >
            &lt;garaasBodsonNiitDunUsgeer&gt; болно
          </td>
          <td style="border: 1px solid #000; font-size: 12px;">Дүн</td>
          <td
            style="border: 1px solid #000; text-align: right; font-size: 12px;"
          >
            &lt;garaasBodsonNiitDunNuatgui&gt;
          </td>
        </tr>
        <tr>
          <td style="border: 1px solid #000; font-size: 12px;">НӨАТ</td>
          <td
            style="border: 1px solid #000; text-align: right; font-size: 12px;"
          >
            &lt;garaasBodsonNiitDunNuat&gt;
          </td>
        </tr>
        <tr>
          <td style="border: 1px solid #000; font-size: 12px;">Нийт үнэ</td>
          <td
            style="border: 1px solid #000; text-align: right; font-size: 12px;"
          >
            &lt;garaasBodsonNiitDun&gt;
          </td>
        </tr>
      `
  }

  <tr>
    <td colspan="6" style="border: 1px solid #000; text-align: left;">
      <p style="font-size: 12px;">
        Жич: Гүйлгээний утга дээр талбайн тоот, регистерийн дугаараа заавал бичнэ үү!
      </p>
    </td>
  </tr>

  <tr>
    <td colspan="6" style="border: none; height: 100px;"></td>
  </tr>

  <tr>
    <td style="border: none; font-size: 12px;">Тамга</td>
    <td style="border: none;" rowspan="2">&lt;tamga&gt;</td>
    <td style="border: none;"></td>
    <td colspan="3" style="border: none; text-align: center;">
      <p style="font-size: 12px;">
        Хүлээн авсан ............... / ............... /
      </p>
    </td>
  </tr>

  <tr>
    <td style="border: none;"></td>
    <td style="border: none;"></td>
    <td colspan="3" style="border: none; text-align: center;">
      <p style="font-size: 12px; margin-bottom: 50px;">
        Нягтлан бодогч &lt;gariinUseg&gt; .............../
      </p>
    </td>
  </tr>

  <tr>
    <td colspan="6"><br /></td>
  </tr>
  <tr>
    <td colspan="6"><br /></td>
  </tr>
</tfoot>

    </table> 
    ${
      ashiglaltTable
        ? `<td style="font-size:12px; font-weight:bold; " colspan="4">Тоолуурын заалтын мэдээлэл:</td>`
        : ""
    }
    ${ashiglaltTable}
    <p style="font-size:12px; margin-top: 20px; font-weight: bold;">Жич: Энэхүү нэхэмжлэх нь тооцоо нийлсэн акт биш төлбөр төлөгчийн эцсийн үлдэгдэл биш байж болно.</p>
  </div>`;
};

export default khatuuZagvarGumuda;
