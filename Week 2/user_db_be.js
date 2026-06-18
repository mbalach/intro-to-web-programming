
function submitData() {

  const submitButton = document.getElementById("submit-data");
  const userNameInput = document.getElementById("input-username");
  const userEmailInput = document.getElementById("input-email");
  const adminSelector = document.getElementById("input-admin");
  const imageInput = document.getElementById("input-image")
  const tableBody = document.querySelector("tbody");

  submitButton.addEventListener("click", function() {

    const rows = tableBody.querySelectorAll("tr");
    const rowsArray = Array.from(rows);
    const file = imageInput.files[0];

    let adminSelectorChar = "";
    let imageSrc = "";

    if (file) {
      imageSrc = URL.createObjectURL(file);
    }

    let userImageCell = document.createElement("td");
    let imageElement = document.createElement("img");

    imageElement.src = imageSrc;
    imageElement.width = 64;
    imageElement.height = 64;
    userImageCell.appendChild(imageElement);

    if (adminSelector.checked) {
        adminSelectorChar = "X";
    } else {
        adminSelectorChar = "-";
    }

    let existingRow = rowsArray.find(row => {
      return row.cells[0].innerText == userNameInput.value;
    });

    if (existingRow) {
      existingRow.cells[1].innerText = userEmailInput.value;
      existingRow.cells[2].innerText = adminSelectorChar;
      existingRow.cells[3].innerHTML = "";
      existingRow.cells[3].appendChild(imageElement);
    } else {
      let newRow = document.createElement("tr");
      let userName = document.createElement("td");
      let userEmail = document.createElement("td");
      let isAdmin = document.createElement("td");
      userName.innerText = userNameInput.value;
      userEmail.innerText = userEmailInput.value;
      isAdmin.innerText = adminSelectorChar;
      newRow.appendChild(userName);
      newRow.appendChild(userEmail);
      newRow.appendChild(isAdmin);
      newRow.appendChild(userImageCell);
      tableBody.appendChild(newRow);
    }

  })

}

function emptyTable() {

  const emptyTableButton = document.getElementById("empty-table");
  const tableBody = document.querySelector("tbody");

  emptyTableButton.addEventListener("click", function() {
    
    tableBody.innerHTML = "";

    //Loops through each row and checks if there is anything, if there is then removes it.
    
    //while (tableBody.firstChild) {
      //tableBody.removeChild(tableBody.firstChild);
    //}

  })

}

document.addEventListener("DOMContentLoaded", submitData);
document.addEventListener("DOMContentLoaded", emptyTable);
