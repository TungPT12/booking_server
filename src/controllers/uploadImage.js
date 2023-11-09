exports.uploadImage = (req, res) => {
    try {
        const file = req.file;
        const urlImage = `${req.protocol}://${req.get('host')}/images/${file.filename}`;
        return res.send(JSON.stringify({
            urlImage: urlImage,
            success: true
        }))
    } catch (error) {
        console.log(error.message);
        return res.status(500).send(JSON.stringify({
            message: "Server Error",
            success: false
        }))
    }
}