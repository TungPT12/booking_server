const Type = require("../../models/Type");
const Hotel = require("../../models/Hotel");

exports.getNumberHotelByType = async (req, res) => {
    try {
        const { id } = req.params

        const type = await Type.findById(id)
        if (type) {
            const numberHotels = await Hotel.find({ type: id }).count();
            const result = {
                ...type._doc,
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