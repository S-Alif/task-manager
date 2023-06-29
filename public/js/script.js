// show alerts
let show_alert = (alertText, alertBg) => {
  let alert = document.querySelector('.alert')

  alert.textContent = alertText
  alert.classList.add(alertBg)
  alert.classList.add("open")
  alert.classList.remove("my-fade-out")
  alert.classList.add("my-fade-in")

  setTimeout(() => {
    alert.classList.remove("open")
    alert.classList.remove(alertBg)
    alert.classList.add("my-fade-out")
    alert.classList.remove("my-fade-in")
  }, 5000)
}