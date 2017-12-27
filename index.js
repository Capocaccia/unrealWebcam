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
	canvas.width = width;
	canvas.height = height;

	return setInterval(() => {
		ctx.drawImage(video, 0, 0, width, height);

		//get all the pixels
		let pixels = ctx.getImageData(0, 0, width, height);

		//mess width them
		pixels = redEffect(pixels);

		//ghosting mode
		//ctx.globlaAlpha = 0.1;

		//put them back
		ctx.putImageData(pixels, 0, 0)
	}, 16)
}

function redEffect(pixels){
	for(let i = 0; i < pixels.data.length; i += 4){
		pixels[i] = pixels.data[i + 0] + 100;
		pixels[i + 1] = pixels.data[i + 1] - 50;
		pixels[i + 2] = pixels.data[i + 2] * 0.5;
	}
	return pixels;
}

function rgbSplit(pixels){
	for(let i = 0; i < pixels.data.length; i += 4){
		pixels[i - 150] = pixels.data[i + 0];
		pixels[i + 150] = pixels.data[i + 1];
		pixels[i - 150] = pixels.data[i + 2];
	}
	return pixels;
}

function greenScreen(pixels) {
  const levels = {};

  document.querySelectorAll('.rgb input').forEach((input) => {
    levels[input.name] = input.value;
  });

  for (i = 0; i < pixels.data.length; i = i + 4) {
    red = pixels.data[i + 0];
    green = pixels.data[i + 1];
    blue = pixels.data[i + 2];
    alpha = pixels.data[i + 3];

    if (red >= levels.rmin
      && green >= levels.gmin
      && blue >= levels.bmin
      && red <= levels.rmax
      && green <= levels.gmax
      && blue <= levels.bmax) {
      // take it out!
      pixels.data[i + 3] = 0;
    }
  }

  return pixels;
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