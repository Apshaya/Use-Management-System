const Customer = require('../Models/Customer');
const mongoose = require('mongoose');


/**
 * GET/
 * HOME PAGE
 */

exports.homepage = async(req,res) => {

    const messages = await req.flash("info");
        const locals = {
            title: "Nodejs",
            description: "Free Nodejs User Management System",
        }

        let perPage = 8;
        let page = req.query.page || 1;

    try {
        const customers = await Customer.aggregate([ { $sort: { updatedAt: -1 } } ])
          .skip(perPage * page - perPage)
          .limit(perPage)
          .exec();

        const count = await Customer.countDocuments({});

        res.render('index', {
            locals,
            customers,
            current: page,
            pages: Math.ceil(count / perPage),
            messages,
        });

    } catch (error) {
        console.log(error);
    }
    
};

// exports.homepage = async(req,res) => {

//     const messages = await req.flash("info");
//         const locals = {
//             title: 'Nodejs',
//             description: 'Free Nodejs User Management System'
//         }
//     try {
//         const customers = await Customer.find({}).limit(22);
//         res.render('index', {locals, messages, customers});

//     } catch (error) {
//         console.log(error);
//     }
    
// }

/**
 * GET/
 * About
 */

exports.about = async(req,res) => {
        const locals = {
            title: 'About',
            description: 'Free Nodejs User Management System'
        }
    try {
        res.render('about', locals);
    } catch (error) {
        console.log(error);
    }
    
}


/**
 * GET/
 * NEW CUSTOMER FORM
 */

exports.addCustomer = async(req,res) => {

    const locals = {
        title: 'Add New Customer - Nodejs',
        description: 'Free Nodejs User Management System'
    }

    res.render('customer/add', locals);

}

/**
 * POST/
 * CREATE NEW CUSTOMER 
 */

exports.postCustomer = async(req,res) => {
    console.log(req.body);

    const newCustomer = new Customer({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        tel: req.body.tel,
        email: req.body.email,
        details: req.body.details
    });
   
    try {

        await Customer.create(newCustomer);
        await req.flash('info', 'New customer has been added.')

        res.redirect('/');
        }catch (error) {
        console.log(error);
        }

}

/**
 * GET/
 * Customer Data
 */

exports.view = async(req,res) => {

    try {
        const customer = await Customer.findOne({ _id: req.params.id });

        const locals = {
            title: "View Customer Data",
            description: "Free Nodejs User Management System",
        };

        res.render("customer/view", {
            locals,
            customer
        });
    }catch (error) {
        console.log(error);
    }
};


/**
 * GET/
 * Edit Customer Data
 */

exports.edit = async(req,res) => {

    try {
        const customer = await Customer.findOne({ _id: req.params.id });

        const locals = {
            title: "Edit Customer Data",
            description: "Free Nodejs User Management System",
        };

        res.render("customer/edit", {
            locals,
            customer
        });
    }catch (error) {
        console.log(error);
    }
};

/**
 * GET/
 * Update Customer Data
 */

exports.editPost = async(req,res) => {
    try {
        await Customer.findByIdAndUpdate(req.params.id, {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            tel: req.body.tel,
            email: req.body.email,
            details: req.body.details,
            updateAt: Date.now(),
        });
        await res.redirect(`/edit/${req.params.id}`);

        console.log("redirected");
    } catch (error) {
        console.log(error);
    }  
};

/**
 * Delete/
 * Delete Customer Data
 */

exports.deleteCustomer = async(req,res) => {
    try {
        await Customer.deleteOne({ _id: req.params.id});
        res.redirect("/")
    } catch (error) {
        console.log(error);
    } 
};

/**
 * GET/
 * Search Customer Data
 */

exports.searchCustomers = async(req,res) => {

    const locals = {
        title: "Search Customer Data",
        description: "Free Nodejs User Management System",
    };
    
try {

    let searchTerm = req.body.searchTerm;
    const searchNoSpecialchar = searchTerm.replace(/[^a-zA-Z0-9 ]/g,)

    const customers = await Customer.find({
       $or:  [
         { firstName: { $regex: new RegExp(searchNoSpecialchar, "i") }},
         { lastName: { $regex: new RegExp(searchNoSpecialchar, "i") }},

             ]
        });

        res.render("search", {
            customers,
            locals
        })
    
} catch (error) {
    console.log(error);
}
};
