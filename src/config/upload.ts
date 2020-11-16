import path from 'path';
import multer from 'multer';
import crypto from 'crypto';

const tempFolder = path.resolve(__dirname, '..', '..', 'tmp');

export default {
  directory: tempFolder,

  storage: multer.diskStorage({
    destination: tempFolder,
    filename(req, file, cb) {
      const uniqueSuffix = crypto.randomBytes(10).toString('hex');
      const fileName = `${uniqueSuffix}-${file.originalname}`;
      return cb(null, fileName);
    }
  })
}
