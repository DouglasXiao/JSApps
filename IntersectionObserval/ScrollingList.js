
const infiniteList = document.getElementById("infiniteList");

const liList = [];
for (let i = 0; i < 1000; i++) {
        const newLi = document.createElement("li");
        newLi.innerHTML = `post ${i+1}`;
        newLi.id = `liId-${i+1}`;
        liList.push(newLi);
}

infiniteList.append(...liList);

document.addEventListener("DOMContentLoaded", () => {
        const observeTarget = "liId-500";
        let options = {
                root: null, // to use current viewport 
                rootMargin: "0px",
                threshold: 1.0,
        };
        let observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                        if (entry.isIntersecting) {
                                console.log(`scrolling past ${observeTarget}`);
                        }
                });
        }, options);
        let target = document.querySelector(`#${observeTarget}`);
        if (target) {
                observer.observe(target);
        }
});
