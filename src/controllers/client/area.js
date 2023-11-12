const Area = require("../../models/Area");
const Hotel = require("../../models/Hotel");
const { randomNumber } = require("../../utils/randomNumber");

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

exports.getThreeRandomAreaWithCountHotel = async (req, res) => {
    try {
        const areas = await Area.find()
        let result = [];
        if (areas.length <= 3) {
            for (let i = 0; i < areas.length; i++) {
                const area = areas[i];
                const numberHotels = await Hotel.find({ area: area._id }).count();
                return {
                    ...area._doc,
                    numberHotels: numberHotels,
                }
            }
            return res.json(result);
        }
        let number = [];
        for (let i = 0; i < 3; i++) {
            const randomPosition = randomNumber(0, areas.length - 1)
            if (!number.includes(randomPosition)) {
                number.push(randomPosition);
                const area = areas[randomPosition];
                const numberHotels = await Hotel.find({ area: area._id }).count();
                result.push({
                    ...area._doc,
                    numberHotels: numberHotels,
                });
            } else {
                i--;
            }
        }
        return res.json(result);
    } catch (error) {
        console.log(error.message);
        return res.status(500).send(JSON.stringify({
            message: "Server Error",
            success: false
        }))
    }
}