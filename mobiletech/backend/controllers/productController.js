const Product = require('../models/productModel');
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncError = require('../middlewares/catchAsyncError')
const APIFeatures = require('../utils/apiFeatures');

//Get Products - /api/v1/products
exports.getProducts = catchAsyncError(async (req, res, next)=>{
    const resPerPage = 8;
    
    let buildQuery = () => {
        return new APIFeatures(Product.find(), req.query).search().filter()
    }
    
    const filteredProductsCount = await buildQuery().query.countDocuments({})
    const totalProductsCount = await Product.countDocuments({});
    let productsCount = totalProductsCount;

    if(filteredProductsCount !== totalProductsCount) {
        productsCount = filteredProductsCount;
    }
    
    const products = await buildQuery().paginate(resPerPage).query;

    res.status(200).json({
        success : true,
        count: productsCount,
        resPerPage,
        products
    })
})

//Create Product - /api/v1/product/new
exports.newProduct = catchAsyncError(async (req, res, next)=>{
    let images = []
    let BASE_URL = process.env.BACKEND_URL;
    if(process.env.NODE_ENV === "production"){
        BASE_URL = `${req.protocol}://${req.get('host')}`
    }
    
    if(req.files.length > 0) {
        req.files.forEach( file => {
            let url = `${BASE_URL}/uploads/product/${file.originalname}`;
            images.push({ image: url })
        })
    }

    req.body.images = images;

    req.body.user = req.user.id;
    const product = await Product.create(req.body);
    res.status(201).json({
        success: true,
        product
    })
});

//Get Single Product - api/v1/product/:id
exports.getSingleProduct = catchAsyncError(async(req, res, next) => {
    const product = await Product.findById(req.params.id).populate('reviews.user','name email');

    if(!product) {
        return next(new ErrorHandler('Product not found', 400));
    }

    res.status(201).json({
        success: true,
        product
    })
})

//Update Product - api/v1/product/:id
exports.updateProduct = catchAsyncError(async (req, res, next) => {
    let product = await Product.findById(req.params.id);

    //uploading images
    let images = []

    //if images not cleared we keep existing images
    if(req.body.imagesCleared === 'false' ) {
        images = product.images;
    }
    let BASE_URL = process.env.BACKEND_URL;
    if(process.env.NODE_ENV === "production"){
        BASE_URL = `${req.protocol}://${req.get('host')}`
    }

    if(req.files.length > 0) {
        req.files.forEach( file => {
            let url = `${BASE_URL}/uploads/product/${file.originalname}`;
            images.push({ image: url })
        })
    }


    req.body.images = images;
    
    if(!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found"
        });
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        success: true,
        product
    })

})

//Delete Product - api/v1/product/:id
exports.deleteProduct = catchAsyncError(async (req, res, next) =>{
    const product = await Product.findById(req.params.id);

    if(!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found"
        });
    }

    await product.remove();

    res.status(200).json({
        success: true,
        message: "Product Deleted!"
    })

})

/// Create Review - api/v1/review
exports.createReview = catchAsyncError(async (req, res, next) => {
    const { productId, rating, comment } = req.body;

    if (!productId || !rating) {
        return next(new ErrorHandler("Product ID and rating are required", 400));
    }

    const product = await Product.findById(productId);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    const review = {
        user: req.user.id,
        rating: Number(rating),
        comment: comment || ""
    };

    // Check if user already reviewed the product
    const isReviewed = product.reviews.find(review => review.user.toString() === req.user.id.toString());

    if (isReviewed) {
        product.reviews.forEach(review => {
            if (review.user.toString() === req.user.id.toString()) {
                review.comment = comment;
                review.rating = Number(rating);
            }
        });
    } else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    // Calculate new ratings
    product.ratings = product.reviews.reduce((acc, review) => review.rating + acc, 0) / product.numOfReviews;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
        message: "Review added/updated successfully"
    });
});

// Get Reviews - api/v1/reviews
exports.getReviews = catchAsyncError(async (req, res, next) => {
    const { id, name } = req.query;

    let product;

    if (id) {
        product = await Product.findById(id).populate("reviews.user", "name email");
    } else if (name) {
        product = await Product.findOne({ name: { $regex: name, $options: "i" } }).populate("reviews.user", "name email");
    } else {
        return next(new ErrorHandler("Please provide a product ID or name", 400));
    }

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    const reviewsWithProductInfo = product.reviews.map(review => ({
        _id: review._id,
        rating: review.rating,
        comment: review.comment,
        user: review.user,
        productName: product.name
    }));

    res.status(200).json({
        success: true,
        reviews: reviewsWithProductInfo
    });
});

// Delete Review - api/v1/review
exports.deleteReview = catchAsyncError(async (req, res, next) => {
    const { productId, id: reviewId } = req.query;

    const product = await Product.findById(productId);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    // Filter out the review to delete
    const updatedReviews = product.reviews.filter(review => review._id.toString() !== reviewId);

    if (product.reviews.length === updatedReviews.length) {
        return next(new ErrorHandler("Review not found", 404));
    }

    product.reviews = updatedReviews;
    product.numOfReviews = updatedReviews.length;

    // Update the ratings
    product.ratings = updatedReviews.length > 0
        ? updatedReviews.reduce((acc, review) => review.rating + acc, 0) / updatedReviews.length
        : 0;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
        message: "Review deleted successfully"
    });
});

// get admin products  - api/v1/admin/products
exports.getAdminProducts = catchAsyncError(async (req, res, next) =>{
    const products = await Product.find();
    res.status(200).send({
        success: true,
        products
    })
});