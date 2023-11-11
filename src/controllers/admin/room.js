const Hotel = require('../../models/Hotel');
const Room = require('../../models/Room');
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