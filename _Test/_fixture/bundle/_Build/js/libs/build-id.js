if(process.env.NODE_ENV === "production"){
    let uuid = document.documentElement.dataset.build;
    let last = window.localStorage.getItem(`${process.env.REPO_NAME}-build-id`);

    if(!last){
        console.log("no build detected - setting");
        window.localStorage.clear();
        window.localStorage.setItem(`${process.env.REPO_NAME}-build-id`, uuid);
    } else if(uuid !== last) {
        console.log("new build detected - resetting storage");
        window.localStorage.clear();
        window.localStorage.setItem(`${process.env.REPO_NAME}-build-id`, uuid);
    }
}