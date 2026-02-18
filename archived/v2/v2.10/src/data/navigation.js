export const navigationLinks = [
    { name: 'Home', href: '#/' },
    {
      name: 'Student Life',
      subLinks: [
        { name: 'Clubs & Societies Explorer', href: '#/clubs', status: 'Active' },
        { name: 'Airport Arrival Guide', href: '#/airport-guide', status: 'Active' },
        { name: 'Food Reviews & Ratings', href: '#/food-reviews', status: 'Beta' },
        { name: 'Campus Cycling Map', href: '#/cycling-map', status: 'Beta' },
      ],
    },
    {
      name: 'Academics',
      subLinks: [
        { name: 'GPA Calculator', href: '#/gpa-calculator', status: 'Beta' },
        { name: 'MOOC Credit Transfer Guide', href: '#', status: 'Coming Soon' },
        { name: 'Overseas Exchange Guide', href: '#', status: 'Coming Soon' },
      ],
    },
    {
      name: 'Quick Tools',
      subLinks: [
        { name: 'Concession Card Calculator', href: '#/concession-card-calculator', status: 'Beta' },
        { name: 'Room Layout Downloads', href: '#/room-layouts', status: 'Active' },
      ],
    },
    {
      name: 'Resources',
      subLinks: [
        { name: 'Getting Started Checklist', href: '#', status: 'Coming Soon' },
        { name: 'Official NTU Links', href: '#', status: 'Active' },
        { name: 'FAQ Section', href: '#', status: 'Coming Soon' },
        { name: 'Contact & Feedback', href: '#', status: 'Active' },
      ],
    },
];
