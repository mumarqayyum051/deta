const express = require("express");
const multer = require("multer");
const path = require("path");
const sharp = require("sharp");
const filePath = path.join(process.cwd(), "public", "images");
const { BadRequestResponse } = require("express-http-response");
const httpResponse = require("express-http-response");
const app = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(httpResponse.Middleware);
app.use(express.static("public/images"));
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, filePath);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname),
    );
  },
});

const upload = multer({
  storage: storage,
});

app.post("/", upload.single("image"), (req, res, next) => {
  const file = req.file;
  console.log(file);
  if (!file) {
    return next(new BadRequestResponse("Please upload a file", 404));
  }

  const saveTo = path.join(__dirname, "public", "compressed", ".jpeg");
  console.log(saveTo);
  sharp(req.file.path)
    .resize(320, 480)
    .jpeg({ quality: 80, chromaSubsampling: "4:4:4" })
    .toFile(saveTo, function (err, file) {
      if (err) {
        console.log(err);
        res.json(err);
      } else {
        console.log(file);
        res.json(file);
      }
    });
});

app.listen(3000, function () {
  console.log("Server is listening on port 3000");
});
