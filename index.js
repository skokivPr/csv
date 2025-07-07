// Global variables - Elements will be initialized after DOM is ready
let csvInput, analyzeButton, outputDiv, summaryDiv, messageModal, modalMessage, closeModalBtn, modalOkBtn;
let columnSelectionContainer, columnCheckboxesWrapper, columnPlaceholder, selectAllColumnsCheckbox;
let openColumnModalBtn, columnModal, closeColumnModalBtn, confirmColumnSelectionBtn, cancelColumnSelectionBtn, selectedColumnsInfo;
let showCleanDataBtn, cleanDataModal, closeCleanDataModalBtn, closeCleanDataBtn, copyCleanDataBtn, downloadCleanDataBtn, toggleViewBtn, cleanDataOutput, cleanDataTableOutput;
let themeToggle, scrollUpBtn;

// Note: Statistics elements are accessed directly in functions using getElementById for better compatibility

// Variables to store clean data
let currentCleanData = '';
let currentCleanHeaders = [];
let currentCleanRows = [];
let isTableView = true;

// Initialize DOM elements after dynamic HTML is loaded
function initializeDOMElements() {
    // Basic elements
    csvInput = document.getElementById('csvInput');
    analyzeButton = document.getElementById('analyzeButton');
    outputDiv = document.getElementById('output');
    summaryDiv = document.getElementById('summary');
    messageModal = document.getElementById('messageModal');
    modalMessage = document.getElementById('modalMessage');
    closeModalBtn = document.getElementById('closeModalBtn');
    modalOkBtn = document.getElementById('modalOkBtn');

    // Column selection elements
    columnSelectionContainer = document.getElementById('columnSelectionContainer');
    columnCheckboxesWrapper = document.getElementById('columnCheckboxesWrapper');
    columnPlaceholder = document.getElementById('columnPlaceholder');
    selectAllColumnsCheckbox = document.getElementById('selectAllColumns');

    // Column modal elements
    openColumnModalBtn = document.getElementById('openColumnModal');
    columnModal = document.getElementById('columnModal');
    closeColumnModalBtn = document.getElementById('closeColumnModalBtn');
    confirmColumnSelectionBtn = document.getElementById('confirmColumnSelection');
    cancelColumnSelectionBtn = document.getElementById('cancelColumnSelection');
    selectedColumnsInfo = document.getElementById('selectedColumnsInfo');

    // Clean data modal elements
    showCleanDataBtn = document.getElementById('showCleanDataBtn');
    cleanDataModal = document.getElementById('cleanDataModal');
    closeCleanDataModalBtn = document.getElementById('closeCleanDataModalBtn');
    closeCleanDataBtn = document.getElementById('closeCleanDataBtn');
    copyCleanDataBtn = document.getElementById('copyCleanDataBtn');
    downloadCleanDataBtn = document.getElementById('downloadCleanDataBtn');
    toggleViewBtn = document.getElementById('toggleViewBtn');
    cleanDataOutput = document.getElementById('cleanDataOutput');
    cleanDataTableOutput = document.getElementById('cleanDataTableOutput');

    // UI elements
    themeToggle = document.getElementById('themeToggle');
    scrollUpBtn = document.getElementById('scrollUpBtn');
}
// Theme functionality
function initializeTheme() {
    const savedTheme = localStorage.getItem('csvAnalyzerTheme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function updateThemeIcon(theme) {
    themeToggle.innerHTML = theme === 'dark'
        ? '<i class="fas fa-sun"></i>'
        : '<i class="fas fa-moon"></i>';
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('csvAnalyzerTheme', newTheme);
    updateThemeIcon(newTheme);
}

// Scroll functionality
function initializeScrollButton() {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollUpBtn.classList.add('visible');
        } else {
            scrollUpBtn.classList.remove('visible');
        }
    });
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Statistics functions
function updateStatistics(csvData, duplicatesData = null) {
    const statisticsSection = document.getElementById('statisticsSection');

    if (!csvData.trim()) {
        resetStatistics();
        return;
    }

    const lines = csvData.split(/\r?\n/).filter(line => line.trim() !== '');
    const headerLine = lines[0];
    const dataLines = lines.slice(1);

    const totalRows = dataLines.length;
    const columnsCount = headerLine ? headerLine.split(',').length : 0;

    let duplicateCount = 0;
    let uniqueCount = totalRows;

    if (duplicatesData) {
        duplicateCount = duplicatesData.duplicateCount || 0;
        uniqueCount = duplicatesData.uniqueCount || totalRows;
    }

    // Show statistics section
    if (statisticsSection) {
        statisticsSection.style.display = 'block';
    }

    // Animate number changes
    const totalRowsElement = document.getElementById('totalRows');
    const duplicateCountElement = document.getElementById('duplicateCount');
    const uniqueCountElement = document.getElementById('uniqueCount');
    const columnsCountElement = document.getElementById('columnsCount');

    if (totalRowsElement) animateNumber(totalRowsElement, totalRows);
    if (duplicateCountElement) animateNumber(duplicateCountElement, duplicateCount);
    if (uniqueCountElement) animateNumber(uniqueCountElement, uniqueCount);
    if (columnsCountElement) animateNumber(columnsCountElement, columnsCount);
}

