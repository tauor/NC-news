const {selectTopics} = require('../model/model.js')


exports.getTopics = (req, res) => {
    selectTopics().then((topics) => {
        res.status(200).send({topics});
    })
}

