// A smoother, time-based function to start the counter animation
const startCounter = (element) => {
    // The final number to count up to
    const finalNumber = parseInt(element.textContent, 10);
    // The total duration of the animation in milliseconds
    const duration = 3500; // 2 seconds
    // This will hold the start time of the animation
    let startTime = null;

    // The 'animate' function will be called on every frame
    const animate = (currentTime) => {
        // If it's the first frame, set the startTime
        if (startTime === null) {
            startTime = currentTime;
        }

        // Calculate the time that has passed
        const elapsedTime = currentTime - startTime;

        // Calculate the progress of the animation (a number from 0 to 1)
        // We use Math.min to ensure the progress doesn't go over 1
        const progress = Math.min(elapsedTime / duration, 1);

        // Calculate the current number to display based on the progress
        const currentDisplayNumber = Math.floor(progress * finalNumber);

        // Update the element's text content
        element.textContent = currentDisplayNumber;

        // If the animation is not yet complete...
        if (progress < 1) {
            // ...request the next animation frame to continue the count
            requestAnimationFrame(animate);
        } else {
            // Once complete, make sure the final number is set correctly
            element.textContent = finalNumber;
        }
    };

    // Start the animation by requesting the first frame
    requestAnimationFrame(animate);
};

// --- This part below remains the same ---

// Set up the Intersection Observer to watch for when the counter elements become visible.
const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        // Check if the element is visible in the viewport
        if (entry.isIntersecting) {
            // If it's visible, start the counter animation
            startCounter(entry.target);
            // Stop observing the element so the animation only runs once
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1
});

// Find all counter elements and tell the observer to watch them
document.querySelectorAll('[data-toggle="counter-up"]').forEach(counterElement => {
    observer.observe(counterElement);
});