function resetStatistics() {
    const statisticsSection = document.getElementById('statisticsSection');
    const totalRowsElement = document.getElementById('totalRows');
    const duplicateCountElement = document.getElementById('duplicateCount');
    const uniqueCountElement = document.getElementById('uniqueCount');
    const columnsCountElement = document.getElementById('columnsCount');

    // Hide statistics section
    if (statisticsSection) {
        statisticsSection.style.display = 'none';
    }

    if (totalRowsElement) animateNumber(totalRowsElement, 0);
    if (duplicateCountElement) animateNumber(duplicateCountElement, 0);
    if (uniqueCountElement) animateNumber(uniqueCountElement, 0);
    if (columnsCountElement) animateNumber(columnsCountElement, 0);
}

function animateNumber(element, targetNumber) {
    const currentNumber = parseInt(element.textContent) || 0;
    const increment = targetNumber > currentNumber ? 1 : -1;
    const stepTime = Math.abs(Math.floor(300 / (targetNumber - currentNumber)));

    if (currentNumber === targetNumber) return;

    const timer = setInterval(() => {
        const current = parseInt(element.textContent) || 0;
        if (current === targetNumber) {
            clearInterval(timer);
        } else {
            element.textContent = current + increment;
        }
    }, stepTime || 50);
}

// Smooth scrolling for navigation links
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Enhanced placeholder management
function updatePlaceholder() {
    const csvText = csvInput.value.trim();
    const outputPlaceholder = document.querySelector('.output-placeholder');

    if (csvText) {
        // Show basic statistics when user types
        updateStatistics(csvText);
        if (outputPlaceholder) {
            outputPlaceholder.style.display = 'none';
        }
    } else {
        // Hide statistics when input is empty
        resetStatistics();
        if (outputPlaceholder) {
            outputPlaceholder.style.display = 'flex';
        }
    }
}

// Initialize all new functionality
function initializeEnhancedUI() {
    initializeTheme();
    initializeScrollButton();
    initializeSmoothScrolling();

    // Initialize placeholder state
    updatePlaceholder();
}

function showModal(message) {
    modalMessage.textContent = message;
    messageModal.style.display = 'flex';
    modalOkBtn.focus();
}

// Modal functions
function showColumnModal() {
    columnModal.style.display = 'flex';
    confirmColumnSelectionBtn.focus();
}

function hideColumnModal() {
    columnModal.style.display = 'none';
}

function updateSelectedColumnsInfo() {
    const selectedCheckboxes = columnCheckboxesWrapper.querySelectorAll('.column-checkbox:checked');
    const csvText = csvInput.value.trim();

    if (!csvText) {
        selectedColumnsInfo.textContent = 'Wprowadz dane CSV, aby wybrac kolumny';
        openColumnModalBtn.disabled = true;
        return;
    }

    openColumnModalBtn.disabled = false;

    if (selectedCheckboxes.length === 0) {
        selectedColumnsInfo.textContent = 'Nie wybrano kolumn (analiza calych wierszy)';
    } else {
        const selectedNames = Array.from(selectedCheckboxes).map(cb => cb.value);
        if (selectedNames.length === 1) {
            selectedColumnsInfo.textContent = `Wybrana kolumna: ${selectedNames[0]}`;
        } else {
            selectedColumnsInfo.textContent = `Wybrane kolumny (${selectedNames.length}): ${selectedNames.slice(0, 2).join(', ')}${selectedNames.length > 2 ? '...' : ''}`;
        }
    }
}

