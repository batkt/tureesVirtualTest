const khatuuZagvar = (medeelel, ajiltan, baiguullaga, barilgiinId) => {
  return `
  <div style="height: 100%; width: 100%; font-family: Arial, sans-serif;">
    <div style="display: flex; justify-content: space-between;">
      <div style="display: block; align-items: flex-start;">
        <div style="display: block; font-size: 14px; font-weight: bold;">
          НХМаягт Т-1
        </div>
      </div>
      
      <div style="display: block; align-items: flex-end; flex-direction: column;">
        <div style="display: block; font-size: 12px;">
          Санхүү, эдийн засгийн сайд, Үндэсний
        </div>
        <div style="display: block; font-size: 12px;">
          статистикийн газрын даргын 2017 оны 347
        </div>
        <div style="display: block; font-size: 12px;">
          дугаар тушаалын хавсралт
        </div>
      </div>
    </div>
    <div style="display: block; width: 65%; text-align: center; margin-top: 20px;">
      <b style="font-size: 16px;">НЭХЭМЖЛЭХ №</b>
    </div>

    <div style="  display: flex; width: 100%; align-items: flex-start; justify-content: space-between; gap: 0.5rem; ">
      <div style="padding: 1rem; background-color: #fff; flex: 1; text-align: center;">
        <p style="font-size: 14px; font-weight: bold; margin-bottom: 10px;">Нэхэмжлэгч:</p>
        <div style="margin-bottom: 8px; display: flex; justify-content: space-between;">
          <span style="color: #4b5563; font-size: 12px;">Байгууллагын нэр:</span>
          <span style="font-weight: bold; font-size: 12px;">${
            barilgiinId === "6735c77a7fc60cd66deb290a"
              ? "Мастер Түншлэл ХХК"
              : baiguullaga.ner
          }</span>
        </div>
        <div style="margin-bottom: 8px; display: flex; justify-content: space-between;">
          <span style="color: #4b5563; font-size: 12px;">Хаяг:</span>
          <span style="font-weight: bold; font-size: 12px;">${
            baiguullaga?.khayag || ""
          }</span>
        </div>
        <div style="margin-bottom: 8px; display: flex; justify-content: space-between;">
          <span style="color: #4b5563; font-size: 12px;">Утас, Факс:</span>
          <span style="font-weight: bold; font-size: 12px;">${
            barilgiinId === "6735c77a7fc60cd66deb290a"
              ? "90088007"
              : barilgiinId === "67512183c60497546f59513a"
              ? "90611148"
              : baiguullaga?.utas?.join(",")
          }</span>
        </div>
        <div style="margin-bottom: 8px; display: flex; justify-content: space-between;">
          <span style="color: #4b5563; font-size: 12px;">И-мэйл:</span>
          <span style="font-weight: bold; font-size: 12px;">${
            barilgiinId === "67512183c60497546f59513a"
              ? "gotofinance@master.mn"
              : baiguullaga?.mail?.join(",")
          }</span>
        </div>
        <div style="margin-bottom: 8px; display: flex; justify-content: space-between;">
          <span style="color: #4b5563; font-size: 12px;">Банкны нэр:</span>
          <span style="font-weight: bold; font-size: 12px;">&lt;bank&gt;</span>
        </div>
        <div style="margin-bottom: 8px; display: flex; justify-content: space-between;">
          <span style="color: #4b5563; font-size: 12px;">Банкны дансны дугаар:</span>
          <span style="font-weight: bold; font-size: 12px;">&lt;dans&gt;</span>
        </div>
        <div style="margin-bottom: 8px; display: flex; justify-content: space-between;">
          <span style="color: #4b5563; font-size: 12px;">IBAN дугаар:</span>
          <span style="font-weight: bold; font-size: 12px;">&lt;ibanDugaar&gt;</span>
        </div>
      </div>
      <div style="padding: 1rem; background-color: #fff; flex: 1; text-align: center;">
        <p style="font-size: 14px; font-weight: bold; margin-bottom: 10px;">Төлөгч:</p>
        <div style="margin-bottom: 8px; display: flex; justify-content: space-between;">
          <span style="color: #4b5563; font-size: 12px;">Иргэн:</span>
          <span style="font-weight: bold; font-size: 12px;">&lt;ner&gt;</span>
        </div>
        <div style="margin-bottom: 8px; display: flex; justify-content: space-between;">
          <span style="color: #4b5563; font-size: 12px;">Хаяг:</span>
          <span style="font-weight: bold; font-size: 12px;">${
            medeelel?.khayag || ""
          }</span>
        </div>
        <div style="margin-bottom: 8px; display: flex; justify-content: space-between;">
          <span style="color: #4b5563; font-size: 12px;">Гэрээний №:</span>
          <span style="font-weight: bold; font-size: 12px;">&lt;gereeniiDugaar&gt;</span>
        </div>
        <div style="margin-bottom: 8px; display: flex; justify-content: space-between;">
          <span style="color: #4b5563; font-size: 12px;">Нэхэмжилсэн огноо:</span>
          <span style="font-weight: bold; font-size: 12px;">&lt;ekhelkhSar&gt;/&lt;ekhlekhUdur&gt;/&lt;ekhlekhOn&gt;</span>
        </div>
        <div style="margin-bottom: 8px; display: flex; justify-content: space-between;">
          <span style="color: #4b5563; font-size: 12px;">Төлбөр хийх хугацаа:</span>
          <span style="font-weight: bold; font-size: 12px;">&lt;duusakhSar&gt;/&lt;duusakhUdur&gt;/&lt;duusakhOn&gt;</span>
        </div>
      </div>
    </div>
    <table style="width: 100%; margin-top: 20px;">
      <thead style="background-color: #d1d5db; font-weight: bold;">
        <tr>
          <td style="border: 1px solid #000; text-align: center; padding: 10px; font-size: 12px;">№</td>
          <td style="border: 1px solid #000; text-align: center; padding: 10px; font-size: 12px;">Материал</td>
          <td style="border: 1px solid #000; text-align: center; padding: 10px; font-size: 12px;">Өмнөх заалт</td>
          <td style="border: 1px solid #000; text-align: center; padding: 10px; font-size: 12px;">Сүүлийн заалт</td>
          <td style="border: 1px solid #000; text-align: center; padding: 10px; font-size: 12px;">НӨАТ</td>
          <td style="border: 1px solid #000; text-align: center; padding: 10px; font-size: 12px;">НӨАТ-гүй дүн</td>
          <td style="border: 1px solid #000; text-align: center; padding: 10px; font-size: 12px;">Хөнгөлөлт</td>
          <td style="border: 1px solid #000; text-align: center; padding: 10px; font-size: 12px;">Нийт дүн</td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="border: 1px solid #000; text-align: center; font-weight: bold; font-size: 12px;">1</td>
          <td style="border: 1px solid #000; text-align: left; font-size: 12px;">Өмнөх төлбөрийн үлдэгдэл</td>
          <td style="border: 1px solid #000; text-align: left; font-size: 12px;"></td>
          <td style="border: 1px solid #000; text-align: left; font-size: 12px;"></td>
          <td style="border: 1px solid #000; text-align: right; font-size: 12px;">&lt;umnukhSariinUrTulburNuat&gt;</td>
          <td style="border: 1px solid #000; text-align: right; font-size: 12px;">&lt;umnukhSariinUrTulburNuatgui&gt;</td>
          <td style="border: 1px solid #000; text-align: left; font-size: 12px;"></td>
          <td style="border: 1px solid #000; text-align: right; font-size: 12px;">&lt;umnukhSariinUrTulbur&gt;</td>
        </tr>
        <tr>
          <td style="border: 1px solid #000; text-align: center; font-size: 12px;">2</td>
          <td style="border: 1px solid #000; text-align: left; font-size: 12px;">Барьцаа үлдэгдэл</td>
          <td style="border: 1px solid #000; text-align: left; font-size: 12px;"></td>
          <td style="border: 1px solid #000; text-align: left; font-size: 12px;"></td>
          <td style="border: 1px solid #000; text-align: right; font-size: 12px;">&lt;baritsaaUldegdelNuat&gt;</td>
          <td style="border: 1px solid #000; text-align: right; font-size: 12px;">&lt;baritsaaUldegdelNuatgui&gt;</td>
          <td style="border: 1px solid #000; text-align: right; font-size: 12px;"></td>
          <td style="border: 1px solid #000; text-align: right; font-size: 12px;">&lt;baritsaaUldegdel&gt;</td>
        </tr>
        <tr>
          <td style="border: 1px solid #000; text-align: center; font-size: 12px;">3</td>
          <td style="border: 1px solid #000; text-align: left; font-size: 12px;">Алданги</td>
          <td style="border: 1px solid #000; text-align: left; font-size: 12px;"></td>
          <td style="border: 1px solid #000; text-align: left; font-size: 12px;"></td>
          <td style="border: 1px solid #000; text-align: right; font-size: 12px;">&lt;aldangiinUldegdelNuat&gt;</td>
          <td style="border: 1px solid #000; text-align: right; font-size: 12px;">&lt;aldangiinUldegdelNuatgui&gt;</td>
          <td style="border: 1px solid #000; text-align: right; font-size: 12px;"></td>
          <td style="border: 1px solid #000; text-align: right; font-size: 12px;">&lt;aldangiinUldegdel&gt;</td>
        </tr>
        <tr>
          <td style="border: 1px solid #000; text-align: center; font-size: 12px;">4</td>
          <td style="border: 1px solid #000; text-align: left; font-size: 12px;">Түрээсийн төлбөр</td>
          <td style="border: 1px solid #000; text-align: center; font-size: 12px;"></td>
          <td style="border: 1px solid #000; text-align: center; font-size: 12px;"></td>
          <td style="border: 1px solid #000; text-align: right; font-size: 12px;">&lt;khungulsunTalbainNiitUneNuat&gt;</td>
          <td style="border: 1px solid #000; text-align: right; font-size: 12px;">&lt;khungulsunTalbainNiitUneNuatgui&gt;</td>
          <td style="border: 1px solid #000; text-align: right; font-size: 12px;">&lt;khungulult&gt;</td>
          <td style="border: 1px solid #000; text-align: right; font-size: 12px;">&lt;khungulsunTalbainNiitUne&gt;</td>
        </tr>
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
                <td style="border: 1px solid #000; text-align: center; font-size: 12px;">${
                  index + 5
                }</td>
                <td style="border: 1px solid #000; text-align: left; font-size: 12px;">${
                  mur.tailbar
                }</td>
                <td style="border: 1px solid #000; text-align: left; font-size: 12px;">${
                  mur.umnukhZaalt === null ? "" : mur.umnukhZaalt
                }</td>
                <td style="border: 1px solid #000; text-align: left; font-size: 12px;">${
                  mur.suuliinZaalt === null ? "" : mur.suuliinZaalt
                }</td>
                <td style="border: 1px solid #000; text-align: right; font-size: 12px;">${
                  mur.nuatBodokh === 1
                    ? `&lt;${mur.tailbar}.khungulultKhassanTulukhDunNuat&gt;`
                    : ""
                }</td>
                <td style="border: 1px solid #000; text-align: right; font-size: 12px;">${
                  mur.nuatBodokh === 1
                    ? `&lt;${mur.tailbar}.khungulultKhassanTulukhDunNuatgui&gt;`
                    : ""
                }</td>
                <td style="border: 1px solid #000; text-align: right; font-size: 12px;">&lt;${
                  mur.tailbar
                }.khungulult&gt;</td>
                <td style="border: 1px solid #000; text-align: right; font-size: 12px;">&lt;${
                  mur.tailbar
                }.khungulultKhassanTulukhDun&gt;</td>
              </tr>
            `;
          })
          .join("")} 
      </tbody>
      <tfoot style="border: none;">
        <tr style="background-color: #d1d5db; font-weight: bold; border: none;">
          <td style="border: none;"></td>
          <td style="border: none;"></td>
          <td style="border: none;"></td>
          <td style="border: none;"></td>
          <td style="border: none;"></td>
          <td style="border: none;"></td>
          <td style="border: none;"></td>
          <td style="text-align: right; font-size: 12px; border: none;">&lt;garaasBodsonNiitDun&gt;</td>
        </tr>
        <tr>
          <td style="border: none;"></td>
          <td style="border: none;"></td>
          <td colspan="6" style="border: none;">
            <p style="font-size: 12px;">&lt;garaasBodsonNiitDunUsgeer&gt; болно</p>
          </td>
        </tr>
        <tr>
          <td style="border: none;"></td>
          <td style="border: none;"></td>
          <td style="border: none;"><p style="font-size: 12px;">Хүлээн авсан</p></td>
          <td style="border: none;"></td>
          <td style="border: none;"><p style="font-size: 12px;">/${
            medeelel?.ovog?.[0] ? medeelel?.ovog?.[0] : ""
          }${medeelel?.ovog?.[0] ? "." : ""} ${medeelel?.ner}/</p></td>
          <td style="border: none;"></td>
          <td style="border: none;"></td>
          <td style="border: none;"></td>
        </tr>
        <tr>
          <td style="border: none;"></td>
          <td style="border: none;"></td>
          <td style="border: none;"><p style="font-size: 12px;">Нэхэмжлэл бичсэн</p></td>
          <td style="border: none;"></td>
          <td style="border: none;"><p style="font-size: 12px;">/${
            ajiltan?.ovog?.[0] ? ajiltan?.ovog?.[0] : ""
          }${ajiltan?.ovog?.[0] ? "." : ""} ${ajiltan?.ner}/</p></td>
          <td style="border: none;"></td>
          <td style="border: none;"></td>
          <td style="border: none;"></td>
        </tr>
        <tr style="margin-top: 2rem; ">
          <td style=" border: none;"></td>
          <td style="border: none;"></td>
          <td style="border: none;"></td>
          <td style="border: none; position: relative; >&lt;tamga&gt;</td>
          <td style="border: none;"></td>
          <td style="border: none;"></td>
          <td style="border: none;"></td>
          <td style="border: none;"></td>
        </tr>
      </tfoot>
    </table>
  </div>`;
};
export default khatuuZagvar;
