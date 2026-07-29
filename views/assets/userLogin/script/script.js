const DAY_DURATION = 7;
const NIGHT_DURATION = 7;
const FADE = 1.2;

function cicloDiaENoite() {
    const tl = gsap.timeline({ repeat: -1 });

    tl.set(".sun", { "--angle": 180, opacity: 0 })
        .to(".sun", { opacity: 1, duration: FADE }, 0)
        .to(".sun", { "--angle": 360, duration: DAY_DURATION, ease: "none" }, 0)
        .to(".night-overlay", { opacity: 0, duration: FADE }, 0)
        .to(".sun", { opacity: 0, duration: FADE }, DAY_DURATION - FADE)
        .to(".night-overlay", { opacity: 0.85, duration: FADE }, DAY_DURATION - FADE)

        .set(".moon", { "--angle": 180, opacity: 0 }, DAY_DURATION)
        .to(".moon", { opacity: 1, duration: FADE }, DAY_DURATION)
        .to(".moon", { "--angle": 360, duration: NIGHT_DURATION, ease: "none" }, DAY_DURATION)
        .to(".moon", { opacity: 0, duration: FADE }, DAY_DURATION + NIGHT_DURATION - FADE)
        .to(".night-overlay", { opacity: 0, duration: FADE }, DAY_DURATION + NIGHT_DURATION - FADE);

    return tl;
}

cicloDiaENoite();

const btnLogin = document.querySelector("#glass-silver");
const btnCadastro = document.querySelector("#glass-gold");

const formLogin = document.querySelector(".form-login");
const formCadastro = document.querySelector(".form-cadastro");


btnLogin.addEventListener("change", () => {

    gsap.to(formCadastro, {
        opacity: 0,
        x: 50,
        duration: 0.4,
        onComplete: () => {

            formCadastro.style.display = "none";

            formLogin.style.display = "block";

            gsap.fromTo(formLogin,
                {
                    opacity: 0,
                    x: -50
                },
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.4
                }
            );

        }
    });

});


btnCadastro.addEventListener("change", () => {

    gsap.to(formLogin, {
        opacity: 0,
        x: -50,
        duration: 0.4,
        onComplete: () => {

            formLogin.style.display = "none";

            formCadastro.style.display = "block";

            gsap.fromTo(formCadastro,
                {
                    opacity: 0,
                    x: 50
                },
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.4
                }
            );

        }
    });

});