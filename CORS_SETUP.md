# CORS Setup for LaTeX Calculator

This document provides instructions on how to handle Cross-Origin Resource Sharing (CORS) for the LaTeX Calculator project when deployed on GitHub Pages.

## Frontend Configuration

The frontend has been configured to handle CORS in the following ways:

1. **Direct API Requests**: The application attempts to make direct API requests to the backend with appropriate CORS headers.
2. **CORS Proxy Fallback**: If direct requests fail due to CORS issues, the application will attempt to use a CORS proxy as a fallback.

## Backend Configuration

For the backend to properly support CORS requests from the GitHub Pages domain, you need to configure it to include the following headers in its responses:

```
Access-Control-Allow-Origin: https://bubbleuniverse.github.io
Access-Control-Allow-Methods: POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, Accept, Origin
```

### For Tencent Cloud Functions

If you're using Tencent Cloud Functions for the backend, you can add the following code to your function to enable CORS:

```javascript
exports.main = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': 'https://bubbleuniverse.github.io',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Accept, Origin',
    'Content-Type': 'application/json'
  };

  // Handle OPTIONS requests (preflight)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: headers,
      body: ''
    };
  }

  // Your existing function logic here
  // ...

  // Return response with CORS headers
  return {
    statusCode: 200,
    headers: headers,
    body: JSON.stringify({
      result: 'Your result here'
    })
  };
};
```

## Alternative Solutions

If you cannot modify the backend to support CORS, you have the following options:

1. **Use a CORS Proxy Service**: The application includes a fallback to use a CORS proxy service. You can modify the `createProxyUrl` function in `cors-proxy.js` to use your preferred proxy service.

2. **Set Up Your Own Proxy**: You can set up your own proxy server that adds the necessary CORS headers to the responses from the backend.

3. **Use a Service Worker**: You can implement a service worker to intercept requests and add the necessary CORS headers.

## Testing CORS Configuration

To test if your CORS configuration is working correctly:

1. Deploy the frontend to GitHub Pages.
2. Open the browser's developer tools (F12).
3. Go to the Network tab.
4. Make a request from the application.
5. Check if the request succeeds or if there are CORS errors.

If you see CORS errors in the console, you may need to adjust your backend configuration or use one of the alternative solutions mentioned above. 