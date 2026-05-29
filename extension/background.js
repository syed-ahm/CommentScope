// receive 'ANALYZE' event and call api

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Message received", message);

    if (message.type == "ANALYZE") {
        // make call
        fetch(`http://localhost:3000/api/v1/comment-analysis?videoID=${message.videoID}`)
            .then(res => res.json())
            .then(data => {
                sendResponse({
                type: "ANALYZE_RESPONSE",
                ...data
            });
        }).catch(err => sendResponse({ type: 'error', error: err.message }));
        
        return true;
    }
}) 