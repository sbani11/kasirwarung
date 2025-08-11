import { db } from "./firebase-config.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const form = document.getElementById("barangForm");

// Ambil ID barang dari query string
const urlParams = new URLSearchParams(window.location.search);
const idBarang = urlParams.get("id");

if (!idBarang) {
  alert("ID Barang tidak ditemukan di URL!");
  window.location.href = "barang.html";
}

// Load data barang
async function loadBarang() {
  try {
    const barangRef = doc(db, "barang", idBarang);
    const barangSnap = await getDoc(barangRef);

    if (barangSnap.exists()) {
      const data = barangSnap.data();
      document.getElementById("idBarang").value = idBarang;
      document.getElementById("namaBarang").value = data.nama;
      document.getElementById("hargaBarang").value = data.harga;
      document.getElementById("stokBarang").value = data.stok;
    } else {
      alert("Barang tidak ditemukan!");
      window.location.href = "barang.html";
    }
  } catch (error) {
    console.error("Gagal memuat data barang:", error);
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nama = document.getElementById("namaBarang").value.trim();
  const harga = parseInt(document.getElementById("hargaBarang").value);
  const stok = parseInt(document.getElementById("stokBarang").value);

  try {
    await setDoc(doc(db, "barang", idBarang), {
      nama: nama,
      harga: harga,
      stok: stok
    });
    alert("Barang berhasil diperbarui!");
    window.location.href = "barang.html";
  } catch (error) {
    console.error("Gagal menyimpan perubahan:", error);
    alert("Gagal menyimpan perubahan!");
  }
});

// Load data saat halaman dibuka
loadBarang();
