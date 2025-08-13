import { db } from "./firebase-config.js";
import { collection, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const barangBody = document.getElementById("barangBody");
const searchInput = document.getElementById("searchBarang");

let semuaBarang = []; // simpan semua data barang untuk keperluan filter

// Fungsi untuk load data barang
async function loadBarang() {
  barangBody.innerHTML = ""; // kosongkan tabel

  try {
    const querySnapshot = await getDocs(collection(db, "barang"));
    semuaBarang = []; // reset array

    if (querySnapshot.empty) {
      barangBody.innerHTML = `<tr><td colspan="5" style="text-align:center;">Belum ada data barang</td></tr>`;
      return;
    }

    querySnapshot.forEach((docSnap) => {
      semuaBarang.push({
        id: docSnap.id,
        ...docSnap.data()
      });
    });

    renderTabel(semuaBarang);

  } catch (error) {
    console.error("Gagal mengambil data barang:", error);
    barangBody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:red;">Error memuat data!</td></tr>`;
  }
}

// Fungsi untuk render tabel dari array barang
function renderTabel(dataArray) {
  barangBody.innerHTML = "";
  dataArray.forEach((data) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${data.id}</td>
      <td>${data.nama}</td>
      <td>Rp ${data.harga.toLocaleString("id-ID")}</td>
      <td>${data.stok}</td>
      <td>
        <button class="btn btn-warning" onclick="editBarang('${data.id}')">✏ Edit</button>
        <button class="btn btn-danger" onclick="hapusBarang('${data.id}')">🗑 Hapus</button>
      </td>
    `;

    barangBody.appendChild(tr);
  });

  if (dataArray.length === 0) {
    barangBody.innerHTML = `<tr><td colspan="5" style="text-align:center;">Tidak ada barang yang cocok</td></tr>`;
  }
}

// Fungsi edit barang
window.editBarang = function (id) {
  window.location.href = `edit-barang.html?id=${id}`;
};

// Fungsi hapus barang
window.hapusBarang = async function (id) {
  if (confirm("Yakin ingin menghapus barang ini?")) {
    try {
      await deleteDoc(doc(db, "barang", id));
      alert("Barang berhasil dihapus!");
      loadBarang();
    } catch (error) {
      console.error("Gagal menghapus barang:", error);
      alert("Gagal menghapus barang!");
    }
  }
};

// Event pencarian
if (searchInput) {
  searchInput.addEventListener("input", () => {
    const keyword = searchInput.value.toLowerCase();
    const filtered = semuaBarang.filter(
      b =>
        b.id.toLowerCase().includes(keyword) ||
        b.nama.toLowerCase().includes(keyword)
    );
    renderTabel(filtered);
  });
}

// Jalankan loadBarang saat halaman dibuka
loadBarang();
