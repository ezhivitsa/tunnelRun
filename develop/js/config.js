require.config({
	deps: ['main'],
	baseUrl: 'develop/js',
	// Ensure that RequireJS knows where to find your dependencies.
    paths: {
        three: "../vendor/threejs/build/three"
    },

    // Help RequireJS load Backbone and Underscore.
    shim: {
        three: { exports: "THREE" }
    }
});