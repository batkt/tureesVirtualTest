import formatNumber from "tools/function/formatNumber";
const parseNum = (v) => {
  if (v == null || v === "") return 0;
  return parseFloat(String(v).replace(/,/g, "")) || 0;
};

const getNiitForZardal = (mur, ashiglaltiinZardal, barilgiinId) => {
  const tulukhDun = parseNum(mur.tulukhDun);
  const khungulult = parseNum(mur.khungulult);
  if (tulukhDun > 0) return tulukhDun - khungulult;
  if (barilgiinId !== "622ec99a8e64e5b4f0c3acb6") return 0;
  const tariffItem =
    ashiglaltiinZardal?.jagsaalt?.find((b) => b.ner === mur.tailbar) ||
    ashiglaltiinZardal?.jagsaalt?.find((b) => mur.tailbar?.includes(b.ner));
  const tariff = parseNum(mur.tariff) || parseNum(tariffItem?.tariff);
  const negj = parseNum(mur.negj);
  if (tariff > 0) return (negj || 1) * tariff - khungulult;
  const fromTailbar = parseNum(
    String(mur.tailbar || "").match(/[\d,]+(?:\.\d+)?/)?.[0],
  );
  return fromTailbar >= 1000 ? fromTailbar - khungulult : 0;
};

const getFromTailbar = (tailbar) => {
  const m = String(tailbar || "").match(/[\d,]+(?:\.\d+)?/);
  const val = parseNum(m?.[0]);
  if (val >= 1000) return val;
  if (val >= 1 && val < 1000 && /тог\s*\d+/i.test(tailbar || ""))
    return val * 1000;
  return 0;
};

