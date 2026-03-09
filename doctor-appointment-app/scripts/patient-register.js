// Form validation
const form = document.getElementById('registrationForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const phoneInput = document.getElementById('phone');

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

// Phone validation (numeric only)
phoneInput.addEventListener('input', function() {
    this.value = this.value.replace(/[^0-9]/g, '');
});

phoneInput.addEventListener('blur', function() {
    const phone = this.value;
    const feedback = document.getElementById('phoneFeedback');
    
    if (phone && !/^[0-9]+$/.test(phone)) {
        this.classList.add('is-invalid');
        this.classList.remove('is-valid');
        feedback.textContent = 'Phone number should contain only digits';
        feedback.style.display = 'block';
    } else if (phone) {
        this.classList.remove('is-invalid');
        this.classList.add('is-valid');
        feedback.style.display = 'none';
    }
});

// Name validation
nameInput.addEventListener('blur', function() {
    const name = this.value.trim();
    const feedback = document.getElementById('nameFeedback');
    
    if (name && name.length < 2) {
        this.classList.add('is-invalid');
        this.classList.remove('is-valid');
        feedback.textContent = 'Name must be at least 2 characters long';
        feedback.style.display = 'block';
    } else if (name) {
        this.classList.remove('is-invalid');
        this.classList.add('is-valid');
        feedback.style.display = 'none';
    }
});

// Form submission
form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Validate all fields
    let isValid = true;
    
    if (!nameInput.value.trim()) {
        nameInput.classList.add('is-invalid');
        isValid = false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value || !emailRegex.test(emailInput.value)) {
        emailInput.classList.add('is-invalid');
        isValid = false;
    }
    
    if (!passwordInput.value || passwordInput.value.length < 6) {
        passwordInput.classList.add('is-invalid');
        isValid = false;
    }
    
    if (!phoneInput.value || !/^[0-9]+$/.test(phoneInput.value)) {
        phoneInput.classList.add('is-invalid');
        isValid = false;
    }
    
    if (isValid) {
        try {
            const requestBody = {
                name: nameInput.value,
                email: emailInput.value,
                password: passwordInput.value,
                phone: phoneInput.value
            };
            var isLoading = true;
            const response = await fetch('http://localhost:4000/users', {
                method: 'POST',
                body: JSON.stringify(requestBody),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const parsedResponse = await response.json();
            isLoading = false;

            if (parsedResponse === 'Email already exists') {
                window.alert('Email already exists');
            } else {
                window.alert('Registered successfully');
                setTimeout(function() {
                    window.location.href = 'patient-login.html';
                }, 500);
            }
        } catch(error) {

        }
    } else {
        alert('Please fill all fields correctly');
    }
});