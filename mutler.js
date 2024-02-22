const path = require('path');
const multer = require('multer');

const generateRandomFileName = () => {
    const randomString = Math.random().toString(36).substring(2, 8);
    const timestamp = Date.now();
    return `${timestamp}-${randomString}`;
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '/uploads/'));
    },
    filename: function (req, file, cb) {
        const randomFileName = generateRandomFileName();
        const extension = path.extname(file.originalname);
        cb(null, `${randomFileName}${extension}`);
    }
});

const upload = multer({ storage: storage });

module.exports = upload;
