const table = document.getElementById("my_table");
let targetCell;

function addRow({ numColumns, descriptionList }) {
  const table = document.getElementById("my_table");
  if (descriptionList) {
    numColumns = descriptionList.length;
  } else if (!numColumns) {
    numColumns = table.rows[0].cells.length;
  }

  function getRandomArbitrary(min, max) {
    return parseInt(Math.random() * (max - min) + min);
  }

  const row = table.insertRow(-1);
  for (let i = 0; i < numColumns; i++) {
    const cell = row.insertCell(i);
    if (descriptionList) {
      editCell(
        cell,
        "https://picsum.photos/" + getRandomArbitrary(250, 300) + "/" +
          getRandomArbitrary(400, 450),
        descriptionList[i],
      );
    } else {
      editCell(
        cell,
        "https://picsum.photos/" + getRandomArbitrary(250, 300) + "/" +
          getRandomArbitrary(400, 450),
        "點擊輸入",
      );
    }
  }
}

function editCell(cell, imgURL, description) {
  cell.innerHTML =
    `<div class="cell-wrapper"><img src="${imgURL}" alt="${imgURL}" ><div>${description}</div></div>`;
}

// edit cell dialog ================================================
const cancel = document.getElementById("cancel");
const imgFileInput = document.getElementById("img_file_input");
const imgPreview = document.getElementById("img_preview");
const descriptionInput = document.getElementById("description");
const editForm = document.getElementById("edit_form");
const imgContainer = document.getElementById("img_container");
const searchResult = document.getElementById("search_result");
const searchInput = document.getElementById("search_work_input");
const editDialog = document.getElementById("edit_dialog");

editForm.addEventListener("submit", function (e) {
  e.preventDefault();
  editCell(targetCell, imgPreview.src, descriptionInput.value);
  imgPreview.src = "";
  editDialog.style.display = "none";
  editForm.reset();
  searchResult.innerHTML = "";
});

cancel.addEventListener("click", function () {
  editDialog.style.display = "none";
});

function updateImgPreview(file) {
  const reader = new FileReader();
  reader.addEventListener("load", function () {
    imgPreview.src = reader.result;
  });
  reader.readAsDataURL(file);
}

imgFileInput.addEventListener("change", function () {
  const file = imgFileInput.files[0];
  updateImgPreview(file);
});

// paste image
editForm.addEventListener("paste", function (e) {
  const data = (e.clipboardData || window.clipboardData);
  const item = [...data.items].find((i) => i.type.includes("image"));

  if (item?.kind === "file") {
    updateImgPreview(item.getAsFile());
  }
});
// end =============================================================

// open edit editDialog
table.addEventListener("click", function (e) {
  editDialog.style.display = "block";
  targetCell = e.target.closest("td");
  descriptionInput.value = targetCell.querySelector("div").innerText;
  searchInput.focus();
});

const addRowForm = document.getElementById("add_row_form");
const columnsInput = document.getElementById("columns_input");
const resetButton = document.getElementById("reset_button");

resetButton.addEventListener("click", function () {
  columnsInput.disabled = false;
  table.innerHTML = "";
});

addRowForm.addEventListener("submit", function (e) {
  e.preventDefault();
  columnsInput.disabled = true;
  addRow({ numColumns: columnsInput.value });
  addRowForm.reset();
});

const saveButton = document.getElementById("save_button");
saveButton.addEventListener("click", async function () {
  const container = document.getElementById("table_container");
  saveButton.innerText = "載入中...";
  try {
    const dataURL = await htmlToImage.toJpeg(container, { quality: 0.96 });
    const link = document.createElement("a");
    link.download = "output.png";
    link.href = dataURL;
    link.click();
    // const img = new Image();
    // img.src = dataURL;
    // document.querySelector("main").appendChild(img);
    saveButton.innerText = "儲存";
  } catch (err) {
    saveButton.innerText = "儲存";
    console.error("oops, something went wrong!", err);
  }
});

// template 2d array
function initTableFromTemplate(template) {
  for (const descriptionList of template) {
    addRow({ descriptionList });
  }
}

searchInput.addEventListener("keydown", async function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    const keyword = searchInput.value;
    // example url: https://zh.wikipedia.org/w/api.php?action=query&lllimit=500&prop=langlinks&titles=%E9%80%B2%E6%93%8A%E7%9A%84%E5%B7%A8%E4%BA%BA&format=json
    const title = await searchJapaneseTitle(keyword);
    searchImage(title);
  }
});
let a;

async function searchJapaneseTitle(keyword) {
  if (keyword === "") return;
  keyword = encodeURIComponent(keyword);
  const url =
    `https://zh.wikipedia.org/w/api.php?action=query&lllimit=500&prop=langlinks&titles=${keyword}&format=json&origin=*`;
  try {
    const response = await fetch(url);
    a = response;
    const json = await response.json();
    if (Object.values(json.query.pages).length === 0) return;
    // get first object
    const langlinks = Object.values(json.query.pages)[0].langlinks;
    if (langlinks) {
      for (const item of langlinks) {
        if (item.lang === "ja") {
          let title = item["*"];
          title = title.replace(" (漫画)", "");
          return title;
        }
      }
    }
  } catch (err) {
    console.log(err);
  }
  searchResult.innerHTML =
    `<a href="https://www.google.com/search?tbm=isch&q=${keyword.trim()}" target="_blank">在Google圖片搜尋</a>` +
    "<div>右鍵複製圖片後在此貼上</div>";
}

async function searchImage(title) {
  title = encodeURIComponent(title);
  const url =
    `https://api.annict.com/v1/works?access_token=${import.meta.env.VITE_ANNICT_API_TOKEN}` +
    `&fields=images,title,twitter_username&filter_title=${title}`;
  try {
    const response = await fetch(url);
    a = response;
    const json = await response.json();
    imgContainer.innerHTML = "";
    for (const work of json.works) {
      // looks like unavatar currently not work for twitter :(
      // if (work.twitter_username) {
      //   const avatarURL = `https://unavatar.io/twitter/${work.twitter_username}`
      //   const imgContainer = document.getElementById('img_container')
      //   const img = document.createElement('img')
      //   img.src = avatarURL
      //   imgContainer.appendChild(img)
      // }

      if (work.images.recommended_url !== "") {
        const img = document.createElement("img");
        img.src = work.images.recommended_url;
        img.addEventListener("click", function () {
          imgPreview.src = img.src;
          imgContainer.innerHTML = "";
        });
        imgContainer.appendChild(img);
      }
    }
    searchResult.innerHTML = "<div>找不到結果嗎？試著</div>" +
      `<a href="https://www.google.com/search?tbm=isch&q=${title.trim()}" target="_blank">在Google圖片搜尋</a>` +
      " or " +
      `<a href="https://annict.com/search?q=${title.trim()}" target="_blank">在Annict上搜尋</a>` +
      "<div>右鍵複製圖片後在此貼上</div>";
  } catch (err) {
    console.log(err);
  }
}

const initialTemplate = [
  ["入坑作", "最喜歡", "看最多次", "最想安利", "最佳劇情"],
  ["最佳畫面", "最佳配樂", "最佳配音", "最治癒", "最感動"],
  ["最虐心", "最被低估", "最過譽", "最離譜", "最討厭"],
];

initTableFromTemplate(initialTemplate);
