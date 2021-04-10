
window.onload=function(){
  const header = document.querySelector("header");
  const sectionOne = document.querySelector(".header-content");

  const sectionOneOptions = {
    rootMargin: "-100px 0px 0px 0px"
  };

  const sectionOneObserver = new IntersectionObserver(function(
    entries,
    sectionOneObserver
  ) {
    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        header.classList.add("nav-scrolled");
      } else {
        header.classList.remove("nav-scrolled");
      }
    });
  },
  sectionOneOptions);

  sectionOneObserver.observe(sectionOne);
}

