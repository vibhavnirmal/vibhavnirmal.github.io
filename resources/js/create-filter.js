function activateFilters() {
    const dropdownButton = document.getElementById('dropdown-button');
    const dropdownContent = document.querySelector('.dropdown-content');
    const filterInput = document.getElementById('filter-input');
    const optionsList = document.getElementById('options-list');
    const selectedOptions = document.getElementById('selected-options');
    // const filterButton = document.getElementById('filter-button');

    // Toggle the dropdown when the button is clicked
    dropdownButton.addEventListener('click', function () {
        dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
    });

    // Filter options as the user types
    filterInput.addEventListener('input', function () {
        const filterText = filterInput.value.toLowerCase();

        for (const checkbox of optionsList.querySelectorAll('.option-checkbox')) {
            const label = checkbox.parentNode;
            if (label.textContent.toLowerCase().includes(filterText)) {
                label.style.display = 'block';
            } else {
                label.style.display = 'none';
            }
        }
    });

    // Apply the filter and close the dropdown
    // filterButton.addEventListener('click', function () {
    //     dropdownContent.style.display = 'none';
    // });

    // Update selected options when checkboxes are clicked
    optionsList.addEventListener('change', function () {
        const selected = Array.from(optionsList.querySelectorAll('.option-checkbox:checked')).map(checkbox => checkbox.value.toLowerCase());
        selectedOptions.textContent = selected.length > 0 ? selected.join(', ') : 'None';
        selectedOptions.classList.toggle('noTag', selected.length === 0);

        if (selected.length === 0) {
            filterSelection('all');
        } else {
            filterSelection(selected);
        }
    });
};


function createFilterElement(uniqueTags) {
    // Create the main filter container
    const filterElement = document.createElement('div');
    filterElement.classList.add('filters');

    // Create the dropdown container
    const dropdownElement = document.createElement('div');
    dropdownElement.classList.add('dropdown');

    // Create the dropdown button
    const dropdownButtonElement = document.createElement('button');
    dropdownButtonElement.classList.add('dropdown-button');
    dropdownButtonElement.id = 'dropdown-button';
    dropdownButtonElement.textContent = 'Filter Tags';

    // Create the dropdown content container
    const dropdownContentElement = document.createElement('div');
    dropdownContentElement.classList.add('dropdown-content');

    // Create the filter input field
    const filterInputElement = document.createElement('input');
    filterInputElement.type = 'text';
    filterInputElement.id = 'filter-input';
    filterInputElement.placeholder = 'Filter options';

    // Create the options list (ul)
    const optionsListElement = document.createElement('ul');
    optionsListElement.id = 'options-list';

    // Create the option checkboxes and labels
    uniqueTags.forEach(tag => {
        const optionLiElement = document.createElement('li');

        const optionLabelElement = document.createElement('label');
        optionLabelElement.classList.add('option-label');

        const optionInputElement = document.createElement('input');
        optionInputElement.type = 'checkbox';
        optionInputElement.classList.add('option-checkbox');
        // convert to First Letter Capital
        tag = tag.charAt(0).toUpperCase() + tag.slice(1);
        optionInputElement.value = tag;

        const optionTextElement = document.createTextNode(tag);

        optionLabelElement.appendChild(optionInputElement);
        optionLabelElement.appendChild(optionTextElement);

        optionLiElement.appendChild(optionLabelElement);

        optionsListElement.appendChild(optionLiElement);
    });

    const filtersSelectedText = document.createElement('p');
    filtersSelectedText.id = 'filters-selected-text';
    filtersSelectedText.textContent = 'Tags selected:';
    filtersSelectedText.style.display = 'inline-block';

    // Create the selected options container
    const selectedOptionsElement = document.createElement('p');
    selectedOptionsElement.id = 'selected-options';
    selectedOptionsElement.classList.add('noTag');
    selectedOptionsElement.textContent = 'None';

    // Create the filter button
    // const filterButtonElement = document.createElement('button');
    // filterButtonElement.id = 'filter-button';
    // filterButtonElement.textContent = 'Apply Filter';

    // Add the elements to the DOM
    dropdownContentElement.appendChild(filterInputElement);
    dropdownContentElement.appendChild(optionsListElement);

    dropdownElement.appendChild(dropdownButtonElement);
    dropdownElement.appendChild(dropdownContentElement);

    filterElement.appendChild(dropdownElement);
    filterElement.appendChild(filtersSelectedText);
    filterElement.appendChild(selectedOptionsElement);
    // filterElement.appendChild(filterButtonElement);

    // Use our enhanced HTML structure - target the filter-container
    const filterContainer = document.getElementById('filter-container');
    if (filterContainer) {
        // Clear any existing content and append the new filter
        filterContainer.innerHTML = '';
        filterContainer.appendChild(filterElement);
        console.log('Filter element added to filter-container');
    } else {
        console.error('filter-container not found');
        // Fallback: try to find the old structure
        const mainProjectsElement = document.getElementsByClassName('filtersAndView')[0];
        if (mainProjectsElement) {
            mainProjectsElement.insertBefore(filterElement, mainProjectsElement.childNodes[0]);
        } else {
            console.error('Neither filter-container nor filtersAndView found');
        }
    }

    activateFilters();
}