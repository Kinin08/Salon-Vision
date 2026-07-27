gsap.registerPlugin(ScrollTrigger);

history.scrollRestoration = "manual";

window.onbeforeunload = function () {
    window.scrollTo(0, 0);
};

window.addEventListener("load", () => {

    setTimeout(() => {
        window.scrollTo(0, 0);
        ScrollTrigger.refresh();
    }, 50);

});

const text = new SplitType("#title", {
    types: "chars"
});

const title = document.querySelector("#title");
const items = document.querySelectorAll(".item");
const card = document.querySelector(".card")
const hamburger = document.querySelector(".hamburger input");
const menu = document.querySelector("#menu-circle");
const overlay = document.querySelector(".overlay");

text.chars.forEach((char, index) => {

    const destaque = index === 0 || index === 5;

    gsap.set(char, {
        color: destaque ? "#FF4F9A" : "#2d2a30",
        textShadow: destaque
            ? "0 0 10px #FF4F9A"
            : "0 0 10px #2d2a30"
    });

});
let scrollPosition = 0;

function travarScroll() {
    document.documentElement.style.overflow = "hidden";
}

function liberarScroll() {
    document.documentElement.style.overflow = "";
    ScrollTrigger.refresh();
}

travarScroll();

const mainTl = gsap.timeline({
    onComplete: () => {
        liberarScroll();
        ScrollTrigger.refresh()
    }
});

mainTl
    .from(text.chars, {
        scaleX: 0,
        opacity: 0,
        transformOrigin: "left center",
        duration: .8,
        stagger: .05,
        ease: "back.out(2)"
    })
    .to(title, {
        top: 10,
        left: "10%",
        fontSize: "3rem",
        duration: 1,
        ease: "power2.out"
    })
    .fromTo(card, {
        y: -100,
        opacity: 0
    }, {
        opacity: 1,
        y: 0,
        duration: .8,
        ease: "power3.out"
    })
    .fromTo(".video-mask", {
        scale: 0,
        opacity: 0
    }, {
        opacity: 1,
        scale: 0.3,
        duration: .8,
        ease: "back.out(1.7)"
    }, "<")
    .fromTo(".menu-login",
        {
            x: 300,
            opacity: 0
        },
        {
            x: 0,
            opacity: 1,
            duration: .8,
            ease: "back.out(1.7)"
        }, "<");

mainTl.call(() => {
    gsap.to(text.chars, {
        y: -10,
        duration: 0.8,
        stagger: 0.05,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });
});

gsap.set(items, {
    x: -100,
    scale: 0,
    opacity: 0
});
gsap.set(".redes", {
    y: 100,
    scale: 0,
    opacity: 0
});

const menuTl = gsap.timeline({
    paused: true
});

menuTl
    .to(card, {
        width: "290px",
        height: "310px",
        duration: .8,
        ease: "power4.out"
    })
    .to(".name", {
        bottom: 15,
        duration: .8,
        ease: "power4.out"
    }, "<")
    .to(items, {
        x: 0,
        scale: 1,
        opacity: 1,
        duration: .4,
        stagger: .08,
        ease: "back.out(1.7)"
    })
    .to(".redes", {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: .5,
        ease: "back.out(2)"
    }, "-=.3");

let menuOpen = false;

hamburger.addEventListener("click", () => {
    if (!menuOpen) {

        menuTl.timeScale(1);
        menuTl.play();

        overlay.classList.add("active");

        menuOpen = true;

    } else {

        menuTl.timeScale(1.5);
        menuTl.reverse();

        overlay.classList.remove("active");

        menuOpen = false;
    }

});

