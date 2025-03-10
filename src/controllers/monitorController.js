const AttendanceController = require('./attendanceController');
const attendanceController = new AttendanceController();

var bodyParser = require('body-parser');
var util = require('util');



class monitorControler {
    async getMonitor(req, res) {
        res.send('GET Monitor');
    }
    async postMonitor(req, res) {
        try {
            const data = req.body;
            console.log("Full Data:", JSON.stringify(data, null, 2)); // Debug full struktur
            
            const rep = data?.["m2m:sgn"]?.["m2m:nev"]?.["m2m:rep"]; // Ambil `m2m:rep`
            console.log("m2m:rep:", JSON.stringify(rep, null, 2)); // Cek strukturnya
    
            if (!rep) {
                return res.status(400).json({ error: "Invalid JSON structure" });
            }
    
            // Pastikan `m2m:rep` berbentuk objek dan memiliki `m2m:cin`
            const cin = rep?.["m2m:cin"];
            if (!cin) {
                return res.status(400).json({ error: "No m2m:cin found" });
            }
    
            // Ambil data `con`
            const con = cin["con"];
            console.log("Raw con:", con);
    
            // Parse isi `con` (karena ini masih dalam format string JSON)
            const content = JSON.parse(con);
            attendanceController.attendancebySerialid(content.serial_id, res);
            console.log("serial_id:", content.serial_id);

            // console.log("Humidity:", content.humidity);
    
        } catch (error) {
            console.error("Error parsing data:", error);
            // return res.status(500).json({ error: "Internal Server Error" });
        }
    }
    
    async putMonitor(req, res) {
        res.send('PUT Monitor');
    }
    async deleteMonitor(req, res) {
        res.send('DELETE Monitor');
    }




}

module.exports = monitorControler;