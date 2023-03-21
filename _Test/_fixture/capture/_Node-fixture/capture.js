module.exports = {
    size: capture => {
        capture.page.array.push('/about.html');
    },
    page: capture => {
        if(capture.page.name === "/faq/index.html"){
            it('test', async () => {
                await capture.screenshot.call();
            });
        }

        if(capture.page.index === 3){
            it('test', async () => {
                await capture.screenshot.call(true);
            });
        }
    }
};