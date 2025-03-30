const Service = require('../models/Service');
const catchAsyncError = require('../middlewares/catchAsyncError');

// Create a new service entry
exports.createService = catchAsyncError(async (req, res) => {
    const { mobileName, username, phoneNumber, complaintDetails, mobileColor, status, updation } = req.body;

    let serviceImage;
    let BASE_URL = process.env.BACKEND_URL;
    if (process.env.NODE_ENV === "production") {
        BASE_URL = `${req.protocol}://${req.get('host')}`;
    }

    if (req.file) {
        serviceImage = `${BASE_URL}/uploads/service/${req.file.originalname}`;
    }

    // Validate required fields
    if (!mobileName || !username || !phoneNumber || !complaintDetails || !mobileColor) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Create a new service record
    const service = await Service.create({
        mobileName,
        username,
        phoneNumber,
        complaintDetails,
        mobileColor,
        status: status || 'Pending', // Default status
        serviceDate: new Date(), // Automatically set to current date
        updation: updation || [], // Default empty array for updates
        serviceImage
    });

    res.status(201).json({
        success: true,
        message: "Service request created successfully",
        service,
    });
});

// Get all service entries
exports.getAllServices = catchAsyncError(async (req, res) => {
    const services = await Service.find().sort({ serviceDate: -1 }); // Sort by service date

    res.status(200).json({
        success: true,
        count: services.length,
        services,
    });
});

// Get a single service by ID
exports.getServiceById = catchAsyncError(async (req, res) => {
    const service = await Service.findById(req.params.id);

    if (!service) {
        return res.status(404).json({ success: false, message: "Service not found" });
    }

    res.status(200).json({
        success: true,
        service,
    });
});

// Update a service entry
exports.updateService = catchAsyncError(async (req, res) => {
    const { mobileName, username, phoneNumber, complaintDetails, mobileColor, status, updation } = req.body;

    let updatedService = await Service.findById(req.params.id);

    if (!updatedService) {
        return res.status(404).json({ success: false, message: "Service not found" });
    }

    let serviceImage = updatedService.serviceImage;
    if (req.file) {
        let BASE_URL = process.env.BACKEND_URL;
        if (process.env.NODE_ENV === "production") {
            BASE_URL = `${req.protocol}://${req.get('host')}`;
        }
        serviceImage = `${BASE_URL}/uploads/service/${req.file.originalname}`;
    }

    updatedService = await Service.findByIdAndUpdate(req.params.id, {
        mobileName,
        username,
        phoneNumber,
        complaintDetails,
        mobileColor,
        status,
        updation,
        serviceImage
    }, { new: true });

    res.status(200).json({
        success: true,
        message: "Service details updated successfully",
        updatedService,
    });
});

// Delete a service entry
exports.deleteService = catchAsyncError(async (req, res) => {
    const service = await Service.findById(req.params.id);

    if (!service) {
        return res.status(404).json({ success: false, message: "Service not found" });
    }

    await service.deleteOne();

    res.status(200).json({
        success: true,
        message: "Service deleted successfully",
    });
});