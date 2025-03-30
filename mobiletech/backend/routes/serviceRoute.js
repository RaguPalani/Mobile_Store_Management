const express = require('express');
const multer = require('multer');
const path = require('path');
const {
    createService,
    getAllServices,
    getServiceById,
    updateService,
    deleteService
} = require('../controllers/serviceController');

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/authenticate');

const router = express.Router();

// Multer setup for file upload (service images)
const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, path.join(__dirname, '..', 'uploads/service'));
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        }
    })
});

// Service Routes
router.route('/admin/service/new').post(isAuthenticatedUser, authorizeRoles('admin'), upload.single('serviceImage'), createService); // Create a new service entry
router.route('/admin/services').get(isAuthenticatedUser, authorizeRoles('admin'), getAllServices); // Get all services
router.route('/admin/service/:id')
    .get(isAuthenticatedUser, authorizeRoles('admin'), getServiceById) // Get a specific service by ID
    .put(isAuthenticatedUser, authorizeRoles('admin'), upload.single('serviceImage'), updateService) // Update service details
    .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteService); // Delete a service

module.exports = router;
