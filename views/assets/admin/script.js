const swup = new Swup();



function animarEntrada(){

    gsap.from("#swup",{

        opacity:0,

        y:50,

        duration:1,

        ease:"power3.out"

    });

}



function animarSaida(){

    return gsap.to("#swup",{

        opacity:0,

        y:-50,

        duration:.6,

        ease:"power3.in"

    });

}



swup.hooks.on("visit", (visit)=>{

    visit.animation = animarSaida();

});



swup.hooks.on("page:view",()=>{

    animarEntrada();

});