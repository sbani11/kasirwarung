import { db } from './firebase-config.js';
import { collection, getDocs, addDoc, Timestamp, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

let keranjang = [];
const keranjangEl = document.getElementById("keranjang");
const totalEl = document.getElementById("totalBelanja");

document.getElementById("btnCari").addEventListener("click", async () => {
  const keyword = document.getElementById("search").value.toLowerCase();
  const querySnapshot = await getDocs(collection(db, "barang"));
  let found = null;

  querySnapshot.forEach(docSnap => {
    const data = docSnap.data();
    if (data.id?.toLowerCase() === keyword || data.nama?.toLowerCase() === keyword) {
      found = { id: docSnap.id, ...data };
    }
  });

  if (found) {
    tambahKeranjang(found);
  } else {
    alert("Barang tidak ditemukan!");
  }
});

function tambahKeranjang(barang) {
  const index = keranjang.findIndex(item => item.id === barang.id);
  if (index >= 0) {
    keranjang[index].qty++;
  } else {
    keranjang.push({ ...barang, qty: 1 });
  }
  renderKeranjang();
}

function renderKeranjang() {
  keranjangEl.innerHTML = "";
  let total = 0;
  keranjang.forEach((item, i) => {
    const subtotal = item.qty * item.harga;
    total += subtotal;
    keranjangEl.innerHTML += `
      <tr>
        <td>${item.nama}</td>
        <td>
          <button onclick="ubahQty(${i}, -1)">-</button>
          ${item.qty}
          <button onclick="ubahQty(${i}, 1)">+</button>
        </td>
        <td>${item.harga}</td>
        <td>${subtotal}</td>
        <td><button onclick="hapusItem(${i})">Hapus</button></td>
      </tr>
    `;
  });
  totalEl.textContent = total;
}

window.ubahQty = function(i, val) {
  keranjang[i].qty += val;
  if (keranjang[i].qty <= 0) keranjang.splice(i, 1);
  renderKeranjang();
}

window.hapusItem = function(i) {
  keranjang.splice(i, 1);
  renderKeranjang();
}

document.getElementById("btnBayar").addEventListener("click", async () => {
  if (keranjang.length === 0) {
    alert("Keranjang kosong!");
    return;
  }
  
  try {
    await addDoc(collection(db, "transaksi"), {
      items: keranjang,
      total: keranjang.reduce((sum, i) => sum + i.harga * i.qty, 0),
      waktu: Timestamp.now(),        // waktu lokal saat transaksi
      tanggal: serverTimestamp()     // timestamp dari server (buat laporan & filter)
    });

    alert("Transaksi berhasil!");
    keranjang = [];
    renderKeranjang();
  } catch (error) {
    console.error("Gagal menyimpan transaksi:", error);
    alert("Terjadi kesalahan saat menyimpan transaksi.");
  }
});
