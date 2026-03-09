// Form validation
const form = document.getElementById('registrationForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const specializationInput = document.getElementById('specialization');
const experienceInput = document.getElementById('experience');

// Form submission
form.addEventListener('submit', async function (e) {
    e.preventDefault();
    try {
        const requestBody = {
            name: nameInput.value,
            email: emailInput.value,
            password: passwordInput.value,
            specialization: specializationInput.value,
            experience: experienceInput.value
        };
        var isLoading = true;
        const response = await fetch('http://localhost:4000/doctors', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const parsedResponse = await response.json();
        isLoading = false;
            window.alert('Registered successfully');
            window.location.href = 'doctor-login.html';
    } catch (error) {

    }
});