const changeView = (view) => {
    const container = document.getElementById("blog-container");
    const gridIcon = document.getElementById("grid-icon");
    const listIcon = document.getElementById("list-icon");

    const isGridView = view === 'grid';
    container.classList.toggle("list-view", !isGridView);
    container.classList.toggle("grid-view", isGridView);

    gridIcon.classList.toggle("active", isGridView);
    listIcon.classList.toggle("active", !isGridView);
};