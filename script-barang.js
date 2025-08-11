import { db } from './firebase-config.js';
import { collection, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const tabelBarang = document.getElementById("tabelBarang");

async function loadBarang() {
  tabelBarang.innerHTML = "";
  const querySnapshot = await getDocs(collection(db, "barang"));
  querySnapshot.forEach(docSnap => {
    const data = docSnap.data();
    const row = `
      <tr>
        <td>${data.id}</td>
        <td>${data.nama}</td>
        <td>${data.stok}</td>
        <td>
          <button onclick="location.href='edit-barang.html?id=${docSnap.id}'">Edit</button>
          <button onclick="hapusBarang('${docSnap.id}')">Hapus</button>
        </td>
      </tr>
    `;
    tabelBarang.innerHTML += row;
  });
}

window.hapusBarang = async function(docId) {
  if (confirm("Yakin mau hapus barang ini?")) {
    await deleteDoc(doc(db, "barang", docId));
    alert("Barang berhasil dihapus");
    loadBarang();
  }
}

loadBarang();
