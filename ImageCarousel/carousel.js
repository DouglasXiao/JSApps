const slides = document.querySelectorAll('.carousel-image');

console.log(slides);

slides.forEach((slide, index) => {
        slide.style.transform = `translateX(${index * 100}%)`;
});

let curSlide = 0;
let maxSlides = slides.length - 1;

function nextSlide() {
        if (curSlide === maxSlides) {
                curSlide = 0;
        } else {
                curSlide++;
        }
        slides.forEach((slide, index) => {
                slide.style.transform = `translateX(${(index - curSlide) * 100}%)`;
        });
}

function prevSlide() {
        if (curSlide === 0) {
                curSlide = maxSlides;
        } else {
                curSlide--;
        }
        slides.forEach((slide, index) => {
                slide.style.transform = `translateX(${(index - curSlide) * 100}%)`;
        });
}
