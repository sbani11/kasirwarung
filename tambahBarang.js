import { db } from "./firebase-config.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const form = document.getElementById("barangForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const idBarang = document.getElementById("idBarang").value.trim();
  const nama = document.getElementById("namaBarang").value.trim();
  const harga = parseInt(document.getElementById("hargaBarang").value);
  const stok = parseInt(document.getElementById("stokBarang").value);

  if (!idBarang) {
    alert("ID Barang wajib diisi!");
    return;
  }

  try {
    await setDoc(doc(db, "barang", idBarang), {
      nama: nama,
      harga: harga,
      stok: stok
    });
    alert("Barang berhasil disimpan!");
    form.reset();
    window.location.href = "barang.html";
  } catch (error) {
    console.error("Gagal menyimpan barang:", error);
    alert("Gagal menyimpan barang!");
  }
});
