// pexelsにログインしてAPIを発行する
const apiKey = "";
const perPage = 16;
let currentPage = 1;
let searchTerm = null;

const resultsImages = document.querySelector(".results-images");
const moreBtn = document.querySelector(".more-btn");
const searchInput = document.querySelector(".search-form input");
const modal = document.querySelector(".modal");
const closeBtn = document.querySelector(".uil-times");
const dlBtn = document.querySelector(".uil-import");

const downloadImg = (imgURL) => {
  // console.log(imgURL);
  fetch(imgURL)
    .then((res) => {
      return res.blob();
    })
    .then((file) => {
      // console.log(file);
      const a = document.createElement("a");
      a.href = URL.createObjectURL(file);
      a.download = new Date().getTime();
      a.click();
    })
    .catch(() => alert("エラーです"));
};

const openModal = (name, img) => {
  modal.querySelector("img").src = img;
  modal.querySelector("span").innerText = name;
  modal.classList.add("show");
  // スクロール可否
  document.body.style.overflow = "hidden";
  // aタグじゃないのでdata-imgという属性を作って代用
  dlBtn.setAttribute("data-img", img);
};

const closeModal = () => {
  modal.classList.remove("show");
  // スクロール可否
  document.body.style.overflow = "auto";
};

const createResults = (images) => {
  // openModalはずっと実行される
  resultsImages.innerHTML += images
    .map((img) => {
      return `<li class="results-card" onclick="openModal('${img.photographer}', '${img.src.large2x}')">
          <img src="${img.src.large2x}" alt="" />
          <div class="results-details">
            <div class="artist">
              <i class="uil uil-camera"></i>
              <span>${img.photographer}</span>
            </div>
            <button onclick="downloadImg('${img.src.large2x}'); event.stopPropagation();">
              <i class="uil uil-import"></i>
            </button>
          </div>
        </li>`;
    })
    .join("");
};

const getImages = (apiURL) => {
  moreBtn.innerHTML = "読み込み中";
  moreBtn.classList.add("disabled");
  fetch(apiURL, {
    headers: { Authorization: apiKey },
  }).then((res) => {
    res
      .json()
      .then((data) => {
        // console.log(data);
        createResults(data.photos);
        moreBtn.innerHTML = "さらに読み込む";
        moreBtn.classList.remove("disabled");
      })
      .catch(() => alert("エラーです"));
  });
};

const loadMore = () => {
  currentPage += 1;
  let apiURL;
  // 検索ワードにLoadMoreボタンを関連づける
  if (searchTerm) {
    apiURL = `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`;
  } else {
    apiURL = `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`;
  }
  getImages(apiURL);
};

const searchImages = (e) => {
  if (e.target.value === "") {
    return (searchTerm = null);
  }
  if (e.key === "Enter") {
    // console.log("Enter");
    currentPage = 1;
    searchTerm = e.target.value;
    resultsImages.innerHTML = "";
    getImages(
      `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`
    );
  }
};

// URLはpexelsのAPIドキュメントからコピペする
getImages(
  `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`
);

moreBtn.addEventListener("click", loadMore);
searchInput.addEventListener("keyup", searchImages);
closeBtn.addEventListener("click", closeModal);
dlBtn.addEventListener("click", (e) => {
  return downloadImg(e.target.dataset.img);
});
