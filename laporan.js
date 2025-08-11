import { db } from './firebase-config.js';
import { collection, query, where, getDocs, orderBy, Timestamp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const laporanBody = document.getElementById("laporanBody");
const btnFilter = document.getElementById("btnFilter");
const btnExport = document.getElementById("btnExport");
const tanggalMulaiInput = document.getElementById("tanggalMulai");
const tanggalAkhirInput = document.getElementById("tanggalAkhir");

async function loadLaporan(startDate = null, endDate = null) {
  laporanBody.innerHTML = `<tr><td colspan="5" style="text-align:center;">Memuat data...</td></tr>`;

  let q;
  if (startDate && endDate) {
    q = query(
      collection(db, "transaksi"),
      where("tanggal", ">=", Timestamp.fromDate(startDate)),
      where("tanggal", "<=", Timestamp.fromDate(endDate)),
      orderBy("tanggal", "desc")
    );
  } else {
    q = query(collection(db, "transaksi"), orderBy("tanggal", "desc"));
  }

  const snap = await getDocs(q);

  if (snap.empty) {
    laporanBody.innerHTML = `<tr><td colspan="5" style="text-align:center;">Tidak ada data</td></tr>`;
    return;
  }

  laporanBody.innerHTML = "";
  snap.forEach(docSnap => {
    const data = docSnap.data();
    const tanggalStr = data.tanggal?.toDate().toLocaleString("id-ID") || "-";

    // Jika transaksi punya banyak item
    if (Array.isArray(data.items)) {
      data.items.forEach(item => {
        laporanBody.innerHTML += `
          <tr>
            <td>${tanggalStr}</td>
            <td>${item.nama}</td>
            <td>${item.qty}</td>
            <td>Rp ${item.harga.toLocaleString("id-ID")}</td>
            <td>Rp ${(item.qty * item.harga).toLocaleString("id-ID")}</td>
          </tr>
        `;
      });
    }
  });
}

// Filter saat tombol diklik
btnFilter.addEventListener("click", () => {
  const mulaiVal = tanggalMulaiInput.value;
  const akhirVal = tanggalAkhirInput.value;

  if (!mulaiVal || !akhirVal) {
    alert("Pilih tanggal mulai dan tanggal akhir!");
    return;
  }

  const startDate = new Date(mulaiVal + "T00:00:00");
  const endDate = new Date(akhirVal + "T23:59:59");

  loadLaporan(startDate, endDate);
});

// Export ke Excel
btnExport.addEventListener("click", () => {
  const wb = XLSX.utils.table_to_book(document.querySelector("table"), { sheet: "Laporan" });
  XLSX.writeFile(wb, "laporan_transaksi.xls");
});

// Load semua data pertama kali
loadLaporan();
