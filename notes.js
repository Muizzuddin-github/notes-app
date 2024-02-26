function createNotes(title, isi, tgl, id) {
  const section = document.createElement("section");
  section.setAttribute("data-id", id);
  section.classList.add(
    "w-96",
    "bg-gray-50",
    "rounded-md",
    "p-5",
    "hover:bg-color4",
    "relative",
    "break-words"
  );

  const layarTranparent = document.createElement("section");
  layarTranparent.classList.add(
    "absolute",
    "top-0",
    "left-0",
    "right-0",
    "bottom-0",
    "bg-red-500",
    "item",
    "opacity-0",
    "cursor-pointer"
  );

  const iconTrash = document.createElement("i");
  iconTrash.classList.add(
    "trash-btn",
    "fa-solid",
    "fa-trash",
    "absolute",
    "right-2",
    "top-2",
    "cursor-pointer",
    "text-color1"
  );

  const titleP = document.createElement("p");
  titleP.appendChild(document.createTextNode(title));
  titleP.classList.add("font-semibold", "title");

  const isiP = document.createElement("p");
  isiP.classList.add("text-sm", "isi");
  isiP.appendChild(document.createTextNode(isi));

  const tglP = document.createElement("p");
  tglP.classList.add("text-[0.789rem]", "mt-5", "tgl");
  tglP.appendChild(document.createTextNode(tgl));

  section.appendChild(layarTranparent);
  section.appendChild(iconTrash);
  section.appendChild(titleP);
  section.appendChild(isiP);
  section.appendChild(tglP);

  return section;
}

function loadData() {
  const data = JSON.parse(localStorage.getItem("data"));
  const listNotes = document.querySelector(".list-notes");
  const notesInfo = document.querySelector(".notes-info");

  if (!Array.isArray(data)) {
    localStorage.setItem("data", "[]");
    return;
  }

  if (data.length === 0) {
    notesInfo.textContent = "Catatan Anda Kosong";
    return;
  }

  for (let i = 0; i < data.length; i++) {
    listNotes.appendChild(
      createNotes(data[i].judul, data[i].isi, data[i].tgl, data[i].id)
    );
  }
}

function formAdd() {
  const listNotes = document.querySelector(".list-notes");
  const form = document.querySelector(".form-add");
  const notesInfo = document.querySelector(".notes-info");
  const data = JSON.parse(localStorage.getItem("data"));
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const title = e.target.querySelector("#title");
    const isi = e.target.querySelector("#notes");

    if (title.value === "" || isi.value === "") {
      return;
    }

    if (isi.value.length > 238) {
      return;
    }

    const formatTgl = new Date()
      .toISOString()
      .slice(0, 10)
      .split("-")
      .reverse()
      .join("-");

    const id = Date.now().toString();

    listNotes.appendChild(createNotes(title.value, isi.value, formatTgl, id));

    data.push({
      id: id,
      judul: title.value,
      isi: isi.value,
      tgl: formatTgl,
    });

    localStorage.setItem("data", JSON.stringify(data));
    notesInfo.textContent = "Catatan Anda";
    title.value = "";
    isi.value = "";
  });
}

function formEdit() {
  const listNotes = document.querySelector(".list-notes");
  const form = document.querySelector(".form-edit");
  let data = JSON.parse(localStorage.getItem("data"));
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const title = e.target.querySelector("#title");
    const isi = e.target.querySelector("#notes");

    if (title.value === "" || isi.value === "") {
      return;
    }

    if (isi.value.length > 238) {
      return;
    }

    const idForm = form.dataset.id;

    data = data.map((d) => {
      if (d.id === idForm) {
        console.log(d.id);
        d.judul = title.value;
        d.isi = isi.value;
      }

      return d;
    });

    for (let i = 0; i < listNotes.children.length; i++) {
      const idItem = listNotes.children[i].dataset.id;
      if (idItem === idForm) {
        listNotes.children[i].querySelector(".title").textContent = title.value;
        listNotes.children[i].querySelector(".isi").textContent = isi.value;
      }
    }

    localStorage.setItem("data", JSON.stringify(data));
    title.value = "";
    isi.value = "";
  });
}

function btnTambah() {
  const btn = document.querySelector(".btn-tambah");
  const formAdd = this.document.querySelector(".form-add");
  const formEdit = this.document.querySelector(".form-edit");

  btn.addEventListener("click", function (e) {
    formAdd.classList.remove("hidden");
    formEdit.classList.add("hidden");
  });
}

function main() {
  loadData();
  formAdd();
  formEdit();
  btnTambah();
}

main();

window.addEventListener("click", function (e) {
  const listNotes = document.querySelector(".list-notes");

  if (e.target.classList.contains("trash-btn")) {
    const id = e.target.parentElement.dataset.id;

    let data = JSON.parse(this.localStorage.getItem("data"));
    data = data.filter((val) => val.id !== id);
    for (let i = 0; i < listNotes.children.length; i++) {
      const idItem = listNotes.children[i].dataset.id;
      if (idItem === id) {
        listNotes.removeChild(listNotes.children[i]);
      }
    }

    this.localStorage.setItem("data", JSON.stringify(data));
  }
});

window.addEventListener("dblclick", function (e) {
  const formEdit = this.document.querySelector(".form-edit");
  const formAdd = this.document.querySelector(".form-add");
  const infoForm = this.document.querySelector(".info-form");
  if (e.target.classList.contains("item")) {
    formAdd.classList.add("hidden");
    formEdit.classList.remove("hidden");
    infoForm.textContent = "Ubah catatan anda";

    const id = e.target.parentElement.dataset.id;
    const title = e.target.parentElement.querySelector(".title").textContent;
    const isi = e.target.parentElement.querySelector(".isi").textContent;

    formEdit.setAttribute("data-id", id);
    formEdit.querySelector("#title").value = title;
    formEdit.querySelector("#notes").value = isi;
  }
});
