const Attendance = require('../models/attendance');
const Employee = require('../models/employee');

class AttendanceController {
    constructor() {
        this.createOrUpdate = this.createOrUpdate.bind(this);
        this.attendancebySerialid = this.attendancebySerialid.bind(this);
    }
    async createOrUpdate(employee_id, res) {
        try {
            // const { employee_id } = req.body || req.params;

            const employee = await Employee.findById(employee_id);
            if (!employee) {
                res.status(404).json({ error: 'Employee not found' });
                return;
            }

            const exists = await Attendance.existsForDay(employee_id);

            if (exists) {
                const success = await Attendance.create({
                    employee_id,
                });

                if (success) {
                    res.status(200).json({ message: 'Attendance record updated successfully' });
                } else {
                    res.status(500).json({ error: 'Failed to update attendance record' });
                }
            } else {
                // Create a new record
                const id = await Attendance.create({
                    employee_id,
                });

                res.status(201).json({ id });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async attendancebySerialid(req, res) {
        try {
            const { serial_id } = req.body;
            const attendance = await Employee.findBySerialId(serial_id);
            if (!attendance) {
                res.status(404).json({ error: 'Attendance record not found' });
            }
            console.log(attendance);
            await this.createOrUpdate(attendance.id, res);
        } catch (error) {
            res.status(500).json({ error: error.message });
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