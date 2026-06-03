const btnAdd = document.querySelector(".add__btn");
const today = new Date().toISOString().split("T")[0];

function showToast(type = "error", message) {
  const toast = document.getElementById("toast");
  const toastMessage = toast.querySelector(".toast__message");

  toast.className = `toast toast--${type}`;
  toastMessage.textContent = message;

  toast.classList.add("toast--visible");

  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.classList.remove("toast--visible");
  }, 3000);
}

function showConfirmModal(onConfirm) {
  const overlay = document.getElementById("modal-overlay");
  const btnConfirm = document.getElementById("modal-confirm");
  const btnCancel = document.getElementById("modal-cancel");

  overlay.classList.add("modal--visible");

  function cleanup() {
    overlay.classList.remove("modal--visible");
    btnConfirm.removeEventListener("click", handleConfirm);
    btnCancel.removeEventListener("click", handleCancel);
  }

  function handleConfirm() {
    cleanup();
    onConfirm();
  }

  function handleCancel() {
    cleanup();
  }

  btnConfirm.addEventListener("click", handleConfirm);
  btnCancel.addEventListener("click", handleCancel);

  overlay.addEventListener(
    "click",
    (e) => {
      if (e.target === overlay) cleanup();
    },
    { once: true },
  );
}

btnAdd.addEventListener("click", () => {
  const taskInput = document.getElementById("task__input").value.trim();
  const dateInput = document.getElementById("date__input").value;

  if (taskInput === "" || dateInput === "") {
    showToast("error");
  } else if (dateInput < today) {
    showToast("warning");
  } else {
    addTask(taskInput, dateInput);
    clearInputs();
  }
});

function formatDate(dateStr) {
  const [year, month, day] = dateStr.split("-");
  const months = [
    "jan",
    "fev",
    "mar",
    "abr",
    "mai",
    "jun",
    "jul",
    "ago",
    "set",
    "out",
    "nov",
    "dez",
  ];
  return `${day} ${months[parseInt(month) - 1]}. ${year}`;
}

function addTask(task, date) {
  const container = document.querySelector(".task__container");

  const taskText = document.createElement("p");
  taskText.classList.add("task__text");
  taskText.textContent = task;

  const taskDate = document.createElement("div");
  taskDate.classList.add("task-date");
  taskDate.innerHTML = `<span class="task-date__label">${formatDate(date)}</span>`;

  const btnRemove = document.createElement("button");
  btnRemove.classList.add("btn", "btn--remove");
  btnRemove.innerHTML = "✕";
  btnRemove.title = "Remover task";

  const taskContent = document.createElement("div");
  taskContent.classList.add("task__content");
  taskContent.appendChild(taskText);
  taskContent.appendChild(taskDate);

  const div = document.createElement("div");
  div.classList.add("task");
  div.appendChild(taskContent);
  div.appendChild(btnRemove);

  container.appendChild(div);

  btnRemove.addEventListener("click", () => {
    showConfirmModal(() => {
      div.remove();
    });
  });
}

function clearInputs() {
  document.getElementById("task__input").value = "";
  document.getElementById("date__input").value = "";
}
