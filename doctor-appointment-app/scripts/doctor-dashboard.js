let patients = [];
let medicines = [];
let selectedAppointment = null;

if (!localStorage.getItem("accessToken")) {
    window.location.href = "../doctor-login.html";
}

async function getPatientList() {
    try {
        const response = await fetch('http://localhost:4000/users', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        });
        patients = await response.json();
    } catch (error) {

    }
}

async function getMedicines() {
    try {
        const response = await fetch('http://localhost:4000/medicines', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        });
        medicines = await response.json();
        const medicinesTbody = document.getElementById('medicines-tbody');
        let medicinesStr = '';
        medicines.forEach(function (medicine) {
            medicinesStr += `
                <tr>
                    <td>
                        <div class="form-check">
                            <input class="form-check-input medicine-selected" type="checkbox" value="" id="checkDefault">
                        </div>
                    </td>
                    <td>${medicine.name}</td>
                    <td>${medicine.type}</td>
                    <td>${medicine.dosage}</td>
                </tr>
            `;
        });
        medicinesTbody.innerHTML = medicinesStr;
    } catch (error) {

    }
}

async function getAppointmentsByDoctorId() {
    try {
        const response = await fetch(`http://localhost:4000/appointments?doctorId=${localStorage.getItem('doctor-id')}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        });
        const parsedResponse = await response.json();
        const appointmentsTableBody = document.getElementById('appointmentsTableBody');
        let appointmentsStr = '';
        parsedResponse.forEach(function (appointment) {
            appointmentsStr += `
                <tr>
                    <td>${getPatientName(appointment.patientId)}</td> 
                    <td>${appointment.selectedService}</td>
                    <td>${appointment.appointmentDate} ${appointment.appointmentTime}</td>
                    <td>
                    ${appointment.status === "Scheduled"
                    ? `
                        <button class="btn btn-success btn-sm"
                            onclick="updateStatus(${appointment.id}, 'Completed')">
                            Complete
                        </button>

                        <button class="btn btn-danger btn-sm ms-1"
                            onclick="updateStatus(${appointment.id}, 'Cancelled')">
                            Cancel
                        </button>
    `
                    : `${appointment.status}`
                }
                    </td>
                    <td>
                        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#selectMedicines" onclick="storeAppointmentId(${appointment.id})">Add Medicines</button>
                    </td>
                </tr>
            `;
        });
        appointmentsTableBody.innerHTML = appointmentsStr;
    } catch (error) {

    }
}
getPatientList();
getMedicines();
getAppointmentsByDoctorId();

function getPatientName(patientId) {
    let name = '';
    patients.forEach(function (patient) {
        if (patient.id == patientId) {
            name = patient.name;
        }
    });
    return name;
}

async function storeAppointmentId(id) {
    selectedAppointment = id;

    // Fetch the appointment to get suggestedMedicines
    try {
        const response = await fetch(`http://localhost:4000/appointments/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        });
        const appointment = await response.json();

        // Check medicines that are already in suggestedMedicines
        checkMedicinesInSuggestedMedicines(appointment.suggestedMedicines || []);
    } catch (error) {
        console.error('Error fetching appointment:', error);
        // If error, uncheck all medicines
        checkMedicinesInSuggestedMedicines([]);
    }
}

async function updateStatus(appointmentId, newStatus) {
  await fetch(`http://localhost:4000/appointments/${appointmentId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      status: newStatus
    })
  });

  alert(`Appointment marked as ${newStatus}`);
  getAppointmentsByDoctorId(); // refresh table
}

function checkMedicinesInSuggestedMedicines(suggestedMedicineIds) {
    const medicineInputs = document.getElementsByClassName('medicine-selected');

    // First, uncheck all medicines
    for (let i = 0; i < medicineInputs.length; i++) {
        medicineInputs[i].checked = false;
    }

    // Then check medicines that are in suggestedMedicines
    if (suggestedMedicineIds && suggestedMedicineIds.length > 0 && medicines.length > 0) {
        for (let i = 0; i < medicines.length; i++) {
            // Check if this medicine ID is in the suggestedMedicines array
            if (suggestedMedicineIds.includes(medicines[i].id)) {
                if (medicineInputs[i]) {
                    medicineInputs[i].checked = true;
                }
            }
        }
    }
}

async function saveMedicines() {
    const medicineInputs = document.getElementsByClassName('medicine-selected');
    const selectedMedicineIds = [];

    for (let i = 0; i < medicineInputs.length; i++) {
        if (medicineInputs[i].checked) {
            selectedMedicineIds.push(medicines[i].id);
        }
    }

    const requestBody = {
        suggestedMedicines: selectedMedicineIds
    };

    const response = await fetch('http://localhost:4000/appointments/' + selectedAppointment, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    });
    const parsedResponse = await response.json();

    // Close the modal
    const modalElement = document.getElementById('selectMedicines');
    const modal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
    modal.hide();
    getAppointmentsByDoctorId();
    window.alert('Added medicines successfully');
}