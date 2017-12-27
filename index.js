const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo(){
	navigator.mediaDevices.getUserMedia({video: true, audio: false})
		.then(localMediaStream => {
			video.src = window.URL.createObjectURL(localMediaStream);
			video.play();
		})
		.catch(err => {
			console.error('OH NO!!!', err);
		})
}

function paintToCanvas(){
	const width = video.videoWidth;
	const height = video.videoHeight;
	console.log(width);
	console.log(height);
	canvas.width = `${width}px`;
	canvas.height = `${height}px`;
	console.log(width)
	console.log(height);
	return setInterval(() => {
		ctx.drawImage(video, 0, 0, width, height);
	}, 16)
}

function takePhoto(){
	//played the sound
	snap.currentTime = 0;
	snap.play();

	//takes the data out of the canvas
	const data = canvas.toDataURL('image/jpeg')
	const link = document.createElement('a');
	const attributeText = 'webcamImage';
	link.href = data;
	link.setAttribute('download', attributeText);
	link.innerHTML = `<img src="${data}" alt="${attributeText}"/>`;
	strip.insertBefore(link, strip.firstChild);
}

video.addEventListener('canplay', paintToCanvas);



getVideo();