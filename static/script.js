document.addEventListener("DOMContentLoaded", function() {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    var image = new Image();

    window.onFileSelected = function(event) {
        var selectedFile = event.target.files[0];
        var reader = new FileReader();

        reader.onload = function(event) {
            image.src = event.target.result;
            image.onload = function() {
                ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
                detectEmotion();
            }
        };
        reader.readAsDataURL(selectedFile);
    };

    function detectEmotion() {
        fetch('/detect_emotion', {
            method: 'POST',
            body: JSON.stringify({
                image: canvas.toDataURL()
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById("resultado").innerText = data.result;
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
});
