class IndexController {
    getHello(req, res) {
        res.json({ message: "Hello, World!" });
    }

    getGoodbye(req, res) {
        res.json({ message: "Goodbye, World!" });
    }
}

module.exports = IndexController;