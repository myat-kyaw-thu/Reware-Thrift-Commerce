const base = process.env.PAYPAL_API_URL || 'https://api-m.sandbox.paypal.com';

async function handleResponse(response: Response) {
  if (response.ok) {
    return response.json();
  } else {
    const errorMessage = await response.text();
    throw new Error(errorMessage);
  }
}
