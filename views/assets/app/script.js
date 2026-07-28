window.addEventListener("load", () => {

    gsap.registerPlugin(ScrollTrigger);

    const horizontal = document.querySelector("#timeline-horizontal");
    const vertical = document.querySelector("#timeline-vertical");
    const track = document.querySelector(".track");

    const hLength = horizontal.getTotalLength();
    const vLength = vertical.getTotalLength();

    const points = [
        {
            el: document.querySelector(".p1"),
            percent: 0.12
        },
        {
            el: document.querySelector(".p2"),
            percent: 0.42
        },
        {
            el: document.querySelector(".p3"),
            percent: 0.75
        }
    ];

    gsap.set(horizontal, {
        strokeDasharray: hLength,
        strokeDashoffset: hLength
    });

    gsap.set(vertical, {
        strokeDasharray: vLength,
        strokeDashoffset: vLength
    });


    const horizontalDistance = 7965 - window.innerWidth;

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: ".timeline-section",
            start: "top top",
            end: `+=${horizontalDistance + 7528}`,
            pin: true,
            scrub: 2,
            markers: true
        }
    });


    tl.to(track, {
        x: -horizontalDistance,
        ease: "power1.inOut",
        duration: horizontalDistance
    });


    tl.to(horizontal, {
        strokeDashoffset: 0,
        ease: "power1.inOut",

        duration: horizontalDistance,

        onUpdate() {

            const offset = gsap.getProperty(
                horizontal,
                "strokeDashoffset"
            );

            const progress = 1 - (offset / hLength);


            points.forEach(point => {

                if (progress >= point.percent) {

                    if (!point.el.classList.contains("active")) {

                        point.el.classList.add("active");

                        mostrarPonto(point.el);

                    }

                } else {

                    if (point.el.classList.contains("active")) {

                        point.el.classList.remove("active");

                        esconderPonto(point.el);

                    }

                }

            });

        }

    }, 0);


    // espera chegar no final
    tl.to({}, {
        duration: 1
    });

    tl.to(vertical, {
        strokeDashoffset: 0,
        ease: "power1.inOut",

        duration: 7528
    })
        .to(track, {
            y: -7000,
            ease: "power1.inOut",

            duration: 7528
        }, "<");

});
function mostrarPonto(elemento) {

    gsap.to(elemento, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: .8,
        ease: "back.out(1.7)"
    });

    gsap.to(elemento, {
        filter: "drop-shadow(0 0 25px #FF4F9A)",
        duration: .5,
        yoyo: true,
        repeat: 1
    });

}