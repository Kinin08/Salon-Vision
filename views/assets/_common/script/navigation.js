const text = new SplitType(".title", {
    types: "chars"
});

gsap.from(text.chars, {
    scaleX: 0,
    opacity: 0,
    duration: 1,
    stagger: 0.05,
    ease: "back.out(2)"
});