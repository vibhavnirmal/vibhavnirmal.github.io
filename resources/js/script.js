

// if clicked outside of dropdown, close it
window.onclick = function (event) {
    if (!event.target.matches('.dropdown-button') && !event.target.matches('.option-checkbox') && !event.target.matches('#filter-input') && !event.target.matches('#options-list') && !event.target.matches('#selected-options') && !event.target.matches('#filter-button') && !event.target.matches('.option-label')) {
        const dropdowns = document.getElementsByClassName("dropdown-content");
        for (let i = 0; i < dropdowns.length; i++) {
            const openDropdown = dropdowns[i];
            if (openDropdown.style.display === "block") {
                openDropdown.style.display = "none";
            }
        }
    }
    // else{
    //     console.log(event.target);
    // }
};

document.addEventListener('DOMContentLoaded', function () {
    // Get the current URL or page
    let currentPage = window.location.href;

    // Find the navigation item that matches the current URL and add the "current" class
    let navigationItems = document.getElementsByTagName('a');
    for (let i = 0; i < navigationItems.length; i++) {
        if (currentPage.indexOf(navigationItems[i].href) > -1) {
            navigationItems[i].className = 'current';
        }
    }
});


function createBlogDateElement(date) {
    const dateElement = document.createElement('p');
    dateElement.classList.add('blog-date');

    const dateObject = new Date(date);
    dateObject.setDate(dateObject.getDate() + 1);
    const humanDateFormat = dateObject.toLocaleString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    dateElement.textContent = 'Published on ' + humanDateFormat;

    return dateElement;
}

function createIconElement(multipleLinks) {
    const iconElement = document.createElement('div');
    iconElement.classList.add('blog-icons');

    multipleLinks.forEach(link => {
        if (link.link === '#') {
            iconElement.style.display = 'none';
        } else {
            const iconLink = document.createElement('a');
            iconLink.href = link.link;

            const iconImg = document.createElement('img');
            iconImg.src = link.icon;
            iconImg.alt = 'Icon';
            iconImg.classList.add('socialIcon');

            iconLink.appendChild(iconImg);
            iconElement.appendChild(iconLink);
        }
    });

    return iconElement;
}

function filterSelection(tags) {

    const blogListings = document.querySelectorAll('.blog-listing');

    blogListings.forEach(blogList => {
        const blogListClasses = blogList.classList;

        if (tags === 'all' || tags.some(tag => blogListClasses.contains(tag))) {
            blogList.style.display = 'grid';
        } else {
            blogList.style.display = 'none';
        }
    });
}

fetch('resources/data.json')
    .then(response => response.json())
    .then(data => {
        let alltags = [];

        data.projects.forEach(project => {
            project.tags.forEach(tag => {
                alltags.push(tag);
            });
        });

        const uniqueTags = Array.from(new Set(alltags));
        createFilterElement(uniqueTags);

        const blogContainer = document.getElementById('blog-container');

        data.projects.forEach(project => {
            const blogListing = createBlogListing(project);
            blogContainer.appendChild(blogListing);
        });
    })
    .catch(error => console.error(error));
