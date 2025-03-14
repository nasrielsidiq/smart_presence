const multer = require('multer');
const path = require('path');
const fs = require('fs');   


// Konfigurasi penyimpanan

const uploadsDir = path.resolve(__dirname, '../uploads/users');

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('Folder uploads dibuat!');
} else {
    console.log('Folder uploads sudah ada!');
}


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir); // Folder penyimpanan
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname); // Ambil ekstensi file
        cb(null, Date.now() + ext); // Nama unik berdasarkan timestamp
    }
});

// Filter tipe file (hanya gambar)
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only images are allowed!'), false);
    }
};

// Inisialisasi Multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 } // Batas ukuran 2MB
});

module.exports = upload;
