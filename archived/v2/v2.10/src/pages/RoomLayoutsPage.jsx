const React = window.React;

const roomLayoutsData = [
  {
    id: 1,
    title: 'Hall of Residence 8 - Single Room',
    type: 'PDF',
    lastUpdated: '2025-08-01',
    size: '1.2 MB',
    thumbnailUrl: 'https://images.unsplash.com/photo-1585685715219-585daf3cb5e8?q=80&w=800&auto=format&fit=crop',
    downloadUrl: '#'
  },
  {
    id: 2,
    title: 'North Hill - Double Room Type A',
    type: 'PNG',
    lastUpdated: '2025-07-25',
    size: '850 KB',
    thumbnailUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=800&auto=format&fit=crop',
    downloadUrl: '#'
  },
  {
    id: 3,
    title: 'Pioneer Hall - Common Area Layout',
    type: 'PDF',
    lastUpdated: '2025-08-05',
    size: '2.5 MB',
    thumbnailUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=800&auto=format&fit=crop',
    downloadUrl: '#'
  },
   {
    id: 4,
    title: 'Crescent Hall - Apartment Suite',
    type: 'PDF',
    lastUpdated: '2025-06-15',
    size: '3.1 MB',
    thumbnailUrl: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?q=80&w=800&auto=format&fit=crop',
    downloadUrl: '#'
  }
];

const FileIcon = ({ type }) => {
  let iconName = 'file';
  let color = 'text-gray-500';
  if (type === 'PDF') {
    iconName = 'file-text';
    color = 'text-ntu-red';
  } else if (type === 'PNG') {
    iconName = 'file-image';
    color = 'text-ntu-blue';
  }
  return React.createElement('i', { 'data-lucide': iconName, className: `w-10 h-10 ${color}` });
};


const LayoutCard = ({ layout }) => {
    const handleShare = () => {
        if(navigator.share) {
            navigator.share({
                title: layout.title,
                text: `Check out the room layout for ${layout.title} on NTU Campus Hub!`,
                url: window.location.href,
            }).catch(console.error);
        } else {
            alert('Share functionality is not supported on your browser. You can copy the page URL.');
        }
    };

    return (
        React.createElement('div', { className: "bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col md:flex-row" },
            React.createElement('div', { className: "md:w-1/3 h-48 md:h-auto flex items-center justify-center bg-gray-100" },
                React.createElement('img', { src: layout.thumbnailUrl, alt: `${layout.title} preview`, className: "w-full h-full object-cover" })
            ),
            React.createElement('div', { className: "p-6 flex flex-col justify-between flex-1" },
                React.createElement('div', null,
                    React.createElement('div', { className: "flex items-start justify-between" },
                        React.createElement(FileIcon, { type: layout.type }),
                        React.createElement('span', { className: "bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full" }, "Active")
                    ),
                    React.createElement('h3', { className: "text-xl font-bold text-gray-800 mt-4" }, layout.title),
                    React.createElement('div', { className: "text-sm text-gray-500 mt-2 space-x-4" },
                        React.createElement('span', null, `Last Updated: ${layout.lastUpdated}`),
                        React.createElement('span', null, `File Size: ${layout.size}`)
                    )
                ),
                React.createElement('div', { className: "mt-6 flex items-center space-x-4" },
                    React.createElement('a', { href: layout.downloadUrl, download: true, className: "flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-ntu-blue hover:bg-ntu-red transition-colors" },
                        React.createElement('i', { 'data-lucide': "download", className: "w-4 h-4 mr-2" }), " Download"
                    ),
                    React.createElement('button', { type: "button", onClick: handleShare, className: "flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50" },
                        React.createElement('i', { 'data-lucide': "share-2", className: "w-4 h-4 mr-2" }), " Share"
                    )
                )
            )
        )
    );
};

const RoomLayoutsPage = () => {
    React.useEffect(() => {
        const timer = setTimeout(() => {
            if (window.lucide) {
                window.lucide.createIcons();
            }
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        React.createElement('div', { className: "bg-gray-50 min-h-screen" },
            React.createElement('div', { className: "max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16" },
                React.createElement('header', { className: "text-center mb-12" },
                    React.createElement('span', { className: "inline-block bg-ntu-blue text-white text-sm font-semibold px-4 py-1 rounded-full mb-2" }, "Quick Tools"),
                    React.createElement('h1', { className: "text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight" }, "Room Layout Downloads"),
                    React.createElement('p', { className: "mt-4 max-w-2xl mx-auto text-lg text-gray-600" }, "Find and download floor plans for various NTU residential halls. All files are provided in high-resolution for your planning needs.")
                ),

                React.createElement('div', { className: "grid gap-8" },
                    roomLayoutsData.map(layout => React.createElement(LayoutCard, { key: layout.id, layout: layout }))
                ),

                React.createElement('div', { className: "mt-16 text-center text-gray-500 p-6 bg-white border border-gray-100 rounded-lg" },
                    React.createElement('h3', { className: "text-lg font-semibold text-gray-700" }, "Can't find your hall?"),
                    React.createElement('p', { className: "mt-2" },
                        "New layouts are added periodically. For specific requests, please contact the ",
                        React.createElement('a', { href: "#", className: "text-ntu-blue hover:underline font-medium" }, "NTU Office of Housing & Auxiliary Services"),
                        "."
                    )
                )
            )
        )
    );
};

export default RoomLayoutsPage;
