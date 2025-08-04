

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

    if (!multipleLinks || multipleLinks.length === 0) {
        iconElement.style.display = 'none';
        return iconElement;
    }

    multipleLinks.forEach(link => {
        if (link.link === '#' || !link.link) {
            return; // Skip invalid links
        }

        const iconLink = document.createElement('a');
        iconLink.href = link.link;
        iconLink.target = '_blank';
        iconLink.rel = 'noopener noreferrer';
        iconLink.classList.add('social-link');

        // Create text-based icons instead of images for better reliability
        const iconText = document.createElement('span');
        iconText.classList.add('social-icon-text');
        
        // Determine icon type based on URL or icon path
        if (link.link.includes('linkedin') || (link.icon && link.icon.includes('Linkedin'))) {
            iconText.textContent = 'LinkedIn';
            iconText.classList.add('linkedin-icon');
        } else if (link.link.includes('github') || (link.icon && link.icon.includes('GitHub'))) {
            iconText.textContent = 'GitHub';
            iconText.classList.add('github-icon');
        } else if (link.link.includes('medium') || (link.icon && link.icon.includes('Medium'))) {
            iconText.textContent = 'Medium';
            iconText.classList.add('medium-icon');
        } else if (link.link.includes('youtube') || (link.icon && link.icon.includes('Youtube'))) {
            iconText.textContent = 'YouTube';
            iconText.classList.add('youtube-icon');
        } else if (link.link.includes('instagram') || (link.icon && link.icon.includes('Instagram'))) {
            iconText.textContent = 'Instagram';
            iconText.classList.add('instagram-icon');
        } else {
            iconText.textContent = 'Link';
            iconText.classList.add('generic-icon');
        }

        iconLink.appendChild(iconText);
        iconElement.appendChild(iconLink);
    });

    return iconElement;
}

function filterSelection(tags) {
    const blogListings = document.querySelectorAll('.blog-listing');
    let visibleCount = 0;

    blogListings.forEach(blogList => {
        const blogListClasses = blogList.classList;

        if (tags === 'all' || tags.some(tag => blogListClasses.contains(tag))) {
            blogList.style.display = 'block';
            visibleCount++;
        } else {
            blogList.style.display = 'none';
        }
    });
    
    // Update results counter
    updateResultsCounter(visibleCount);
    console.log(`Showing ${visibleCount} projects`);
}

function updateResultsCounter(count) {
    const resultsCounter = document.getElementById('results-counter');
    const resultsCount = document.getElementById('results-count');
    
    if (resultsCounter && resultsCount) {
        resultsCount.textContent = count;
        resultsCounter.style.display = count > 0 ? 'block' : 'none';
    }
}

fetch('resources/data.json')
    .then(response => {
        console.log('Fetching data.json...', response.status);
        return response.json();
    })
    .then(data => {
        console.log('Data loaded:', data);
        console.log('Number of projects:', data.projects.length);
        
        let alltags = [];

        data.projects.forEach(project => {
            project.tags.forEach(tag => {
                alltags.push(tag);
            });
        });

        const uniqueTags = Array.from(new Set(alltags));
        console.log('Creating filters for tags:', uniqueTags);
        createFilterElement(uniqueTags);

        const blogContainer = document.getElementById('blog-container');
        console.log('Blog container found:', !!blogContainer);

        if (!blogContainer) {
            console.error('blog-container element not found!');
            return;
        }

        data.projects.forEach((project, index) => {
            console.log(`Creating blog listing ${index + 1}:`, project.title);
            const blogListing = createBlogListing(project);
            if (blogListing) {
                blogContainer.appendChild(blogListing);
            } else {
                console.error(`Failed to create blog listing for project: ${project.title}`);
            }
        });
        
        // Initialize results counter with total count
        updateResultsCounter(data.projects.length);
        
        console.log('All projects loaded successfully!');
    })
    .catch(error => {
        console.error('Error loading projects:', error);
    });
