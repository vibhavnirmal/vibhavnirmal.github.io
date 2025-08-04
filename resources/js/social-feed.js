// Social Feed for Unified Portfolio
(function() {
    'use strict';
    
    let projectsData = [];
    let filteredProjects = [];
    let currentFilter = 'all';
    
    // Initialize the social feed
    function initializeFeed() {
        loadProjectsData();
    }
    
    // Load projects data
    function loadProjectsData() {
        showLoading();
        
        fetch('resources/data.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                projectsData = data.projects || [];
                filteredProjects = [...projectsData];
                
                // Sort by date (newest first)
                filteredProjects.sort((a, b) => new Date(b.date) - new Date(a.date));
                
                createFilterChips();
                renderFeedPosts();
                hideLoading();
                
                // Update stats in sidebar
                updateStatsIfNeeded();
            })
            .catch(error => {
                console.error('Error loading projects:', error);
                showError();
            });
    }
    
    // Show loading state
    function showLoading() {
        const feedContainer = document.getElementById('feed-posts');
        if (feedContainer) {
            feedContainer.innerHTML = `
                <div class="feed-loading">
                    <div class="loading-spinner"></div>
                    <p>Loading your feed...</p>
                </div>
            `;
        }
    }
    
    // Hide loading state
    function hideLoading() {
        // Loading will be replaced by rendered posts
    }
    
    // Show error state
    function showError() {
        const feedContainer = document.getElementById('feed-posts');
        if (feedContainer) {
            feedContainer.innerHTML = `
                <div class="feed-empty">
                    <div class="empty-icon">⚠️</div>
                    <h3>Oops! Something went wrong</h3>
                    <p>Unable to load projects. Please try refreshing the page.</p>
                </div>
            `;
        }
    }
    
    // Create filter chips with enhanced UI
    function createFilterChips() {
        const filterContainer = document.getElementById('feed-filters');
        if (!filterContainer) return;
        
        const allTags = new Set();
        projectsData.forEach(project => {
            if (project.tags) {
                project.tags.forEach(tag => allTags.add(tag));
            }
        });
        
        const sortedTags = ['all', ...Array.from(allTags).sort()];
        
        // Initialize search functionality
        initializeSearch();
        
        // Count projects for each tag
        const tagCounts = {};
        tagCounts['all'] = projectsData.length;
        
        allTags.forEach(tag => {
            tagCounts[tag] = projectsData.filter(project => 
                project.tags && project.tags.includes(tag)
            ).length;
        });
        
        filterContainer.innerHTML = sortedTags.map(tag => {
            const count = tagCounts[tag];
            const isActive = tag === currentFilter;
            return `
                <button class="filter-chip ${isActive ? 'active' : ''}" 
                        onclick="filterProjects('${tag}')"
                        aria-pressed="${isActive}"
                        data-count="${count}">
                    ${tag === 'all' ? 'All Projects' : formatTagName(tag)}
                </button>
            `;
        }).join('');
        
        // Update results info
        updateFilterResultsInfo();
    }
    
    // Initialize search functionality
    function initializeSearch() {
        const searchInput = document.getElementById('project-search-input');
        const clearButton = document.getElementById('filter-clear-btn');
        
        if (searchInput && !searchInput.hasAttribute('data-initialized')) {
            // Add debounced search functionality
            let searchTimeout;
            searchInput.addEventListener('input', (event) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    handleFilterSearch(event);
                }, 300); // 300ms debounce
            });
            searchInput.setAttribute('data-initialized', 'true');
        }
        
        if (clearButton && !clearButton.hasAttribute('data-initialized')) {
            clearButton.addEventListener('click', clearFilterSearch);
            clearButton.setAttribute('data-initialized', 'true');
        }
    }
    
    // Format tag names for display
    function formatTagName(tag) {
        const tagMap = {
            'computervision': 'Computer Vision',
            'machinelearning': 'Machine Learning',
            'deeplearning': 'Deep Learning',
            'python': 'Python',
            'javascript': 'JavaScript',
            'cpp': 'C++',
            'blog': 'Blog Post',
            'linkedin': 'LinkedIn',
            'github': 'GitHub'
        };
        
        return tagMap[tag] || tag.charAt(0).toUpperCase() + tag.slice(1);
    }
    
    // Update statistics in sidebar if present
    function updateStatsIfNeeded() {
        // This function will be called to sync with the main page stats
        const event = new CustomEvent('projectsLoaded', {
            detail: {
                projects: projectsData,
                filteredCount: filteredProjects.length
            }
        });
        window.dispatchEvent(event);
    }
    
    // Filter projects with enhanced UI support
    window.filterProjects = function(tag) {
        currentFilter = tag;
        
        // Clear search input when changing filters
        const searchInput = document.getElementById('project-search-input');
        if (searchInput) {
            searchInput.value = '';
            // Hide clear button
            const clearButton = document.getElementById('filter-clear-btn');
            if (clearButton) {
                clearButton.style.opacity = '0';
            }
        }
        
        if (tag === 'all') {
            filteredProjects = [...projectsData];
        } else {
            filteredProjects = projectsData.filter(project => 
                project.tags && project.tags.includes(tag)
            );
        }
        
        // Sort by date (newest first)
        filteredProjects.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Update filter chips with enhanced active state
        document.querySelectorAll('.filter-chip').forEach(chip => {
            const chipText = chip.textContent.trim();
            const isActive = (tag === 'all' && chipText === 'All Projects') ||
                           (tag !== 'all' && chipText === formatTagName(tag));
            chip.classList.toggle('active', isActive);
            chip.setAttribute('aria-pressed', isActive);
        });
        
        renderFeedPosts();
        updateFilterResultsInfo();
        updateStatsIfNeeded();
    };
    
    // Render feed posts
    function renderFeedPosts() {
        const feedContainer = document.getElementById('feed-posts');
        if (!feedContainer) return;
        
        if (filteredProjects.length === 0) {
            feedContainer.innerHTML = `
                <div class="feed-empty">
                    <div class="empty-icon">📋</div>
                    <h3>No projects found</h3>
                    <p>Try selecting a different filter to see more projects.</p>
                </div>
            `;
            return;
        }
        
        feedContainer.innerHTML = filteredProjects.map(project => createPostHTML(project)).join('');
        
        // Add event listeners for interactions
        addPostInteractions();
    }
    
    // Create HTML for a single post
    function createPostHTML(project) {
        const formattedDate = formatDate(project.date);
        const timeAgo = getTimeAgo(project.date);
        const mediaHTML = createMediaHTML(project);
        const tagsHTML = createTagsHTML(project.tags);
        const linksHTML = createLinksHTML(project.multipleLinks);
        
        return `
            <article class="feed-post" data-project-id="${project.title}">
                <header class="post-header">
                    <img src="resources/images/vin.jpeg" 
                         alt="Vibhav Nirmal" 
                         class="post-avatar"
                         loading="lazy">
                    <div class="post-user-info">
                        <h3 class="post-username">Vibhav Nirmal</h3>
                        <p class="post-handle">@vibhavnirmal</p>
                    </div>
                    <time class="post-timestamp" datetime="${project.date}" title="${formattedDate}">
                        ${timeAgo}
                    </time>
                </header>
                
                <div class="post-content">
                    <h2 class="post-title">${project.title}</h2>
                    <p class="post-description">${project.description}</p>
                    
                    ${mediaHTML}
                </div>
                
                <footer class="post-footer">
                    ${tagsHTML}
                    <div class="post-actions">                        
                        <div class="external-links">
                            ${linksHTML}
                        </div>
                    </div>
                </footer>
            </article>
        `;
    }
    
    // Create media HTML (image, video, or embed)
    function createMediaHTML(project) {
        // Priority: 1. Local video/image, 2. Embed if no local media
        if (project.image) {
            const isVideo = project.image.endsWith('.mp4') || project.image.endsWith('.webm');
            
            if (isVideo) {
                return `
                    <div class="post-media">
                        <video class="post-video" 
                               controls 
                               muted
                               preload="metadata"
                               aria-label="Project demonstration video">
                            <source src="${project.image}" type="video/mp4">
                            Your browser does not support the video tag.
                        </video>
                    </div>
                `;
            } else {
                return `
                    <div class="post-media">
                        <img class="post-image" 
                             src="${project.image}" 
                             alt="${project.title} preview"
                             loading="lazy">
                    </div>
                `;
            }
        } else if (project.embed) {
            // Show embed if no local image/video is available
            return `
                <div class="post-media">
                    ${project.embed}
                </div>
            `;
        }
        
        return '';
    }
    
    // Create tags HTML
    function createTagsHTML(tags) {
        if (!tags || tags.length === 0) return '';
        
        return `
            <div class="post-tags">
                ${tags.map(tag => `
                    <a href="#" class="post-tag" onclick="filterProjects('${tag}'); return false;">
                        ${formatTagName(tag)}
                    </a>
                `).join('')}
            </div>
        `;
    }
    
    // Create external links HTML
    function createLinksHTML(links) {
        if (!links || links.length === 0) return '';
        
        return `
            <div class="external-links-container">
                <span class="external-links-label">Learn more:</span>
                <div class="external-links">
                    ${links.map(linkObj => {
                        const platform = getPlatformFromIcon(linkObj.icon);
                        const linkText = getPlatformLinkText(platform);
                        return `
                            <a href="${linkObj.link}" 
                               class="external-link ${platform.toLowerCase()}" 
                               target="_blank" 
                               rel="noopener noreferrer"
                               title="View on ${platform}"
                               aria-label="View this project on ${platform}">
                                ${getPlatformIcon(platform)}
                                <span class="link-text">${linkText}</span>
                            </a>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }
    
    // Get platform name from icon path
    function getPlatformFromIcon(iconPath) {
        if (iconPath.includes('GitHub')) return 'GitHub';
        if (iconPath.includes('Linkedin')) return 'LinkedIn';
        if (iconPath.includes('Medium')) return 'Medium';
        if (iconPath.includes('Youtube')) return 'YouTube';
        return 'External Link';
    }
    
    // Get platform-specific link text
    function getPlatformLinkText(platform) {
        const linkTexts = {
            'GitHub': 'View Code',
            'LinkedIn': 'Read Article',
            'Medium': 'Read Blog',
            'YouTube': 'Watch Demo',
            'External Link': 'Learn More'
        };
        
        return linkTexts[platform] || 'Learn More';
    }
    
    // Get platform icon using Font Awesome classes
    function getPlatformIcon(platform) {
        const icons = {
            'GitHub': '<i class="fab fa-github" aria-hidden="true"></i>',
            'LinkedIn': '<i class="fab fa-linkedin" aria-hidden="true"></i>',
            'Medium': '<i class="fab fa-medium" aria-hidden="true"></i>',
            'YouTube': '<i class="fab fa-youtube" aria-hidden="true"></i>',
            'External Link': '<i class="fas fa-external-link-alt" aria-hidden="true"></i>'
        };
        
        return icons[platform] || '<i class="fas fa-link" aria-hidden="true"></i>';
    }
    
    // Format date for display
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
    
    // Get time ago string
    function getTimeAgo(dateString) {
        const now = new Date();
        const date = new Date(dateString);
        const diffInSeconds = Math.floor((now - date) / 1000);
        
        const timeUnits = [
            { unit: 'year', seconds: 31536000 },
            { unit: 'month', seconds: 2592000 },
            { unit: 'week', seconds: 604800 },
            { unit: 'day', seconds: 86400 },
            { unit: 'hour', seconds: 3600 },
            { unit: 'minute', seconds: 60 }
        ];
        
        for (const { unit, seconds } of timeUnits) {
            const interval = Math.floor(diffInSeconds / seconds);
            if (interval >= 1) {
                return `${interval}${unit.charAt(0)}`;
            }
        }
        
        return 'now';
    }
    
    // Add post interactions
    function addPostInteractions() {
        // No like functionality needed anymore
    }
    
    // Share post functionality
    window.sharePost = function(postId) {
        const project = projectsData.find(p => p.title === postId);
        if (!project) return;
        
        const shareData = {
            title: project.title,
            text: project.description,
            url: window.location.href
        };
        
        if (navigator.share) {
            navigator.share(shareData).catch(console.error);
        } else {
            // Fallback: copy to clipboard
            const url = window.location.href;
            navigator.clipboard.writeText(url).then(() => {
                showToast('Link copied to clipboard!');
            }).catch(() => {
                showToast('Unable to copy link');
            });
        }
    };
    
    // Show toast message
    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #333333;
            color: #ffffff;
            padding: 12px 24px;
            z-index: 1000;
            font-size: 14px;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => toast.style.opacity = '1', 10);
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => document.body.removeChild(toast), 300);
        }, 2000);
    }
    
    // Enhanced filter search functionality
    function handleFilterSearch(event) {
        const searchTerm = event.target.value.toLowerCase();
        
        // Apply both search and filter criteria
        if (searchTerm === '') {
            // If no search term, just apply current filter
            if (currentFilter === 'all') {
                filteredProjects = [...projectsData];
            } else {
                filteredProjects = projectsData.filter(project => 
                    project.tags && project.tags.includes(currentFilter)
                );
            }
        } else {
            // Apply both search and filter
            filteredProjects = projectsData.filter(project => {
                const matchesSearch = 
                    project.title.toLowerCase().includes(searchTerm) ||
                    project.description.toLowerCase().includes(searchTerm) ||
                    (project.tags && project.tags.some(tag => tag.toLowerCase().includes(searchTerm)));
                
                const matchesFilter = currentFilter === 'all' || 
                    (project.tags && project.tags.includes(currentFilter));
                
                return matchesSearch && matchesFilter;
            });
        }
        
        // Sort by date (newest first)
        filteredProjects.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        renderFeedPosts();
        updateFilterResultsInfo(filteredProjects.length, searchTerm);
        
        // Show/hide clear button based on input
        const clearButton = document.getElementById('filter-clear-btn');
        if (clearButton) {
            clearButton.style.opacity = searchTerm ? '1' : '0';
        }
    }
    
    // Clear search input
    function clearFilterSearch() {
        const searchInput = document.getElementById('project-search-input');
        if (searchInput) {
            searchInput.value = '';
            // Trigger search to reset results
            handleFilterSearch({ target: searchInput });
        }
    }
    
    // Update filter results information
    function updateFilterResultsInfo(customCount = null, searchTerm = '') {
        const existingInfo = document.querySelector('.filter-results-info');
        if (existingInfo) {
            existingInfo.remove();
        }
        
        const count = customCount !== null ? customCount : filteredProjects.length;
        const total = projectsData.length;
        
        let message = '';
        if (searchTerm) {
            message = `${count} found: "${searchTerm}"`;
            if (currentFilter !== 'all') {
                message = `${count} in ${formatTagName(currentFilter)}: "${searchTerm}"`;
            }
        } else if (currentFilter !== 'all') {
            message = `${count} in ${formatTagName(currentFilter)}`;
        } else {
            message = `${count} projects`;
        }
        
        if (count === 0) {
            message = searchTerm ? 
                `No matches: "${searchTerm}"` : 
                `No projects in ${formatTagName(currentFilter)}`;
        }
        
        // Show floating chip for any filter/search activity or when count is 0
        if (searchTerm || currentFilter !== 'all' || count === 0) {
            const infoHTML = `
                <div class="filter-results-info" onclick="this.remove()">
                    <span>${message}</span>
                    <button class="close-btn" aria-label="Close">&times;</button>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', infoHTML);
            
            // Auto-hide after 3 seconds if no search term
            if (!searchTerm && count > 0) {
                setTimeout(() => {
                    const info = document.querySelector('.filter-results-info');
                    if (info) {
                        info.style.opacity = '0';
                        info.style.transform = 'translateY(20px)';
                        setTimeout(() => info.remove(), 300);
                    }
                }, 3000);
            }
        }
    }
    
    // Initialize when DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeFeed);
    } else {
        initializeFeed();
    }
    
})();
