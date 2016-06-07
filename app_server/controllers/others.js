module.exports.index = function(req, res) {
    res.render('index', {
        title: 'Express'
    });
};

/* GET 'about' page */
module.exports.about = function(req, res) {
    res.render('generic-text', {
        title: 'About',
        content: 'About - example page '
    });
};

module.exports.angularApp = function(req, res) {
    res.render('layout', {
        title: 'Loc8r'
    });
};