// Initialize event listeners after DOM elements are ready
function initializeEventListeners() {
    // Basic UI event listeners
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    if (scrollUpBtn) {
        scrollUpBtn.addEventListener('click', scrollToTop);
    }
    if (csvInput) {
        csvInput.addEventListener('input', updatePlaceholder);
    }

    // Message modal event listeners
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => messageModal.style.display = 'none');
        closeModalBtn.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') messageModal.style.display = 'none';
        });
    }

    if (modalOkBtn) {
        modalOkBtn.addEventListener('click', () => messageModal.style.display = 'none');
    }

    // Column modal event listeners
    if (openColumnModalBtn) {
        openColumnModalBtn.addEventListener('click', showColumnModal);
    }
    if (closeColumnModalBtn) {
        closeColumnModalBtn.addEventListener('click', hideColumnModal);
    }
    if (confirmColumnSelectionBtn) {
        confirmColumnSelectionBtn.addEventListener('click', () => {
            updateSelectedColumnsInfo();
            hideColumnModal();
        });
    }
    if (cancelColumnSelectionBtn) {
        cancelColumnSelectionBtn.addEventListener('click', hideColumnModal);
    }

    // Global event listeners
    window.addEventListener('click', (event) => {
        if (messageModal && event.target == messageModal) {
            messageModal.style.display = 'none';
        }
        if (columnModal && event.target === columnModal) {
            hideColumnModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            if (columnModal && columnModal.style.display === 'flex') {
                hideColumnModal();
            }
            if (cleanDataModal && cleanDataModal.style.display === 'flex') {
                hideCleanDataModal();
            }
        }
    });

    // Clean data modal event listeners
    if (showCleanDataBtn) {
        showCleanDataBtn.addEventListener('click', showCleanDataModal);
    }
    if (closeCleanDataModalBtn) {
        closeCleanDataModalBtn.addEventListener('click', hideCleanDataModal);
    }
    if (closeCleanDataBtn) {
        closeCleanDataBtn.addEventListener('click', hideCleanDataModal);
    }
    if (toggleViewBtn) {
        toggleViewBtn.addEventListener('click', () => {
            isTableView = !isTableView;
            updateCleanDataDisplay();
        });
    }
    if (copyCleanDataBtn) {
        copyCleanDataBtn.addEventListener('click', () => {
            copyToClipboard(currentCleanData);
        });
    }
    if (downloadCleanDataBtn) {
        downloadCleanDataBtn.addEventListener('click', () => {
            downloadCSV(currentCleanData);
        });
    }

    // CSV input event listener
    if (csvInput) {
        csvInput.addEventListener('input', handleCSVInputChange);
    }

    // Select all columns event listener
    if (selectAllColumnsCheckbox) {
        selectAllColumnsCheckbox.addEventListener('change', handleSelectAllColumnsChange);
    }

    // Analyze button event listener
    if (analyzeButton) {
        analyzeButton.addEventListener('click', handleAnalyzeButtonClick);
    }

    // Additional window event listeners
    window.addEventListener('click', (event) => {
        if (cleanDataModal && event.target === cleanDataModal) {
            hideCleanDataModal();
        }
    });

    // Initial CSV input dispatch to ensure proper initialization
    if (csvInput) {
        setTimeout(() => {
            csvInput.dispatchEvent(new Event('input'));
        }, 0);
    }
}

// Clean data modal functions
function showCleanDataModal() {
    updateCleanDataDisplay();
    updateModalStatistics();
    cleanDataModal.style.display = 'flex';
    copyCleanDataBtn.focus();
}

function updateModalStatistics() {
    const modalTotalRows = document.getElementById('modalTotalRows');
    const modalColumnsCount = document.getElementById('modalColumnsCount');
    const modalDataSize = document.getElementById('modalDataSize');

    // Calculate statistics from clean data
    const totalRows = currentCleanRows.length;
    const columnsCount = currentCleanHeaders.length;

    // Calculate data size in bytes/KB
    const dataSize = new Blob([currentCleanData]).size;
    const dataSizeFormatted = dataSize < 1024
        ? `${dataSize} B`
        : dataSize < 1024 * 1024
            ? `${(dataSize / 1024).toFixed(1)} KB`
            : `${(dataSize / (1024 * 1024)).toFixed(1)} MB`;

    // Update modal statistics with animation
    if (modalTotalRows) animateNumber(modalTotalRows, totalRows);
    if (modalColumnsCount) animateNumber(modalColumnsCount, columnsCount);
    if (modalDataSize) {
        modalDataSize.textContent = dataSizeFormatted;
    }
}

function updateCleanDataDisplay() {
    if (isTableView) {
        cleanDataTableOutput.style.display = 'block';
        cleanDataOutput.style.display = 'none';
        toggleViewBtn.textContent = 'Pokaz jako tekst';

        // Generate table HTML
        let tableHtml = '<table><thead><tr>';
        currentCleanHeaders.forEach(header => {
            tableHtml += `<th>${header}</th>`;
        });
        tableHtml += '</tr></thead><tbody>';

        currentCleanRows.forEach(row => {
            tableHtml += '<tr>';
            row.forEach(cell => {
                tableHtml += `<td>${cell}</td>`;
            });
            tableHtml += '</tr>';
        });

        tableHtml += '</tbody></table>';
        cleanDataTableOutput.innerHTML = tableHtml;
    } else {
        cleanDataTableOutput.style.display = 'none';
        cleanDataOutput.style.display = 'block';
        cleanDataOutput.value = currentCleanData;
        toggleViewBtn.textContent = 'Pokaz jako tabele';
    }
}

function hideCleanDataModal() {
    cleanDataModal.style.display = 'none';
}

