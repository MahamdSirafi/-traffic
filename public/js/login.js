let ForgotPassword = document.querySelector(".ForgotPassword");
let email1;
ForgotPassword.addEventListener("click", () => {
  email1 = document.getElementById("Email").value;
  let data = { email: `${email1}` };
  fetch("http://localhost:8500/users/forgotPassword", {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => (window.location.href = data.url))
    .catch((err) => {
      console.log(err);
    });
});
