const Hotel = require('../../models/Hotel');
const Transaction = require('../../models/Transaction');
const { searchByArea, searchRoomByDate, searchByPeople } = require('../../utils/searchHotels');

exports.getTopThreeRatingHotel = async (req, res) => {
    try {
        const hotel = await Hotel.find().select('_id name photos area rating').populate({ path: 'area', select: '-_id name' })
            .sort({ rating: -1 });
        if (hotel.length <= 3) {
            return res.send(JSON.stringify(hotel));
        }
        return res.send(JSON.stringify([hotel[0], hotel[1], hotel[2]]));
    } catch (error) {
        console.log(error);
        return res.status(500).send(JSON.stringify({
            message: "Server Error",
            success: false
        }))
    }
}


exports.getHotelById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(404).send(JSON.stringify({
                message: "Not Found params id!",
                success: false
            }))
        }
        const hotel = await Hotel.findOne({ _id: id })
            .populate({ path: 'area', select: '-_id name' })
            .populate('type')
            .populate({ path: 'rooms' });
        if (hotel) {
            return res.send(JSON.stringify(hotel))
        }
        return res.status(404).send(JSON.stringify({
            message: "Not Found hotel!",
            success: false
        }))
    } catch (error) {
        console.log(error);
        return res.status(500).send(JSON.stringify({
            message: "Server Error",
            success: false
        }))
    }
}

exports.searchHotels = async (req, res) => {
    try {
        const { area, startDate, endDate, minPrice, maxPrice, people } = req.query;
        const hotels = await Hotel.find().populate({ path: 'area' }).populate('type').populate('rooms');

        const hotelsHaveRoom = hotels.filter((hotel) => {
            return hotel.rooms.length > 0;
        })


        if (hotelsHaveRoom.length <= 0) {
            return res.json([])
        }

        const resultList = searchByArea(area, hotelsHaveRoom);
        if (resultList.length <= 0) {
            return res.json([])
        }

        // lấy list id hotel
        const listHotelId = resultList.map((hotel) => {
            return hotel._id;
        })

        // lấy các transaction có hotel id
        const transactions = await Transaction.find({
            $or: [
                {
                    hotelId: listHotelId,
                    status: "booked"
                },
                {
                    hotelId: listHotelId,
                    status: 'checkin'
                }
            ]
        })

        const filterHotelHaveValidRoom = searchRoomByDate(resultList, transactions, startDate, endDate);

        const filterByMaxPeople = searchByPeople(people, filterHotelHaveValidRoom);

        return res.json(filterByMaxPeople);
    } catch (error) {
        console.log(error);
        return res.status(500).send(JSON.stringify({
            message: "Server Error",
            success: false
        }))
    }
}





