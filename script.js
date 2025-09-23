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
        const map = L.map('map').setView([26.9124, 75.7873], 13); // Jaipur
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // --- ICONS ---
        const busIcon = L.icon({ iconUrl: 'https://img.icons8.com/plasticine/100/bus.png', iconSize: [40, 40], iconAnchor: [20, 20] });
        const standIcon = L.icon({ iconUrl: 'https://iconscout.com/icons/stop-signboard', iconSize: [35, 35], iconAnchor: [17, 35] });

        // --- MOCK DATA ---
        // highlight-start
        const allBuses = [
            { id: 1, number: 'R-4', route: 'Chandpole to Sanganer', lat: 26.925, lng: 75.78, delay: 5, price: 15, eta: '12 min', driver: 'Ramesh Kumar' },
            { id: 2, number: 'R-7', route: 'Jhotwara to Jagatpura', lat: 26.89, lng: 75.80, delay: 0, price: 20, eta: '8 min', driver: 'Suresh Singh' },
            { id: 3, number: 'AC-2', route: 'Vaishali to Airport', lat: 26.91, lng: 75.75, delay: 2, price: 35, eta: '20 min', driver: 'Priya Sharma' },
            { id: 4, number: 'R-1B', route: 'Mansarovar to Amer', lat: 26.85, lng: 75.77, delay: 10, price: 25, eta: '15 min', driver: 'Amit Verma' },
            { id: 5, number: 'AC-5', route: 'Sitapura to Kukas', lat: 26.79, lng: 75.82, delay: 3, price: 40, eta: '25 min', driver: 'Sunita Devi' },
            { id: 6, number: 'R-3', route: 'Bapu Nagar to Vidhyadhar Nagar', lat: 26.93, lng: 75.77, delay: 8, price: 15, eta: '18 min', driver: 'Mohan Lal' },
            { id: 7, number: 'R-9A', route: 'Tonk Phatak to Kalwar Road', lat: 26.87, lng: 75.76, delay: 1, price: 20, eta: '22 min', driver: 'Geeta Kumari' },
            { id: 8, number: 'R-15', route: 'Agra Road to Sirsi Road', lat: 26.88, lng: 75.85, delay: 12, price: 22, eta: '30 min', driver: 'Rajesh Meena' },
            { id: 9, number: 'LOW-FLOOR-1', route: 'Jagatpura to Railway Station', lat: 26.84, lng: 75.83, delay: 0, price: 30, eta: '7 min', driver: 'Deepak Jangid' }
        ];
        // highlight-end
        const busStands = [
            { name: 'Sindhi Camp Bus Stand', lat: 26.9258, lng: 75.7901 },
            { name: 'Gopalbari Bus Stop', lat: 26.923, lng: 75.801 },
            { name: 'Ajmeri Gate Stop', lat: 26.914, lng: 75.818 }
        ];
        
        let busMarkers = {};
        let standMarkers = [];
        // NEW: Load favorites from localStorage
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
            // Fit map to show all stands
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

        // --- USER GEOLOCATION ---
        navigator.geolocation.getCurrentPosition(position => {
            const userPos = [position.coords.latitude, position.coords.longitude];
            map.setView(userPos, 14);
            L.marker(userPos).addTo(map).bindPopup("<b>You are here</b>").openPopup();
        }, () => console.log("Location access denied."));

        // --- SIMULATE REAL-TIME MOVEMENT ---
        setInterval(() => {
            allBuses.forEach(bus => {
                bus.lat += (Math.random() - 0.5) * 0.001;
                bus.lng += (Math.random() - 0.5) * 0.001;
            });
            // Update map without filtering
            let currentBusIdsOnDisplay = Array.from(document.querySelectorAll('.bus-card .card-body')).map(el => parseInt(el.dataset.busId));
            let busesToDisplayOnMap = allBuses.filter(bus => currentBusIdsOnDisplay.includes(bus.id));
            displayBusesOnMap(busesToDisplayOnMap);
        }, 3000);

        // --- INITIAL LOAD ---
        displayBusesOnMap(allBuses);
        displayBusCards(allBuses);
    }
});