function generateCleanData(csvText, selectedColumnIndices) {
    const lines = csvText.split(/\r?\n/).filter(line => line.trim() !== '');
    if (lines.length === 0) return '';

    const headerLine = lines[0];
    const dataLines = lines.slice(1);

    // Store headers for table view
    currentCleanHeaders = headerLine.split(',').map(h => h.trim());

    if (dataLines.length === 0) {
        currentCleanRows = [];
        return headerLine;
    }

    const processedLines = {};
    const uniqueLines = [headerLine];
    const uniqueRows = [];

    // Function to get the key for comparison
    function getLineKey(line) {
        const cells = line.split(',');
        if (selectedColumnIndices.length > 0) {
            return selectedColumnIndices.map(index => (cells[index] || '').trim()).join('||');
        }
        return line.trim();
    }

    dataLines.forEach((line) => {
        const trimmedLine = line.trim();
        if (trimmedLine === '') return;

        const lineKey = getLineKey(trimmedLine).toLowerCase().replace(/\s+/g, ' ').trim();

        if (!processedLines[lineKey]) {
            processedLines[lineKey] = true;
            uniqueLines.push(trimmedLine);
            // Store row data for table view
            uniqueRows.push(trimmedLine.split(',').map(cell => cell.trim()));
        }
    });

    // Store rows for table view
    currentCleanRows = uniqueRows;

    return uniqueLines.join('\n');
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showModal('Dane zostaly skopiowane do schowka!');
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            showModal('Dane zostały skopiowane do schowka!');
        } catch (err) {
            showModal('Nie udało się skopiować danych do schowka.');
        }
        document.body.removeChild(textArea);
    });
}

function downloadCSV(csvContent, filename = 'dane_bez_duplikatow.csv') {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showModal('Plik CSV został pobrany!');
    } else {
        showModal('Pobieranie plików nie jest obsługiwane przez tę przeglądarkę.');
    }
}

// Clean data modal event listeners will be initialized in initializeEventListeners()

function updateSelectAllCheckboxState() {
    const columnCheckboxes = columnCheckboxesWrapper.querySelectorAll('.column-checkbox');
    if (columnCheckboxes.length === 0) {
        selectAllColumnsCheckbox.checked = false;
        selectAllColumnsCheckbox.indeterminate = false;
        updateSelectedColumnsInfo();
        return;
    }
    const allChecked = Array.from(columnCheckboxes).every(cb => cb.checked);
    const someChecked = Array.from(columnCheckboxes).some(cb => cb.checked);

    if (allChecked) {
        selectAllColumnsCheckbox.checked = true;
        selectAllColumnsCheckbox.indeterminate = false;
    } else if (someChecked) {
        selectAllColumnsCheckbox.checked = false;
        selectAllColumnsCheckbox.indeterminate = true;
    } else {
        selectAllColumnsCheckbox.checked = false;
        selectAllColumnsCheckbox.indeterminate = false;
    }

    updateSelectedColumnsInfo();
}

// CSV input and analyze button event listeners will be initialized in initializeEventListeners()

function handleCSVInputChange() {
    const csvText = csvInput.value.trim();
    columnCheckboxesWrapper.innerHTML = ''; // Clear previous checkboxes

    if (!csvText) {
        columnCheckboxesWrapper.appendChild(columnPlaceholder);
        selectAllColumnsCheckbox.checked = false;
        selectAllColumnsCheckbox.indeterminate = false;
        updateSelectedColumnsInfo();
        return;
    }

    const lines = csvText.split(/\r?\n/);
    if (lines.length > 0 && lines[0].trim() !== '') {
        const headers = lines[0].split(',').map(h => h.trim());
        if (headers.length > 0 && headers.some(h => h !== '')) {
            columnPlaceholder.style.display = 'none';
            headers.forEach((header, index) => {
                if (header === '') return; // Skip empty header strings that might result from trailing commas

                const div = document.createElement('div');
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = `col-${index}`;
                checkbox.value = header;
                checkbox.dataset.columnIndex = index;
                checkbox.className = 'column-checkbox';
                checkbox.addEventListener('change', updateSelectAllCheckboxState);

                const label = document.createElement('label');
                label.htmlFor = `col-${index}`;
                label.textContent = header;
                label.className = 'column-label';

                div.appendChild(checkbox);
                div.appendChild(label);
                columnCheckboxesWrapper.appendChild(div);
            });
            updateSelectAllCheckboxState();
        } else {
            columnCheckboxesWrapper.appendChild(columnPlaceholder);
            columnPlaceholder.style.display = 'block';
            updateSelectedColumnsInfo();
        }
    } else {
        columnCheckboxesWrapper.appendChild(columnPlaceholder);
        columnPlaceholder.style.display = 'block';
        selectAllColumnsCheckbox.checked = false;
        selectAllColumnsCheckbox.indeterminate = false;
        updateSelectedColumnsInfo();
    }
}

function handleSelectAllColumnsChange() {
    const columnCheckboxes = columnCheckboxesWrapper.querySelectorAll('.column-checkbox');
    columnCheckboxes.forEach(checkbox => {
        checkbox.checked = selectAllColumnsCheckbox.checked;
    });
    // After changing all, ensure indeterminate is false.
    selectAllColumnsCheckbox.indeterminate = false;
    updateSelectedColumnsInfo();
}

