
function submitData() {

  const submitButton = document.getElementById("submit-data");
  const userNameInput = document.getElementById("input-username");
  const userEmailInput = document.getElementById("input-email");
  const adminSelector = document.getElementById("input-admin");
  const tableBody = document.querySelector("tbody");

  submitButton.addEventListener("click", function() {

    let newRow = document.createElement("tr");
    let userName = document.createElement("td");
    let userEmail = document.createElement("td");
    let isAdmin = document.createElement("td");
    
    userName.innerText = userNameInput.value;
    userEmail.innerText = userEmailInput.value;
    if (adminSelector.checked) {
      isAdmin.innerText = "X";
    } else {
      isAdmin.innerText = "-";
    }

    newRow.appendChild(userName);
    newRow.appendChild(userEmail);
    newRow.appendChild(isAdmin);
    tableBody.appendChild(newRow);

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
