import React from 'react';

export default function SponsorsPage() {
  // Example sponsors data
  const sponsors = [
    {
      name: 'Acme Corp',
      logo: '/acme-logo.png',
      url: 'https://acme.com',
      description: 'Leading provider of innovative solutions.'
    },
    {
      name: 'Globex Inc',
      logo: '/globex-logo.png',
      url: 'https://globex.com',
      description: 'Global leader in technology and services.'
    }
    // Add more sponsors as needed
  ];

  return (
    <main className="min-h-screen py-12 px-4 bg-white">
      <h1 className="text-4xl font-bold text-center mb-8">Our Sponsors</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {sponsors.map((sponsor) => (
          <a
            key={sponsor.name}
            href={sponsor.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center p-6 border rounded-lg shadow hover:shadow-lg transition"
          >
            <img
              src={sponsor.logo}
              alt={sponsor.name + ' logo'}
              className="h-24 mb-4 object-contain"
            />
            <h2 className="text-xl font-semibold mb-2">{sponsor.name}</h2>
            <p className="text-gray-600 text-center">{sponsor.description}</p>
          </a>
        ))}
      </div>
    </main>
  );
}
