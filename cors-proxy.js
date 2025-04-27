/**
 * CORS Proxy for LaTeX Calculator
 * This file provides a fallback solution for CORS issues if the backend doesn't support CORS properly.
 */

// Function to create a proxy URL for the API request
function createProxyUrl(apiUrl) {
    // You can use a CORS proxy service like cors-anywhere or set up your own proxy
    // For GitHub Pages, you might want to use a service like:
    // - https://cors-anywhere.herokuapp.com/
    // - https://api.allorigins.win/raw?url=
    // - https://api.codetabs.com/v1/proxy?quest=
    
    // Example using a hypothetical CORS proxy service
    const proxyUrl = 'https://api.allorigins.win/raw?url=';
    return proxyUrl + encodeURIComponent(apiUrl);
}

// Function to make a proxied API request
function makeProxiedRequest(endpoint, data) {
    const apiUrl = `${CONFIG.API.BASE_URL}${endpoint}`;
    const proxyUrl = createProxyUrl(apiUrl);
    
    return fetch(proxyUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Origin': window.location.origin
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Proxy request failed with status: ${response.status}`);
        }
        return response.json();
    });
}

// Export the function for use in other files
window.makeProxiedRequest = makeProxiedRequest; 