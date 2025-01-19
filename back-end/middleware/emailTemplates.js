const selectEmailTemplate = (candidate, job) => {
    return `
      <h1>Congratulations, you're selected!</h1>
      <p>Dear ${candidate.name},</p>
      <p>We are happy to inform you that you have been selected for the interview for <strong>${job.designation}</strong> at <strong>${job.company}</strong>.</p>
      <p><strong>Job Details:</strong></p>
      <ul>
        <li><strong>Company:</strong> ${job.company}</li>
        <li><strong>Designation:</strong> ${job.designation}</li>
        <li><strong>Package:</strong> ${job.package}</li>
        <li><strong>Job Description:</strong> ${job.jobDescription}</li>
      </ul>
      <p>We will reach out to you shortly with further steps. Congratulations again!</p>
      <p>Best regards,<br>Job Portal Team</p>
    `;
  };
  

  const rejectEmailTemplate = (candidate, job) => {
    return `
      <h1>Job Application Status</h1>
      <p>Dear ${candidate.name},</p>
      <p>Thank you for applying for the position of <strong>${job.designation}</strong> at <strong>${job.company}</strong>. Unfortunately, we have decided not to move forward with your application at this time.</p>
      <p><strong>Job Details:</strong></p>
      <ul>
        <li><strong>Company:</strong> ${job.company}</li>
        <li><strong>Designation:</strong> ${job.designation}</li>
        <li><strong>Package:</strong> ${job.package}</li>
        <li><strong>Job Description:</strong> ${job.jobDescription}</li>
      </ul>
      <p>We encourage you to keep an eye on future opportunities with us. Thank you for your interest, and best of luck with your job search!</p>
      <p>Best regards,<br>Job Portal Team</p>
    `;
  };

  const newApplicationEmailTemplate = (hr, job, profile) => {
    return `
      <h1>New Job Application Received</h1>
      <p>Dear ${hr.name},</p>
      <p>A new candidate has applied for the job position <strong>${job.designation}</strong> at <strong>${job.company}</strong>.</p>
      <p><strong>Candidate Details:</strong></p>
      <ul>
        <li><strong>Name:</strong> ${profile.name}</li>
        <li><strong>Email:</strong> ${profile.email}</li>
        <li><strong>Skills:</strong> ${profile.skills.join(', ')}</li>
        <li><strong>Work Experience:</strong> ${profile.workExperience}</li>
      </ul>
      <p>The candidate's resume is attached for your review.</p>
      <p>Best regards,<br>Job Portal Team</p>
    `;
  };
  

module.exports = { selectEmailTemplate, rejectEmailTemplate, newApplicationEmailTemplate };
