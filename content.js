const diff = 30;

function chatGPTDecreaseCodeBlocksWidth() {
    // typically, a conversation contains multiple
    // replies from chatgpt. Each of these replies
    // is wrapped in a div element with the class name
    var replyNodes = document.getElementsByClassName('markdown prose w-full break-words dark:prose-invert dark');
    if (replyNodes.length === 0) {
        replyNodes = document.getElementsByClassName('markdown prose w-full break-words dark:prose-invert light');
    }

    for (let index = 0; index < replyNodes.length; index++) {
        const replyNode = replyNodes[index];

        // a reply may or may not contain code blocks
        // if it does, each code block is wrapped in a pre element
        var preTags = replyNode.querySelectorAll('pre');
        if (preTags) {
            preTags.forEach((preTag) => {
                let currentWidth = parseFloat(window.getComputedStyle(preTag).width);
                let newWidth = currentWidth - diff;
                preTag.style.width = newWidth + 'px';
            });
        }
    }
}

function chatGPTIncreaseCodeBlocksWidth() {
    var replyNodes = document.getElementsByClassName('markdown prose w-full break-words dark:prose-invert dark');
    if (replyNodes.length === 0) {
        replyNodes = document.getElementsByClassName('markdown prose w-full break-words dark:prose-invert light');
    }

    for (let index = 0; index < replyNodes.length; index++) {
        const replyNode = replyNodes[index];

        var preTags = replyNode.querySelectorAll('pre');
        if (preTags) {
            preTags.forEach((preTag) => {
                let currentWidth = parseFloat(window.getComputedStyle(preTag).width);
                let newWidth = currentWidth + diff;
                preTag.style.width = newWidth + 'px';
            });
        }
    }
}

function claudeAIIncreaseCodeBlocksWidth() {
    var preTags = document.querySelectorAll('pre');
    if (preTags) {
        preTags.forEach((preTag) => {
            let currentWidth = parseFloat(window.getComputedStyle(preTag).width);
            let newWidth = currentWidth + diff;
            preTag.style.width = newWidth + 'px';
        });
    }
}

function claudeAIDecreaseCodeBlocksWidth() {
    var preTags = document.querySelectorAll('pre');
    if (preTags) {
        preTags.forEach((preTag) => {
            let currentWidth = parseFloat(window.getComputedStyle(preTag).width);
            let newWidth = currentWidth - diff;
            preTag.style.width = newWidth + 'px';
        });
    }
}


document.addEventListener('keydown', (event) => {

    if (event.key === 'PageUp' || event.key === 'PageDown') {
        // scrollTop is the current scroll position of the container
        // clientHeight is the container's visible height

        if (event.key === 'PageUp') {
            let scroll = document.querySelector('div[class^="react-scroll-to-bottom"]').firstChild;
            scroll.scrollTo({
                top: scroll.scrollTop - scroll.clientHeight,
                // behavior: 'smooth'
            });
        }
        else if (event.key === 'PageDown') {
            let scroll = document.querySelector('div[class^="react-scroll-to-bottom"]').firstChild;
            scroll.scrollTo({
                top: scroll.scrollTop + scroll.clientHeight,
                // behavior: 'smooth'
            });
        }

        return;
    }

    if (event.ctrlKey) {
        if (event.key === '[') {
            if (document.location.origin == 'https://chatgpt.com') {
                chatGPTDecreaseCodeBlocksWidth();
            }
            else if (document.location.origin == 'https://claude.ai') {
                claudeAIDecreaseCodeBlocksWidth();
            }

        }
        else if (event.key === ']') {
            if (document.location.origin == 'https://chatgpt.com') {
                chatGPTIncreaseCodeBlocksWidth();
            }
            else if (document.location.origin == 'https://claude.ai') {
                claudeAIIncreaseCodeBlocksWidth();
            }
        }
    }
});