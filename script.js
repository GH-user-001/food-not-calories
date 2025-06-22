document.addEventListener('DOMContentLoaded', () => {
    // Element references
    const videoElement = document.getElementById('live-video');
    const photoCanvas = document.getElementById('photo-canvas');
    const timelineContainer = document.getElementById('timeline-container');
    const startCookingButton = document.getElementById('start-cooking');
    const finishCookingButton = document.getElementById('finish-cooking');
    const captureIntervalSelect = document.getElementById('capture-interval');

    const recipeNameEl = document.getElementById('recipe-name');
    const recipeTimeEl = document.getElementById('recipe-time');
    const recipeIngredientsEl = document.getElementById('recipe-ingredients');
    const recipeStepsEl = document.getElementById('recipe-steps');
    const recipeContentEl = document.getElementById('recipe-content');
    const initialRecipeMessageEl = recipeContentEl.querySelector('p');


    // State variables
    let stream;
    let captureIntervalId;
    let capturedImages = [];
    let isCooking = false;

    // Function to start the camera
    async function startCamera() {
        try {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
            stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
            videoElement.srcObject = stream;
            videoElement.style.display = 'block'; // Show video when stream is active
            photoCanvas.style.display = 'none';
        } catch (error) {
            console.error("Error accessing camera:", error);
            videoElement.style.display = 'none'; // Hide video element if camera access fails
            alert("Could not access the camera. Please ensure permissions are granted and no other app is using it.");
            // Optionally display an error message to the user in the UI
        }
    }

    // Function to capture a photo
    function capturePhoto() {
        if (!stream || !isCooking) return;

        const context = photoCanvas.getContext('2d');
        photoCanvas.width = videoElement.videoWidth;
        photoCanvas.height = videoElement.videoHeight;
        context.drawImage(videoElement, 0, 0, photoCanvas.width, photoCanvas.height);

        const imageDataUrl = photoCanvas.toDataURL('image/jpeg');
        capturedImages.push({ src: imageDataUrl, timestamp: new Date() });

        // Add photo to timeline
        const imgElement = document.createElement('img');
        imgElement.src = imageDataUrl;
        imgElement.alt = `Cooking step at ${new Date().toLocaleTimeString()}`;
        imgElement.title = `Captured at ${new Date().toLocaleTimeString()}`;
        timelineContainer.appendChild(imgElement);
        timelineContainer.scrollTop = timelineContainer.scrollHeight; // Scroll to the latest image
        console.log("Photo captured:", imageDataUrl.substring(0, 30) + "...");
    }

    // Event listener for Start Cooking button
    startCookingButton.addEventListener('click', async () => {
        if (isCooking) return;

        isCooking = true;
        startCookingButton.disabled = true;
        finishCookingButton.disabled = false;
        captureIntervalSelect.disabled = true;
        capturedImages = []; // Reset images
        timelineContainer.innerHTML = ''; // Clear previous timeline
        recipeContentEl.querySelector('p').style.display = 'block'; // Show initial message
        recipeNameEl.textContent = '';
        recipeTimeEl.textContent = '';
        recipeIngredientsEl.innerHTML = '';
        recipeStepsEl.innerHTML = '';


        await startCamera(); // Ensure camera is started before setting interval

        if (stream) { // Only set interval if stream is successfully started
            const interval = parseInt(captureIntervalSelect.value) * 1000;
            capturePhoto(); // Capture one photo immediately
            captureIntervalId = setInterval(capturePhoto, interval);
            console.log(`Cooking started. Capturing photos every ${interval / 1000} seconds.`);
        } else {
            console.log("Camera not available, cannot start photo capture interval.");
            // Reset UI if camera failed
            isCooking = false;
            startCookingButton.disabled = false;
            finishCookingButton.disabled = true;
            captureIntervalSelect.disabled = false;
        }
    });

    // Event listener for Finish Cooking button
    finishCookingButton.addEventListener('click', () => {
        if (!isCooking) return;

        isCooking = false;
        clearInterval(captureIntervalId);
        startCookingButton.disabled = false;
        finishCookingButton.disabled = true;
        captureIntervalSelect.disabled = false;

        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            stream = null;
            videoElement.srcObject = null;
            videoElement.style.display = 'none'; // Hide video feed when cooking is finished
        }
        console.log("Cooking finished. Total images captured:", capturedImages.length);
        generateRecipe();
    });

    // Function to generate recipe (mock for now)
    async function generateRecipe() {
        if (capturedImages.length === 0) {
            recipeContentEl.querySelector('p').textContent = "No photos were captured to generate a recipe.";
            recipeContentEl.querySelector('p').style.display = 'block';
            return;
        }

        initialRecipeMessageEl.textContent = "Generating your recipe, please wait...";
        initialRecipeMessageEl.style.display = 'block';


        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Mock AI response
        const mockRecipe = {
            name: "AI Generated Delicious Dish",
            time: `${Math.round(capturedImages.length * (parseInt(captureIntervalSelect.value)/60))} - ${Math.round(capturedImages.length * (parseInt(captureIntervalSelect.value)/60)) + 15} minutes`,
            ingredients: [
                "Ingredient 1 (based on images)",
                "Ingredient 2 (based on images)",
                "1 cup Water (example)",
                "Spices (to taste)"
            ],
            steps: capturedImages.map((img, index) => `Step ${index + 1}: Do something related to image ${index + 1} (e.g., add ingredients, stir, cook for X minutes).`)
        };

        if (capturedImages.length < 3) { // Example: if too few images, suggest a generic name
            mockRecipe.name = "Quick Experimental Dish";
        } else {
            // A more "AI" name based on image count or a hypothetical dominant color if we had image analysis
            const adjectives = ["Hearty", "Spicy", "Savory", "Quick", "Automated"];
            const nouns = ["Delight", "Feast", "Creation", "Mix", "Surprise"];
            mockRecipe.name = `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${nouns[Math.floor(Math.random() * nouns.length)]}`;
        }


        // Display recipe
        initialRecipeMessageEl.style.display = 'none';
        recipeNameEl.textContent = mockRecipe.name;
        recipeTimeEl.textContent = mockRecipe.time;

        recipeIngredientsEl.innerHTML = ''; // Clear previous
        mockRecipe.ingredients.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            recipeIngredientsEl.appendChild(li);
        });

        recipeStepsEl.innerHTML = ''; // Clear previous
        mockRecipe.steps.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            recipeStepsEl.appendChild(li);
        });

        console.log("Recipe generated:", mockRecipe);
    }

    // Initialize
    function init() {
        videoElement.style.display = 'none'; // Initially hide the video element
        photoCanvas.style.display = 'none'; // Ensure canvas is also hidden initially

        // Check for camera support
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            alert("getUserMedia is not supported in your browser! Camera functionality will not work.");
            startCookingButton.disabled = true;
            captureIntervalSelect.disabled = true;
        }
        // Set initial state for buttons
        finishCookingButton.disabled = true;
    }

    init();
});
