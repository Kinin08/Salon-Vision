history.scrollRestoration = "manual";

window.scrollTo(0, 0);

const text = new SplitType("#title", {
    types: "chars"
});

const title = document.querySelector("#title");
const items = document.querySelectorAll(".item");
const card = document.querySelector(".card")
const hamburger = document.querySelector(".hamburger input");
const menu = document.querySelector("menu-circle");
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
    scrollPosition = window.scrollY;

    document.body.style.overflowY = "scroll";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollPosition}px`;
    document.body.style.width = "100%";
}

function liberarScroll() {
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.width = "";
    document.body.style.overflowY = ""; 

    window.scrollTo(0, scrollPosition);
}

travarScroll();

const mainTl = gsap.timeline({
    onComplete: () => {
        liberarScroll();
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

        start: "top center",
        end: "bottom center",

        scrub: 1,

        invalidateOnRefresh: true

    }

});
window.addEventListener("load", () => {
    window.scrollTo(0, 0);

    setTimeout(() => {
        ScrollTrigger.refresh();
    }, 500);
});