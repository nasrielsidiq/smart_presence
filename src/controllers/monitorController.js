const AttendanceController = require('./attendanceController');
const attendanceController = new AttendanceController();

var bodyParser = require('body-parser');
var util = require('util');

class MonitorController {
    /**
     * Handle POST request for monitor.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     */
    async postMonitor(req, res) {
        try {
            const data = req.body;
            console.log("Full Data:", JSON.stringify(data, null, 2)); // Debug full structure
            console.log(data?.["m2m:sgn"]?.["m2m:vrq"]);
            if(data?.["m2m:sgn"]?.["m2m:vrq"] && !data?.["m2m:sgn"]?.["m2m:sud"]){
                return res.status(200).json({ message: "Success to connect antares" });
            }
            
            const rep = data?.["m2m:sgn"]?.["m2m:nev"]?.["m2m:rep"]; // Extract `m2m:rep`
            console.log("m2m:rep:", JSON.stringify(rep, null, 2)); // Check structure
    
            if (!rep) {
                return res.status(400).json({ error: "Invalid JSON structure" });
            }
    
            // Ensure `m2m:rep` is an object and has `m2m:cin`
            const cin = rep?.["m2m:cin"];
            if (!cin) {
                return res.status(400).json({ error: "No m2m:cin found" });
            }
    
            // Extract `con` data
            const con = cin["con"];
            console.log("Raw con:", con);
    
            // Parse `con` content (as it is still in JSON string format)
            const content = JSON.parse(con);
            attendanceController.attendancebySerialid(content.serial_id, content.time, content.device_code, res);
            // console.log("serial_id:", content.serial_id);
        } catch (error) {
            console.error("Error parsing data:", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
}

module.exports = MonitorController;