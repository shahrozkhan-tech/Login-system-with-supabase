import { supabaseClient } from "./supabaseConfig.js";

const signUpButton = document.getElementById("signUp");
const signInButton = document.getElementById("signIn");
const container = document.getElementById("container");
const signInLink = document.querySelector(".clean-toggle");
const signUpLink = document.querySelector(".toggle-link");




async function loginWithGitHub(e) {
    if (e) e.preventDefault();
    
    Swal.showLoading(); 

    const { data, error } = await client.auth.signInWithOAuth({
        provider: 'github',
        options: {
            redirectTo: 'https://pro-todo-app.vercel.app/todo.html'
        }
    });

    if (error) {
        Swal.fire({ icon: 'error', title: 'GitHub Login Failed', text: error.message });
        console.error("GitHub Auth Error:", error);
    }
}



if (signInButton) {
  signInButton.addEventListener("click", () =>
    container.classList.remove("right-panel-active"),
  );
}

if (signInLink) {
  signInLink.addEventListener("click", (e) => {
    e.preventDefault();
    container.classList.remove("right-panel-active");
  });
}

if (signUpButton) {
  signUpButton.addEventListener("click", () =>
    container.classList.add("right-panel-active"),
  );
}

if (signUpLink) {
  signUpLink.addEventListener("click", (e) => {
    e.preventDefault();
    container.classList.add("right-panel-active");
  });
}

let loginBtn = document.getElementById("signin");
let signupBtn = document.getElementById("signup");
let logoutBtn = document.getElementById("logout");
let forgotBtn = document.getElementById("forgot-btn");

let nameSpan = document.getElementById("userName");
let emailSpan = document.getElementById("userEmail");
let phoneSpan = document.getElementById("userPhone");
let updatePassInput = document.getElementById("new-pass");
let updatePassBtn = document.getElementById("update-pass-btn");

// Login Func
if (loginBtn) {
  loginBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    const emailValue = document.getElementById("email").value;
    const passwordValue = document.getElementById("pass").value;

    if (!emailValue || !passwordValue) {
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "Please fill both fields",
      });
      return;
    }

    loginBtn.disabled = true;
    loginBtn.innerText = "Logging in...";

    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email: emailValue,
      password: passwordValue,
    });

    loginBtn.disabled = false;
    loginBtn.innerText = "Sign In";

    if (error) {
      Swal.fire({ icon: "error", title: "Login Failed", text: error.message });
      return;
    } else {
      await Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Login Successful!",
        timer: 1500,
        showConfirmButton: false,
      });
      window.location.href = "./dashboard.html";
    }
  });
}

// Signup Func
if (signupBtn) {
  signupBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    const emailValue = document.querySelector(".signup-email").value.trim();
    const passwordValue = document.querySelector(".signup-pass").value.trim();
    const userName = document.getElementById("username-inp").value.trim();
    const phNumber = document.getElementById("ph-inp").value.trim();

    if (!emailValue || !passwordValue || !userName || !phNumber) {
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "Please fill all fields",
      });
      return;
    }

    if (phNumber.length !== 11) {
      Swal.fire({
        icon: "error",
        title: "Invalid Phone Number",
        text: "Phone number must be exactly 11 digits long!",
      });
      return;
    }

    if (isNaN(phNumber)) {
      Swal.fire({
        icon: "error",
        title: "Invalid Format",
        text: "Phone number must contain numbers only!",
      });
      return;
    }

    signupBtn.disabled = true;
    signupBtn.innerText = "Signing up...";

    const { data, error } = await supabaseClient.auth.signUp({
      email: emailValue,
      password: passwordValue,
      options: {
        data: {
          first_name: userName,
          full_name: userName,
          phone_number: phNumber,
        },
      },
    });

    signupBtn.disabled = false;
    signupBtn.innerText = "Sign Up";

    if (error) {
      Swal.fire({
        icon: "error",
        title: "Sign Up Failed",
        text: error.message,
      });
      return;
    } else {
      await Swal.fire({
        icon: "success",
        title: "Registered!",
        text: "Sign Up Successful!",
        timer: 1500,
        showConfirmButton: false,
      });
      window.location.href = "./dashboard.html";
    }
  });
}

// Social Login
window.loginWithSocial = async function (providerName) {
  const { error } = await supabaseClient.auth.signInWithOAuth({
    provider: providerName,
    options: {
      // redirectTo: window.location.origin + "/dashboard.html",
      redirectTo: 'https://shahrozkhan-tech.github.io/Login-system-with-supabase/dashboard.html',
    },
  });

  if (error) {
    Swal.fire({ icon: "error", title: "Oops...", text: error.message });
  }
};

