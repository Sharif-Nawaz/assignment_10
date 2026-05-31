Project name: PetPaw
Project Purpose:

PetPaw is a winter-focused pet care platform designed to help pet owners keep their furry friends warm, safe, and healthy during the cold season.
The application provides access to winter pet care services, expert advice, grooming options, and cozy clothing — all within a modern, user-friendly single-page application.



Live URL: http://localhost:5173/




Key Features:

Authentication

Email & Password Login
Google Social Login
Secure Firebase Authentication
Protected Routes (Service Details & Profile)
Redirects user to desired route after login
Password validation during signup:
At least 6 characters
Must contain uppercase & lowercase letters
Forgot Password functionality (redirects to Gmail)


Home Page

Winter-themed Hero Slider using Swiper
Popular Winter Pet Care Services (loaded from JSON)
Winter Care Tips for Pets
Meet Our Expert Vets section
Extra relevant section (Pet Winter Safety / Accessories / Nutrition)


 Services

Services loaded from a JSON file (minimum 6 services)
Each service card includes:
Image
Service Name
Rating
Price
View Details button


Service Details (Protected Route)

Only logged-in users can access
Redirects unauthenticated users to Login
Displays full service details

Booking Form:
Name
Email



My Profile

Displays user:
Name
Email
Profile Image
Update Profile feature:
Update Name
Update Photo URL using updateProfile()


Layout

Persistent Navbar & Footer
Navbar behavior:
Logged out → Login / Register
Logged in → Avatar + Display Name (hover) + Logout
SPA behavior (no reload crash)
404 Not Found page for invalid routes


Responsiveness

Fully responsive on:
Mobile
Tablet 
Desktop





NPM Packages Used:

firebase

react-router-dom

react-icons

daisyui

tailwindcss