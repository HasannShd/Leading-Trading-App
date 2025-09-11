import { useState } from 'react';

// Careers page with application form
const Careers = () => {
  const [form, setForm] = useState({ name: '', phone: '', nationality: '', cv: null });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = e => {
    const { name, value, files } = e.target;
    setForm(f => ({
      ...f,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    // Here you would send the form data to your backend or email service
    setSubmitted(true);
  };

  return (
    <div style={{padding: '2rem'}}>
      <h2>Careers</h2>
      <p>Interested in joining our team? Fill out the form below and upload your CV.</p>
      {submitted ? (
        <div style={{color: 'green', marginTop: 24}}>Thank you for your application!</div>
      ) : (
        <form className="careers-form" onSubmit={handleSubmit}>
          <label>
            Name
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="input"
            />
          </label>
          <label>
            Phone Number
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
              className="input"
            />
          </label>
          <label>
            Nationality
            <input
              type="text"
              name="nationality"
              value={form.nationality}
              onChange={handleChange}
              required
              className="input"
            />
          </label>
          <label>
            Upload CV
            <input
              type="file"
              name="cv"
              accept=".pdf,.doc,.docx"
              onChange={handleChange}
              required
              className="input"
            />
          </label>
          <button type="submit" className="btn" style={{marginTop: 16}}>Submit</button>
        </form>
      )}
    </div>
  );
};

export default Careers;
