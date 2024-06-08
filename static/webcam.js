document.addEventListener("DOMContentLoaded", function() {
    var video = document.getElementById("video");
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");

    function startVideo() {
        navigator.mediaDevices.getUserMedia({ video: {} })
            .then(stream => {
                video.srcObject = stream;
            })
            .catch(err => console.error("Error accessing camera: ", err));
    }

    function detectEmotion() {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        var image = canvas.toDataURL('image/png');

        fetch('/detect_emotion', {
            method: 'POST',
            body: JSON.stringify({
                image: image
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById("resultado").innerText = data.result;
            setTimeout(detectEmotion, 500);  // Detectar emoción cada 500ms
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    startVideo();
    video.addEventListener('play', () => {
        detectEmotion();
    });
});
