function url_join() {
    return new URL(
        require("path").join(...[].slice.call(arguments, 1)),
        arguments[0]
    ).toString();
}

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const packages = [
    {
        name: "pdf",
        capture: true,
        zips: [],
    },
    {
        name: "app",
        zips: [
            {
                cwd: "_Output/",
            },
        ],
    },
    {
        name: "handover",
    },
    {
        name: "veeva",
        capture: true,
        zips: [
            {
                src: ["**", "!**/ctlfile/**/*", "!**/ctlfile"],
            },
        ],
    },
    {
        name: "cegedim",
        capture: true,
    },
    {
        name: "vablet",
    },
    {
        name: "electron",
        zips: [
            {
                name: "mac",
                cwd: "_Packages/Electron/<%= repo.name %>-darwin-x64/",
            },
            {
                name: "win",
                cwd: "_Packages/Electron/<%= repo.name %>-win32-x64/",
            },
        ],
    },
    {
        name: "phonegap",
        zips: [
            {
                name: "ios",
                src: ["app.ipa"],
            },
        ],
    },
];

module.exports = {
    url_join,
    packages,
    capitalize,
};
