const User = require('../models/user');
const Office = require('../models/office');
const Attendance = require('../models/attendance');
const { format } = require('fast-csv');

class csvController {
    async csvDownloadAll(req, res) {
            // Contoh data
        
        const period = req.query.period || null;
        const division = req.query.division || null;
        const office = req.query.office || null;

        const data = await Attendance.findAll({period : period, division : division, office : office});        
    
        // Set header supaya browser tahu ini file CSV
        res.setHeader("Content-Disposition", "attachment; filename=data.csv");
        res.setHeader("Content-Type", "text/csv");
    
        // Stream data CSV ke response
        const csvStream = format({ headers: true });
        csvStream.pipe(res);
        data.attendance.forEach(row => csvStream.write(row));
        csvStream.end();
        // try {
        //     const data = await Office.getAll(); // Ambil data dari database
        
        //     const workbook = new ExcelJS.Workbook();
        //     const worksheet = workbook.addWorksheet("Data Kantor");
        
        //     // Atur header
        //     worksheet.columns = [
        //       { header: "Nama Kantor", key: "name", width: 30 },
        //       { header: "Alamat", key: "address", width: 40 },
        //       { header: "Kota", key: "city", width: 20 },
        //       { header: "Tanggal Buat", key: "created_at", width: 20 },
        //       { header: "Status", key: "status", width: 15 },
        //     ];
        
        //     // Tambah data ke worksheet
        //     data.forEach(row => {
        //       worksheet.addRow({
        //         name: row.name,
        //         address: row.address,
        //         city: row.city,
        //         created_at: new Date(row.created_at).toLocaleDateString(),
        //         status: row.is_active ? "Aktif" : "Nonaktif",
        //       });
        //     });
        
        //     // Styling header
        //     worksheet.getRow(1).eachCell(cell => {
        //       cell.font = { bold: true };
        //       cell.fill = {
        //         type: 'pattern',
        //         pattern: 'solid',
        //         fgColor: { argb: 'FFDBCC8F' }, // warna accent kamu
        //       };
        //     });
        
        //     // Set header response
        //     res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        //     res.setHeader("Content-Disposition", "attachment; filename=data_kantor.xlsx");
        
        //     // Kirim file Excel ke client
        //     await workbook.xlsx.write(res);
        //     res.end();
        
        //   } catch (err) {
        //     console.error("Gagal generate Excel:", err);
        //     res.status(500).send("Gagal membuat file Excel.");
        //   }
    }
}
module.exports = csvController;