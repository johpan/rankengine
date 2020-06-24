// var sheetHash = "1lTk2wI8ofJrMZ9Hm1iUCN6sNCGk3TEKowoaPYEnkRPk"      
var params = new URLSearchParams(window.location.search);

var sheetHash = params.get("h") || null;
var sheetNumber = params.get("s") || 1;
var sheetUrl = "https://spreadsheets.google.com/feeds/cells/";
var sheetUrlSuffix = "/public/full?alt=json";

document.getElementsByName("h")[0].value = sheetHash;
document.getElementsByName("s")[0].value = sheetNumber;

if (sheetHash !== null) {
  fetch(sheetUrl + sheetHash + "/" + sheetNumber + sheetUrlSuffix)
    .then(resp => resp.json())
    .then(data => {
      const sheet = data.feed;
      const css = sheet.entry.findIndex(e => e.content.$t.toLowerCase() == 'css') > -1 
        ? sheet.entry[sheet.entry.findIndex(e => e.content.$t.toLowerCase() == 'css') + 1].content.$t
        : '';
      const columns = sheet.entry.findIndex(e => e.content.$t.toLowerCase() == 'columns') > -1
        ? sheet.entry[sheet.entry.findIndex(e => e.content.$t.toLowerCase() == 'columns') + 1].content.$t
        : 'four';
      const cardsize = sheet.entry.findIndex(e => e.content.$t.toLowerCase() == 'card size') > -1
        ? sheet.entry[sheet.entry.findIndex(e => e.content.$t.toLowerCase() == 'card size') + 1].content.$t
        : 'Medium';
      
      rankCell = sheet.entry.findIndex(e => e.content.$t.toLowerCase() == 'image') + 1;
      let rankMap = [], skip;
      sheet.entry.forEach((cell, index, entries) => {
        if (index >= rankCell && index < entries.length - 1 && index !== skip) {
          rankMap.push([cell.content.$t, entries[index + 1].content.$t]);
          skip = index + 1;
        }
      });
      
      let output = "";
      rankMap.forEach((rank, index) => {
        output += `
          <article class="card">
            <section class="inner" style="background-image:url(` + rank[1] + `);">
              <footer>
                <span>` + (index + 1) + `. ` + rank[0] + `</span>
              </footer>
            </section>
          </article>
        `;
      });
      
      var title = sheet.title.$t;
      
      document.getElementById("rankTitle").innerHTML = title;
      document.title = title + " - " + document.title;
      document.getElementById("importedStyle").innerHTML = css;
      document.getElementById("ranking").classList.add(columns);
      document.getElementById("ranking").innerHTML = output;
      document.querySelectorAll("section.inner").forEach(e => e.classList.add("cardSize" + cardsize));
    })
    .catch(error => alert(error + "\nAre you sure you've published your sheet?"));
}