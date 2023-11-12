const Hotel = require('../../models/Hotel');
const Room = require('../../models/Room');
const Transaction = require('../../models/Transaction');
const paging = require('../../utils/paging')

const resultPerPage = 8;

exports.createRoom = async (req, res) => {
    try {
        let { title, price, maxPeople, desc, roomNumbers, hotelID } = req.body;
        const room = new Room({
            title: title,
            price: price,
            maxPeople: maxPeople,
            desc: desc,
            roomNumbers: roomNumbers,
            hotelID: hotelID,
        });
        const hotel = await Hotel.findById(hotelID);
        const result = await room.save();
        hotel.rooms = [...hotel.rooms, result._id];
        hotel.save();
        if (result) {
            return res.send(JSON.stringify(result));
        }
        return res.status(500).send(JSON.stringify({
            message: "Cannot create room!",
            success: false
        }))
    } catch (error) {
        console.log(error)
        return res.status(500).send(JSON.stringify({
            message: "Server Error",
            success: false
        }))
    }
}

exports.getRooms = async (req, res) => {
    try {
        let { page } = req.query
        if (page) {
            page = parseInt(page)
        }
        const rooms = await Room.find()
        if (page) {
            if (rooms.length === 0) {
                return res.send(JSON.stringify({
                    page: 0,
                    results: [],
                    pageSize: 0,
                }))
            }
            const total_pages = Math.ceil(rooms.length / resultPerPage);
            if (page > total_pages) {
                return res.send(JSON.stringify({
                    errors: `page must be less than or equal to ${total_pages}`,
                    success: false
                }));
            }
            const results = paging(rooms, resultPerPage, page)
            return res.send(JSON.stringify({
                page: page ? page : 1,
                results: results,
                total_pages: total_pages
            }))
        }
        return res.send(JSON.stringify({
            results: rooms,
        }))
    } catch (error) {
        console.log(error);
        return res.status(500).send(JSON.stringify({
            message: "Server Error",
            success: false
        }))
    }
}

exports.getRoomById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(404).send(JSON.stringify({
                message: "Not found id params!",
                success: false
            }));
        };
        const room = await Room.findById(id);

        if (!room) {
            return res.status(404).send(JSON.stringify({
                message: "Not found room!",
                success: false
            }));
        };

        return res.json(room);

    } catch (error) {
        console.log(error);
        return res.status(500).send(JSON.stringify({
            message: "Server Error",
            success: false
        }));
    }
}

exports.deleteRoomById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).send(JSON.stringify({
                message: "Not found id params!",
                success: false
            }));
        }

        const room = await Room.findById(id);
        if (!room) {
            return res.status(404).send(JSON.stringify({
                message: "Not found room!",
                success: false
            }));
        }

        const hotelId = room.hotelID;
        const roomNumbersInRoom = room.roomNumbers;

        const transactions = await Transaction.find({
            $or: [
                {
                    hotelId: hotelId,
                    status: 'booked'
                },
                {
                    hotelId: hotelId,
                    status: 'checkin'
                },
            ]
        })

        let isDelete = true;

        if (transactions.length > 0) {
            for (let transactionPosition = 0; transactionPosition < transactions.length; transactionPosition++) {
                const transaction = transactions[transactionPosition];
                const roomNumbersWasBookedOrCheckin = transaction.rooms;
                roomNumbersWasBookedOrCheckin.forEach((roomNumberWasBookedOrCheckin) => {
                    if (roomNumbersInRoom.includes(roomNumberWasBookedOrCheckin)) {
                        isDelete = false;
                    }
                })
                if (!isDelete) {
                    break;
                }
            }
        }

        if (!isDelete) {
            return res.status(400).send(JSON.stringify({
                message: "This room is booking or checkin cannot delete!",
                success: false
            }))
        }

        const deletedRoom = await Room.deleteOne({
            _id: id
        });

        if (deletedRoom.deletedCount <= 0) {
            return res.status(400).send(JSON.stringify({
                message: "Something went wrong when delete room!",
                success: false
            }));
        }

        return res.sendStatus(200);

    } catch (error) {
        if (error.message.includes("Cast to ObjectId failed")) {
            return res.status(404).send(JSON.stringify({
                message: "Not Found Room",
                success: false
            }))
        }
        console.log(error.message);
        return res.status(500).send(JSON.stringify({
            message: "Server Error",
            success: false
        }))
    }
}

exports.updateRoomById = async (req, res) => {
    try {
        const { id, title, price, maxPeople, desc, roomNumbers } = req.body;

        if (!id) {
            return res.status(400).send(JSON.stringify({
                message: "Not found id params!",
                success: false
            }));
        }
        const room = await Room.findById(id);

        if (!room) {
            return res.status(404).send(JSON.stringify({
                message: "Not found room!",
                success: false
            }));
        }

        room.title = title;
        room.price = price;
        room.maxPeople = maxPeople;
        room.desc = desc;
        room.roomNumbers = roomNumbers;

        const roomUpdated = await room.save();
        if (roomUpdated) {
            return res.json(roomUpdated);
        }

        return res.status(400).send(JSON.stringify({
            message: "Cannot update room!",
            success: false
        }));

    } catch (error) {
        if (error.message.includes("Cast to ObjectId failed")) {
            return res.status(404).send(JSON.stringify({
                message: "Not Found Area",
                success: false
            }))
        }
        console.log(error.message);
        return res.status(500).send(JSON.stringify({
            message: "Server Error",
            success: false
        }))
    }
}