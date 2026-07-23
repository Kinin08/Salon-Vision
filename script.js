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

const mainTl = gsap.timeline();

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
    .to(card, {
        opacity: 1,
        top: 10,
        scale: 1,
        ease: "back.out(1.7)"

    })
    .to(text.chars, {
        y: -8,
        duration: .8,
        stagger: .05,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut"
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

        menuTl.play();

        overlay.classList.add("active");

        menuOpen = true;
    } else {
        overlay.classList.remove("active");
        menuTl.reverse();
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

        gsap.killTweensOf(item);
        gsap.killTweensOf(dot);

        gsap.timeline()
            .to(item, {
                color: "var(--branco)",
                textShadow: "0 0 10px var(--branco)",
                duration: .2,
                ease: "power2.out"
            })
            .to(item, {
                x: 10,
                duration: .4,
                ease: "power2.out"
            }, "-=.1");


        gsap.to(dot, {
            scale: 1,
            opacity: 1,
            duration: .3,
            ease: "back.out(3)",
            overwrite: true
        });

    });


    item.addEventListener("mouseleave", () => {

        gsap.killTweensOf(item);
        gsap.killTweensOf(dot);

        gsap.to(item, {
            x: 0,
            color: "var(--itens)",
            textShadow: "0 0 0 transparent",
            duration: .3,
            ease: "power2.out",
            overwrite: true
        });


        gsap.to(dot, {
            scale: 0,
            opacity: 0,
            duration: .2,
            ease: "power2.in",
            overwrite: true
        });

    });

});