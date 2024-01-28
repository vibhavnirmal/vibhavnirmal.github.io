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

    // show video in popup
    imageTitleDiv.addEventListener('click', function () {

        // if display @media screen and (max-width: 700px) then don't show popup
        if (window.matchMedia("(max-width: 700px)").matches) {
            return;
        }

        // if popup is already open, close the previous one
        let oldpopup = document.querySelector('.media-popup');
        if (oldpopup) {
            document.body.removeChild(oldpopup);
        }

        const fileExtension = project.image.split('.').pop().toLowerCase();

        const popup = document.createElement('div');
        popup.classList.add('media-popup');

        let mediaElement;

        if (fileExtension === 'mp4') {
            mediaElement = document.createElement('video');
            mediaElement.autoplay = true;
            mediaElement.loop = true;
            mediaElement.muted = true;
        } else if (fileExtension === 'gif' || fileExtension === 'jpg' || fileExtension === 'jpeg' || fileExtension === 'png') {
            mediaElement = document.createElement('img');
        } else {
            // Handle unsupported file types (optional)
            console.error('Unsupported file type:', fileExtension);
            return;
        }

        mediaElement.src = project.image;
        mediaElement.classList.add('media-content');

        popup.appendChild(mediaElement);

        const closePopup = document.createElement('div');
        closePopup.classList.add('close-popup');
        closePopup.innerHTML = '&times;';
        popup.appendChild(closePopup);

        document.body.appendChild(popup);

        closePopup.addEventListener('click', function () {
            document.body.removeChild(popup);
        });
    });

    // close popup when esc key is pressed
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            const popup = document.querySelector('.media-popup');
            if (popup) {
                document.body.removeChild(popup);
            }
        }
    });

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