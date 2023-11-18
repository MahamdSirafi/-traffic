const loginText = document.querySelector(".title-text .form1");
      const loginForm = document.querySelector("form.form1");
      const loginBtn = document.querySelector("label.form1");
      const signupBtn = document.querySelector("label.form2");
      const signupLink = document.querySelector("form .signup-link a");
      signupBtn.onclick = (()=>{
        loginForm.style.marginLeft = "-50%";
        loginText.style.marginLeft = "-70%";
      });

       loginBtn.onclick = (()=>{
         loginForm.style.marginLeft = "0%";
         loginText.style.marginLeft = "0%";
       });
       signupLink.onclick = (()=>{
         signupBtn.click();
         return false;
       });


     