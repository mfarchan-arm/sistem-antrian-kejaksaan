$(document).ready(function () {
  // tampilkan informasi antrian
  $("#jumlah-antrian").load("get_jumlah_antrian.php");
  $("#antrian-sekarang").load("get_antrian_sekarang.php");
  $("#antrian-selanjutnya").load("get_antrian_selanjutnya.php");
  $("#sisa-antrian").load("get_sisa_antrian.php");
  $("#loket-sekarang").load("get_loket.php");

  // menampilkan data antrian menggunakan DataTables
  var table = $("#tabel-antrian").DataTable({
    lengthChange: false, // non-aktifkan fitur "lengthChange"
    searching: false, // non-aktifkan fitur "Search"
    ajax: "get_antrian.php", // url file proses tampil data dari database
    // menampilkan data
    columns: [
      {
        data: "no_antrian",
        width: "250px",
        className: "text-center",
      },
      {
        data: "loket",
        width: "250px",
        className: "text-center",
      },
      {
        data: "status",
        visible: false,
      },
      {
        data: null,
        orderable: false,
        searchable: false,
        width: "100px",
        className: "text-center",
        render: function (data, type, row) {
          // jika tidak ada data "status"
          if (data["status"] === "") {
            // sembunyikan button panggil
            var btn = "-";
          }
          // jika data "status = 0"
          else if (data["status"] === "0") {
            // tampilkan button panggil
            var btn = '<button class="btn btn-success btn-sm rounded-circle"><i class="bi-mic-fill"></i></button>';
          }
          // jika data "status = 1"
          else if (data["status"] === "1") {
            // tampilkan button ulangi panggilan
            var btn = '<button class="btn btn-secondary btn-sm rounded-circle"><i class="bi-mic-fill"></i></button>';
          }
          return btn;
        },
      },
    ],
    order: [
      [0, "asc"], // urutkan data berdasarkan "no_antrian" secara descending
    ],
    iDisplayLength: 10, // tampilkan 10 data per halaman
  });

  // panggilan antrian dan update data
  $("#tabel-antrian tbody").on("click", "button", function () {
    // ambil data dari datatables
    var data = table.row($(this).parents("tr")).data();
    // buat variabel untuk menampilkan data "id"
    var id = data["id"];
    // buat variabel untuk menampilkan audio bell antrian
    var bell = document.getElementById("tingtung");

    // mainkan suara bell antrian
    bell.pause();
    bell.currentTime = 0;
    bell.play();

    // set delay antara suara bell dengan suara nomor antrian
    durasi_bell = bell.duration * 770;

    // mainkan suara nomor antrian
    setTimeout(function () {
      responsiveVoice.speak("Nomor Antrian, " + data["no_antrian"] + ", menuju, loket, " + data["loket"], "Indonesian Male", {
        rate: 0.9,
        pitch: 1,
        volume: 1,
      });
    }, durasi_bell);

    //proses reset data
    $("#reset").on("click", function () {
      $.ajax({
        type: "POST", // mengirim data dengan method POST
        url: "reset.php", // url file proses insert data
        success: function (result) {
          // ketika proses insert data selesai
          // jika berhasil
          if (result === "Sukses") {
            // tampilkan jumlah antrian
            $("#antrian").load("get_antrian.php").fadeIn("slow");
          }
        },
      });
    });

    // proses update data
    $.ajax({
      type: "POST", // mengirim data dengan method POST
      url: "update.php", // url file proses update data
      data: { id: id }, // tentukan data yang dikirim
    });
  });

  // auto reload data antrian setiap 1 detik untuk menampilkan data secara realtime
  setInterval(function () {
    $("#jumlah-antrian").load("get_jumlah_antrian.php").fadeIn("slow");
    $("#antrian-sekarang").load("get_antrian_sekarang.php").fadeIn("slow");
    $("#antrian-selanjutnya").load("get_antrian_selanjutnya.php").fadeIn("slow");
    $("#sisa-antrian").load("get_sisa_antrian.php").fadeIn("slow");
    $("#loket-sekarang").load("get_loket.php").fadeIn("slow");
    table.ajax.reload(null, false);
  }, 1000);
});
