
    const cardsContainer = document.getElementById("cards");
    const countdownEl = document.getElementById("countdown");
    const lastUpdated = document.getElementById("last-updated");

    const priceAdjustments = { box1:0, box2:0, box3:0, box4:0, box5:0 };
    const carats = ["24K","22K","21K","18K"];

    function formatPrice(p){ return Number(p).toLocaleString("en",{minimumFractionDigits:3,maximumFractionDigits:3}); }







function fitTextToDiv(el, minFontPx = 24) {
  const computedStyle = window.getComputedStyle(el);
  const defaultFontPx = parseFloat(computedStyle.fontSize); // keep Tailwind 8xl

  let fontSize = defaultFontPx;
  const parentWidth = el.parentElement.offsetWidth - 10; // padding

  while (el.scrollWidth > parentWidth && fontSize > minFontPx) {
    fontSize -= 1;
    el.style.fontSize = fontSize + "px";
  }
}



    async function fetchPrices(){
      try{
        const resp = await fetch("https://api.daralsabaek.com/api/goldAndFundBalance/getMetalPrices");
        const data = await resp.json();
        if(!data.isSuccess || !Array.isArray(data.result)) return;

        const gold24 = data.result.find(i=>i.metalType===1);
        if(!gold24) return;

        const price24 = gold24.buyPrice24 - 1 + priceAdjustments.box1;
        const prices = {
          "24K": price24,
          "22K": price24*(22/24) + priceAdjustments.box2,
          "21K": price24*(21/24) + priceAdjustments.box3,
          "18K": price24*(18/24) + priceAdjustments.box4
        };

        cardsContainer.innerHTML = "";
        const tpl = document.getElementById("card-template");

        carats.forEach(carat=>{
          const node = tpl.content.cloneNode(true);

          const sellEl = node.querySelector("[data-role='sell']");
          const buyEl = node.querySelector("[data-role='buy']");

          // Set prices
          sellEl.textContent = formatPrice(prices[carat]);
          buyEl.textContent = formatPrice(prices[carat]-0.871);

          // Auto-fit prices

fitTextToDiv(sellEl);
fitTextToDiv(buyEl);

          node.querySelector("[data-role='carat']").textContent = carat;
          node.querySelector("[data-role='change']").textContent = "0.000 (0.00%)";

          cardsContainer.appendChild(node);
        });

        lastUpdated.textContent = new Date().toLocaleString();
      } catch(e){
        console.error(e);
      }
    }






















    function startCountdown(){
      let timeLeft=15;
      countdownEl.textContent = timeLeft;
      setInterval(()=>{
        timeLeft--;
        if(timeLeft<=0){ fetchPrices(); timeLeft=15; }
        countdownEl.textContent = timeLeft;
      },1000);
    }

    /* Intro + Slogan */
    const slogans = { ar:["مرحبا بك في سبايك 24","أفضل الأسعار كل يوم","موثوق من قبل الآلاف","تألقي مثل الذهب الخالص"], en:["Welcome to Gold Shop","Best Prices Every Day","Trusted by Thousands","Shine with Pure Gold"]};
    const sloganOverlay = document.getElementById("slogan-overlay");
    let sloganIndex = 0;
    function showSlogan(){
      sloganOverlay.textContent = slogans["ar"][sloganIndex];
      sloganIndex = (sloganIndex+1)%slogans["ar"].length;
      sloganOverlay.classList.remove("hidden");
      sloganOverlay.classList.add("slogan-animate");
      setTimeout(()=>{ sloganOverlay.classList.add("hidden"); sloganOverlay.classList.remove("slogan-animate"); },4000);
    }
    function startSloganSequence(){ showSlogan(); setInterval(showSlogan,15000); }

    window.addEventListener("load",()=>{
      const overlay = document.getElementById("intro-overlay");
      setTimeout(()=>{
        overlay.style.transition="opacity 0.5s ease";
        overlay.style.opacity=0;
        setTimeout(()=>{
          overlay.style.display="none";
          startSloganSequence();
          fetchPrices();
          startCountdown();
        },500);
      },4000);
    });
