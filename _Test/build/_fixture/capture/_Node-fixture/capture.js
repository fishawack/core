module.exports = {
    size: capture => {
        capture.page.array.push('/about.html');
    },
    page: capture => {
        if(capture.page.name === "/faq/index.html"){
            it('screenshot', async () => {
                await capture.screenshot.call();
            });
        }

        if(capture.page.index === 3){
            it('screenshot viewport only', async () => {
                await capture.screenshot.call(true);
            });
        }

        if(capture.page.index === capture.page.array.length - 2){
            it('set state', async () => {
                await browser.execute(() => window.localStorage.setItem('hasState', true));
            });
        }

        if(capture.page.index === capture.page.array.length - 1){
            it('get state', async () => {
                if(await browser.execute(() => window.localStorage.getItem('hasState'))){
                    capture.page.slug = 'state';
                    await capture.screenshot.call(true);
                }
            });
        }
    }
};