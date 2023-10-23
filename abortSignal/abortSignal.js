const downloadBtn = document.querySelector(".download");
const abortBtn = document.querySelector(".abort");

let controller;

function fetchVideo() {
        downloadBtn.classList.toggle("download-hide", true);
        abortBtn.classList.toggle("abort-hide", false);

        controller = new AbortController();
        setTimeout(() => {
                fetch("https://mdn.github.io/dom-examples/abort-api/sintel.mp4", { signal: controller.signal }).then(
                        response => {
                                console.log("Download complete", response);
                        }
                ).catch(err => {
                        console.error(err.message);
                });
        }, 1000);
}

downloadBtn.addEventListener("click", fetchVideo);
abortBtn.addEventListener("click", function() {
        downloadBtn.classList.toggle("download-hide", false);
        abortBtn.classList.toggle("abort-hide", true);

        if (controller) {
                controller.abort();
        }
});
