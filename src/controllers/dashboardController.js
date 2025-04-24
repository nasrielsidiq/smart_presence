const attendance = require('../models/attendance.js');
const employee = require('../models/employee.js');
const division = require('../models/division.js');

class DashboardController {
    /**
     * Handle the index request for the dashboard.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     */
    async index(req, res) {
        try {

            const division_id = req.query.division || null;

            if(division_id) {
                const divisions = await division.findById(division_id);
                if (!divisions) return res.status(404).json({ message: 'Division not found' });
            }

            const employeeCount = await employee.totalEmployee(division_id);
            const absentCount = await attendance.totalAbsent(division_id);
            const onTimeCount = await attendance.totalOnTime(division_id);
            const lateCount = await attendance.totalLate(division_id);
            const onLeaveCount = await attendance.totalOnLeave(division_id);
    
            // Menghitung total kehadiran
            const totalPresence = onTimeCount + lateCount;
            const totalSum = absentCount + totalPresence + onLeaveCount; // Total semua kategori
    
            // Menghitung persentase secara proporsional agar total selalu 100%
            let absentPercentage = (absentCount / totalSum) * 100;
            let onTimePercentage = (onTimeCount / totalSum) * 100;
            let latePercentage = (lateCount / totalSum) * 100;
            let onLeavePercentage = (onLeaveCount / totalSum) * 100;
    
            // Menghindari masalah floating-point dengan pembulatan
            const totalPercentage = absentPercentage + onTimePercentage + latePercentage + onLeavePercentage;
            const adjustment = 100 - totalPercentage;
    
            // Menyesuaikan persentase terbesar agar total = 100%
            if (absentPercentage >= onTimePercentage && absentPercentage >= latePercentage) {
                absentPercentage += adjustment;
            } else if (onTimePercentage >= latePercentage) {
                onTimePercentage += adjustment;
            } else {
                latePercentage += adjustment;
            }
    
            res.json({
                employeeCount,
                absentCount,
                onTimeCount,
                lateCount,
                onLeaveCount,
                percentages: {
                    absent: absentPercentage.toFixed(2),
                    onTime: onTimePercentage.toFixed(2),
                    late: latePercentage.toFixed(2),
                    onLeave: onLeavePercentage.toFixed(2),
                }
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async chart(req, res) {
        try{

            const category = req.query.category || 'discipline';
            // console.log(category);

            const attendances = await attendance.grafikPerBulan(category);
            res.json(attendances);
        }catch(error){
            res.status(500).json({ error: error.message });
        }
    }
    
    
}

module.exports = DashboardController;