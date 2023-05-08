function displayProjects() {
    fetch('resources/data.json')
        .then(response => response.json())
        .then(data => {
            const projectsContainer = document.querySelector('.projects-container');
            data.projects.forEach(project => {
                const projectDiv = document.createElement('div');
                projectDiv.className = 'project';
                // position relative to place overlay on top of background image
                projectDiv.style.position = 'relative';
                // padding to make room for overlay
                projectDiv.style.padding = '10px';

                const iconImg = document.createElement('img');
                iconImg.src = project.icon;
                iconImg.alt = `${project.title} icon`;
                iconImg.className = 'project-icon';

                // create background image overlay
                const overlay = document.createElement('div');
                overlay.className = 'overlay';
                projectDiv.appendChild(overlay);
                overlay.style.backgroundImage = `url(${project.image})`;
                overlay.style.backgroundPosition = 'center';
                overlay.style.backgroundSize = 'cover';
                overlay.style.zIndex = '-1';
                overlay.style.height = '100%';
                overlay.style.width = '100%';
                overlay.style.position = 'absolute';
                overlay.style.filter = 'blur(1px)';
                overlay.style.opacity = '0.2';
                overlay.style.borderRadius = '10px';
                
                const projectInfo = document.createElement('div');
                projectInfo.className = 'project-info';

                const projectTitle = document.createElement('h2');
                projectTitle.textContent = project.title;
                projectTitle.className = 'project-title';

                const projectDescription = document.createElement('p');
                projectDescription.textContent = project.description;
                projectDescription.className = 'project-description';

                const projectDate = document.createElement('p');
                projectDate.textContent = `Published on ${project.date}`;
                projectDate.className = 'project-date';

                const projectLink = document.createElement('a');
                projectLink.href = project.link;
                projectLink.target = '_blank';

                projectLink.appendChild(iconImg);
                projectLink.appendChild(projectInfo);
                projectInfo.appendChild(projectTitle);
                projectInfo.appendChild(projectDescription);
                projectInfo.appendChild(projectDate);
                projectDiv.appendChild(projectLink);

                projectsContainer.appendChild(projectDiv);
            });
        })
        .catch(error => console.error(error));
}

displayProjects();
