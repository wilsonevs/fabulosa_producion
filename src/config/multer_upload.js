const multer = require("multer");
const path = require("path");
const random = require("../public/js/random");
const {v4}= require("uuid");

let aleatorio = random.uuidv4();

const Storage = multer.diskStorage({
    destination: path.join(__dirname, '../public/utils/img/uploads'),
    filename: (req, file , cb) => {
        cb(null, v4() + path.extname(file.originalname).toLowerCase());
    }
  });
  
const upload = multer({ 
      storage: Storage,
      dest: path.join(__dirname, '../public/utils/img/uploads'),
      limits: { fieldSize: 2048000},
      fileFilter: (req, file , cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const isMimeType = filetypes.test(file.mimetype);
        const isExtName = filetypes.test(path.extname(file.originalname));

        const mensaje = "Error: Solo se permite extensiones de tipo: ";
        (isMimeType && isExtName) ? cb(null, true) : cb(mensaje +""+ filetypes);

    }
}).single('imagen');


module.exports= {
  upload, 
};