import formatNumber from "tools/function/formatNumber";

const khatuuZagvarVirtus = (medeelel, ajiltan, baiguullaga) => {
  // Use system tags for auto-replacement or date eval
  const getCoverage = (ognoo) => {
    if (!ognoo) return "&lt;ekhlekhOn&gt;.&lt;ekhelkhSar&gt;.01-&lt;ekhlekhOn&gt;.&lt;ekhelkhSar&gt;.30";
    try {
      if (ognoo.length < 10) return "&lt;ekhlekhOn&gt;.&lt;ekhelkhSar&gt;.01-&lt;ekhlekhOn&gt;.&lt;ekhelkhSar&gt;.30";
      const yStr = ognoo.substring(0,4);
      const mStr = ognoo.substring(5,7);
      const lastDay = new Date(parseInt(yStr), parseInt(mStr), 0).getDate();
      return `${yStr}.${mStr}.01-${yStr}.${mStr}.${lastDay}`;
    } catch(e) {
      return "&lt;ekhlekhOn&gt;.&lt;ekhelkhSar&gt;.01-&lt;ekhlekhOn&gt;.&lt;ekhelkhSar&gt;.30";
    }
  };

  return `
<div style="-webkit-print-color-adjust:exact !important;color-adjust:exact !important;width:100%;font-family:Times New Roman,sans-serif;font-size:16px;color:#000;padding:20px 24px;box-sizing:border-box;background:#fff;">
<style>
  * { box-sizing: border-box; -webkit-print-color-adjust: exact !important; color-adjust: exact !important; }
  .vt { border-collapse:collapse; width:100%; font-size:16px; }
  .vt td { border:1px solid #000; padding:4px 6px; font-size:16px; vertical-align:middle; color:#000; font-weight: normal; }
  .vt .hdr td { background-color:#a5bfdb; color:#000; font-weight:normal; text-align:center; }
  .vt .cat td { background-color:#a5bfdb; color:#000; font-weight:normal; text-align:center; }
  .vt .tot td { font-weight:normal; }
  .footer-table td { border: none !important; padding: 0; vertical-align: middle; font-size: 16px; color: #000; font-weight: normal; }
  .footer-row { height: 40px; }
</style>

<!-- Title -->
<div style="text-align:center;margin-bottom:16px;">
  <div style="font-size:16px;color:#000;font-weight:normal;">НЭХЭМЖЛЭЛ</div>
  <div style="font-size:16px;color:#000;font-weight:normal;">Дугаар: рр/ ${medeelel?.nekhemjlekhiinDugaar || ""}</div>
</div>

<!-- Header block -->
<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;width:100%; margin-top: 20px;">
  <div style="width:50%;">
    <div style="font-size:16px;color:#000;margin-bottom:4px;font-weight:normal;">Нэхэмжлэгч байгууллагын нэр:</div>
    <div style="font-size:16px;color:#000;padding:4px 0px;margin-bottom:8px;font-weight:normal;box-sizing:border-box;width:100%;">${baiguullaga?.ner}</div>
    
    <div style="display:flex; font-size:16px; margin-bottom:4px; margin-left: 20px;">
       <div style="width: 120px;">Банкны нэр:</div>
       <div>Голомт банк</div>
    </div>
    <div style="display:flex; font-size:16px; margin-bottom:10px; margin-left: 20px;">
       <div style="width: 120px;">Дансны дугаар:</div>
       <div style="white-space:nowrap;">MN34 0015 00 3005107103</div>
    </div>
  </div>

  <div style="width:48%; margin-left: 50px;">
    <div style="font-size:16px;color:#000;margin-bottom:4px;font-weight:normal;">Төлөгч байгууллагын нэр:</div>
    <div style="font-size:16px;color:#000;background:#a5bfdb;padding:4px 0px;margin-bottom:8px;font-weight:normal;box-sizing:border-box;width:100%;">&lt;ner&gt;</div>
    
    <div style="font-size:16px;color:#000;font-weight:normal;line-height:1.3;">
      <span>Хаяг: ${medeelel?.khayag ? medeelel.khayag : "Паркплэйс<br/>СБД, 1-р хороо, Чингисийн<br/>өргөн чөлөө-24"}</span>
    </div>
  </div>
</div>

<div style="display:flex;justify-content:space-between;width:100%;margin-top:20px;margin-bottom:8px;">
  <div style="width:50%;font-size:16px;color:#000;font-weight:normal;display:flex;align-items:flex-end;">
    Утас: 70112606
  </div>
  <div style="width:45%;">
    <div style="display:flex;justify-content:space-between;font-size:16px;color:#000;margin-bottom:4px;font-weight:normal;">
      <span>Нэхэмжилсэн хугацаа:</span>
      <span style="font-weight:normal;">&lt;ekhlekhOn&gt;.&lt;ekhelkhSar&gt;.&lt;ekhlekhUdur&gt;</span>
    </div>
    <div style="display:flex;justify-content:space-between;font-size:16px;color:#000;font-weight:normal;">
      <span>Төлбөр хийх хугацаа:</span>
      <span style="font-weight:normal;">&lt;duusakhOn&gt;.&lt;duusakhSar&gt;.&lt;duusakhUdur&gt;</span>
    </div>
  </div>
</div>

<!-- Main Table -->
<table class="vt" style="margin-top:16px;">
  ${(() => {
    const hasMeters = medeelel.zardluud.some(z => z.tailbar?.toLowerCase().includes("цахилгаан") || z.tailbar?.toLowerCase().includes("цэвэр ус") || z.tailbar?.toLowerCase().includes("бохир ус") || z.tailbar?.toLowerCase().includes("халуун ус") || z.tailbar?.toLowerCase().includes("хүйтэн ус"));
    return `<thead>
      <tr class="hdr">
        <td style="width:40px;background-color:#a5bfdb;text-align:center;">Д/д</td>
        <td style="background-color:#a5bfdb;">Нэхэмжлэлийн утга</td>
        <td style="width:170px;background-color:#a5bfdb;text-align:center;">Хамрах хугацаа</td>
        ${hasMeters ? 
          `<td style="width:80px;background-color:#a5bfdb;text-align:center;">Тоолуурын заалт өмнө</td>
           <td style="width:80px;background-color:#a5bfdb;text-align:center;">Тоолуурын заалт одоо</td>` 
          : 
          `<td style="width:80px;background-color:#a5bfdb;text-align:center;">Талбай м2</td>
           <td style="width:80px;background-color:#a5bfdb;text-align:center;">Үнэ ₮</td>`
        }
        <td style="width:110px;background-color:#a5bfdb;text-align:center;">Нийт үнэ ₮</td>
      </tr>
    </thead>`;
  })()}
  <tbody>
    ${(() => {
      let html = "";
      let n = 1;

      // 0. Base Rent (Түрээсийн төлбөр)
      html += `<tr>
        <td style="text-align:center;">${n++}</td>
        <td>Түрээсийн төлбөр</td>
        <td style="text-align:center;">${getCoverage(medeelel?.ognoo)}</td>
        <td style="text-align:right;">&lt;talbainKhemjee&gt;</td>
        <td></td>
        <td style="text-align:right;">&lt;khungulsunTalbainNiitUne&gt;</td>
      </tr>`;

      // 1. Electricity
      const elec = medeelel.zardluud.filter(z =>
        z.tailbar?.includes("Цахилгаан") || z.tailbar?.includes("цахилгаан")
      );
      if (elec.length > 0) {
        const rn = n++;
        elec.forEach((z, i) => {
          html += `<tr>
            ${i === 0 ? `<td rowspan="${elec.length}" style="text-align:center;">${rn}</td>` : ""}
            <td>${z.tailbar} ${z.talbainDugaar ? "№" + z.talbainDugaar : ""}</td>
            ${i === 0 ? `<td rowspan="${elec.length}" style="text-align:center;">${getCoverage(elec[0]?.ognoo)}</td>` : ""}
            <td style="text-align:center;">${z.umnukhZaalt !== null && z.umnukhZaalt !== undefined ? z.umnukhZaalt : ""}</td>
            <td style="text-align:center;">${z.suuliinZaalt !== null && z.suuliinZaalt !== undefined ? z.suuliinZaalt : ""}</td>
            <td style="text-align:right;">${z.tulukhDun ? formatNumber(z.tulukhDun) : ""}</td>
          </tr>`;
        });
      }

      // 2. Water
      const water = medeelel.zardluud.filter(z =>
        z.tailbar?.includes("Цэвэр ус") || z.tailbar?.includes("Бохир ус") ||
        z.tailbar?.includes("Халуун ус") || z.tailbar?.includes("Хүйтэн ус")
      );
      if (water.length > 0) {
        const rn = n++;
        water.forEach((z, i) => {
          html += `<tr>
            ${i === 0 ? `<td rowspan="${water.length}" style="text-align:center;">${rn}</td>` : ""}
            <td>${z.tailbar} ${z.talbainDugaar ? "№" + z.talbainDugaar : ""}</td>
            ${i === 0 ? `<td rowspan="${water.length}" style="text-align:center;">${getCoverage(water[0]?.ognoo)}</td>` : ""}
            <td style="text-align:center;">${z.umnukhZaalt !== null && z.umnukhZaalt !== undefined ? z.umnukhZaalt : ""}</td>
            <td style="text-align:center;">${z.suuliinZaalt !== null && z.suuliinZaalt !== undefined ? z.suuliinZaalt : ""}</td>
            <td style="text-align:right;">${z.tulukhDun ? formatNumber(z.tulukhDun) : ""}</td>
          </tr>`;
        });
      }

      // 3. Management
      const mgmt = medeelel.zardluud.filter(z => z.tailbar?.toLowerCase().includes("менежмент"));
      if (mgmt.length > 0) {
        html += `<tr class="cat">
          <td style="background-color:#a5bfdb;text-align:center;">Д/д</td><td style="background-color:#a5bfdb;text-align:center;">Нэхэмжлэлийн утга</td><td style="background-color:#a5bfdb;text-align:center;">Хамрах хугацаа</td>
          <td style="background-color:#a5bfdb;text-align:center;">Талбай м2</td><td style="background-color:#a5bfdb;text-align:center;">Үнэ ₮</td><td style="background-color:#a5bfdb;text-align:center;">Нийт үнэ ₮</td>
        </tr>`;
        const rn = n++;
        const area = parseFloat(medeelel.talbainKhemjee || "0");
        mgmt.forEach((z, i) => {
          let tariffVal = "";
          if (z.tariff) tariffVal = formatNumber(z.tariff);
          else if (z.negjUne) tariffVal = formatNumber(z.negjUne);
          else if (area > 0) tariffVal = formatNumber(z.tulukhDun / area);
          else tariffVal = "";

          html += `<tr>
            ${i === 0 ? `<td rowspan="${mgmt.length}" style="text-align:center;">${rn}</td>` : ""}
            <td>${z.tailbar} ${z.talbainDugaar ? "№" + z.talbainDugaar : ""}</td>
            ${i === 0 ? `<td rowspan="${mgmt.length}" style="text-align:center;">${getCoverage(mgmt[0]?.ognoo)}</td>` : ""}
            <td style="text-align:right;">&lt;talbainKhemjee&gt;</td>
            <td style="text-align:right;">${tariffVal}</td>
            <td style="text-align:right;">&lt;${z.tailbar}.tulukhDun&gt;</td>
          </tr>`;
        });
      }

      // 4. Heating
      const heat = medeelel.zardluud.filter(z => z.tailbar?.toLowerCase().includes("дулаан"));
      if (heat.length > 0) {
        html += `<tr class="cat">
          <td style="background-color:#a5bfdb;text-align:center;">Д/д</td><td style="background-color:#a5bfdb;text-align:center;">Нэхэмжлэлийн утга</td><td style="background-color:#a5bfdb;text-align:center;">Хамрах хугацаа</td>
          <td style="background-color:#a5bfdb;text-align:center;">Талбай м3</td><td style="background-color:#a5bfdb;text-align:center;">Үнэ ₮</td><td style="background-color:#a5bfdb;text-align:center;">Нийт үнэ ₮</td>
        </tr>`;
        const rn = n++;
        const areaH = parseFloat(medeelel.talbainKhemjeeMetrKube || medeelel.talbainKhemjee || "0");
        heat.forEach((z, i) => {
          let tariffVal = "";
          if (z.tariff) tariffVal = formatNumber(z.tariff);
          else if (z.negjUne) tariffVal = formatNumber(z.negjUne);
          else if (areaH > 0) tariffVal = formatNumber(z.tulukhDun / areaH);
          else tariffVal = "";

          html += `<tr>
            ${i === 0 ? `<td rowspan="${heat.length}" style="text-align:center;">${rn}</td>` : ""}
            <td>${z.tailbar}</td>
            ${i === 0 ? `<td rowspan="${heat.length}" style="text-align:center;">${getCoverage(heat[0]?.ognoo)}</td>` : ""}
            <td style="text-align:right;">&lt;talbainKhemjeeMetrKube&gt;</td>
            <td style="text-align:right;">${tariffVal}</td>
            <td style="text-align:right;">&lt;${z.tailbar}.tulukhDun&gt;</td>
          </tr>`;
        });
      }

      // 5. Other (Parking etc.)
      const other = medeelel.zardluud.filter(z => {
        const tb = z.tailbar ? z.tailbar.toLowerCase() : "";
        return !tb.includes("цахилгаан") &&
               !tb.includes("цэвэр ус") &&
               !tb.includes("бохир ус") &&
               !tb.includes("халуун ус") &&
               !tb.includes("хүйтэн ус") &&
               !tb.includes("менежмент") &&
               !tb.includes("дулаан");
      });
      other.forEach((z) => {
        const title = z.turul === 'khuvaari' ? "Түрээсийн төлбөр" : (z.tailbar || "");
        html += `<tr>
          <td style="text-align:center;">${n++}</td>
          <td>${title}</td>
          <td style="text-align:center;">${getCoverage(z.ognoo)}</td>
          <td></td><td></td>
          <td style="text-align:right;">${z.tulukhDun ? formatNumber(z.tulukhDun) : `&lt;${z.tailbar || 'other'}.tulukhDun&gt;`}</td>
        </tr>`;
      });

      return html;
    })()}

    <tr class="tot">
      <td colspan="4" style="border:none;"></td>
      <td style="text-align:left;background:#a5bfdb;font-size:16px;color:#000;font-weight:normal;white-space:nowrap;">Нийт төлөх дүн</td>
      <td style="text-align:right;background:#a5bfdb;font-size:16px;color:#000;font-weight:bold;">&lt;garaasBodsonNiitDun&gt;</td>
    </tr>
  </tbody>
</table>

<!-- Footer Section -->
<div style="margin-top:40px; width: calc(100% - 40px); margin-left: 20px; margin-right: 20px;">
  <div style="font-size:16px;color:#000;margin-bottom:15px;font-weight:normal;">Вертус Проперти Менежмент ХХК</div>

  <table class="footer-table" style="width: 100%;">
    <tr class="footer-row">
      <td style="width: 15%;">Менежер:</td>
      <td style="width: 50%; position: relative;">
        <!-- Container for offset stamp/signature pushed to the right of this cell -->
        <div style="position: absolute; left: 0; top: 0; width: 100%; height: 70px;">
          <div style="position: absolute; top: 50%; left: 75%; transform: translate(-50%, -50%); opacity: 0.8; z-index: 1;">
            <div style="width: 110px; height: 110px; overflow: visible;">
              ${medeelel.tamga || ""}
            </div>
          </div>
          <div style="position: absolute; top: 35%; left: 80%; transform: translate(-50%, 40%); z-index: 2;">
            ${medeelel.gariinUseg || ""}
          </div>
        </div>
      </td>
      <td style="width: 20%; padding-left: 0;">Д.Золзаяа</td>
      <td style="width: 15%; text-align: right;">95918454</td>
    </tr>
    <tr class="footer-row">
      <td>Нягтлан бодогч:</td>
      <td></td>
      <td style="padding-left: 0;">Б.Оюунбилэг</td>
      <td style="text-align: right;">88082530</td>
    </tr>
  </table>
</div>

<div style="text-align:center;margin-top:35px;font-size:16px;color:#000;font-weight:normal;">
  Хамтран ажилласанд баярлалаа!
</div>

</div>
  `;
};

export default khatuuZagvarVirtus;
