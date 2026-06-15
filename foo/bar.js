

function printButtonFunc() {

  const printButton = document.getElementById("my-button");
  const header1 = document.getElementById("header1");

  printButton.addEventListener("click",function() {
    console.log("Hello World!");
    let newText = "Moi maailma";
    header1.innerText = newText;
  });

}

function addTextFunc() {

  const addButton = document.getElementById("add-data");
  const myList = document.getElementById("my-list");
  let itemCounter = 0;

  addButton.addEventListener("click", function () {
    let newItem = document.createElement("li");
    newItem.innerText = ++itemCounter + " - " + document.getElementById("message").value;
    myList.appendChild(newItem);
  });

}

document.addEventListener("DOMContentLoaded", printButtonFunc);
document.addEventListener("DOMContentLoaded", addTextFunc);