<!-- From Uiverse.io by 20essentials --> 
<section style="top: 0px; left: 0px" class="container-espiral">
  <aside style="--r: 1" class="loader">
    <span style="--i: 1" class="circulo"></span>
    <span style="--i: 2" class="circulo"></span>
    <span style="--i: 3" class="circulo"></span>
    <span style="--i: 4" class="circulo"></span>
    <span style="--i: 5" class="circulo"></span>
    <span style="--i: 6" class="circulo"></span>
    <span style="--i: 7" class="circulo"></span>
    <span style="--i: 8" class="circulo"></span>
    <span style="--i: 9" class="circulo"></span>
    <span style="--i: 10" class="circulo"></span>
    <span style="--i: 11" class="circulo"></span>
    <span style="--i: 12" class="circulo"></span>
    <span style="--i: 13" class="circulo"></span>
    <span style="--i: 14" class="circulo"></span>
    <span style="--i: 15" class="circulo"></span>
    <span style="--i: 16" class="circulo"></span>
    <span style="--i: 17" class="circulo"></span>
    <span style="--i: 18" class="circulo"></span>
    <span style="--i: 19" class="circulo"></span>
    <span style="--i: 20" class="circulo"></span>
  </aside>
  <aside style="--r: 2" class="loader">
    <span style="--i: 1" class="circulo"></span>
    <span style="--i: 2" class="circulo"></span>
    <span style="--i: 3" class="circulo"></span>
    <span style="--i: 4" class="circulo"></span>
    <span style="--i: 5" class="circulo"></span>
    <span style="--i: 6" class="circulo"></span>
    <span style="--i: 7" class="circulo"></span>
    <span style="--i: 8" class="circulo"></span>
    <span style="--i: 9" class="circulo"></span>
    <span style="--i: 10" class="circulo"></span>
    <span style="--i: 11" class="circulo"></span>
    <span style="--i: 12" class="circulo"></span>
    <span style="--i: 13" class="circulo"></span>
    <span style="--i: 14" class="circulo"></span>
    <span style="--i: 15" class="circulo"></span>
    <span style="--i: 16" class="circulo"></span>
    <span style="--i: 17" class="circulo"></span>
    <span style="--i: 18" class="circulo"></span>
    <span style="--i: 19" class="circulo"></span>
    <span style="--i: 20" class="circulo"></span>
  </aside>
  <aside style="--r: 3" class="loader">
    <span style="--i: 1" class="circulo"></span>
    <span style="--i: 2" class="circulo"></span>
    <span style="--i: 3" class="circulo"></span>
    <span style="--i: 4" class="circulo"></span>
    <span style="--i: 5" class="circulo"></span>
    <span style="--i: 6" class="circulo"></span>
    <span style="--i: 7" class="circulo"></span>
    <span style="--i: 8" class="circulo"></span>
    <span style="--i: 9" class="circulo"></span>
    <span style="--i: 10" class="circulo"></span>
    <span style="--i: 11" class="circulo"></span>
    <span style="--i: 12" class="circulo"></span>
    <span style="--i: 13" class="circulo"></span>
    <span style="--i: 14" class="circulo"></span>
    <span style="--i: 15" class="circulo"></span>
    <span style="--i: 16" class="circulo"></span>
    <span style="--i: 17" class="circulo"></span>
    <span style="--i: 18" class="circulo"></span>
    <span style="--i: 19" class="circulo"></span>
    <span style="--i: 20" class="circulo"></span>
  </aside>
  <aside style="--r: 4" class="loader">
    <span style="--i: 1" class="circulo"></span>
    <span style="--i: 2" class="circulo"></span>
    <span style="--i: 3" class="circulo"></span>
    <span style="--i: 4" class="circulo"></span>
    <span style="--i: 5" class="circulo"></span>
    <span style="--i: 6" class="circulo"></span>
    <span style="--i: 7" class="circulo"></span>
    <span style="--i: 8" class="circulo"></span>
    <span style="--i: 9" class="circulo"></span>
    <span style="--i: 10" class="circulo"></span>
    <span style="--i: 11" class="circulo"></span>
    <span style="--i: 12" class="circulo"></span>
    <span style="--i: 13" class="circulo"></span>
    <span style="--i: 14" class="circulo"></span>
    <span style="--i: 15" class="circulo"></span>
    <span style="--i: 16" class="circulo"></span>
    <span style="--i: 17" class="circulo"></span>
    <span style="--i: 18" class="circulo"></span>
    <span style="--i: 19" class="circulo"></span>
    <span style="--i: 20" class="circulo"></span>
  </aside>
</section>


<style>
    /* From Uiverse.io by 20essentials */ 
.container-espiral {
  position: absolute;
  top: 0;
  left: 0;
  inset: 0;
  z-index: 50;
  display: flex;
  flex-wrap: wrap;
  place-content: center;

  .loader {
    position: relative;
    transform: rotate(calc(var(--r) * 45deg));

    .circulo {
      --color: #0f0;
      top: 0;
      width: 200px;
      height: 2px;
      left: -200px;
      position: absolute;
      transform-origin: right;
      transform: rotate(calc(var(--i) * 18deg));

      &::before {
        content: "";
        position: absolute;
        top: -50%;
        width: 15px;
        height: 15px;
        background-color: var(--color);
        border-radius: 50%;
        box-shadow:
          0 0 10px var(--color),
          0 0 20px var(--color),
          0 0 40px var(--color),
          0 0 60px var(--color),
          0 0 80px var(--color),
          0 0 100px var(--color);
        animation: animate 5s linear infinite;
        animation-delay: calc(var(--i) * -0.5s);
      }
    }
  }
}

@keyframes animate {
  0% {
    transform: translateX(200px) scale(1);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
  100% {
    transform: translateX(0px) scale(0);
    opacity: 1;
  }
}


</style>