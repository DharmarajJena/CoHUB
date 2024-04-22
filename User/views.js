
const Razorpay = require('razorpay');
const { User, Project, Product, Order } = require('./models');
const shortid = require('shortid');
require('dotenv').config();
const crypto = require('crypto');
const { error } = require('console');

const userRegistration = async (req, res) => {

    try {

        data = req.body;
        const newUser = new User(data);
        newUser.email = req.firebaseUser.email;
        newUser.userId = req.firebaseUser.user_id;

        const response = await newUser.save();

        return res.status(200).json({ message: "Registration successfull" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const startProject = async (req, res) => {

    try {

        data = req.body;
        const newProject = new Project(data);
        newProject.userID = req.firebaseUser.user_id;
        const response = await newProject.save();
        return res.status(200).json({ data: response });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const getOwnProjects = async (req, res) => {
    try {
        const projects = await Project.find({ userID: req.firebaseUser.user_id });

        if (!projects)
            return res.status(404).json({ message: "No projects found!" });

        return res.status(201).json(projects);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const getProjectDetails = async (req, res) => {

    try {
        id = req.params.projectID;
        const project = await Project.findById(id);
        if (!project)
            return res.status(204).json({ message: "Candidate not found" });
        return res.status(200).json(project);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const addProduct = async (req, res) => {
    try {
        // Parse body data assuming 'req.body' has already been parsed as JSON by body-parser middleware
        let data = req.body;

        // Check if 'pickup_location' is in string format and parse it
        if (typeof data.pickup_location === 'string') {
            data.pickup_location = JSON.parse(data.pickup_location);
        }

        // Now create a new product instance with the parsed data
        const newProduct = new Product(data);

        // Handle file upload
        if (req.file) {
            newProduct.image = req.file.path;
        } else {
            return res.status(400).json({ error: 'No image uploaded' });
        }

        // Handle user data from Firebase authentication
        if (req.firebaseUser && req.firebaseUser.user_id) {
            newProduct.userID = req.firebaseUser.user_id;
        } else {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        // Save the new product to the database
        const response = await newProduct.save();
        return res.status(200).json({ data: response });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const getOwnAvailableProduct = async (req, res) => {
    try {
        const product = await Product.find({ userID: req.firebaseUser.user_id, available: true });

        if (!product)
            return res.status(404).json({ message: "No product found!" });

        return res.status(201).json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const getAllProduct = async (req, res) => {
    try {
        const longitude = parseFloat(req.headers.longitude);
        const latitude = parseFloat(req.headers.latitude);
        const product = await Product.aggregate([
            {
                $geoNear: {
                    near: {
                        type: 'Point',
                        coordinates: [longitude, latitude]
                    },
                    distanceField: 'distance', // This field will contain the distance
                    maxDistance: 5000,
                    spherical: true,
                    query: { available: true } // Additional query to filter by 'available'
                }
            }
        ]);

        if (!product.length)
            return res.status(404).json({ message: "No product found!" });

        return res.status(201).json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const getProductDetails = async (req, res) => {

    try {
        id = req.params.productID;
        const product = await Product.findById(id);
        if (!product)
            return res.status(204).json({ message: "Product not found" });
        return res.status(200).json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

//create razorpay client/instance
var razorpay_client = new Razorpay({
    key_id: process.env.RZP_KEY,
    key_secret: process.env.RZP_SECRET,
});

const getBuyOrderSummary = async (req, res) => {
    try {
        const id = req.params.productID;
        const product_details = await Product.findById(id);

        if (!product_details) {
            return res.status(404).json({ message: "Product not found" });
        }

        let amount = 0;
        let numberOfDaysOfRenting = 0;

        if (req.body.type === 'buy') {
            amount = product_details.selling_price;
        } else {
            const order_date = new Date(); // Current date-time
            const return_date = new Date(req.body.returnDate);

            if (isNaN(return_date.getTime())) {
                return res.status(400).json({ message: "Invalid or missing return date." });
            }

            const differenceInTime = return_date.getTime() - order_date.getTime();
            numberOfDaysOfRenting = Math.ceil(differenceInTime / (1000 * 3600 * 24)); // Use Math.ceil to round up the days

            if (numberOfDaysOfRenting < 1) {
                return res.status(400).json({ message: "Return date must be after the order date." });
            }

            amount = product_details.rentPrice_perDay * numberOfDaysOfRenting;
        }

        const options = {
            amount: Math.round(amount * 100), // Convert to smallest currency unit
            currency: 'INR',
            receipt: shortid.generate(),
            payment_capture: 1
        };

        const response = await razorpay_client.orders.create(options);

        const data = {
            ...req.body,
            price: amount,
            userID: req.firebaseUser.user_id,
            productID: id,
            sellerID: product_details.userID,
            orderId: response.id,
            rentDurationDays: numberOfDaysOfRenting
        };

        const order = new Order(data);
        const savedOrder = await order.save();

        return res.status(200).json({
            ...savedOrder.toObject(), // Convert Mongoose document to plain object
            order_id: response.id,
            currency: response.currency,
            amount: response.amount
        });

    } catch (error) {
        console.error(error);
        return res.status(501).json({ message: "Razorpay error" });
    }
}


const paymentSuccess = async (req, res) => {
    try {
        const { orderId, paymentId } = req.body;

        console.log(orderId);
        const order = await Order.findById(orderId);
        if (!order) {
            // If no order found, return 404
            return res.status(404).json({ message: "No order exists with the provided ID." });
        }

        // Update the paymentId field
        order.paymentId = paymentId;

        // Save the updated order
        const response = await order.save();

        var product_id = req.params.productID;

        response = await Product.findById(product_id);

        response.available = false;

        response.save();

        // Return success message
        return res.status(201).json({ message: "Payment ID added successfully." });

    } catch (error) {
        console.error(error);
        // Return error message
        return res.status(500).json({ message: "Internal server error" });
    }
}

//Razorpay webhook url
const paymentCompleteWebHook = async (req, res) => {

    try {

        const secret = process.env.RZP_WEBHOOK_SECRET;

        console.log(req.body)

        const shasum = crypto.createHmac('sha256', secret);
        shasum.update(JSON.stringify(req.body));
        const digest = shasum.digest('hex');

        if (digest === req.headers['x-razorpay-signature']) {
            if (req.body.event === 'payment.captured') {

                receivedOrderId = req.body.payload.payment.entity.order_id;
                receivedPaymentId = req.body.payload.payment.entity.id;

                const order = await Order.findOne({ orderId: receivedOrderId });

                order.status = "completed";
                order.paymentId = receivedPaymentId;

                await order.save();

                return res.status(202).json({ message: "Payment details saved in db." });

            }
            return res.status(421).json({ message: "Payment is not captured." })
        }

        return res.status(403).json({ message: "Request headers not correct." })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "internal server error" });
    }
}

const getRentedProducts = async (req, res) => {
    try {
        let rented_products = await Product.aggregate([
            {
                $match: {
                    available: false,
                    userID: req.firebaseUser.user_id
                }
            },
            {
                $lookup: {
                    from: 'orders',
                    localField: '_id',
                    foreignField: 'productID',
                    as: 'orders'
                }
            },
            {
                $unwind: '$orders'
            },
            {
                $match: {
                    'orders.type': 'rent',
                    'orders.returned': false,
                    $expr: { $eq: ["$userID", "$orders.sellerID"] }
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    image: 1,
                    rentPrice_perDay: 1,
                    available: 1,
                    'orders.returnDate': 1,
                    'orders.orderDate': 1,
                    'orders.rentDurationDays': 1,
                    'orders.userID': 1,
                    'orders._id':1,
                    'orders.returned':1
                }
            }
        ]);

        rented_products = await rented_products.reduce(async (accPromise, curr) => {
            const acc = await accPromise;
            const buyer = await User.findOne({ userId: curr.orders.userID });
            if (buyer) {
                acc.push({
                    buyer_name: buyer.name,
                    buyer_number: buyer.mobile_no,
                    ...curr
                });
            }
            return acc;
        }, Promise.resolve([]));

        if (!rented_products.length) {
            return res.status(404).json({ message: "Data not found!" });
        }
        return res.status(200).json(rented_products);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error." });
    }
}

const updateReturnStatus = async (req, res) => {
    try {
        const order_id = req.params.orderID;
        const order = await Order.findById(order_id);
        console.log("log1");
        // Check if order exists and is not a 'buy' type order
        if (!order || order.type === 'buy') {
            return res.status(404).json({ message: "Order does not exist or product is already purchased." });
        }
        var id=order.productID;
        const product = await Product.findById(id);

        // Check if product exists
        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }

        // Update the order and product statuses
        order.returned = true;
        await order.save(); // Ensure save completes before moving on

        product.available = true;
        await product.save(); // Ensure save completes before moving on

        // Send a success response
        return res.status(200).json({ message: "Return processed successfully." });
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error." });
    }
}


module.exports = {
    userRegistration, startProject, getOwnProjects, addProduct, getOwnAvailableProduct,
    getAllProduct, getProductDetails, getProjectDetails, getBuyOrderSummary, paymentSuccess, paymentCompleteWebHook,
    getRentedProducts,updateReturnStatus
};