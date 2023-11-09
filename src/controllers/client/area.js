const Area = require("../../models/Area");
const Hotel = require("../../models/Hotel");

exports.getNumberHotelInArea = async (req, res) => {
    try {
        const { id } = req.params
        const area = await Area.findById(id)
        if (area) {
            const numberHotels = await Hotel.find({ area: id }).count();
            const result = {
                ...area._doc,
                numberHotels: numberHotels,
            }
            return res.send(JSON.stringify(result));
        }
        return res.status(400).send(JSON.stringify({
            message: "Cannot get areas!",
            success: false
        }))
    } catch (error) {
        console.log(error.message);
        return res.status(500).send(JSON.stringify({
            message: "Server Error",
            success: false
        }))
    }
}  