
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
        let options = {
                root: null, // to use current viewport 
                rootMargin: "0px",
                threshold: 1.0,
        };
        let observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                        if (entry.isIntersecting) {
                                console.log(`scrolling past ${entry.target.id}`);
                        }
                });
        }, options);

        let targetIds = ["liId-200", "liId-500", "liId-800"];
        targetIds.forEach((id) => {
                let target = document.querySelector(`#${id}`);
                if (target) {
                        observer.observe(target);
                }
        });
});
