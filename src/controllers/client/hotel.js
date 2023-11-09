const Hotel = require('../../models/Hotel');

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




