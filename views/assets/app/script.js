gsap.registerPlugin(ScrollTrigger);


const path = document.querySelector("#stroke-path");


const length = path.getTotalLength();


gsap.set(path, {
    strokeDasharray: length,
    strokeDashoffset: length
});


gsap.to(path, {

    strokeDashoffset: 0,

    ease: "none",

    scrollTrigger: {

        trigger: ".svg-line",

        start: "top bottom",

        end: "bottom center",

        scrub: true,

        markers: true

    }

});