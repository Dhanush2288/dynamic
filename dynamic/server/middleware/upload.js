const util = require("util");
const multer = require("multer");
const maxSize = 2 * 1024 * 1024;
let path=require("path")

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null,  "./uploads");
  },
  filename: (req, file, cb) => {
      var Daate = Date.now()
      var ext = path.extname(file.originalname);
      file.originalname= "Audio" + '-' + Daate + '.' + file.originalname.split('.')[file.originalname.split('.').length -1] ;
      cb(null, file.originalname);
  },
});

let uploadFile = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname);
    if(ext !== '.wav') {
        return callback(new Error('Only images are allowed'))
    }
    callback(null, true)
}
}).single("file");

let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;