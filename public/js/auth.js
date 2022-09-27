const myForm = document.querySelector("form");

let url = window.location.hostname.includes("localhost")
  ? "http://localhost:8080/api/auth/"
  : "https://tonymessenger.herokuapp.com/api/auth/";

console.log(url);

myForm.addEventListener("submit", async(ev) => {
  ev.preventDefault();
  const formData = {};

  for (let element of myForm.elements) {
    if (element.name.length > 0) {
      formData[element.name] = element.value;
    }
  }

  fetch(url + "login", {
    method: "POST",
    body: JSON.stringify(formData),
    headers: { "Content-Type": "application/json" },
  })
  .then(res => res.json())
  .then(async({msg, token, errors}) => {
    if(errors){
        return console.error(errors)
    }
    await localStorage.setItem('token', token);
    window.location = 'chat.html';
  })
  .catch(error => {
    console.log(error);
  })
});

function handleCredentialResponse(response) {
  const body = { id_token: response.credential };
  fetch(`${url}google`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body), //body siempre debe estar serializado
  })
    .then((res) => res.json())
    .then(async (res) => {
      localStorage.setItem("email", res.googleUser.mail);
      localStorage.setItem("token", res.token);
      window.location = 'chat.html';
    })
    .catch(console.log);
}

const btnSign = document.getElementById("signOut");
btnSign.onclick = () => {
  google.accounts.id.disableAutoSelect();

  google.accounts.id.revoke(localStorage.getItem("email"), (done) => {
    localStorage.clear();
    location.reload();
  });
};
