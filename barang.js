import { db } from "./firebase-config.js";
import { collection, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const barangBody = document.getElementById("barangBody");

// Fungsi untuk load data barang
async function loadBarang() {
  barangBody.innerHTML = ""; // kosongkan tabel

  try {
    const querySnapshot = await getDocs(collection(db, "barang"));

    if (querySnapshot.empty) {
      barangBody.innerHTML = `<tr><td colspan="5" style="text-align:center;">Belum ada data barang</td></tr>`;
      return;
    }

    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${docSnap.id}</td>
        <td>${data.nama}</td>
        <td>Rp ${data.harga.toLocaleString("id-ID")}</td>
        <td>${data.stok}</td>
        <td>
          <button class="btn btn-warning" onclick="editBarang('${docSnap.id}')">✏ Edit</button>
          <button class="btn btn-danger" onclick="hapusBarang('${docSnap.id}')">🗑 Hapus</button>
        </td>
      `;

      barangBody.appendChild(tr);
    });

  } catch (error) {
    console.error("Gagal mengambil data barang:", error);
    barangBody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:red;">Error memuat data!</td></tr>`;
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

// Jalankan loadBarang saat halaman dibuka
loadBarang();
