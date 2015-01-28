require.config({
    deps: ['main'],
    baseUrl: 'develop/js',
    // Ensure that RequireJS knows where to find your dependencies.
    paths: {
        three: "../vendor/threejs/build/three",
        projector: "../lib/Projector",
        trackballControls: "../lib/TrackballControls"
    },

    // Help RequireJS load Backbone and Underscore.
    shim: {
        three: {
            exports: "THREE"
        },
        projector: {
            exports: "THREE",
            deps: ["three"]
        },
        trackballControls: {
            exports: "THREE",
            deps: ["three"]
        }
    }
});