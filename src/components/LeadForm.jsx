import { useState } from 'preact/hooks';

// NOTE: Replace this with your actual Webhook URL for Xano/Zapier/etc.
const WEBHOOK_URL = 'YOUR_EXTERNAL_WEBHOOK_URL'; 

export default function LeadForm({ pageSlug }) {
  const [formData, setFormData] = useState({ name: '', email: '', zip_code: '', goal: '', phone: '', message: '' }); // ADDED: name, phone, message
  const [status, setStatus] = useState('idle'); // idle, submitting, success, error

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          // CRITICAL: Passing the source page AND the user's explicit ZIP code
          source_page_slug: pageSlug,
          timestamp: new Date().toISOString(),
          // Include the city/state inferred from the slug for redundancy (optional but helpful)
          inferred_location: pageSlug.split('/')[0], 
        }),
      });

      if (response.ok) {
        setStatus('success');
      } else {
        console.error('Webhook error:', response.status, await response.text());
        setStatus('error');
      }
    } catch (err) {
      console.error('Submission failed:', err);
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-green-100 p-6 rounded-lg text-center shadow-lg">
        <h3 className="text-2xl font-bold text-green-700">Success! 🎉</h3>
        <p className="text-green-600 mt-2">Your match request has been received. A coach will be in touch shortly!</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow-xl max-w-lg mx-auto border-4 border-primary-500">
      <div className="space-y-4">
        
        {/* ADDED: Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Your Full Name</label>
          <input
            type="text"
            name="name"
            id="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:border-primary-500 focus:ring-primary-500"
          />
        </div>
        
        {/* ADDED: Phone Number Field */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone (Optional)</label>
          <input
            type="tel"
            name="phone"
            id="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="(123) 456-7890"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        {/* ZIP Code Field */}
        <div>
          <label htmlFor="zip_code" className="block text-sm font-medium text-gray-700">Your ZIP Code</label>
          <input
            type="text"
            name="zip_code"
            id="zip_code"
            required
            pattern="\d{5}" // Basic 5-digit US ZIP validation
            maxLength="5"
            value={formData.zip_code}
            onChange={handleChange}
            placeholder="e.g., 20007"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        <div>
          <label htmlFor="goal" className="block text-sm font-medium text-gray-700">Your Primary Fitness Goal</label>
          <select
            name="goal"
            id="goal"
            required
            value={formData.goal}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="">Select a Goal</option>
            <option value="weight-loss">Weight Loss</option>
            <option value="strength-training">Strength & Muscle Gain</option>
            <option value="flexibility">Flexibility & Mobility</option>
            <option value="rehab">Post-Rehabilitation</option>
          </select>
        </div>
        
        {/* ADDED: Message Field */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">Tell Us About Your Goals (Optional)</label>
          <textarea
            name="message"
            id="message"
            rows="3"
            value={formData.message}
            onChange={handleChange}
            placeholder="I want to gain 10 lbs of muscle for a triathlon."
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:border-primary-500 focus:ring-primary-500"
          />
        </div>
        
      </div>

      <button
        type="submit"
        disabled={status === 'submitting'}
        className={`w-full mt-6 flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white 
          ${status === 'submitting' ? 'bg-gray-500' : 'bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'}`}
      >
        {status === 'submitting' ? 'Matching You...' : 'Get Matched Now'}
      </button>
      
      {status === 'error' && (
        <p className="mt-3 text-red-600 text-center">
          There was an error. Please try again or refresh the page.
        </p>
      )}

      <p className="mt-4 text-xs text-gray-500 text-center">
        100% Privacy Protected. We only share your details with matched trainers.
      </p>
    </form>
  );
}