function handleAnalyzeButtonClick() {
    const csvText = csvInput.value.trim();
    if (!csvText) {
        showModal('Wklej dane CSV, aby rozpocząć analizę.');
        outputDiv.innerHTML = '<div class="output-placeholder"><div class="placeholder-icon">📋</div><p class="placeholder">Wklej dane CSV i kliknij "Analizuj CSV", aby zobaczyć wyniki.</p></div>';
        summaryDiv.style.display = 'none';
        showCleanDataBtn.style.display = 'none';
        resetStatistics();
        return;
    }

    const lines = csvText.split(/\r?\n/).filter(line => line.trim() !== '');
    if (lines.length === 0) {
        showModal('Wklej dane CSV, aby rozpocząć analizę.');
        outputDiv.innerHTML = '<div class="output-placeholder"><div class="placeholder-icon">📋</div><p class="placeholder">Wklej dane CSV i kliknij "Analizuj CSV", aby zobaczyć wyniki.</p></div>';
        summaryDiv.style.display = 'none';
        showCleanDataBtn.style.display = 'none';
        resetStatistics();
        return;
    }

    const headerLine = lines[0];
    const dataLines = lines.slice(1);

    if (dataLines.length === 0) {
        showModal('Brak danych do analizy (tylko nagłówek?).');
        outputDiv.innerHTML = `<div class="header-line">${headerLine}</div><div class="output-placeholder"><div class="placeholder-icon">⚠️</div><p class="placeholder">Brak wierszy danych do analizy.</p></div>`;
        summaryDiv.style.display = 'none';
        showCleanDataBtn.style.display = 'none';
        updateStatistics(csvText, { duplicateCount: 0, uniqueCount: 0 });
        return;
    }

    const selectedColumnIndices = Array.from(columnCheckboxesWrapper.querySelectorAll('.column-checkbox:checked'))
        .map(cb => parseInt(cb.dataset.columnIndex));

    const processedLines = {};
    const headers = headerLine.split(',').map(h => h.trim());
    const duplicates = [];
    let duplicateCount = 0;

    // Function to get the key for comparison
    function getLineKey(line) {
        const cells = line.split(',');
        if (selectedColumnIndices.length > 0) {
            return selectedColumnIndices.map(index => (cells[index] || '').trim()).join('||');
        }
        return line.trim(); // Full line comparison if no columns selected
    }

    dataLines.forEach((line, index) => {
        const trimmedLine = line.trim();
        if (trimmedLine === '') return;

        const lineKey = getLineKey(trimmedLine).toLowerCase().replace(/\s+/g, ' ').trim();

        if (processedLines[lineKey]) {
            processedLines[lineKey].count++;
            processedLines[lineKey].indices.push(index); // Store 0-based index of dataLines
        } else {
            processedLines[lineKey] = {
                original: trimmedLine, // Store first occurrence of raw line for display
                keyRepresentation: selectedColumnIndices.length > 0 ? selectedColumnIndices.map(idx => (line.split(',')[idx] || '').trim()).join(', ') : trimmedLine,
                count: 1,
                indices: [index]
            };
        }
    });

    let totalDuplicateLines = 0;
    let uniqueLinesCount = 0;

    // Generate table HTML
    let tableHtml = '<div class="table-container"><table class="results-table"><thead><tr>';

    // Add headers
    headers.forEach((header, index) => {
        const isSelected = selectedColumnIndices.length === 0 || selectedColumnIndices.includes(index);
        tableHtml += `<th class="${isSelected ? 'selected-column' : ''}">${header}</th>`;
    });
    tableHtml += '</tr></thead><tbody>';

    // Add data rows
    dataLines.forEach((line, index) => {
        const trimmedLine = line.trim();
        if (trimmedLine === '') return;

        const lineKey = getLineKey(trimmedLine).toLowerCase().replace(/\s+/g, ' ').trim();
        const lineInfo = processedLines[lineKey];
        const cells = trimmedLine.split(',').map(cell => cell.trim());

        const rowClass = lineInfo && lineInfo.count > 1 ? 'duplicate-row' : 'unique-row';
        tableHtml += `<tr class="${rowClass}">`;

        cells.forEach((cell, cellIndex) => {
            const isSelected = selectedColumnIndices.length === 0 || selectedColumnIndices.includes(cellIndex);
            tableHtml += `<td class="${isSelected ? 'selected-column' : ''}">${cell}</td>`;
        });

        tableHtml += '</tr>';
    });

    tableHtml += '</tbody></table></div>';

    Object.values(processedLines).forEach(info => {
        if (info.count > 1) {
            totalDuplicateLines += info.count;
        } else {
            uniqueLinesCount++;
        }
    });

    outputDiv.innerHTML = tableHtml;

    const duplicateSummaryItems = Object.values(processedLines).filter(info => info.count > 1);

    let analysisBasis = selectedColumnIndices.length > 0 ?
        `na podstawie kolumn: ${selectedColumnIndices.map(idx => headerLine.split(',')[idx].trim()).join(', ')}` :
        'na podstawie całych wierszy';

    let summaryText = `Łączna liczba wierszy danych (bez nagłówka): ${dataLines.filter(l => l.trim() !== '').length}<br>`;
    summaryText += `Analiza duplikatów ${analysisBasis}.<br>`;
    summaryText += `Liczba unikalnych wpisów (kluczy): ${uniqueLinesCount}<br>`;
    summaryText += `Liczba wierszy będących częścią duplikatu: ${totalDuplicateLines}<br>`;


    if (duplicateSummaryItems.length > 0) {
        summaryText += `<h3 class="text-xl font-semibold mt-4 text-gray-700">Powtarzające się wpisy (${duplicateSummaryItems.length} grup):</h3>`;
        duplicateSummaryItems.forEach(info => {
            const displayKey = selectedColumnIndices.length > 0 ? info.keyRepresentation : info.original.split(',').slice(0, 3).join(', ') + (info.original.split(',').length > 3 ? '...' : ''); // Show selected cols or snippet
            summaryText += `<p class="ml-2 text-sm">Klucz: "${displayKey}" - powtórzone ${info.count} razy (wiersze danych: ${info.indices.map(i => i + 1).join(', ')})</p>`;
        });
    } else {
        summaryText += `<p class="mt-4 text-gray-600">Brak powtarzających się wpisów ${analysisBasis}.</p>`;
    }

    summaryDiv.innerHTML = summaryText;
    summaryDiv.style.display = 'block';

    // Update statistics with calculated data
    updateStatistics(csvText, {
        duplicateCount: totalDuplicateLines,
        uniqueCount: uniqueLinesCount
    });

    // Generate clean data and show button
    currentCleanData = generateCleanData(csvText, selectedColumnIndices);
    showCleanDataBtn.style.display = 'inline-block';
}

