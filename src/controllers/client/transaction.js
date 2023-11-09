const Transaction = require("../../models/Transaction");

exports.createTransaction = async (req, res) => {
    try {
        const { username, fullName, rooms, dateStart, dateEnd, price, payment, hotelId } = req.body;

        if (!username && !fullName && !rooms && !endDate && !startDate && !price && !payment) {
            return res.status(404).send(JSON.stringify({
                message: "Some params Not Found id!",
                success: false
            }))
        }
        const transaction = new Transaction({
            username: username,
            fullName: fullName,
            rooms: rooms,
            dateStart: dateStart,
            dateEnd: dateEnd,
            price: price,
            payment: payment,
            status: 'booked',
            hotelId: hotelId,
            userId: req.userId,
            createDate: new Date()
        })
        const result = await transaction.save()
        if (result) {
            return res.send(JSON.stringify(result))
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send(JSON.stringify({
            message: "Server Error",
            success: false
        }))
    }
}

exports.getTransactions = async (req, res) => {
    try {
        const userId = req.userId;
        const transactions = await Transaction.find({ userId: userId }).populate({ path: 'hotelId', select: 'name' });
        if (!transactions) {
            return res.status(400).send(JSON.stringify({
                message: "Cannot get transactions ! ",
                success: false
            }))
        }
        return res.json(transactions);
    } catch (error) {
        console.log(error);
        return res.status(500).send(JSON.stringify({
            message: "Server Error",
            success: false
        }))
    }
}
