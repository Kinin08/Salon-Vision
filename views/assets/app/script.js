gsap.to(".horizontal", {
    xPercent: -66.66,
    ease: "none",

    scrollTrigger: {
        trigger: ".horizontal",
        pin: true,
        scrub: 1,
        end: "+=3000"
    }
});