// Clear Data and Reset Functions
function clearData() {
    // Clear CSV input
    const csvInput = document.getElementById('csvInput');
    if (csvInput) csvInput.value = '';

    // Clear local storage
    clearLocalData();

    // Clear output
    const outputDiv = document.getElementById('output');
    if (outputDiv) {
        outputDiv.innerHTML = '<div class="output-placeholder"><div class="placeholder-icon"><i class="fas fa-clipboard-list"></i></div><p class="placeholder">Wklej dane CSV i kliknij "Analizuj CSV", aby zobaczyć wyniki.</p></div>';
    }

    // Hide summary and clean data button
    const summaryDiv = document.getElementById('summary');
    const showCleanDataBtn = document.getElementById('showCleanDataBtn');
    if (summaryDiv) {
        summaryDiv.style.display = 'none';
        summaryDiv.innerHTML = '';
    }
    if (showCleanDataBtn) {
        showCleanDataBtn.style.display = 'none';
    }

    // Clear column selection
    const columnCheckboxesWrapper = document.getElementById('columnCheckboxesWrapper');
    const columnPlaceholder = document.getElementById('columnPlaceholder');
    const selectAllColumnsCheckbox = document.getElementById('selectAllColumns');

    if (columnCheckboxesWrapper) {
        const columnCheckboxes = columnCheckboxesWrapper.querySelectorAll('.column-checkbox');
        columnCheckboxes.forEach(checkbox => checkbox.remove());
        if (columnPlaceholder) {
            columnCheckboxesWrapper.appendChild(columnPlaceholder);
            columnPlaceholder.style.display = 'block';
        }
    }

    if (selectAllColumnsCheckbox) {
        selectAllColumnsCheckbox.checked = false;
        selectAllColumnsCheckbox.indeterminate = false;
    }

    // Update selected columns info
    updateSelectedColumnsInfo();

    // Reset statistics
    resetStatistics();

    // Clear current clean data
    currentCleanData = '';
    currentCleanHeaders = [];
    currentCleanRows = [];

    // Reset modal statistics
    const modalTotalRows = document.getElementById('modalTotalRows');
    const modalColumnsCount = document.getElementById('modalColumnsCount');
    const modalDataSize = document.getElementById('modalDataSize');

    if (modalTotalRows) modalTotalRows.textContent = '0';
    if (modalColumnsCount) modalColumnsCount.textContent = '0';
    if (modalDataSize) modalDataSize.textContent = '0 B';

    // Hide results view toggle
    const resultsViewToggle = document.getElementById('resultsViewToggle');
    if (resultsViewToggle) {
        resultsViewToggle.style.display = 'none';
    }

    // Show notification
    showNotification('Dane zostały wyczyszczone', 'success');
}

function openResetModal() {
    const resetModal = document.getElementById('resetModal');
    if (resetModal) {
        resetModal.style.display = 'flex';
    }
}