document.addEventListener("click", (e) => {

    const clicouDentro = card.contains(e.target);

    if (!clicouDentro && menuOpen) {
        menuTl.reverse();
        menuOpen = false;
        overlay.classList.remove("active");

        hamburger.checked = false;
    }

});
items.forEach(item => {

    const dot = item.querySelector(".dot");

    item.addEventListener("mouseenter", () => {

        gsap.to(item, {
            x: 10,
            color: "var(--branco)",
            textShadow: "0 0 10px var(--branco)",
            duration: .3,
            ease: "power2.out",
            overwrite: "auto"
        });


        gsap.to(dot, {
            scale: 1,
            opacity: 1,
            duration: .3,
            ease: "back.out(3)",
            overwrite: "auto"
        });

    });


    item.addEventListener("mouseleave", () => {


        gsap.to(item, {
            x: 0,
            color: "var(--itens)",
            textShadow: "0 0 0 transparent",
            duration: .3,
            ease: "power2.out",
            overwrite: "auto"
        });


        gsap.to(dot, {
            scale: 0,
            opacity: 0,
            duration: .2,
            ease: "power2.in",
            overwrite: "auto"
        });

    });

});
const seta = document.querySelector("#open h2");
const botao = document.querySelector("#open");

const tl = gsap.timeline({
    paused: true
});


tl.to(seta, {
    rotate: 180,
    duration: .5,
    ease: "power2.out"
}, 0)

    .to(botao, {
        borderRadius: "40px",
        duration: 1,
        ease: "power2.out"
    }, 0)


    .to(".buttons-login", {
        width: 260,
        opacity: 1,
        duration: 1,
        ease: "power2.out"
    }, 0);



let aberto = false;

botao.addEventListener("click", () => {

    aberto = !aberto;


    if (aberto) {
        tl.play();
    } else {
        tl.reverse();
    }

});


window.addEventListener("load", () => {

    const path = document.querySelector("#stroke-path");

    if (!path) {
        console.log("SVG não encontrado");
        return;
    }


    const length = path.getTotalLength();

    console.log("Tamanho da linha:", length);


    gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length
    });


    gsap.to(path, {

        strokeDashoffset: 0,

        ease: "none",

        scrollTrigger: {
            trigger: ".svg-section",

            start: "top center",
            end: "bottom bottom",

            scrub: 1,
        }

    });


    ScrollTrigger.refresh();

});

const video = document.querySelector(".video-mask video");
let pausado = false;

gsap.set(".painel", {
    opacity: 0,
    y: 100,
    scale: 0.8
});

const videoScaleTl = gsap.timeline({
    scrollTrigger: {
        trigger: "#video-itens",
        start: "top top",
        end: "+=6000",
        scrub: true,

    }
});


videoScaleTl
    .fromTo(".video-mask",
        {
            scale: 0.3,
            clipPath: "inset(0% 35% 0% 35% round 100px)"
        },
        {
            scale: 1,
            clipPath: "inset(0% 0% 0% 0% round 0px)",
            ease: "power2.out",
            duration: 2
        }
    )
    .to("#coisas h1", {
        opacity: 1,
        y: 0,
        stagger: 0.2,
        duration: 1,
        ease: "back.out(1.7)"
    })
    .to({}, { duration: 0.8 })
    .to("#coisas h1", {
        opacity: 0,
        y: -50,
        stagger: 0.15,
        duration: 1,
        ease: "power2.in"
    })
    .to(".video-mask", {
        clipPath: "inset(0% 35% 0% 35% round 100px)",
        scale: 0,
        ease: "power2.out",
        duration: 2,

        onUpdate() {
            const scale = gsap.getProperty(".video-mask", "scale");

            if (scale <= 0.03 && !pausado) {
                video.pause();
                pausado = true;
                gsap.set(".video-mask", {
                    opacity: 0
                });
            }

            if (scale > 0.05 && pausado) {
                video.play();
                pausado = false;
                gsap.set(".video-mask", {
                    opacity: 1
                });
            }
        }
    })
    .fromTo(".painel",
        {
            opacity: 0,
            y: 80,
            scale: 0.8
        },
        {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            ease: "power3.out"
        },
        "-=1"
    );

const novoItemTl = gsap.timeline({
    scrollTrigger: {
        trigger: ".novo-item",
        start: "top top",
        end: "+=2000",
        scrub: 1,
        pin: true,
        anticipatePin: 1
    }
});


novoItemTl.to(".novo-item", {
    xPercent: -66.66,
    ease: "none"
});
