const Hotel = require('../../models/Hotel');
const Type = require('../../models/Type');
const resultPerPage = 8;

exports.createType = async (req, res) => {
    try {
        let { name, image } = req.body;
        const type = new Type({
            name: name,
            image: image,
        });
        const result = await type.save();
        if (result) {
            return res.send(JSON.stringify(result));
        }
        return res.status(500).send(JSON.stringify({
            message: "Cannot create type!",
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

exports.getTypes = async (req, res) => {
    try {
        let { page } = req.query;
        const types = await Type.find()
        if (page) {
            page = parseInt(page)
            if (types.length === 0) {
                return res.send(JSON.stringify({
                    page: 0,
                    results: [],
                    pageSize: 0,
                }))
            }
            const total_pages = Math.ceil(types.length / resultPerPage);
            if (page > total_pages) {
                return res.send(JSON.stringify({
                    errors: `page must be less than or equal to ${total_pages}`,
                    success: false
                }));
            }
            const results = paging(types, resultPerPage, page)
            return res.send(JSON.stringify({
                page: page ? page : 1,
                results: results,
                total_pages: total_pages
            }))
        }
        return res.json({
            results: types,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send(JSON.stringify({
            message: "Server Error",
            success: false
        }))
    }
}

exports.deleteType = async (req, res) => {
    try {
        const { id } = req.params;
        const isHaveHotel = await Hotel.findOne({
            type: id,
        })
        if (isHaveHotel) {
            return res.status(400).send(JSON.stringify({
                message: "This type have hotels",
                success: true
            }))
        }

        const type = await Type.findById(id);
        if (type) {
            const typeDelete = await Type.deleteOne({ _id: id });
            if (typeDelete) {
                return res.sendStatus(200);
            }
            return res.status(400).send(JSON.stringify({
                message: "Cannot delete type",
                success: false
            }))
        }
        return res.status(404).send(JSON.stringify({
            message: "Not Found type",
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

exports.getTypeById = async (req, res) => {
    try {
        let { id } = req.params;
        const type = await Type.findById(id)
        if (!type) {
            return res.status(404).json({
                message: "Not found type!",
                success: false,
            });
        }
        return res.send(JSON.stringify(type));
    } catch (error) {
        console.log(error)
        return res.status(500).send(JSON.stringify({
            message: "Server Error",
            success: false
        }))
    }
}

exports.updateTypeById = async (req, res) => {
    try {
        const { id, name, image } = req.body;
        const type = await Type.findById(id)
        if (!type) {
            return res.status(404).send(JSON.stringify({
                message: "Not found type!",
                success: false,
            }))
        }
        if (name) {
            type.name = name;
        }
        if (image) {
            type.image = image;
        }

        const typeUpdate = await type.save();

        if (typeUpdate) {
            return res.json(typeUpdate);
        }
        return res.status(404).send(JSON.stringify({
            message: "Cannot update type!",
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