const khatuuZagvarIkhNayd = (
  medeelel,
  ajiltan,
  baiguullaga,
  barilga,
  baiguullagiinId,
  barilgiinId,

  ashiglaltDugaarlalt = [0],
  baritsaaDugaarlalt = [0],
  ashiglaltiinZardal,
) => {
  const ashiglaltZardluud = medeelel.zardluud
    ?.filter(
      (a) =>
        a.tailbar?.includes("Цахилгаан") ||
        a.tailbar?.includes("Халуун ус") ||
        a.tailbar?.includes("Хүйтэн ус") ||
        a.tailbar?.includes("Газ"),
    )
    .sort((a, b) =>
      a.tailbar.localeCompare(b.tailbar, "en", { sensitivity: "base" }),
    );
  const murNemekh = [];
  const dugaarlalt = [0];
  const ashiglaltTable =
    ashiglaltZardluud.length > 0
      ? `
    <table style="width:100%; border-collapse:collapse;">
    <tr>
        <td style="font-size:12px; font-weight:bold; " colspan="4">Тоолуурын заалтын мэдээлэл:</td>
    </tr>
      <thead">
        <tr>
          <td style="border:1px solid #000; text-align: center; font-size:12px; width: 5%;">№</td>
          <td style="border:1px solid #000; text-align: center; font-size:12px; width: 20%;">Утга</td>
          <td style="border:1px solid #000; text-align: center; font-size:12px;">Өмнөх заалт</td>
          <td style="border:1px solid #000; text-align: center; font-size:12px;">Одоогийн заалт</td>
          <td style="border:1px solid #000; text-align: center; font-size:12px;">Хэрэглээ</td>
          <td style="border:1px solid #000; text-align: center; font-size:12px;">Нэгж үнэ</td>
        </tr>
      </thead>
      <tbody>
        ${ashiglaltZardluud
          .map((mur, index) => {
            return `
              <tr key=${index}>
                <td style="border: 1px solid #000; text-align: center; font-size:12px; width: 5%;">${++ashiglaltDugaarlalt[0]}</td>
                <td style="border: 1px solid #000; text-align: left; font-size:12px; width: 20%;">${
                  mur.tailbar
                }</td>
                <td style="border: 1px solid #000; text-align: center; font-size:12px">&lt;${
                  mur.tailbar
                }.umnukhZaalt&gt;</td>
                <td style="border: 1px solid #000; text-align: center; font-size:12px">&lt;${
                  mur.tailbar
                }.suuliinZaalt&gt;</td>
                <td style="border: 1px solid #000; text-align: center; width: 16%; font-size:12px">${formatNumber(
                  mur?.negj || 0,
                )}</td>
                <td style="border: 1px solid #000; text-align: center; width: 16%; font-size:12px">${formatNumber(
                  mur?.tariff || 0,
                )}</td>
              </tr>`;
          })
          .join("")}
          ${ashiglaltZardluud
            .filter((a) => a.tailbar === "Цахилгаан")
            .map((mur, index) => {
              return `
              <tr key=${index}>
                <td style="border: 1px solid #000; text-align: center;font-size:12px">${++ashiglaltDugaarlalt[0]}</td>
                <td style="border: 1px solid #000; text-align: left; font-size:12px; width: 20%;">ЦЕХ</td>
                <td style="border: 1px solid #000; text-align: center; font-size:12px">0</td>
                <td style="border: 1px solid #000; text-align: center; font-size:12px">0</td>
                <td style="border: 1px solid #000; text-align: center; width: 16%; font-size:12px">&lt;${
                  mur.tailbar
                }.tsekhDun&gt;</td>
                <td style="border: 1px solid #000; text-align: center; width: 16%; font-size:12px">0</td>
              </tr>`;
            })
            .join("")}
          ${ashiglaltZardluud
            .filter((a) => a.tailbar === "Цахилгаан")
            .map((mur, index) => {
              return `
              <tr key=${index}>
                <td style="border: 1px solid #000; text-align: center;font-size:12px; width: 5%;">${++ashiglaltDugaarlalt[0]}</td>
                <td style="border: 1px solid #000; text-align: left; font-size:12px; width: 20%;">Чадал</td>
                <td style="border: 1px solid #000; text-align: center; font-size:12px">0</td>
                <td style="border: 1px solid #000; text-align: center; font-size:12px">0</td>
                <td style="border: 1px solid #000; text-align: center; width: 16%; font-size:12px">&lt;${
                  mur.tailbar
                }.chadalDun&gt;</td>
                <td style="border: 1px solid #000; text-align: center; width: 16%; font-size:12px">0</td>
              </tr>`;
            })
            .join("")}
          ${ashiglaltZardluud
            .filter((a) => a.tailbar === "Цахилгаан")
            .map((mur, index) => {
              return `
              <tr key=${index}>
                <td style="border: 1px solid #000; text-align: center;font-size:12px; width: 5%;">${++ashiglaltDugaarlalt[0]}</td>
                <td style="border: 1px solid #000; text-align: left; font-size:12px; width: 20%;">ЦЕХ дэмжих</td>
                <td style="border: 1px solid #000; text-align: center; font-size:12px">0</td>
                <td style="border: 1px solid #000; text-align: center; font-size:12px">0</td>
                <td style="border: 1px solid #000; text-align: center; width: 16%; font-size:12px">&lt;${
                  mur.tailbar
                }.sekhDemjikhTulburDun&gt;</td>
                <td style="border: 1px solid #000; text-align: center; width: 16%; font-size:12px">0</td>
              </tr>`;
            })
            .join("")}
      </tbody>
    </table>`
      : "";
  if (Number(medeelel.aldangiinUldegdel) > 0) {
    murNemekh.push(`
      <tr>
        <td style="border: 1px solid #000; text-align: center; font-size: 12px;">${++dugaarlalt[0]}</td>
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
        <p style="">Нэхэмжлэгч:</p>
        <div style="display: flex; font-size:12px; justify-content: space-between;">
          <span>Байгууллагын нэр:</span>
          <span style="font-size:12px;">&nbsp;${
            medeelel?.barilgiinId === "61e13558ccf0f605a3f09d3c"
              ? "Шинэ тэрэг плаза"
              : medeelel?.barilgiinId === "61d54c5748d9fcf140298137"
              ? "Цэцэг төв"
              : medeelel?.barilgiinId === "657955ac70280a9ebe8f11ef"
              ? "Шинэст"
              : medeelel?.barilgiinId === "619e267fdd4835aa2c168b28"
              ? "Их наяд Плаза ХХК"
              : medeelel?.barilgiinId === "622ec99a8e64e5b4f0c3acb6"
              ? "Их наяд Tower"
              : ""
          }
          </span> 
        </div>

        <div style="display: flex;font-size:12px; justify-content: space-between;">
          <span>РД:</span>
          <span style=""> 6481523 </span>
        </div>
        <div style="display: flex; font-size:12px; justify-content: space-between;">
          <span>Хаяг:</span>
          <span style="">&nbsp;ХУД 15-р хороо Их Наяд Плаза Зүүн Өндөр 13 давхар 1304тоот</span>
        </div>
        <div style="display: flex; font-size:12px; justify-content: space-between;">
          <span>Утас:</span>
          <span style="">&nbsp;77091155</span>
        </div>
        <div style="display: flex; font-size:12px; justify-content: space-between;">
          <span>Э-шуудан:</span>
          <span style="">&nbsp;${
            barilgiinId === "622ec99a8e64e5b4f0c3acb6"
              ? baiguullaga?.tokhirgoo?.mailNevtrekhNer
              : "info@ikhnayd.mn"
          }</span>
        </div>
        <div style="display: flex; font-size:12px; justify-content: space-between;">
          <span>Банкны нэр:</span>
          <span style="">&nbsp;&lt;bank&gt;&nbsp;&lt;dansniiNer&gt;</span>
        </div>
        <div style="display: flex; font-size:12px; justify-content: space-between;">
          <span>IBAN дансны дугаар:</span>
          <span style="">&lt;dans&gt;</span>
        </div>
      </div>

      <div style="padding: 1rem; flex: 1; font-size:12px;">
        <p style="">Хариуцагч:</p>
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
              : "&lt;ekhelkhSar&gt;/&lt;duusakhUdur&gt;/&lt;duusakhOn&gt;"
          }</span>
        </div>
        <div style="display: flex; font-size:12px; justify-content: space-between;">
         <span style= "font-size:12px">
          ${medeelel.sariiinToo ? `${medeelel.sariiinToo} сарын нэхэмжлэх` : ``}
          </span>
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
          <th style="border: 1px solid #000; font-size:12px">Нэгж үнэ</th>
          <th style="border: 1px solid #000; font-size:12px">Хөнгөлөлт</th>
          <th style="border: 1px solid #000; font-size:12px">Нийт</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="border: 1px solid #000; text-align: center; font-size: 12px;">${++dugaarlalt[0]}</td>
          <td style="border: 1px solid #000; text-align: left; font-size: 12px;">Түрээсийн төлбөр</td>
          <td style="border: 1px solid #000; text-align: center; font-size: 12px;">&lt;talbainKhemjee&gt;</td>
          <td style="border: 1px solid #000; text-align: center; font-size: 12px; width: 15%;">&lt;talbainNegjUne&gt;</td>
          <td style="border: 1px solid #000; text-align: right; font-size: 12px; width: 15%;">&lt;khungulult&gt;</td>
          <td style="border: 1px solid #000; text-align: right; font-size: 12px; width: 25%;">&lt;khungulsunTalbainNiitUne&gt;</td>
        </tr>
      ${murNemekh}
         ${medeelel.zardluud
           .sort((a, b) => {
             return a.tailbar.localeCompare(b.tailbar, "en", {
               sensitivity: "base",
             });
           })
           .filter((a) => a.tailbar?.includes("менежмент"))
           .map((mur, index) => {
             const niitVal = getNiitForZardal(mur, ashiglaltiinZardal, barilga);
             return `
              <tr key=${index}>
                <td style="border: 1px solid #000; font-size:12px; text-align: center;">${++dugaarlalt[0]}</td>
                <td style="border: 1px solid #000; font-size:12px; text-align: left;">
                  ${mur.tailbar}
                </td>
                <td style="border: 1px solid #000; font-size:12px; text-align: center;">
                  &lt;talbainKhemjee&gt;
                </td>
                <td style="border: 1px solid #000; font-size:12px; text-align: center; width: 16%;">
                  ${mur?.tariff || 0}
                </td>
                <td style="border: 1px solid #000; font-size:12px; text-align: right; ">
                  &lt;${mur.tailbar}.khungulult&gt;
                </td>
                <td style="border: 1px solid #000; font-size:12px; text-align: right; font-size: 12px;">${
                  (barilga === "622ec99a8e64e5b4f0c3acb6" ? niitVal : null) !=
                  null
                    ? niitVal.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                    : "&lt;" + mur.tailbar + ".khungulultKhassanTulukhDun&gt;"
                }</td>
              </tr>
            `;
           })
           .join("")}

        ${medeelel.zardluud
          .filter(
            (a) =>
              !a.tailbar?.includes("менежмент") && a.tailbar != "Хөнгөлөлт",
          )
          .map((mur, index) => {
            const niitVal = getNiitForZardal(mur, ashiglaltiinZardal, barilga);
            const displayNiit =
              barilga === "622ec99a8e64e5b4f0c3acb6" ? niitVal : null;
            const tariffItem =
              ashiglaltiinZardal?.jagsaalt?.find(
                (b) => b.ner === mur.tailbar,
              ) ||
              ashiglaltiinZardal?.jagsaalt?.find((b) =>
                mur.tailbar?.includes(b.ner),
              );
            const tariffForQty =
              parseNum(mur.tariff) || parseNum(tariffItem?.tariff);
            const fromTailbar = getFromTailbar(mur.tailbar);
            const isUtility =
              mur.tailbar?.includes("Халуун ус") ||
              mur.tailbar?.includes("Хүйтэн ус") ||
              mur.tailbar?.includes("Цахилгаан") ||
              mur.tailbar?.includes("Хаягжилт");
            const isFixedFee =
              barilga === "622ec99a8e64e5b4f0c3acb6" &&
              displayNiit > 0 &&
              tariffForQty === 0;
            const isFixedFeeFromTailbar =
              (mur.tailbar?.includes("Хог") ||
                mur.tailbar?.includes("Хаягжилт")) &&
              tariffForQty === 0 &&
              fromTailbar > 0;
            const displayQty = mur.tailbar.includes("Дулаан")
              ? ` &lt;talbainKhemjeeMetrKube&gt;`
              : isFixedFee || isFixedFeeFromTailbar
              ? "1"
              : isUtility
              ? `${mur?.negj || 0}`
              : `1`;
            const displayTariff =
              isFixedFee && displayNiit > 0
                ? displayNiit.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                : isFixedFeeFromTailbar
                ? fromTailbar.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                : null;
            return `
          <tr>
            <td style="border: 1px solid #000; font-size:12px; text-align:center;">${++dugaarlalt[0]}</td>
            <td style="border: 1px solid #000; font-size:12px;">${
              mur.tailbar || ""
            }</td>
            <td style="border: 1px solid #000; font-size:12px; text-align:center;">${displayQty}</td>
            <td style="border: 1px solid #000; font-size:12px; text-align: center;">
                  ${
                    displayTariff != null
                      ? displayTariff
                      : formatNumber(mur?.tariff || 0)
                  }
            </td>
            <td style="border: 1px solid #000; font-size:12px; text-align: right; width: 16%;">
              &lt;${mur.tailbar}.khungulult&gt;
            </td>
            <td style="border: 1px solid #000; font-size:12px; text-align: right; font-size: 12px;">${
              displayNiit != null
                ? displayNiit.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                : "&lt;" + mur.tailbar + ".khungulultKhassanTulukhDun&gt;"
            }</td>
          </tr>`;
          })
          .join("")}
      </tbody>
       <tfoot style="border: none;">
          ${
            ajiltan?.baiguullagiinId === "622ec99a8e64e5b4f0c3acb6"
              ? `<tr style; border: none;">
             <td style="border: none; text-align: center; justify-content: center; font-weight: normal; font-size:12px; " colspan="4" rowspan="3" >&lt;garaasBodsonNiitDunUsgeer&gt; болно</td>
            </tr>`
              : `<tr style=; border: none;">
              <td style="border: none; text-align: center; justify-content: center; font-weight: normal; font-size:12px;" colspan="4" rowspan="3" >&lt;garaasBodsonNiitDunUsgeer&gt; болно</td>
              <td style="border: 1px solid #000; font-size:12px">Дүн</td>
              <td style="text-align: right; font-size: 12px; border: 1px solid #000;">&lt;garaasBodsonNiitDunNuatgui&gt;</td> 
            </tr>
            <tr style; border: none;">
              <td style="border: none; border: 1px solid #000; font-size:12px" >НӨАТ</td>
              <td style="text-align: right; font-size: 12px; border: 1px solid #000;">&lt;garaasBodsonNiitDunNuat&gt;</td>
            </tr>
            <tr style; border: none;">
              <td style="border: none; border: 1px solid #000; font-size:12px" >Нийт үнэ</td>
              <td style="text-align: right; font-size: 12px; border: 1px solid #000;">&lt;garaasBodsonNiitDun&gt;</td>
            </tr>`
          }     
        <tr>
            <td colspan="6" style="border: none; text-align: left; ">
                <p style="font-size: 12px;">Жич: Гүйлгээний утга дээр талбайн тоот, регистерийн дугаараа заавал бичнэ үү!</p>
            </td>
        </tr>
        <tr>
          <td style="border: none; font-size: 12px">Тамга</td>
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
            <p style="font-size: 12px; margin-bottom: 20px">Нягтлан бодогч&lt;gariinUseg&gt;............../</p>
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
        <p style="font-size: 12px; font-weight: bold;">Барьцааны мэдээлэл</p>
    <table style="width: 30%; border-collapse: collapse; margin-top: 10px; margin-bottom: 20px;">
          <thead>
            <tr>
              <th style="border: 1px solid #000; font-size:12px">№</th>
              <th style="border: 1px solid #000; font-size:12px">Барьцаа</th>
              <th style="border: 1px solid #000; font-size:12px">Нийт</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="border: 1px solid #000; text-align: center; font-size: 12px;">${++baritsaaDugaarlalt[0]}</td>
              <td style="border: 1px solid #000; text-align: left; font-size: 12px;">Нийт төлөх дүн</td>
              <td style="border: 1px solid #000; text-align: center; font-size: 12px;">&lt;baritsaaAvakhDun&gt;</td>
            </tr>
            <tr>
              <td style="border: 1px solid #000; text-align: center; font-size: 12px;">${++baritsaaDugaarlalt[0]}</td>
              <td style="border: 1px solid #000; text-align: left; font-size: 12px;">Төлсөн дүн</td>
              <td style="border: 1px solid #000; text-align: center; font-size: 12px;">&lt;baritsaaniiUldegdel&gt;</td>
            </tr>
            <tr>
              <td style="border: 1px solid #000; text-align: center; font-size: 12px;">${++baritsaaDugaarlalt[0]}</td>
              <td style="border: 1px solid #000; text-align: left; font-size: 12px;">Үлдэгдэл</td>
              <td style="border: 1px solid #000; text-align: center; font-size: 12px;">&lt;baritsaaUldegdel&gt;</td>
            </tr>
          </tbody>
      </table>
    
    ${ashiglaltTable}
    <p style="font-size:12px; margin-top: 20px; font-weight: bold;">Жич: Энэхүү нэхэмжлэх нь тооцоо нийлсэн акт биш төлбөр төлөгчийн эцсийн үлдэгдэл биш байж болно.</p>
  </div>`;
};

export default khatuuZagvarIkhNayd;
