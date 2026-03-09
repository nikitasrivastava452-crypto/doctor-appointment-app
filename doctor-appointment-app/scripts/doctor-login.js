let doctors = [];

async function getDoctorList() {
    try {
        const response = await fetch('http://localhost:4000/doctors', { 
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        });
        doctors = await response.json();
    } catch(error) {

    }
}

getDoctorList();

document.getElementById('registrationForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    let doctorInfo = null;
    doctors.forEach(function(doctor) {
        if (doctor.email === emailInput.value && doctor.password === passwordInput.value) {
            doctorInfo = doctor;
        }
    });

    if (doctorInfo) {
        localStorage.setItem('doctor-id', doctorInfo.id);
        window.alert('Logged in successfully');
        window.location.href = './doctor-dashboard.html';
    } else {
        window.alert('Incorrect email or password');
    }

});