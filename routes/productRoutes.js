import express from 'express';
const router = express.Router();
import multer from 'multer';

import { createProduct, deleteProduct, featuredProducts, getProductById, getProducts, productsCount, updateProduct, uploadImageGallery } from '../controllers/productController.js';
import { protect } from '../middleware/authMiddleware.js';

const FILE_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error('invalid image type');

    if (isValid) {
      uploadError = null;
    }
    cb(uploadError, 'public/uploads');
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(' ').join('-');
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  }
});

const uploadOptions = multer({ storage: storage });

router.route(`/`)
  .get(getProducts)
  .post(protect, uploadOptions.single('image'), createProduct);
router.route(`/:id`)
  .get(getProductById)
  .put(protect, uploadOptions.single('image'), updateProduct)
  .delete(deleteProduct)
router.put('/gallery-images/:id', protect, uploadOptions.array('images', 10), uploadImageGallery)
router.get(`/get/count`, protect, productsCount);
router.get(`/get/featured/:count?`, featuredProducts);

export default router;