// Forgot Password Func
if (window.location.pathname.includes("forgot.html")) {
  const sendResetBtn = document.getElementById("send-reset-btn");
  const forgotEmailInput = document.getElementById("forgot-email");

  sendResetBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    const emailValue = forgotEmailInput.value.trim();

    if (!emailValue) {
      Swal.fire({
        icon: "warning",
        title: "Email Required",
        text: "Please enter your email address.",
      });
      return;
    }

    sendResetBtn.disabled = true;
    sendResetBtn.innerText = "Sending link...";

    const { error } = await supabaseClient.auth.resetPasswordForEmail(
      emailValue,
      {
        redirectTo: window.location.origin + "/update-password.html",
      },
    );

    sendResetBtn.disabled = false;
    sendResetBtn.innerText = "Send Reset Link";

    if (error) {
      Swal.fire({ icon: "error", title: "Error", text: error.message });
    } else {
      Swal.fire({
        icon: "success",
        title: "Link Sent!",
        text: "Password reset link has been sent to your email.",
      });
      forgotEmailInput.value = "";
    }
  });
}

// Update Pass Func
if (window.location.pathname.includes("update-password.html")) {
  updatePassBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    const newPassword = updatePassInput.value;

    if (!newPassword || newPassword.length < 6) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Password",
        text: "Password must be at least 6 characters long.",
      });
      return;
    }

    updatePassBtn.disabled = true;
    updatePassBtn.innerText = "Updating...";

    const { error } = await supabaseClient.auth.updateUser({
      password: newPassword,
    });

    updatePassBtn.disabled = false;
    updatePassBtn.innerText = "Update Password";

    if (error) {
      Swal.fire({ icon: "error", title: "Failed", text: error.message });
    } else {
      await Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Password updated successfully! Please login.",
        timer: 2000,
        showConfirmButton: false,
      });
      window.location.href = "./index.html";
    }
  });
}

// Logout Funct

if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
      Swal.fire({ icon: "error", title: "Logout Failed", text: error.message });
    } else {
      await Swal.fire({
        icon: "success",
        title: "Logged Out",
        text: "Logout Successful!",
        timer: 1500,
        showConfirmButton: false,
      });
      window.location.href = "./index.html";
    }
  });
}

// Dashboard Page Logic
if (window.location.pathname.includes("dashboard.html")) {
  const nameSpan = document.getElementById("userName");
  const headerNameSpan = document.getElementById("userName-hed");
  const emailSpan = document.getElementById("userEmail");
  const phoneSpan = document.getElementById("userPhone");
  const avatarImg = document.getElementById("userAvatar");

  const editBtn = document.getElementById("edit-profile-btn");
  const editBtnText = document.getElementById("edit-btn-text");

  const editNameInp = document.getElementById("editNameInp");
  const editPhoneInp = document.getElementById("editPhoneInp");

  // Show User Info Func
  async function showUserInfo() {
    const { data, error } = await supabaseClient.auth.getUser();

    if (error || !data.user) {
      window.location.href = "./index.html";
      return;
    }

    const user = data.user;
    const currentName =
      user.user_metadata.full_name ||
      user.user_metadata.first_name ||
      "No Name Found";
    const currentPhone = user.user_metadata.phone_number || "No Phone Number";

    if (avatarImg && user.user_metadata.avatar_url) {
      avatarImg.src = user.user_metadata.avatar_url;
    }
    if (headerNameSpan) headerNameSpan.innerText = currentName;
    if (nameSpan) nameSpan.innerText = currentName;
    if (emailSpan) emailSpan.innerText = user.email;
    if (phoneSpan) phoneSpan.innerText = currentPhone;

    if (editNameInp) editNameInp.value = currentName;
    if (editPhoneInp) editPhoneInp.value = currentPhone;
  }

  let isEditing = false;

  //  Edit Func
  if (editBtn) {
    editBtn.addEventListener("click", async () => {
      if (!isEditing) {
        isEditing = true;
        editBtnText.innerText = "Save Changes";
        editBtn.querySelector("i").className = "fas fa-save";

        nameSpan.style.display = "none";
        phoneSpan.style.display = "none";
        editNameInp.style.display = "block";
        editPhoneInp.style.display = "block";
      } else {
        const updatedName = editNameInp.value.trim();
        const updatedPhone = editPhoneInp.value.trim();

        if (!updatedName) {
          Swal.fire({
            icon: "warning",
            title: "Required",
            text: "Name cannot be empty!",
          });
          return;
        }

        if (
          updatedPhone &&
          updatedPhone !== "No Phone Number" &&
          updatedPhone.length !== 11
        ) {
          Swal.fire({
            icon: "error",
            title: "Invalid Phone",
            text: "Phone number must be exactly 11 digits!",
          });
          return;
        }

        editBtn.disabled = true;
        editBtnText.innerText = "Saving...";

        const { data, error } = await supabaseClient.auth.updateUser({
          data: {
            full_name: updatedName,
            first_name: updatedName,
            phone_number: updatedPhone,
          },
        });

        editBtn.disabled = false;

        if (error) {
          Swal.fire({
            icon: "error",
            title: "Update Failed",
            text: error.message,
          });
        } else {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Profile updated!",
            timer: 1500,
            showConfirmButton: false,
          });

          isEditing = false;
          editBtnText.innerText = "Edit Profile";
          editBtn.querySelector("i").className = "fas fa-edit";

          editNameInp.style.display = "none";
          editPhoneInp.style.display = "none";
          nameSpan.style.display = "block";
          phoneSpan.style.display = "block";

          showUserInfo();
        }
      }
    });
  }

  showUserInfo();
}
