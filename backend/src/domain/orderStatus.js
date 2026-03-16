const orderStatus = Object.freeze({
    PENDING:"Pending",
    PROCESSING:"Processing",
    PLACED:"Placed",
    CONFIRM:"Confirm",
    SHIPPED:"Shipped",
    DELIVERED:"Delivered",
    CANCELLED:"Cancelled"
})

module.exports = orderStatus;