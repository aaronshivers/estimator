const navLinks = document.getElementById('navLinks')

document.cookie ? null : navLinks.innerHTML += `<li class="nav-item"><a class="nav-link" href="/users/login">Login</a></li>`
document.cookie ? null : navLinks.innerHTML += `<li class="nav-item"><a class="nav-link" href="/users/signup">Signup</a></li>`
document.cookie ? navLinks.innerHTML += `<li class="nav-item"><a class="nav-link" href="/calculator">Calculator</a></li>` : null
document.cookie ? navLinks.innerHTML += `<li class="nav-item"><a class="nav-link" href="/settings">Settings</a></li>` : null
document.cookie ? navLinks.innerHTML += `<li class="nav-item"><a class="nav-link" href="/info">Info</a></li>` : null
document.cookie ? navLinks.innerHTML += `<li class="nav-item"><a class="nav-link" href="/users/me">Profile</a></li>` : null
document.cookie ? navLinks.innerHTML += `<li class="nav-item"><a class="nav-link" href="/users/logout">Logout</a></li>` : null
