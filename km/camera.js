
let camera_button = document.querySelector("#start-camera");
let camera_stop = document.querySelector("#stop-camera");
let video = document.querySelector("#video");
let click_button = document.querySelector("#click-photo");
let canvas = document.querySelector("#canvas");
let dataurl = document.querySelector("#dataurl");
let dataurl_container = document.querySelector("#dataurl-container");
let inputkm_container = document.querySelector("#inputkm-container");

camera_button.addEventListener('click', async function() {
    let stream = null;
    
    try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    }
    catch(error) {
        alert(error.message);
        return;
    }
    
    video.srcObject = stream;
    
    // hideButton();
    // $("#inputkm-container").hide(250);
    // $("#cam-container").show(500);
    // camera_stop.style.display = 'block';
    // video.style.display = 'block';
    // camera_button.style.display = 'none';
    // inputkm_container.style.display = 'none';
    // click_button.style.display = 'block';
});

click_button.addEventListener('click', function() {

    $("#dataurl-container").show();

    canvas.style.display = 'block';
    dataurl.style.display = 'block';
    dataurl_container.style.display = 'block';
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    let image_data_url = canvas.toDataURL('image/jpeg');
    
    dataurl.value = image_data_url;
    dataurl_container.style.display = 'block';
});


function hideButton() {
    // camera_stop.style.display = 'none';
    // video.style.display = 'none';
    // click_button.style.display = 'none';
    // canvas.style.display = 'none';
    // dataurl.style.display = 'none';
    // dataurl_container.style.display = 'none';
    // inputkm_container.style.display = 'none';
    $("#inputkm-container").hide()
    $("#cam-container").hide()
    $("#dataurl-container").hide()
}
function encoder() {
    // hideButton();
    // inputkm_container.style.display = 'block';
}

$("#manuelInput").click(function(){
    $("#cam-container").hide()
    $("#dataurl-container").hide()
    $("#inputkm-container").toggle(500);
});

$("#start-camera").click(function(){
    $("#inputkm-container").hide()
    $("#dataurl-container").hide()
    $("#cam-container").toggle(500);
});