const Area = require('../../models/Area');
const Hotel = require('../../models/Hotel');
const resultPerPage = 8;

exports.createArea = async (req, res) => {
    try {
        let { name, backgroundImage } = req.body;
        const area = new Area({
            name: name,
            backgroundImage: backgroundImage,
        });
        const result = await area.save();
        if (result) {
            return res.send(JSON.stringify(result));
        }
        return res.status(500).send(JSON.stringify({
            message: "Cannot create area!",
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

exports.getAreaById = async (req, res) => {
    try {
        let { id } = req.params;
        const area = await Area.findById(id)
        if (!area) {
            return res.status(404).json({
                message: "Not found area!",
                success: false,
            });
        }
        return res.send(JSON.stringify(area));
    } catch (error) {
        console.log(error)
        return res.status(500).send(JSON.stringify({
            message: "Server Error",
            success: false
        }))
    }
}

exports.getAreas = async (req, res) => {
    try {
        let { page } = req.query;
        const areas = await Area.find()
        if (page) {
            page = parseInt(page)
            if (areas.length === 0) {
                return res.send(JSON.stringify({
                    page: 0,
                    results: [],
                    pageSize: 0,
                }))
            }
            const total_pages = Math.ceil(areas.length / resultPerPage);
            if (page > total_pages) {
                return res.send(JSON.stringify({
                    errors: `page must be less than or equal to ${total_pages}`,
                    success: false
                }));
            }
            const results = paging(areas, resultPerPage, page)
            return res.send(JSON.stringify({
                page: page ? page : 1,
                results: results,
                total_pages: total_pages
            }))
        }
        return res.json({
            results: areas,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send(JSON.stringify({
            message: "Server Error",
            success: false
        }))
    }
}

exports.updateAreaById = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, backgroundImage } = req.body;
        const area = await Area.findById(id)
        if (!area) {
            return res.status(404).send(JSON.stringify({
                message: "Not found area!",
                success: false,
            }))
        }
        if (name) {
            area.name = name;
        }
        if (backgroundImage) {
            area.backgroundImage = backgroundImage;
        }

        const areaUpdate = await area.save();

        if (areaUpdate) {
            return res.json(areaUpdate);
        }
        return res.status(404).send(JSON.stringify({
            message: "Cannot update area!",
            success: false
        }))
    } catch (error) {
        if (error.message.includes("Cast to ObjectId failed")) {
            return res.status(404).send(JSON.stringify({
                message: "Not Found area",
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

exports.deleteArea = async (req, res) => {
    try {
        const { id } = req.params;
        const isHaveHotel = await Hotel.findOne({
            area: id,
        })
        if (isHaveHotel) {
            return res.status(400).send(JSON.stringify({
                message: "This area have hotels",
                success: true
            }))
        }

        const area = await Area.findById(id);
        if (area) {
            const areaDelete = await area.deleteOne({ _id: id });
            if (areaDelete) {
                return res.sendStatus(200);
            }
            return res.status(400).send(JSON.stringify({
                message: "Cannot delete area",
                success: false
            }))
        }
        return res.status(404).send(JSON.stringify({
            message: "Not Found area",
            success: false
        }))
    } catch (error) {
        if (error.message.includes("Cast to ObjectId failed")) {
            return res.status(404).send(JSON.stringify({
                message: "Not Found area",
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
