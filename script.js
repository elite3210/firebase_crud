
new gridjs.Grid({ 
    width: '100%',
    sort: true,
    search: true,
    pagination: {
    limit: 3,
    enable: true,
    //summary:false,
},
    columns: ['Name', 'Email'],
    data: [
            ['John', 'john@example.com'],
            ['Mike', 'mike@gmail.com'],
            ['John', 'john@example.com'],
            ['Mike', 'mike@gmail.com'],
            ['John', 'john@example.com'],
            ['Mike', 'mike@gmail.com'],
            ['John', 'john@example.com'],
            ['Mike', 'mike@gmail.com']
    ] 
    }
).render(document.getElementById('table'));

