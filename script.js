document.addEventListener('DOMContentLoaded', () => {
    
    // --- LOGIN PAGE LOGIC ---
    if (document.getElementById('loginForm')) {
        const loginForm = document.getElementById('loginForm');
        const signupForm = document.getElementById('signupForm');
        const showSignup = document.getElementById('showSignup');
        const showLogin = document.getElementById('showLogin');

        showSignup.addEventListener('click', (e) => {
            e.preventDefault();
            loginForm.classList.remove('active');
            signupForm.classList.add('active');
        });

        showLogin.addEventListener('click', (e) => {
            e.preventDefault();
            signupForm.classList.remove('active');
            loginForm.classList.add('active');
        });

        const handleAuth = (e) => {
            e.preventDefault();
            // In a real app, you would have authentication logic here.
            // On success, redirect to the main page.
            window.location.href = 'index.html'; 
        };

        loginForm.addEventListener('submit', handleAuth);
        signupForm.addEventListener('submit', handleAuth);
    }

    // --- MAIN PAGE LOGIC ---
    if (document.getElementById('map')) {
        
        // --- THEME TOGGLER ---
        const themeToggle = document.getElementById('theme-toggle');
        const currentTheme = localStorage.getItem('theme') || 'light-mode';
        document.body.classList.add(currentTheme);

        themeToggle.addEventListener('click', () => {
            let newTheme = document.body.classList.contains('light-mode') ? 'dark-mode' : 'light-mode';
            document.body.classList.remove('light-mode', 'dark-mode');
            document.body.classList.add(newTheme);
            localStorage.setItem('theme', newTheme);
        });

        // --- MAP INITIALIZATION ---
        const map = L.map('map').setView([30.91, 75.85], 9); // Centered on Ludhiana, zoomed out for Punjab view
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // --- ICONS ---
        const busIcon = L.icon({ iconUrl: 'https://img.icons8.com/plasticine/100/bus.png', iconSize: [40, 40], iconAnchor: [20, 20] });
        const standIcon = L.icon({ iconUrl: 'https://img.icons8.com/fluency/48/bus-stop.png', iconSize: [35, 35], iconAnchor: [17, 35] });

        // --- EXPANDED MOCK DATA FOR PUNJAB ---
        const allBuses = [
            // Original Set
            { id: 1, number: 'PB-10A', route: 'Ludhiana to Chandigarh', lat: 30.85, lng: 75.95, delay: 10, price: 150, eta: '25 min', driver: 'Gurpreet Singh' },
            { id: 2, number: 'PB-02C', route: 'Amritsar to Jalandhar', lat: 31.55, lng: 74.95, delay: 5, price: 100, eta: '15 min', driver: 'Harman Kaur' },
            { id: 3, number: 'PB-11B', route: 'Patiala to Ludhiana', lat: 30.50, lng: 76.20, delay: 0, price: 120, eta: '10 min', driver: 'Manpreet Singh' },
            { id: 4, number: 'PB-08D', route: 'Jalandhar to Hoshiarpur', lat: 31.32, lng: 75.60, delay: 2, price: 80, eta: '18 min', driver: 'Sukhdeep Kaur' },
            { id: 5, number: 'PB-13F', route: 'Bathinda to Firozpur', lat: 30.25, lng: 74.85, delay: 15, price: 130, eta: '30 min', driver: 'Jaswinder Singh' },
            { id: 6, number: 'PB-65E', route: 'Mohali to Patiala', lat: 30.68, lng: 76.70, delay: 8, price: 90, eta: '22 min', driver: 'Amandeep Singh' },
            { id: 7, number: 'PB-06G', route: 'Pathankot to Amritsar', lat: 32.20, lng: 75.55, delay: 4, price: 160, eta: '35 min', driver: 'Navjot Kaur' },
            { id: 8, number: 'PB-32H', route: 'Moga to Ludhiana', lat: 30.80, lng: 75.25, delay: 0, price: 70, eta: '12 min', driver: 'Baljit Singh' },
            { id: 9, number: 'PB-01V', route: 'Chandigarh to Amritsar', lat: 30.95, lng: 76.50, delay: 20, price: 250, eta: '45 min', driver: 'Rupinder Kaur' },
            
            // New Additions
            { id: 10, number: 'PB-08J', route: 'Jalandhar to Ludhiana', lat: 31.15, lng: 75.75, delay: 3, price: 95, eta: '14 min', driver: 'Karanvir Singh' },
            { id: 11, number: 'PB-03N', route: 'Bathinda to Chandigarh', lat: 30.40, lng: 75.50, delay: 25, price: 280, eta: '50 min', driver: 'Simranjeet Kaur' },
            { id: 12, number: 'PB-11M', route: 'Patiala to Sangrur', lat: 30.30, lng: 76.10, delay: 1, price: 60, eta: '9 min', driver: 'Arshdeep Singh' },
            { id: 13, number: 'PB-13P', route: 'Firozpur to Moga', lat: 30.90, lng: 74.90, delay: 7, price: 85, eta: '28 min', driver: 'Gaganpreet Kaur' },
            { id: 14, number: 'PB-07R', route: 'Hoshiarpur to Chandigarh', lat: 31.50, lng: 76.05, delay: 12, price: 170, eta: '33 min', driver: 'Dilpreet Singh' },
            { id: 15, number: 'PB-03S', route: 'Bathinda to Amritsar', lat: 30.80, lng: 74.90, delay: 18, price: 220, eta: '40 min', driver: 'Jasleen Kaur' },
            { id: 16, number: 'PB-10T', route: 'Ludhiana to Patiala (Return)', lat: 30.75, lng: 76.00, delay: 0, price: 120, eta: '8 min', driver: 'Harnek Singh' },
            { id: 17, number: 'PB-65U', route: 'Mohali to Jalandhar', lat: 30.78, lng: 76.45, delay: 5, price: 190, eta: '26 min', driver: 'Prabhjot Kaur' },
            { id: 18, number: 'PB-02W', route: 'Amritsar to Pathankot', lat: 31.85, lng: 75.20, delay: 9, price: 160, eta: '29 min', driver: 'Sartaj Singh' }
        ];

        const busStands = [
            { name: 'Ludhiana Bus Stand', lat: 30.903, lng: 75.85 },
            { name: 'Shaheed Bhagat Singh ISBT, Amritsar', lat: 31.638, lng: 74.86 },
            { name: 'Amar Shaheed Madan Lal Dhingra ISBT, Chandigarh', lat: 30.72, lng: 76.74 },
            { name: 'Patiala Bus Stand', lat: 30.34, lng: 76.38 },
            { name: 'S. Bhagat Singh ISBT, Jalandhar', lat: 31.31, lng: 75.59 },
            { name: 'Bathinda Bus Stand', lat: 30.20, lng: 74.95 },
            { name: 'Moga Bus Stand', lat: 30.82, lng: 75.17 },
            { name: 'Hoshiarpur Bus Stand', lat: 31.51, lng: 75.91 },
            { name: 'Pathankot Bus Stand', lat: 32.26, lng: 75.65 },
            { name: 'Firozpur Bus Stand', lat: 30.92, lng: 74.60 }
        ];
        
        let busMarkers = {};
        let standMarkers = [];
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

        // --- FUNCTIONS ---
        function displayBusesOnMap(busData) {
            Object.values(busMarkers).forEach(marker => map.removeLayer(marker));
            busMarkers = {};
            busData.forEach(bus => {
                const marker = L.marker([bus.lat, bus.lng], { icon: busIcon }).addTo(map)
                    .bindPopup(`<b>Bus No: ${bus.number}</b><br>Route: ${bus.route}`);
                busMarkers[bus.id] = marker;
            });
        }
        
        function displayBusCards(busData) {
            const container = document.getElementById('bus-list-container');
            container.innerHTML = '';
            busData.sort((a, b) => parseInt(a.eta) - parseInt(b.eta));

            busData.forEach(bus => {
                const isFavorite = favorites.includes(bus.id);
                const card = document.createElement('div');
                card.className = 'bus-card';
                card.innerHTML = `
                    <div class="card-header">
                        <div>
                            <h3>${bus.route}</h3>
                            <span class="bus-number">${bus.number}</span>
                        </div>
                        <button class="favorite-btn ${isFavorite ? 'active' : ''}" data-bus-id="${bus.id}">
                            <i class="fas fa-heart"></i>
                        </button>
                    </div>
                    <div class="card-body" data-bus-id="${bus.id}">
                        <p><i class="fa-solid fa-clock"></i> ETA: <strong>${bus.eta}</strong></p>
                        <p><i class="fa-solid fa-triangle-exclamation"></i> Delay: ${bus.delay} min</p>
                        <p><i class="fa-solid fa-indian-rupee-sign"></i> Fare: ${bus.price}</p>
                    </div>
                `;
                container.appendChild(card);
            });
        }
        
        // --- MODAL & CARD CLICK LOGIC ---
        const modal = document.getElementById('bus-detail-modal');
        const closeModal = document.querySelector('.close-button');
        
        function showBusDetails(busId) {
            const bus = allBuses.find(b => b.id === busId);
            document.getElementById('modal-body').innerHTML = `
                <h2>Bus Details: ${bus.number}</h2>
                <p><strong>Route:</strong> ${bus.route}</p>
                <p><strong>Driver:</strong> ${bus.driver}</p>
                <p><strong>Estimated Arrival:</strong> ${bus.eta}</p>
                <p><strong>Current Delay:</strong> ${bus.delay} minutes</p>
                <p><strong>Ticket Price:</strong> ₹${bus.price}</p>
            `;
            modal.style.display = 'flex';
            map.flyTo([bus.lat, bus.lng], 15);
            busMarkers[bus.id].openPopup();
        }
        
        closeModal.onclick = () => { modal.style.display = "none"; }
        window.onclick = (event) => { if (event.target == modal) modal.style.display = "none"; }
        
        document.getElementById('bus-list-container').addEventListener('click', (e) => {
            const favButton = e.target.closest('.favorite-btn');
            const cardBody = e.target.closest('.card-body');

            if (favButton) {
                const busId = parseInt(favButton.dataset.busId);
                favButton.classList.toggle('active');
                if (favorites.includes(busId)) {
                    favorites = favorites.filter(id => id !== busId);
                } else {
                    favorites.push(busId);
                }
                localStorage.setItem('favorites', JSON.stringify(favorites));
            } else if (cardBody) {
                showBusDetails(parseInt(cardBody.dataset.busId));
            }
        });

        // --- FEATURE: NEARBY STANDS ---
        document.getElementById('show-nearby-stands').addEventListener('click', (e) => {
            e.preventDefault();
            standMarkers.forEach(marker => map.removeLayer(marker)); // Remove old markers
            standMarkers = [];
            busStands.forEach(stand => {
                const marker = L.marker([stand.lat, stand.lng], { icon: standIcon }).addTo(map)
                    .bindPopup(`<b>${stand.name}</b>`);
                standMarkers.push(marker);
            });
            const group = new L.featureGroup(standMarkers);
            map.fitBounds(group.getBounds().pad(0.5));
        });

        // --- FEATURE: FAVORITES FILTER ---
        const showFavoritesLink = document.getElementById('show-favorites-link');
        const showAllBusesBtn = document.getElementById('show-all-buses');
        
        showFavoritesLink.addEventListener('click', (e) => {
            e.preventDefault();
            const favoriteBuses = allBuses.filter(bus => favorites.includes(bus.id));
            displayBusCards(favoriteBuses);
            displayBusesOnMap(favoriteBuses);
            showAllBusesBtn.classList.remove('hidden');
        });

        showAllBusesBtn.addEventListener('click', () => {
            displayBusCards(allBuses);
            displayBusesOnMap(allBuses);
            showAllBusesBtn.classList.add('hidden');
        });

        // --- USER GEOLOCATION --- (REMOVED)
        /*
        navigator.geolocation.getCurrentPosition(position => {
            const userPos = [position.coords.latitude, position.coords.longitude];
            map.setView(userPos, 14);
            L.marker(userPos).addTo(map).bindPopup("<b>You are here</b>").openPopup();
        }, () => console.log("Location access denied."));
        */

        // --- SIMULATE REAL-TIME MOVEMENT ---
        setInterval(() => {
            allBuses.forEach(bus => {
                bus.lat += (Math.random() - 0.5) * 0.001;
                bus.lng += (Math.random() - 0.5) * 0.001;
            });
            let currentBusIdsOnDisplay = Array.from(document.querySelectorAll('.bus-card .card-body')).map(el => parseInt(el.dataset.busId));
            let busesToDisplayOnMap = allBuses.filter(bus => currentBusIdsOnDisplay.includes(bus.id));
            displayBusesOnMap(busesToDisplayOnMap);
        }, 3000);

        // --- INITIAL LOAD ---
        displayBusesOnMap(allBuses);
        displayBusCards(allBuses);
    }
});
