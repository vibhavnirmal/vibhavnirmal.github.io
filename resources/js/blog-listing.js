function createBlogListing(project) {
    const blogListing = document.createElement('article');
    blogListing.classList.add('blog-listing');
    blogListing.classList.add('all');

    project.tags.forEach(tag => {
        blogListing.classList.add(tag);
    });

    // create a div for image and title
    const imageTitleDiv = document.createElement('div');
    imageTitleDiv.classList.add('image-title-div');

    const contentDiv = document.createElement('div');
    contentDiv.classList.add('content-div');


    const titleElement = document.createElement('h2');
    titleElement.classList.add('blog-title');
    titleElement.textContent = project.title;

    const linkElement = document.createElement('a');
    if (project.titleLink === '#') {
        linkElement.onclick = function () { return false; };
        linkElement.style.cursor = 'default';
    } else {
        linkElement.href = project.titleLink;
    }

    // add video element
    if (project.image !== '') {
        if (project.image.includes('mp4')) {
            const videoElement = document.createElement('video');
            videoElement.src = project.image;

            videoElement.autoplay = true;
            videoElement.loop = true;
            videoElement.muted = true;

            videoElement.classList.add('blog-image');
            imageTitleDiv.appendChild(videoElement);
        } else {
            const imageElement = document.createElement('img');
            imageElement.src = project.image;
            imageElement.alt = 'Blog Image';
            imageElement.classList.add('blog-image');
            imageTitleDiv.appendChild(imageElement);
        }
    }

    const excerptElement = document.createElement('p');
    excerptElement.classList.add('blog-excerpt');
    excerptElement.textContent = project.description;

    const dateElement = createBlogDateElement(project.date);

    const iconElement = createIconElement(project.multipleLinks);

    if (project.image !== '') {
        blogListing.appendChild(imageTitleDiv);
        contentDiv.appendChild(dateElement);
        linkElement.appendChild(titleElement);
        contentDiv.appendChild(linkElement);
        contentDiv.appendChild(excerptElement);
        contentDiv.appendChild(iconElement);
        blogListing.appendChild(contentDiv);
    } else {
        blogListing.appendChild(dateElement);
        linkElement.appendChild(titleElement);
        blogListing.appendChild(linkElement);
        blogListing.appendChild(excerptElement);
        blogListing.appendChild(iconElement);
    }

    return blogListing;
}
