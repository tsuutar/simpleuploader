document.addEventListener("DOMContentLoaded", loadFiles);

const fileInput = document.getElementById("file-input");
const fileList = document.getElementById("file-list");
const progressContainer = document.getElementById("progress-container");
const progressBar = document.getElementById("progress-bar");
const progressText = document.getElementById("progress-text");

// 全画面のドラッグ＆ドロップ対応
document.addEventListener("dragover", (e) => {
  e.preventDefault();
  document.body.classList.add("bg-gray-200"); // 背景を変えてD&D可能を視覚化
});

document.addEventListener("dragleave", () => {
  document.body.classList.remove("bg-gray-200");
});

document.addEventListener("drop", (e) => {
  e.preventDefault();
  document.body.classList.remove("bg-gray-200");
  fileInput.files = e.dataTransfer.files;
  uploadFiles();
});

function uploadFiles() {
  const files = fileInput.files;
  if (files.length === 0) return;

  progressContainer.classList.remove("hidden");
  progressBar.style.width = "0%";
  progressText.textContent = `0% 完了`;

  const formData = new FormData();
  for (let file of files) {
    formData.append("files", file);
  }

  const xhr = new XMLHttpRequest();
  xhr.open("POST", "/upload", true);

  xhr.upload.onprogress = function (event) {
    if (event.lengthComputable) {
      const percent = Math.round((event.loaded / event.total) * 100);
      progressBar.style.width = percent + "%";
      progressText.textContent = `${percent}% 完了`;
    }
  };

  xhr.onload = function () {
    if (xhr.status === 200) {
      progressText.textContent = "アップロード完了！";

      // **ファイル選択をリセット**
      fileInput.value = "";

      setTimeout(() => {
        progressContainer.classList.add("hidden");
        loadFiles();
      }, 1000);
    } else {
      progressText.textContent = "アップロードに失敗しました";
    }
  };

  xhr.send(formData);
}

function loadFiles() {
  fetch("/files")
    .then((response) => response.json())
    .then((files) => {
      fileList.innerHTML = "";
      files.forEach((file) => {
        const row = document.createElement("tr");
        row.classList.add("hover:bg-gray-100");

        const nameCell = document.createElement("td");
        nameCell.classList.add("py-2", "px-4", "truncate", "max-w-xs");

        // ファイル名をクリックでダウンロード可能に
        const link = document.createElement("a");
        link.href = file.url;
        link.textContent = decodeURIComponent(file.displayName);
        link.classList.add("text-blue-600", "hover:underline");
        link.setAttribute("download", decodeURIComponent(file.displayName));

        nameCell.appendChild(link);
        row.appendChild(nameCell);

        const dateCell = document.createElement("td");
        dateCell.classList.add("py-2", "px-4");
        dateCell.textContent = new Date(file.date).toLocaleString();
        row.appendChild(dateCell);

        const actionCell = document.createElement("td");
        actionCell.classList.add("py-2", "px-4", "text-center");
        const deleteButton = document.createElement("button");
        deleteButton.classList.add("text-red-500", "hover:text-red-700");
        deleteButton.innerHTML = "🗑"; // ゴミ箱アイコン
        deleteButton.onclick = () => deleteFile(file.name);
        actionCell.appendChild(deleteButton);
        row.appendChild(actionCell);

        fileList.appendChild(row);
      });
    });
}

function deleteFile(filename) {
  fetch(`/delete/${filename}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then(() => loadFiles());
}

// テーブルのソート機能
function sortTable(columnIndex) {
  const table = document.querySelector("table");
  const tbody = table.querySelector("tbody");
  const rows = Array.from(tbody.querySelectorAll("tr"));

  const isAscending =
    table.dataset.sortColumn == columnIndex && table.dataset.sortOrder == "asc";
  table.dataset.sortColumn = columnIndex;
  table.dataset.sortOrder = isAscending ? "desc" : "asc";

  rows.sort((rowA, rowB) => {
    const cellA = rowA.cells[columnIndex].textContent.trim();
    const cellB = rowB.cells[columnIndex].textContent.trim();

    if (columnIndex === 1) {
      // 日付カラムのソート
      return isAscending
        ? new Date(cellB) - new Date(cellA)
        : new Date(cellA) - new Date(cellB);
    }

    return isAscending
      ? cellB.localeCompare(cellA, "ja")
      : cellA.localeCompare(cellB, "ja");
  });

  tbody.innerHTML = "";
  rows.forEach((row) => tbody.appendChild(row));
}
