const diff = 30;

function decreaseCodeBlocksWidth() {
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

function increaseCodeBlocksWidth() {
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

document.addEventListener('keydown', (event) => {
    if (event.ctrlKey) {
        if (event.key === '[') {
            decreaseCodeBlocksWidth();
        }
        else if (event.key === ']') {
            increaseCodeBlocksWidth();
        }
    }
});

// audio recording
let mediaRecorder;
let recordedChunks = [];
let recordingIndicator;

// Function to create and show the recording indicator
function showRecordingIndicator() {
    // Create the indicator if it doesn't exist
    if (!recordingIndicator) {
        recordingIndicator = document.createElement('div');
        recordingIndicator.id = 'audio-recording-indicator';
        recordingIndicator.style.position = 'fixed';
        recordingIndicator.style.top = '10px';
        recordingIndicator.style.right = '20px';
        recordingIndicator.style.zIndex = '9999';
        recordingIndicator.style.backgroundColor = 'rgba(255, 0, 0, 0.7)';
        recordingIndicator.style.color = 'white';
        recordingIndicator.style.padding = '8px 12px';
        recordingIndicator.style.borderRadius = '4px';
        recordingIndicator.style.fontWeight = 'bold';
        recordingIndicator.style.display = 'flex';
        recordingIndicator.style.alignItems = 'center';
        recordingIndicator.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';

        // Create recording icon (pulsing dot)
        const recordingIcon = document.createElement('div');
        recordingIcon.style.width = '12px';
        recordingIcon.style.height = '12px';
        recordingIcon.style.borderRadius = '50%';
        recordingIcon.style.backgroundColor = 'red';
        recordingIcon.style.marginRight = '8px';
        recordingIcon.style.animation = 'pulse 1.5s infinite';

        // Add the animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes pulse {
                0% { opacity: 1; }
                50% { opacity: 0.4; }
                100% { opacity: 1; }
            }
        `;
        document.head.appendChild(style);

        recordingIndicator.appendChild(recordingIcon);
        recordingIndicator.appendChild(document.createTextNode('Recording Audio'));

        document.body.appendChild(recordingIndicator);
    } else {
        recordingIndicator.style.display = 'flex';
    }
}

// Function to hide the recording indicator
function hideRecordingIndicator() {
    if (recordingIndicator) {
        recordingIndicator.style.display = 'none';
    }
}

// Function to start recording the audio stream
function startRecording(audioElement) {
    if (!audioElement) {
        console.error('No audio element found.');
        return;
    }

    // Check if the audio element has active audio tracks
    const audioStream = audioElement.captureStream();
    if (audioStream.getAudioTracks().length === 0) {
        console.error('No audio tracks available.');
        return;
    }

    mediaRecorder = new MediaRecorder(audioStream);
    mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) recordedChunks.push(e.data);
    };

    mediaRecorder.onstop = saveRecording;
    mediaRecorder.start();
    console.log('Recording started automatically.');

    // Show the recording indicator
    showRecordingIndicator();
}

// Function to save the recording as a .webm file
function saveRecording() {
    const blob = new Blob(recordedChunks, { type: 'audio/webm' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'chatgpt-audio.webm';
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    recordedChunks = [];
    console.log('Recording saved.');

    // Hide the recording indicator
    hideRecordingIndicator();
}

// Function to stop the recording
function stopRecording() {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
        console.log('Recording stopped.');

        // Hide the recording indicator
        hideRecordingIndicator();
    }
}

// Function to monitor the audio element
function monitorAudioElement() {
    const audioElement = document.querySelector('audio');
    if (audioElement) {
        audioElement.addEventListener('canPlay', () => {
            console.log('audio can start, but not sure it will play through');
        });

        audioElement.addEventListener('canplaythrough', () => {
            console.log('audio can play through');

            startRecording(audioElement);
        });

        audioElement.addEventListener('pause', () => {
            console.log('audio paused');

            stopRecording();
        });

        audioElement.addEventListener('ended', () => {
            console.log('audio ended');

            stopRecording();
        });


    } else {
        console.warn('No audio element found. Retrying...');

        setTimeout(monitorAudioElement, 1000); // Retry until audio element is found
    }
}

// Start monitoring for the audio element when the script is injected
monitorAudioElement();

