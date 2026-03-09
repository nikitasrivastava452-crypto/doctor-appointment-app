// Form validation
const form = document.getElementById('registrationForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

// Email validation
emailInput.addEventListener('blur', function() {
    const email = this.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const feedback = document.getElementById('emailFeedback');
    
    if (email && !emailRegex.test(email)) {
        this.classList.add('is-invalid');
        this.classList.remove('is-valid');
        feedback.textContent = 'Please enter a valid email address';
        feedback.style.display = 'block';
    } else if (email) {
        this.classList.remove('is-invalid');
        this.classList.add('is-valid');
        feedback.style.display = 'none';
    }
});

// Password strength indicator
passwordInput.addEventListener('input', function() {
    const password = this.value;
    const strengthDiv = document.getElementById('passwordStrength');
    const strengthBar = document.getElementById('strengthBar');
    
    if (password.length > 0) {
        strengthDiv.style.display = 'block';
        if (password.length < 6) {
            strengthBar.className = 'strength-bar strength-weak';
        } else if (password.length < 10) {
            strengthBar.className = 'strength-bar strength-medium';
        } else {
            strengthBar.className = 'strength-bar strength-strong';
        }
    } else {
        strengthDiv.style.display = 'none';
    }
});
// Form submission
form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Validate all fields
    let isValid = true;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value || !emailRegex.test(emailInput.value)) {
        emailInput.classList.add('is-invalid');
        isValid = false;
    }
    
    if (!passwordInput.value || passwordInput.value.length < 6) {
        passwordInput.classList.add('is-invalid');
        isValid = false;
    }
    
    if (isValid) {
        try {
            const requestBody = {
                email: emailInput.value,
                password: passwordInput.value,
            };
            var isLoading = true;
            const response = await fetch('http://localhost:4000/login', {
                method: 'POST',
                body: JSON.stringify(requestBody),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const parsedResponse = await response.json();
            isLoading = false;

            console.log(parsedResponse);

            if (parsedResponse === 'Cannot find user') {
                window.alert('Please verify your email or create an account');
            } else if (parsedResponse === 'Incorrect password') {
                window.alert('Incorrect password');
            } else {
                console.log(parsedResponse);
                localStorage.setItem('accessToken', parsedResponse.accessToken);
                localStorage.setItem('patientId', parsedResponse.user.id);
                window.alert('Login successful');
                window.location.href = 'patient-dashboard.html';
            }

            // if (parsedResponse === 'Email already exists') {
            //     window.alert('Email already exists');
            // } else {
            //     window.alert('Registered successfully');
            //     setTimeout(function() {
            //         window.location.href = 'patient-login.html';
            //     }, 500);
            // }
        } catch(error) {

        }
    } else {
        alert('Please fill all fields correctly');
    }
});