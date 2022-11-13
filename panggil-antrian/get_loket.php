<?php
// pengecekan ajax request untuk mencegah direct access file, agar file tidak bisa diakses secara langsung dari browser
// jika ada ajax request
if (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && ($_SERVER['HTTP_X_REQUESTED_WITH'] == 'XMLHttpRequest')) {
  // panggil file "database.php" untuk koneksi ke database
  require_once "../config/database.php";

  // ambil tanggal sekarang
  $tanggal = gmdate("Y-m-d", time() + 60 * 60 * 7);

  // sql statement untuk menampilkan data "loket" dari tabel "tbl_antrian" berdasarkan "tanggal" dan "status = 1"
  $query = mysqli_query($mysqli, "SELECT loket FROM tbl_antrian 
                                  WHERE tanggal='$tanggal' AND status='1' 
                                  ORDER BY updated_date DESC LIMIT 1")
                                  or die('Ada kesalahan pada query tampil data : ' . mysqli_error($mysqli));
  // ambil jumlah baris data hasil query
  $rows = mysqli_num_rows($query);

  // cek hasil query
  // jika data "loket" ada
  if ($rows <> 0) {
    // ambil data hasil query
    $data = mysqli_fetch_assoc($query);
    // buat variabel untuk menampilkan data
    $loket = $data['loket'];

    // tampilkan data
    echo number_format($loket, 0, '', '.');
  } 
  // jika data "loket" tidak ada
  else {
    // tampilkan "-"
    echo "-";
  }
}
