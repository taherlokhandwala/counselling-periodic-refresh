window.addEventListener("DOMContentLoaded", () => {
  //DOM elements
  const branchSelect = document.getElementById("branch-select");
  const CSE = document.getElementById("CSE");
  const ECE = document.getElementById("ECE");
  const ME = document.getElementById("ME");
  const BT = document.getElementById("BT");
  const error = document.getElementById("error");
  const submit = document.getElementById("submit-btn");
  const xhr = new XMLHttpRequest();
  let interval = null;
  let intervalTime = 5000;
  xhr.timeout = 5000;
  xhr.ontimeout = backoff;

  //Select drop down initialisation
  M.FormSelect.init(branchSelect);

  //To display seats
  const showSeats = () => {
    if (xhr.readyState === 4 && xhr.status === 200) {
      const seats = JSON.parse(xhr.responseText);
      CSE.innerText = seats.CSE;
      ECE.innerText = seats.ECE;
      ME.innerText = seats.ME;
      BT.innerText = seats.BT;
    }
  };

  //To fetch seats
  const getSeats = () => {
    xhr.open("GET", "/getseats.php");
    xhr.onreadystatechange = showSeats;
    xhr.send();
  };

  //To show error if seat not available
  const showSeatError = (branch) => {
    error.style.display = "block";
    error.children[0].innerHTML = `No seats for ${branch} branch`;
    setTimeout(() => {
      error.style.display = "none";
      error.children[0].innerHTML = "Please select a branch";
    }, 4000);
  };

  //Update seats on server
  submit.addEventListener("click", () => {
    if (!branchSelect.value) {
      error.style.display = "block";
      setTimeout(() => {
        error.style.display = "none";
      }, 4000);
    } else {
      xhr.open("GET", `/update.php?branch=${branchSelect.value}`);
      xhr.onreadystatechange = null;
      switch (branchSelect.value) {
        case "CSE":
          if (parseInt(CSE.innerText) >= 1) {
            CSE.innerText = parseInt(CSE.innerText) - 1;
            xhr.send();
          } else {
            showSeatError("CSE");
          }
          break;
        case "ECE":
          if (parseInt(ECE.innerText) >= 1) {
            ECE.innerText = parseInt(ECE.innerText) - 1;
            xhr.send();
          } else {
            showSeatError("ECE");
          }
          break;
        case "ME":
          if (parseInt(ME.innerText) >= 1) {
            ME.innerText = parseInt(ME.innerText) - 1;
            xhr.send();
          } else {
            showSeatError("ME");
          }
          break;
        case "BT":
          if (parseInt(BT.innerText) >= 1) {
            BT.innerText = parseInt(BT.innerText) - 1;
            xhr.send();
          } else {
            showSeatError("BT");
          }
          break;
        default:
          return;
      }
    }
  });

  //Exponential backoff fallback pattern
  function backoff() {
    clearInterval(interval);
    interval = setInterval(getSeats, intervalTime * 2);
    intervalTime *= 2;
  }

  getSeats();
  interval = setInterval(getSeats, 5000);
});
