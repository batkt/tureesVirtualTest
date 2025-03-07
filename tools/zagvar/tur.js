const khatuuZagvar = (medeelel, ajiltan, baiguullaga, barilgiinId) => {
  return `
  <div style="height: 100%; width: 100%;">
    <div style="display: flex; justify-content: space-between;">
      <div style="display: block; align-items: flex-start;">
        <div style="display: block;">
          НХМаягт Т-1
        </div>
      </div>
      <div style="display: block; align-items: flex-end; flex-direction: column;">
        <div style="display: block;">
          Санхүү, эдийн засгийн сайд, Үндэсний
        </div>
        <div style="display: block;">
          статистикийн газрын даргын 2017 оны 347
        </div>
        <div style="display: block;">
          дугаар тушаалын хавсралт
        </div>
      </div>
    </div>
    <div style="display: block; width: 65%; text-align: center;">
      <b>НЭХЭМЖЛЭХ №</b>
    </div>
    <div style="display: flex; width: 100%; align-items: flex-start; justify-content: space-between; gap: 0.5rem;">
      <div style="display: block; width: 50%;">
        <p style="font-weight: 600;">Нэхэмжлэгч:</p>
        <div style="display: flex; align-items: flex-start; justify-content: space-between;">
          <p style="white-space: nowrap;">Байгууллагын нэр:</p>
          <p style="width: 100%; text-align: left; font-weight: 600;">
            ${barilgiinId === "6735c77a7fc60cd66deb290a" ? "Мастер Түншлэл ХХК" : baiguullaga.ner}
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
          ${barilgiinId === "6735c77a7fc60cd66deb290a" ? "90088007" : barilgiinId === "67512183c60497546f59513a" ? "90611148"  : baiguullaga?.utas?.join(",")}
          </p>
        </div>
        <div style="display: flex; align-items: flex-start; justify-content: space-between;">
          <p style="white-space: nowrap;">И-мэйл:</p>
          <p style="width: 100%; text-align: left; font-weight: 600;">
          ${barilgiinId === "67512183c60497546f59513a" ? "gotofinance@master.mn" : baiguullaga?.mail?.join(",")}
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
      </div>
      <div style="display: block; width: 50%;">
        <p style="font-weight: 600;">Төлөгч:</p>
        <div style="display: flex; align-items: flex-start; justify-content: space-between;">
          <p style="white-space: nowrap;">Иргэн:</p>
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
          <p style="white-space: nowrap;">Гэрээний №:</p>
          <p style="width: 100%; text-align: left; font-weight: 600;">
            &lt;gereeniiDugaar&gt;
          </p>
        </div>
        <div style="display: flex; align-items: flex-start; justify-content: space-between;">
          <p style="white-space: nowrap;">Нэхэмжилсэн огноо:</p>
          <p style="width: 100%; text-align: left; font-weight: 600;">
            &lt;ekhelkhSar&gt;/&lt;ekhlekhUdur&gt;/&lt;ekhlekhOn&gt;
          </p>
        </div>
        <div style="display: flex; align-items: flex-start; justify-content: space-between;">
          <p style="white-space: nowrap;">Төлбөр хийх хугацаа:</p>
          <p style="width: 100%; text-align: left; font-weight: 600;">
            &lt;duusakhSar&gt;/&lt;duusakhUdur&gt;/&lt;duusakhOn&gt;
          </p>
        </div>
      </div>
    </div>
    <table style="margin-top: 2rem; width: 100%;">
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
        <tr>
          <td style="border: 1px solid #000; text-align: center; font-weight: 600;">
            1
          </td>
          <td style="border: 1px solid #000; text-align: left;">
            Өмнөх төлбөрийн үлдэгдэл
          </td>
          <td style="border: 1px solid #000; text-align: left;"></td>
          <td style="border: 1px solid #000; text-align: left;"></td>
          <td style="border: 1px solid #000; text-align: right;">
            &lt;umnukhSariinUrTulburNuat&gt;
          </td>
          <td style="border: 1px solid #000; text-align: right;">
            &lt;umnukhSariinUrTulburNuatgui&gt;
          </td>
          <td style="border: 1px solid #000; text-align: left;"></td>
          <td style="border: 1px solid #000; text-align: right;">
            &lt;umnukhSariinUrTulbur&gt;
          </td>
        </tr>
        <tr>
          <td style="border: 1px solid #000; text-align: center;">2</td>
          <td style="border: 1px solid #000; text-align: left;">Барьцаа үлдэгдэл</td>
          <td style="border: 1px solid #000; text-align: left;"></td>
          <td style="border: 1px solid #000; text-align: left;"></td>
          <td style="border: 1px solid #000; text-align: right;">
            &lt;baritsaaUldegdelNuat&gt;
          </td>
          <td style="border: 1px solid #000; text-align: right;">
            &lt;baritsaaUldegdelNuatgui&gt;
          </td>
          <td style="border: 1px solid #000; text-align: right;"></td>
          <td style="border: 1px solid #000; text-align: right;">
            &lt;baritsaaUldegdel&gt;
          </td>
        </tr>
        <tr>
          <td style="border: 1px solid #000; text-align: center;">3</td>
          <td style="border: 1px solid #000; text-align: left;">Алданги</td>
          <td style="border: 1px solid #000; text-align: left;"></td>
          <td style="border: 1px solid #000; text-align: left;"></td>
          <td style="border: 1px solid #000; text-align: right;">
            &lt;aldangiinUldegdelNuat&gt;
          </td>
          <td style="border: 1px solid #000; text-align: right;">
            &lt;aldangiinUldegdelNuatgui&gt;
          </td>
          <td style="border: 1px solid #000; text-align: right;"></td>
          <td style="border: 1px solid #000; text-align: right;">
            &lt;aldangiinUldegdel&gt;
          </td>
        </tr>
        <tr>
          <td style="border: 1px solid #000; text-align: center;">4</td>
          <td style="border: 1px solid #000; text-align: left;">
            Түрээсийн төлбөр
          </td>
          <td style="border: 1px solid #000; text-align: center;"></td>
          <td style="border: 1px solid #000; text-align: center;"></td>
          <td style="border: 1px solid #000; text-align: right;">&lt;khungulsunTalbainNiitUneNuat&gt;</td>
          <td style="border: 1px solid #000; text-align: right;">&lt;khungulsunTalbainNiitUneNuatgui&gt;</td>
          <td style="border: 1px solid #000; text-align: right;">&lt;khungulult&gt;</td>
          <td style="border: 1px solid #000; text-align: right;">&lt;khungulsunTalbainNiitUne&gt;</td>
        </tr>
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
                  index + 5
                }</td>
                <td style="border: 1px solid #000; text-align: left;">
                  ${mur.tailbar}
                </td>
                <td style="border: 1px solid #000; text-align: left;">${
                  mur.umnukhZaalt === null ? "" : mur.umnukhZaalt
                }</td>
                <td style="border: 1px solid #000; text-align: left;">${
                  mur.suuliinZaalt === null ? "" : mur.suuliinZaalt
                }</td>
                <td style="border: 1px solid #000; text-align: right;">&lt;${
                  mur.tailbar
                }.khungulultKhassanTulukhDunNuat&gt;</td>
                <td style="border: 1px solid #000; text-align: right;">&lt;${
                  mur.tailbar
                }.khungulultKhassanTulukhDunNuatgui&gt;</td>
                <td style="border: 1px solid #000; text-align: right;">&lt;${
                  mur.tailbar
                }.khungulult&gt;</td>
                <td style="border: 1px solid #000; text-align: right;">&lt;${
                  mur.tailbar
                }.khungulultKhassanTulukhDun&gt;</td>
              </tr>
            `;
          })
          .join("")} 
      </tbody>
      <tfoot>
        <tr style="background-color: #d1d5db; font-weight: 600;">
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td style="text-align: right;">&lt;garaasBodsonNiitDun&gt;</td>
        </tr>
        <tr style="margin-top: 1rem;">
          <td></td>
          <td></td>
          <td colspan="6">
            <p>&lt;garaasBodsonNiitDunUsgeer&gt; болно</p>
          </td>
        </tr>
        <tr style="margin-top: 1rem;">
          <td></td>
          <td></td>
          <td><p>Хүлээн авсан</p></td>
          <td></td>
          <td><p>/${medeelel?.ovog?.[0] ? medeelel?.ovog?.[0] : ""}${medeelel?.ovog?.[0] ? "." : ""} ${medeelel?.ner}/</p></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr style="margin-top: 1rem;">
          <td></td>
          <td></td>
          <td><p>Нэхэмжлэл бичсэн</p></td>
          <td></td>
          <td><p>/${ajiltan?.ovog?.[0] ? ajiltan?.ovog?.[0] : ""}${ajiltan?.ovog?.[0] ? "." : ""} ${ajiltan?.ner}/</p></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr style="margin-top: 1rem;">
          <td></td>
          <td></td>
          <td></td>
          <td>&lt;tamga&gt;</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
      </tfoot>
    </table>
  </div>`;
};
export default khatuuZagvar;
