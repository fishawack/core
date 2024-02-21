module.exports = {
    // This is called right after the viewport has been resized before the pages are iterated over
    size: function(capture){
        it(`screen: ${capture.size.index}`, () => {
        });
    },
    // This is called after the standard page capture has happened on each page
    page: function(capture){
        it(`page: ${capture.page.index}`, () => {
        });
    }
};