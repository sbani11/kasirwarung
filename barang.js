import { db } from "./firebase-config.js";
import {
  collection,
  getDocs,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const barangBody = document.getElementById("barangBody");
const searchInput = document.getElementById("searchBarang");
const btnCari = document.getElementById("btnCari");

// Cache barang yang sudah pernah diambil
let cacheBarang = {};

// Render tabel
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

// Fungsi cari barang dengan cache
async function cariBarang(keyword) {
  if (!keyword) {
    barangBody.innerHTML = `<tr><td colspan="5" style="text-align:center;">Ketik kata kunci lalu tekan Cari</td></tr>`;
    return;
  }

  keyword = keyword.toLowerCase();

  // Cek cache dulu
  let hasilCache = Object.values(cacheBarang).filter(
    b =>
      b.id.toLowerCase().includes(keyword) ||
      b.nama.toLowerCase().includes(keyword)
  );

  if (hasilCache.length > 0) {
    renderTabel(hasilCache);
    return;
  }

  try {
    // Ambil semua barang sekali saja
    const snap = await getDocs(collection(db, "barang"));
    let hasilBaru = [];

    snap.forEach((docSnap) => {
      const data = { id: docSnap.id, ...docSnap.data() };
      cacheBarang[data.id] = data; // simpan ke cache

      if (
        data.id.toLowerCase().includes(keyword) ||
        data.nama.toLowerCase().includes(keyword)
      ) {
        hasilBaru.push(data);
      }
    });

    renderTabel(hasilBaru);

  } catch (error) {
    console.error("Gagal mencari barang:", error);
    barangBody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:red;">Error mencari data!</td></tr>`;
  }
}

// Event tombol cari
btnCari.addEventListener("click", () => {
  cariBarang(searchInput.value.trim());
});

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
      delete cacheBarang[id]; // hapus dari cache
      cariBarang(searchInput.value.trim()); // refresh tabel
    } catch (error) {
      console.error("Gagal menghapus barang:", error);
    }
  }
};
