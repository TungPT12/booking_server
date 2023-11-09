const Room = require("../../models/Room");
const Transaction = require("../../models/Transaction");

exports.getRooByHotelId = async (req, res) => {
    try {
        const { hotelId } = req.params;
        const startDate = new Date(req.query.startDate);
        const endDate = new Date(req.query.endDate);

        if (!hotelId) {
            return res.status(404).send(JSON.stringify({
                message: "Not Found params hotelId!",
                success: false
            }))
        }
        const rooms = await Room.find({ hotelID: hotelId })
        if (!rooms) {
            return res.send(JSON.stringify([]))
        }
        if (rooms.length < 1) {
            return res.send(JSON.stringify([]))
        }

        // Laáy tất cả transaction của khách sạn
        const transactions = await Transaction.find({
            $or: [
                {
                    hotelId: hotelId,
                    status: "booked"
                },
                {
                    hotelId: hotelId,
                    status: 'checkin'
                }
            ]
        })

        // laays cac transaction  trong khoang startDate vaf ednDate
        const transactionsHaveRoomInValid = transactions.filter((transaction) => {
            return startDate >= transaction.dateStart && startDate <= transaction.dateEnd
                || endDate >= transaction.dateStart && endDate <= transaction.dateEnd
                || transaction.dateStart >= endDate && transaction.dateEnd <= startDate
                || transaction.dateEnd >= startDate && transaction.dateEnd <= endDate
        })
        if (transactionsHaveRoomInValid.length < 1) {
            return res.json(rooms)
        }

        // lay tat ca room trong cac transaction
        let allInvAlidRoomNumber = [];
        for (let index = 0; index < transactionsHaveRoomInValid.length; index++) {
            const rooms = transactionsHaveRoomInValid[index].rooms;
            allInvAlidRoomNumber = [...allInvAlidRoomNumber, ...rooms];
            // for (let j = 0; j < rooms.length; j++) {
            //     allInvAlidRoomNumber.push(rooms[j].roomNumber);
            // }
        }
        if (allInvAlidRoomNumber.length < 1) {
            return res.json(rooms);
        }
        let validRooms = []
        for (let roomPosition = 0; roomPosition < rooms.length; roomPosition++) {
            let roomNumbers = rooms[roomPosition].roomNumbers; // số phòng trong room hiện tại;
            const room = rooms[roomPosition]; // phòng hiện tại;
            for (let roomNumbersPosition = 0; roomNumbersPosition < roomNumbers.length; roomNumbersPosition++) {
                if (allInvAlidRoomNumber.includes(roomNumbers[roomNumbersPosition])) {
                    roomNumbers.splice(roomNumbersPosition, 1);
                    roomNumbersPosition--;
                }
            }
            validRooms.push({
                ...room._doc,
                roomNumbers: roomNumbers
            })
        }
        return res.send(JSON.stringify(validRooms))
    } catch (error) {
        console.log(error);
        return res.status(500).send(JSON.stringify({
            message: "Server Error",
            success: false
        }))
    }
}
