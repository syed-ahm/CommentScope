// check for new video and add UI elements (generate button) 
// onClick for generate button sends msg to SW (here)
// receive msg and (check local cache?) send metadata to server
// send response back to tab
// tab displays content in UI (shadow dom?)

// when send analyze message is received then 


// get video ID from window api
// listen for YT SPA changes with window history 'popstate' event
// display UI button when comment element renders
// onClick for button sends msg to SW
// SW makes API call


(() => {
    // HELPERS
    const waitForElement = (selector) => {
        return new Promise(resolve => {
            const element = document.querySelector(selector);
            if (element) return resolve(element);

            const observer = new MutationObserver(() => {
                const element = document.querySelector(selector);
                if (element) {
                    observer.disconnect();
                    resolve(element);
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    };

    const getVideoID = () => {
        const params = new URLSearchParams(window.location.search);
        return params.get('v');
    };

    const displayAnalyzeBtn = async (videoID) => {
        const existingBtn = document.getElementById('comments-analyze-btn');

        if (!existingBtn && videoID) {
            const analyzeBtn = document.createElement("button");
            analyzeBtn.id = 'comments-analyze-btn';
            analyzeBtn.textContent = "Analyze Comments";
            analyzeBtn.style.marginLeft = "10px";
            analyzeBtn.style.padding = "5px 10px";
            analyzeBtn.onclick = sendAnalyzeRequest;

            const commentsHeader = await waitForElement('.style-scope.ytd-comments-header-renderer');
            if (commentsHeader) {
                commentsHeader.appendChild(analyzeBtn);
            }
        }
    };

    const sendAnalyzeRequest = () => {
        const videoID = getVideoID();
        console.log(`Analyzing video: ${videoID}`);

        // TODO: check client cache
        
        // send message to SW
        chrome.runtime.sendMessage({
            type: "ANALYZE",
            videoID: videoID
        }, (res) => {
            console.log('Final Result: ', res);
            // TODO: store in client cache
        })
    };

    // Listen for navigation (YouTube SPA)
    window.addEventListener('popstate', () => {
        const videoID = getVideoID();
        if (videoID) {
            displayAnalyzeBtn(videoID);
        }
    });

    // Initial load
    const videoID = getVideoID();
    if (videoID) {
        displayAnalyzeBtn(videoID);
    }
})();