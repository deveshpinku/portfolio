import React, { useState } from 'react';

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    subject: '',
    message: '',
  });

  const [statusMessage, setStatusMessage] = useState('');

  const handleInputChange = event => {
    const { name, value } = event.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const onSubmit = async event => {
    event.preventDefault();
    setLoading(true);
    setStatusMessage('');

    const formDataObj = new FormData(event.target);
    formDataObj.append('access_key', '6bb1bd8b-fea2-4823-be87-ef54ac843073');

    const object = Object.fromEntries(formDataObj);
    const json = JSON.stringify(object);

    try {
      // Send form data to web3forms
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: json,
      });

      const res = await response.json();

      if (res.success) {
        setFormData({
          name: '',
          email: '',
          whatsapp: '',
          subject: '',
          message: '',
        });
        setStatusMessage('✅ Message sent successfully!');

  // Send auto-reply email via backend
  await fetch('http://localhost:5000/api/send-auto-reply', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: object.name,
      email: object.email,
    }),
  });
  

        // Now send WhatsApp message via backend
        await fetch('http://localhost:5000/api/send-whatsapp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: object.name,
            whatsapp: object.whatsapp, // include country code if needed
          }),
        });
      } else {
        setStatusMessage('❌ Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error(error);
      setStatusMessage('❌ Something went wrong. Please try again later.');
    }

    setLoading(false);
  };

  return (
    <form id="contact-form" onSubmit={onSubmit}>
      <div className="row gx-3 gy-4">
        <div className="col-md-6">
          <div className="form-group">
            <label className="form-label">Your Name</label>
            <input
              name="name"
              placeholder="Name *"
              className="form-control"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="col-md-6">
          <div className="form-group">
            <label className="form-label">Your Email</label>
            <input
              name="email"
              placeholder="Email *"
              className="form-control"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="col-md-6">
          <div className="form-group">
            <label className="form-label">WhatsApp Number</label>
            <input
              name="whatsapp"
              placeholder="WhatsApp (with country code, e.g. 918838143246)"
              className="form-control"
              type="text"
              value={formData.whatsapp}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="col-12">
          <div className="form-group">
            <label className="form-label">Subject</label>
            <input
              name="subject"
              placeholder="Subject *"
              className="form-control"
              type="text"
              value={formData.subject}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="col-md-12">
          <div className="form-group">
            <label className="form-label">Your message</label>
            <textarea
              name="message"
              placeholder="Your message *"
              rows={4}
              className="form-control"
              value={formData.message}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="col-md-12">
          <div className="send">
            <button
              className={`px-btn w-100 ${loading ? 'disabled' : ''}`}
              type="submit"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </div>
        </div>

        {statusMessage && (
          <div className="col-md-12 mt-3">
            <div
              className={`alert ${
                statusMessage.startsWith('✅') ? 'alert-success' : 'alert-danger'
              }`}
              role="alert"
            >
              {statusMessage}
            </div>
          </div>
        )}
      </div>
    </form>
  );
}
