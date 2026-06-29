const inputShow = document.getElementById("input-show");
const searchForm = document.getElementById("search-form");
const showContainer = document.querySelector(".show-container");


async function fetchData () {

  let tvShowDataURL = "https://api.tvmaze.com/search/shows?q=";
  let query = inputShow.value;
  tvShowDataURL = tvShowDataURL + query;
  const tvShowPromise = await fetch(tvShowDataURL);
  const tvShowJSON = await tvShowPromise.json();
  return tvShowJSON;

}

searchForm.addEventListener('submit', async(event) => {

  event.preventDefault();
  showContainer.innerHTML = "";

  const showsArray = await fetchData();
  showsArray.forEach(element => {
    const showDataDiv =  document.createElement("div");
    showDataDiv.classList.add("show-data");
    const showImg = document.createElement("img");
    showImg.src = element.show.image.medium;
    const showInfoDiv = document.createElement("div");
    showInfoDiv.classList.add("show-info");
    const title = document.createElement("h1");
    title.textContent = element.show.name;
    const summaryContainer = document.createElement("div");
    summaryContainer.innerHTML = element.show.summary;
    showInfoDiv.appendChild(title);
    showInfoDiv.appendChild(summaryContainer);
    showDataDiv.appendChild(showImg);
    showDataDiv.appendChild(showInfoDiv);
    showContainer.appendChild(showDataDiv);
  });
});