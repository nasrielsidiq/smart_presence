const Attendance = require('../models/attendance');
const Employee = require('../models/employee');
const axios = require("axios");
require("dotenv").config();

class AttendanceController {
    constructor() {
        this.createOrUpdate = this.createOrUpdate.bind(this);
        this.attendancebySerialid = this.attendancebySerialid.bind(this);
        this.sendDataToAntares = this.sendDataToAntares.bind(this);
    }
    async createOrUpdate(employee_id, res) {
        try {
            // const { employee_id } = req.body || req.params;

            const employee = await Employee.findById(employee_id);
            if (!employee) {
                var send = this.sendDataToAntares({
                    success : false,
                    message : 'Employee not found',
                    serial_id : employee.serial_id,
                }, res);
                console.log(send);
                // return res.status(404).json({ error: 'Employee not found' });
            }

            const exists = await Attendance.existsForDay(employee_id);

            if (exists) {
                const success = await Attendance.create({
                    employee_id,
                });

                if (success) {
                    var send = this.sendDataToAntares({
                        success : true,
                        message : 'Attendance record updated successfully',
                        serial_id : employee.serial_id,
                    }, res);
                    console.log(send);
                    // return res.json({ message: 'Attendance record updated successfully' });
                } else {
                    var send = this.sendDataToAntares({
                        success : true,
                        message : 'Failed to update attendance record',
                        serial_id : employee.serial_id,
                    }, res);
                    console.log(send);
                    // return res.status(500).json({ error: 'Failed to update attendance record' });
                }
            } else {
                // Create a new record
                const id = await Attendance.create({
                    employee_id,
                });

                // return res.json(id);
                var send = this.sendDataToAntares({
                    success : true,
                    id,
                    message : 'Success to check in today',
                    serial_id : employee.serial_id,
                }, res);
                console.log(send);

            }
        } catch (error) {
            const send = this.sendDataToAntares({
                success : false,
                message : 'Failed to check in/check out today',
                serial_id : employee.serial_id,
            }, res);
            console.log(send);
            // return res.status(500).json({ error: error.message });
        }
    }

    async attendancebySerialid(serial_id, res) {
        try {
            const attendance = await Employee.findBySerialId(serial_id);
            if (!attendance) {
                res.status(404).json({ error: 'Attendance record not found' });
            }
                console.log(attendance);
                this.createOrUpdate(attendance.id, res);
            
            // console.log(create);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async sendDataToAntares(data, res) {
        try {
            // Konversi data ke format JSON string seperti yang diminta oleh Antares
            const formattedData = {
                "m2m:cin": {
                    "con": JSON.stringify(data) // Convert object ke string JSON
                }
            };

            const url = `${process.env.ANTARES_ROUTE}/${process.env.ANTARES_CSE}/${process.env.ANTARES_ID}/${process.env.APP_NAME}/${process.env.DEVICE_NAME}`;
            
            console.log("Antares URL:", url); // Cek apakah URL sudah benar

            if (!process.env.ANTARES_ROUTE || !process.env.ANTARES_CSE || !process.env.ANTARES_ID || !process.env.APP_NAME || !process.env.DEVICE_NAME) {
                throw new Error("Missing required environment variables for Antares API.");
            }

            // Kirim request ke Antares
            const response = await axios.post(
                url,
                formattedData,
                {
                    headers: {
                        "X-M2M-Origin": process.env.ACCESS_KEY, // Ganti dengan access key Antares kamu
                        "Content-Type": "application/json;ty=4",
                        "Accept": "application/json"
                    }
                }
            );

            console.log("Data sent successfully:", response.data);
            // return;
            // return res.status(200);
            // return response.data;
            return res.status(200).json({ success: true, message: "Data sent successfully", data: response.data });
        } catch (error) {
            console.error("Error sending data to Antares:", error.response?.data || error.message);
            // return;
            // return res.status(400);
            return res.status(400).json({ success: false, error: error.response?.data || error.message });
        }
    }

    async checkEmployeeAttendance(req, res) {
        try {
            // const { id } = req.body;
            console.log(req.params.id);
            const attendance = await Attendance.existsForDay(req.params.id);
            console.log(attendance);
            res.json(attendance);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getAttendances(req, res) {
        try {
            const attendances = await Attendance.findAll();
            res.json(attendances);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getAttendanceById(req, res) {
        try {
            const attendance = await Attendance.findById(req.params.id);
            if (attendance) {
                res.json(attendance);
            } else {
                res.status(404).json({ error: 'Attendance record not found' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateAttendance(req, res) {
        try {
            const { employee_id, check_in, check_out, status_check_in, status_check_out, category } = req.body;
            const success = await Attendance.update(req.params.id, {
                employee_id,
                check_in,
                check_out,
                status_check_in,
                status_check_out,
                category
            });

            if (!success) {
                res.status(404).json({ error: 'Attendance record not found' });
                return;
            }
            res.json({ message: 'Attendance record updated successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

}

module.exports = AttendanceController;