class JokeGenerator {
    constructor() {
        this.apiUrl = 'https://official-joke-api.appspot.com/jokes/random';
        this.lastRequestTime = 0;
        this.minRequestInterval = 1000; // 1 second rate limiting
        this.apiFailCount = 0;
        this.maxApiFailures = 2;
        
        // Fallback jokes for demo/offline mode
        this.fallbackJokes = [
            {
                setup: "Why don't scientists trust atoms?",
                punchline: "Because they make up everything!"
            },
            {
                setup: "What do you call a fake noodle?",
                punchline: "An impasta!"
            },
            {
                setup: "Why did the scarecrow win an award?",
                punchline: "He was outstanding in his field!"
            },
            {
                setup: "What do you call a bear with no teeth?",
                punchline: "A gummy bear!"
            },
            {
                joke: "I told my wife she was drawing her eyebrows too high. She looked surprised."
            },
            {
                joke: "I'm reading a book about anti-gravity. It's impossible to put down!"
            },
            {
                joke: "Did you hear about the mathematician who's afraid of negative numbers? He'll stop at nothing to avoid them."
            }
        ];
        
        this.elements = {
            button: document.getElementById('get-joke-btn'),
            jokeDisplay: document.getElementById('joke-display'),
            loading: document.getElementById('loading'),
            errorMessage: document.getElementById('error-message')
        };
        
        this.init();
    }
    
    init() {
        this.elements.button.addEventListener('click', () => this.fetchJoke());
        
        // Allow Enter key to trigger joke fetching
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !this.elements.button.disabled) {
                this.fetchJoke();
            }
        });
    }
    
    async fetchJoke() {
        // Rate limiting check
        const now = Date.now();
        if (now - this.lastRequestTime < this.minRequestInterval) {
            return;
        }
        this.lastRequestTime = now;
        
        this.showLoading();
        
        try {
            const response = await fetch(this.apiUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
                // Add timeout to prevent hanging requests
                signal: AbortSignal.timeout(10000) // 10 second timeout
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const joke = await response.json();
            this.displayJoke(joke);
            
        } catch (error) {
            console.error('Error fetching joke:', error);
            this.apiFailCount++;
            
            // After multiple API failures, switch to demo mode
            if (this.apiFailCount >= this.maxApiFailures) {
                console.log('Switching to demo mode with fallback jokes');
                this.displayFallbackJoke();
            } else {
                this.showError(this.getErrorMessage(error));
            }
        }
    }
    
    displayFallbackJoke() {
        const randomJoke = this.fallbackJokes[Math.floor(Math.random() * this.fallbackJokes.length)];
        this.displayJoke(randomJoke);
        
        // Show a small indicator that this is demo mode
        const footer = document.querySelector('footer p');
        footer.innerHTML = 'Demo mode - Using sample jokes | Powered by <a href="https://official-joke-api.appspot.com/" target="_blank">Official Joke API</a>';
    }
    
    displayJoke(joke) {
        this.hideLoading();
        this.hideError();
        
        let jokeHTML = '';
        
        // Check if it's a setup/punchline joke or a one-liner
        if (joke.setup && joke.punchline) {
            jokeHTML = `
                <div class="setup">${this.escapeHtml(joke.setup)}</div>
                <div class="punchline">${this.escapeHtml(joke.punchline)}</div>
            `;
        } else if (joke.joke) {
            // Some APIs might use 'joke' field for one-liners
            jokeHTML = `
                <div class="one-liner">${this.escapeHtml(joke.joke)}</div>
            `;
        } else {
            // Fallback for unexpected format
            jokeHTML = `
                <div class="one-liner">Sorry, this joke couldn't be displayed properly!</div>
            `;
        }
        
        this.elements.jokeDisplay.innerHTML = jokeHTML;
        
        // Add a subtle animation
        this.elements.jokeDisplay.style.opacity = '0';
        setTimeout(() => {
            this.elements.jokeDisplay.style.opacity = '1';
            this.elements.jokeDisplay.style.transition = 'opacity 0.3s ease-in-out';
        }, 100);
    }
    
    showLoading() {
        this.elements.button.disabled = true;
        this.elements.jokeDisplay.classList.add('hidden');
        this.elements.errorMessage.classList.add('hidden');
        this.elements.loading.classList.remove('hidden');
    }
    
    hideLoading() {
        this.elements.button.disabled = false;
        this.elements.loading.classList.add('hidden');
        this.elements.jokeDisplay.classList.remove('hidden');
    }
    
    showError(message) {
        this.elements.button.disabled = false;
        this.elements.loading.classList.add('hidden');
        this.elements.jokeDisplay.classList.add('hidden');
        this.elements.errorMessage.classList.remove('hidden');
        this.elements.errorMessage.querySelector('p').textContent = message;
    }
    
    hideError() {
        this.elements.errorMessage.classList.add('hidden');
    }
    
    getErrorMessage(error) {
        if (error.name === 'AbortError' || error.name === 'TimeoutError') {
            return 'Request timed out. Please check your internet connection and try again.';
        } else if (error.message.includes('Failed to fetch')) {
            return 'Network error. Please check your internet connection and try again.';
        } else if (error.message.includes('HTTP error')) {
            return 'The joke service is temporarily unavailable. Please try again later.';
        } else {
            return 'Oops! Something went wrong. Please try again.';
        }
    }
    
    // Escape HTML to prevent XSS attacks
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the joke generator when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new JokeGenerator();
});

// Add some fun console messages for developers
console.log('🎭 Random Joke Generator loaded!');
console.log('Made with ❤️ for laughs and learning');
console.log('API: Official Joke API - https://official-joke-api.appspot.com/');