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

    /**
     * Create or update an attendance record for an employee.
     * @param {number} employee_id - The ID of the employee.
     * @param {string} time - The time of the attendance.
     * @param {Object} res - The response object.
     */
    async createOrUpdate(employee_id, time, res) {
        try {
            const employee = await Employee.findById(employee_id);
            if (!employee) {
                return this.sendDataToAntares({
                    success: false,
                    message: 'Employee not found',
                    serial_id: null,
                }, res);
            }
    
            const exists = await Attendance.existsForDay(employee_id);
    
            if (exists) {
                let success = await Attendance.create({ employee_id, time });
    
                return this.sendDataToAntares({
                    success: !!success,
                    message: success ? 'Attendance record updated successfully' : 'Failed to update attendance record',
                    serial_id: employee.serial_id,
                }, res);
            } else {
                let id = await Attendance.create({ employee_id, time });
    
                return this.sendDataToAntares({
                    success: true,
                    id,
                    message: 'Success to check in today',
                    serial_id: employee.serial_id,
                }, res);
            }
        } catch (error) {
            return this.sendDataToAntares({
                success: false,
                message: 'Failed to check in/check out today',
                serial_id: null,
                error: error.message,
            }, res);
        }
    }

    /**
     * Handle attendance by serial ID.
     * @param {string} serial_id - The serial ID of the employee.
     * @param {string} time - The time of the attendance.
     * @param {Object} res - The response object.
     */
    async attendancebySerialid(serial_id, time, res) {
        try {
            const attendance = await Employee.findBySerialId(serial_id);
            if (!attendance) {
                res.status(404).json({ error: 'Attendance record not found' });
            }
            console.log(attendance);
            this.createOrUpdate(attendance.id, time, res);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * Send data to Antares.
     * @param {Object} data - The data to send.
     * @param {Object} res - The response object.
     */
    async sendDataToAntares(data, res) {
        try {
            const formattedData = {
                "m2m:cin": {
                    "con": JSON.stringify(data)
                }
            };

            const url = `${process.env.ANTARES_ROUTE}/${process.env.ANTARES_CSE}/${process.env.ANTARES_ID}/${process.env.APP_NAME}/${process.env.DEVICE_NAME}`;
            
            console.log("Antares URL:", url);

            if (!process.env.ANTARES_ROUTE || !process.env.ANTARES_CSE || !process.env.ANTARES_ID || !process.env.APP_NAME || !process.env.DEVICE_NAME) {
                throw new Error("Missing required environment variables for Antares API.");
            }

            const response = await axios.post(
                url,
                formattedData,
                {
                    headers: {
                        "X-M2M-Origin": process.env.ACCESS_KEY,
                        "Content-Type": "application/json;ty=4",
                        "Accept": "application/json"
                    }
                }
            );

            console.log("Data sent successfully:", response.data);
            return res.status(200).json({ success: true, message: "Data sent successfully", data: response.data });
        } catch (error) {
            console.error("Error sending data to Antares:", error.response?.data || error.message);
            return res.status(400).json({ success: false, error: error.response?.data || error.message });
        }
    }

    /**
     * Check employee attendance for the current day.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     */
    async checkEmployeeAttendance(req, res) {
        try {
            const attendance = await Attendance.existsForDay(req.params.id);
            console.log(attendance);
            res.json(attendance);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * Retrieve all attendance records.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     */
    async getAttendances(req, res) {
        try {
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 10;
            const period = req.query.period || 'daily';
            const spId = parseInt(req.user.id);
            console.log(spId);
            let attendances;
            if(req.user.privilege == 'supervisor'){
                attendances = await Attendance.findAll({ page, limit, period, sp_id: spId });
            }else{
                attendances = await Attendance.findAll({ page, limit, period });
            }
            res.json(attendances);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * Retrieve individual attendance records for a specific employee.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     */
    async getAttendancesIndividu(req, res) {
        try {
            const employee = await Employee.findById(req.params.id);
            if (!employee) {
                return  res.status(404).json({ error: 'Employee not found' });
            }

            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 10;
            const period = req.query.period || 'daily';
            const employee_id = employee.id;
            const attendances = await Attendance.findAll({ page, limit, period, employee_id});
            res.json(attendances);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * Retrieve an attendance record by ID.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     */
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

    /**
     * Update an attendance record by ID.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     */
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