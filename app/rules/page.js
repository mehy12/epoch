const judgingCriteria = [
  { criterion: "Innovation & Originality", weightage: "25%" },
  { criterion: "Technical Complexity", weightage: "25%" },
  { criterion: "Real-world Impact", weightage: "20%" },
  { criterion: "Completeness & Demo", weightage: "20%" },
  { criterion: "Presentation", weightage: "10%" },
];

const sections = [
  {
    title: "1. Eligibility",
    points: [
      "Open to all undergraduate and postgraduate students across India.",
      "All team members must hold a valid IEEE membership at the time of registration.",
      "A team must consist of 2 to 4 members.",
      "Members from different colleges may form a team.",
      "Faculty members and professionals are not eligible to participate.",
    ],
  },
  {
    title: "2. Registration",
    points: [
      "Teams must register online before April 25, 2026.",
      "Registration fee for Round 1 is Rs 300 per team (non-refundable).",
      "Each participant can be part of only one team.",
      "Incomplete registrations will be rejected without notice.",
      "All details submitted during registration must be accurate. Misrepresentation will lead to disqualification.",
    ],
  },
  {
    title: "3. Round 1 - Online Screening",
    points: [
      "Teams must submit a PPT presentation and a brief idea description during registration.",
      "Submissions must be made via the registration form before the deadline.",
      "Shortlisted teams will be announced on April 28, 2026.",
      "Shortlisted teams must pay an additional Rs 800 to confirm their spot in the finale.",
      "Non-payment by the deadline will result in forfeiture of the spot.",
      "Screening decisions by the panel are final and non-contestable.",
    ],
  },
  {
    title: "4. Round 2 - Grand Finale",
    points: [
      "The finale will be held on May 1-2, 2026 at Vemana Institute of Technology, Koramangala, Bangalore.",
      "Hackathon begins at 11:00 AM on May 1 and ends at 11:00 AM on May 2 (24 hours).",
      "All team members must be physically present throughout the event.",
      "Late arrivals beyond 30 minutes from the start time may be disqualified at the organiser's discretion.",
      "Teams must bring their own laptops, chargers, and required hardware.",
      "Power outlets and Wi-Fi will be provided. Teams must not use mobile hotspots to bypass internet filters.",
    ],
  },
  {
    title: "5. Project & Submission",
    points: [
      "Projects must be built during the hackathon duration only. Pre-built projects are strictly prohibited.",
      "The project must align with one of the three tracks: AI for Social Good, Sustainability Goals, Cybersecurity & Blockchain.",
      "Use of open-source libraries, APIs, and publicly available datasets is permitted and encouraged.",
      "Teams must not plagiarise or copy existing projects. Any such attempt will lead to immediate disqualification.",
      "Final submission must include a working prototype or demo, source code, and a short presentation.",
      "Submissions must be made on the platform specified by organisers before the deadline.",
    ],
  },
  {
    title: "7. Code of Conduct",
    points: [
      "Participants must maintain respectful and professional behaviour at all times.",
      "Harassment, discrimination, or unsportsmanlike conduct of any kind will result in immediate disqualification and removal from the venue.",
      "Participants must not damage venue property. Any damage caused will be the team's responsibility.",
      "Consumption of alcohol, tobacco, or any illegal substances on premises is strictly prohibited.",
      "Participants must carry their college ID and IEEE membership card at all times during the event.",
    ],
  },
  {
    title: "8. Intellectual Property",
    points: [
      "Teams retain full ownership of their projects.",
      "By participating, teams grant EPOCH '26 and Vemana Institute of Technology the right to showcase, photograph, or publish their work for promotional purposes.",
      "Organisers will not claim commercial rights over any submitted project.",
    ],
  },
  {
    title: "9. Meals & Facilities",
    points: [
      "Lunch - 2:00 PM (May 1)",
      "Snacks - 5:00 PM (May 1)",
      "Dinner - 8:00 PM (May 1)",
      "Midnight Jamming Session - 12:00 AM",
      "Tea & Coffee - 4:00 AM (May 2)",
      "Breakfast - 8:00 AM (May 2)",
      "Accommodation is not provided. Participants must arrange their own stay if travelling from outside Bangalore.",
    ],
  },
  {
    title: "10. Prizes",
    points: [
      "Total Prize Pool: Rs 3,00,000.",
      "Rs 1,00,000 per track, split as Rs 50,000 (1st), Rs 30,000 (2nd), and Rs 20,000 (3rd).",
      "Goodies worth Rs 10,000 for select participants.",
      "Prizes are non-transferable and will be awarded at the Valedictory Ceremony at 1:00 PM on May 2.",
      "Tax deductions, if applicable, will be as per Government of India norms.",
    ],
  },
  {
    title: "11. Disqualification",
    points: [
      "Submitting pre-built or plagiarised work",
      "Violation of code of conduct",
      "Invalid or fake IEEE membership",
      "Misrepresentation of team details",
      "Tampering with other teams' work or systems",
    ],
  },
  {
    title: "12. Organisers' Rights",
    points: [
      "The organising committee reserves the right to modify, suspend, or cancel the event in case of unforeseen circumstances.",
      "The organisers' decision on any matter not covered in these rules will be final.",
      "Participants are bound by these rules upon registration.",
    ],
  },
];

export default function RulesPage() {
  return (
    <main className="rules-page-shell">
      <section className="rules-page-content">
        <a className="register-back" href="/">
          Back to Home
        </a>

        <p className="section-label">EPOCH '26</p>
        <h1 className="rules-main-title">Rules & Regulations</h1>
        <p className="rules-subtitle">
          Grand National Hackathon | Vemana Institute of Technology, Bangalore
        </p>

        {sections.slice(0, 5).map((section) => (
          <article className="rules-card" key={section.title}>
            <h2 className="rules-card-title">{section.title}</h2>
            <ul className="rules-list">
              {section.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </article>
        ))}

        <article className="rules-card" key="6-judging">
          <h2 className="rules-card-title">6. Judging Criteria</h2>
          <p className="rules-copy">Judging begins at 11:00 AM on May 2 and is based on:</p>
          <div className="rules-table-wrap" role="region" aria-label="Judging criteria weightage">
            <table className="rules-table">
              <thead>
                <tr>
                  <th>Criteria</th>
                  <th>Weightage</th>
                </tr>
              </thead>
              <tbody>
                {judgingCriteria.map((row) => (
                  <tr key={row.criterion}>
                    <td>{row.criterion}</td>
                    <td>{row.weightage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ul className="rules-list">
            <li>Each track will be judged independently by a dedicated panel.</li>
            <li>Judges' decisions are final and binding.</li>
            <li>Teams will get 5 minutes to present and 3 minutes for Q&A.</li>
          </ul>
        </article>

        {sections.slice(5).map((section) => (
          <article className="rules-card" key={section.title}>
            <h2 className="rules-card-title">{section.title}</h2>
            <ul className="rules-list">
              {section.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </article>
        ))}

        <article className="rules-card">
          <h2 className="rules-card-title">Queries</h2>
          <p className="rules-copy">
            For queries, contact the EPOCH '26 organising committee via the official website or IEEE Student Branch, Vemana Institute of Technology.
          </p>
        </article>
      </section>
    </main>
  );
}
