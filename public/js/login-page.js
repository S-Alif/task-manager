// get elements - panels
const login_panel = document.querySelector('.login-panel')
const sign_panel = document.querySelector('.sign-in-panel')
const otp_panel = document.querySelector('.otp-panel')

// get elements - buttons(submit btns)
const submit_btns = document.querySelectorAll('.submit-btn')

// get elements - buttons(switch panels)
const goTo_reg = document.getElementById('goto-reg-panel')
const goTo_login = document.getElementById('goto-login-panel')

// get form elements-login
const email = document.getElementById('email')
const pass = document.getElementById('pass')

// get form elements-registration
const sign_email = document.getElementById('sign-email')
const sign_pass = document.getElementById('sign-pass')
const fName = document.getElementById('fName')
const lName = document.getElementById('lName')

// get form elements-otp
const otp = document.getElementById('otp')

const send_otp_again = document.getElementById('send-otp-again')


// switching panels
goTo_reg.onclick = () => {
  login_panel.classList.add('my-fade-out')
  sign_panel.classList.remove('my-fade-out')
  sign_panel.classList.add('my-fade-in')
}
goTo_login.onclick = () => {
  login_panel.classList.add('my-fade-in')
  login_panel.classList.remove('my-fade-out')
  sign_panel.classList.remove('my-fade-in')
  sign_panel.classList.add('my-fade-out')
}


// registration data validation
let reg_data_validation = () => {

  if (validateEmail(sign_email.value) == false) {
    show_alert("invalid email", "alert-danger")
  }
  else if (sign_pass.value.length <= 10) {
    show_alert("password must be larger than 10 chanracters", "alert-danger")
  }
  else if (fName.value.length < 3 || fName.value == "") {
    show_alert("first name cannot be less than 3 character or empty", "alert-danger")
  }
  else if (lName.value.length < 3 || lName.value == "") {
    show_alert("last name cannot be less than 3 character or empty", "alert-danger")
  }
  else {
    sign_in(sign_email.value, sign_pass.value, fName.value, lName.value)
  }
}

// data verification
submit_btns.forEach(e => {
  e.addEventListener('click', (btn) => {
    btn.preventDefault()
    let parentId = e.parentElement.id

    if(parentId == "login-form"){
      log_in(email.value, pass.value)
    }
    if(parentId == "sign-form"){
      reg_data_validation()
    }
    if(parentId == "otp-form"){
      verify_otp(sign_email.value, otp.value)
    }
  })
})

// email validate
let validateEmail = (mail) => {

  if(mail == ""){
    return false
  }
  else if (mail.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)){
    return true
  }
  else{
    return false
  }
}

// signing in
let sign_in = async (email, password, first_name, last_name) => {

  await fetch('http://localhost:8000/task-manager/registration', {
    method: 'POST',
    headers: {
      Accept: 'application.json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: email,
      password: password,
      firstName: first_name,
      lastName: last_name
    })
  }).then(res => res.json())
    .then(data => {

      if (data.status == 'successfull') {
        show_alert("registration successful", "alert-success")
        setTimeout(() => {
          send_otp(sign_email.value)
        }, 3000)
      }
      else {
        show_alert("registration failed", "alert-danger")
      }
    })  
}

// logging in
let log_in = async (email, password) => {

  await fetch('http://localhost:8000/task-manager/login', {
    method: 'POST',
    headers: {
      Accept: 'application.json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: email,
      password: password
    })
  }).then(res => res.json())
    .then(data => {
      console.log(data)
      if (data.status == 'successfull') {
        show_alert("login successful", "alert-success")
        localStorage.setItem('token', data.data)

        setTimeout(() => {
          window.location.replace('../user-detail.html')
        }, 5000)
      }
      else {
        show_alert("login failed", "alert-danger")
      }
    })  
}

//sending otp
let send_otp = async (mail) => {
  let url = `http://localhost:8000/task-manager/send-otp/${mail}`
  
  await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application.json',
      'Content-Type': 'application/json'
    }
  }).then(res => res.json())
    .then(data => {
      if(data.status == "successfull"){
        sign_panel.classList.add('my-fade-out')
        sign_panel.classList.remove('my-fade-in')
        otp_panel.classList.remove('my-fade-out')
        otp_panel.classList.add('my-fade-in')
        setTimeout(() => {
          show_alert("OTP was sent to your account", "alert-success")
        }, 2000)
      }
    })
}

// if no otp was sent / user did not get otp
send_otp_again.onclick = () => {
  send_otp(sign_email.value)
}
//verifying otp
let verify_otp = async (email, otp) => {

  await fetch(`http://localhost:8000/task-manager/verify-otp/${email}/${otp}`, {
    method: 'GET',
    headers: {
      Accept: 'application.json',
      'Content-Type': 'application/json'
    }
  }).then(res => res.json())
    .then(data => {
      if (data.status == "successfull") {
        show_alert("verification success", "alert-success")
        setTimeout(() => {
          otp_panel.classList.add('my-fade-out')
          otp_panel.classList.remove('my-fade-in')
          login_panel.classList.add('my-fade-in')
          login_panel.classList.remove('my-fade-out')
        }, 2000)

        return true
      }
    })
}