function closeResetModal() {
    const resetModal = document.getElementById('resetModal');
    if (resetModal) {
        resetModal.style.display = 'none';
    }
}

function resetApplication() {
    // Clear all data (including local storage)
    clearData();

    // Additional local storage cleanup
    clearLocalData();

    // Close any open modals
    const messageModal = document.getElementById('messageModal');
    const columnModal = document.getElementById('columnModal');
    const cleanDataModal = document.getElementById('cleanDataModal');
    const resetModal = document.getElementById('resetModal');

    if (messageModal) messageModal.style.display = 'none';
    if (columnModal) columnModal.style.display = 'none';
    if (cleanDataModal) cleanDataModal.style.display = 'none';
    if (resetModal) resetModal.style.display = 'none';

    // Reset theme to light (optional)
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('csvAnalyzerTheme', 'light');
    updateThemeIcon('light');

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Focus on CSV input
    const csvInput = document.getElementById('csvInput');
    if (csvInput) csvInput.focus();

    // Show notification
    showNotification('Aplikacja została zresetowana', 'info');
}

// Notification function
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
        ${message}
    `;

    // Add to body
    document.body.appendChild(notification);

    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Enhanced UI initialization with new buttons
function initializeEnhancedUIWithNewButtons() {
    initializeEnhancedUI();

    // Override simple onclick buttons with enhanced functionality
    const buttons = document.querySelectorAll('.btn-button');
    buttons.forEach(button => {
        const text = button.textContent.trim();

        if (text.includes('Wyczyść dane')) {
            // Remove existing onclick - event listener will be added later
            button.removeAttribute('onclick');
        }

        if (text.includes('Reset aplikacji')) {
            // Remove existing onclick and add enhanced reset function
            button.removeAttribute('onclick');
            button.addEventListener('click', () => {
                openResetModal();
            });
        }
    });
}

// Local Storage Management
const LOCAL_STORAGE_KEY = 'csvAnalyzerData';
const LOCAL_STORAGE_TIMESTAMP_KEY = 'csvAnalyzerDataTimestamp';

let autoSaveTimeout = null;

function initializeLocalStorage() {
    if (!csvInput) return;

    // Load saved data on page load
    loadLocalData();

    // Add input event listener for auto-save
    csvInput.addEventListener('input', function () {
        const value = csvInput.value.trim();

        if (value === '') {
            clearLocalData();
            return;
        }

        // Show saving status
        updateSaveStatus('saving');

        // Debounce auto-save (save after 2 seconds of no typing)
        clearTimeout(autoSaveTimeout);
        autoSaveTimeout = setTimeout(() => {
            saveLocalData(value);
        }, 2000);
    });

    // Clear local data button
    const clearLocalBtn = document.getElementById('clearLocalBtn');
    if (clearLocalBtn) {
        clearLocalBtn.addEventListener('click', function () {
            clearLocalData();
            csvInput.value = '';
            showNotification('Dane lokalne zostały usunięte', 'info');
        });
    }
}

function saveLocalData(data) {
    try {
        const timestamp = Date.now();
        localStorage.setItem(LOCAL_STORAGE_KEY, data);
        localStorage.setItem(LOCAL_STORAGE_TIMESTAMP_KEY, timestamp.toString());

        updateSaveStatus('saved');
        updateLastSaveTime(timestamp);

        // Automatically hide saving status after 3 seconds
        setTimeout(() => {
            updateSaveStatus('active');
        }, 3000);

    } catch (error) {
        console.error('Error saving data to localStorage:', error);
        updateSaveStatus('error');
        showNotification('Błąd podczas zapisywania danych lokalnie', 'error');
    }
}

function loadLocalData() {
    try {
        const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
        const savedTimestamp = localStorage.getItem(LOCAL_STORAGE_TIMESTAMP_KEY);

        if (savedData && savedTimestamp) {
            if (csvInput) {
                csvInput.value = savedData;
                updateSaveStatus('active');
                updateLastSaveTime(parseInt(savedTimestamp));

                // Show notification about loaded data
                showNotification('Wczytano poprzednie dane CSV', 'info');
            }
        } else {
            updateSaveStatus('idle');
        }
    } catch (error) {
        console.error('Error loading data from localStorage:', error);
        updateSaveStatus('error');
    }
}

function clearLocalData() {
    try {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        localStorage.removeItem(LOCAL_STORAGE_TIMESTAMP_KEY);
        updateSaveStatus('idle');
        updateLastSaveTime(null);
    } catch (error) {
        console.error('Error clearing localStorage:', error);
        updateSaveStatus('error');
    }
}

function updateSaveStatus(status) {
    const localSaveStatus = document.getElementById('localSaveStatus');
    const saveStatusIcon = document.getElementById('saveStatusIcon');
    const saveStatusText = document.getElementById('saveStatusText');
    const clearLocalBtn = document.getElementById('clearLocalBtn');

    if (!localSaveStatus || !saveStatusIcon || !saveStatusText) return;

    // Reset classes
    localSaveStatus.className = 'local-save-status';
    saveStatusIcon.className = 'fas fa-save';

    switch (status) {
        case 'idle':
            saveStatusText.textContent = 'Wprowadź dane, aby włączyć auto-zapis';
            if (clearLocalBtn) clearLocalBtn.style.display = 'none';
            break;

        case 'saving':
            localSaveStatus.classList.add('saving');
            saveStatusIcon.classList.add('saving');
            saveStatusText.textContent = 'Zapisywanie danych lokalnie...';
            if (clearLocalBtn) clearLocalBtn.style.display = 'flex';
            break;

        case 'saved':
            localSaveStatus.classList.add('active');
            saveStatusIcon.classList.add('saved');
            saveStatusIcon.className = 'fas fa-check saved';
            saveStatusText.textContent = 'Dane zapisane lokalnie';
            if (clearLocalBtn) clearLocalBtn.style.display = 'flex';
            break;

        case 'active':
            localSaveStatus.classList.add('active');
            saveStatusIcon.classList.add('saved');
            saveStatusText.textContent = 'Auto-zapis aktywny';
            if (clearLocalBtn) clearLocalBtn.style.display = 'flex';
            break;

        case 'error':
            localSaveStatus.classList.add('error');
            saveStatusIcon.classList.add('error');
            saveStatusIcon.className = 'fas fa-exclamation-triangle error';
            saveStatusText.textContent = 'Błąd zapisu lokalnego';
            if (clearLocalBtn) clearLocalBtn.style.display = 'none';
            break;
    }
}

function updateLastSaveTime(timestamp) {
    const lastSaveTime = document.getElementById('lastSaveTime');
    if (!lastSaveTime) return;

    if (!timestamp) {
        lastSaveTime.textContent = '';
        return;
    }

    const now = Date.now();
    const diff = now - timestamp;

    let timeText = '';
    if (diff < 60000) { // Less than 1 minute
        timeText = 'przed chwilą';
    } else if (diff < 3600000) { // Less than 1 hour
        const minutes = Math.floor(diff / 60000);
        timeText = `${minutes} min temu`;
    } else if (diff < 86400000) { // Less than 1 day
        const hours = Math.floor(diff / 3600000);
        timeText = `${hours} godz. temu`;
    } else {
        const date = new Date(timestamp);
        timeText = date.toLocaleDateString('pl-PL');
    }

    lastSaveTime.textContent = `Ostatni zapis: ${timeText}`;
}

function getLocalStorageSize() {
    try {
        const data = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (!data) return 0;

        // Calculate size in bytes (approximate)
        return new Blob([data]).size;
    } catch (error) {
        return 0;
    }
}

// Initialize enhanced UI when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    // Wait for dynamic HTML to be loaded
    setTimeout(function () {
        initializeDOMElements();
        initializeEventListeners();
        initializeEnhancedUIWithNewButtons();
        initializeLocalStorage();

        // Add event listeners for clear data buttons
        const clearDataBtn = document.getElementById('clearDataBtn');
        const footerClearBtn = document.getElementById('footerClearBtn');

        if (clearDataBtn) {
            clearDataBtn.addEventListener('click', clearData);
        }
        if (footerClearBtn) {
            footerClearBtn.addEventListener('click', clearData);
        }

        // Add event listeners for reset modal
        const resetAppBtn = document.getElementById('resetAppBtn');
        const footerResetBtn = document.getElementById('footerResetBtn');
        const closeResetModalBtn = document.getElementById('closeResetModalBtn');
        const confirmResetBtn = document.getElementById('confirmResetBtn');
        const cancelResetBtn = document.getElementById('cancelResetBtn');
        const resetModal = document.getElementById('resetModal');

        // Add click listeners for reset buttons
        if (resetAppBtn) {
            resetAppBtn.addEventListener('click', openResetModal);
        }
        if (footerResetBtn) {
            footerResetBtn.addEventListener('click', openResetModal);
        }

        // Add close modal listeners
        if (closeResetModalBtn) {
            closeResetModalBtn.addEventListener('click', closeResetModal);
        }
        if (cancelResetBtn) {
            cancelResetBtn.addEventListener('click', closeResetModal);
        }

        // Add confirm reset listener
        if (confirmResetBtn) {
            confirmResetBtn.addEventListener('click', resetApplication);
        }

        // Close modal when clicking outside
        if (resetModal) {
            resetModal.addEventListener('click', function (event) {
                if (event.target === resetModal) {
                    closeResetModal();
                }
            });
        }

        // Close modal with Escape key
        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') {
                const resetModal = document.getElementById('resetModal');
                if (resetModal && resetModal.style.display === 'flex') {
                    closeResetModal();
                }
            }
        });
    }, 100); // Small delay to ensure dynamic HTML is loaded
});