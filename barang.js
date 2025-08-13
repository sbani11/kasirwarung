import { db } from "./firebase-config.js";
import { collection, getDocs, deleteDoc, doc, query, where } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const barangBody = document.getElementById("barangBody");
const searchInput = document.getElementById("searchBarang");

// Pesan awal
barangBody.innerHTML = `<tr><td colspan="5" style="text-align:center;">Ketik ID atau Nama barang untuk mencari</td></tr>`;

// Fungsi render tabel
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

// Fungsi mencari barang di Firestore
async function cariBarang(keyword) {
  if (!keyword) {
    barangBody.innerHTML = `<tr><td colspan="5" style="text-align:center;">Ketik ID atau Nama barang untuk mencari</td></tr>`;
    return;
  }

  try {
    const querySnapshot = await getDocs(collection(db, "barang"));
    let hasil = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if (
        docSnap.id.toLowerCase().includes(keyword) ||
        data.nama.toLowerCase().includes(keyword)
      ) {
        hasil.push({ id: docSnap.id, ...data });
      }
    });

    renderTabel(hasil);

  } catch (error) {
    console.error("Gagal mencari barang:", error);
    barangBody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:red;">Error mencari data!</td></tr>`;
  }
}

// Event saat mengetik
searchInput.addEventListener("input", () => {
  const keyword = searchInput.value.trim().toLowerCase();
  cariBarang(keyword);
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
      cariBarang(searchInput.value.trim().toLowerCase()); // refresh hasil pencarian
    } catch (error) {
      console.error("Gagal menghapus barang:", error);
      alert("Gagal menghapus barang!");
    }
  }
};
