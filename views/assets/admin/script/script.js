const swup = new Swup();


function animarEntrada() {

    gsap.from("#swup", {

        opacity: 0,
        y: 100,
        x: 100,

        duration: 1,

        ease: "power3.out"

    });

}



function animarSaida() {

    return new Promise(resolve => {

        gsap.to("#swup", {

            opacity: 0,
            y: -100,
            x: -100,

            duration: .6,

            ease: "power3.in",

            onComplete: resolve

        });

    });

}



swup.hooks.on("visit:start", () => {

    return animarSaida();

});



swup.hooks.on("page:view", () => {

    animarEntrada();

});