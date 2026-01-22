// Save this as: netlify/functions/get-products.js

exports.handler = async function(event, context) {
  // Get Snipcart secret API key from environment variables
  const SNIPCART_SECRET_KEY = process.env.SNIPCART_SECRET_KEY;
  
  if (!SNIPCART_SECRET_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Snipcart API key not configured' })
    };
  }

  try {
    // Fetch products from Snipcart API
    const response = await fetch('https://app.snipcart.com/api/products', {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${Buffer.from(SNIPCART_SECRET_KEY + ':').toString('base64')}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Snipcart API error: ${response.status}`);
    }

    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300' // Cache for 5 minutes
      },
      body: JSON.stringify({
        products: data.items || []
      })
    };

  } catch (error) {
    console.error('Error fetching products:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to fetch products',
        message: error.message 
      })
    };
  }
};
