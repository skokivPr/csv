// htmlGenerator.js - Dynamiczne generowanie struktur HTML

class HTMLGenerator {
    constructor() {
        this.initialized = false;
    }

    // Generowanie modalów
    generateModals() {
        const modalsContainer = document.createElement('div');
        modalsContainer.id = 'modalsContainer';
        modalsContainer.innerHTML = `
            ${this.generateCleanDataModal()}
            ${this.generateColumnSelectionModal()}
            ${this.generateMessageModal()}
            ${this.generateResetModal()}
        `;
        return modalsContainer;
    }

    generateCleanDataModal() {
        return `
            <!-- Clean Data Modal -->
            <div id="cleanDataModal" class="modal" role="dialog" aria-modal="true" aria-labelledby="cleanDataModalTitle">
                <div class="modal-content clean-data-modal-content">
                    <div class="modal-header">
                        <h3 id="cleanDataModalTitle"><i class="fas fa-table"></i> Podgląd i eksport danych CSV</h3>
                        <span class="close-button" id="closeCleanDataModalBtn" role="button" tabindex="0"
                            aria-label="Zamknij">&times;</span>
                    </div>
                    <div class="modal-body">
                        <p class="clean-data-info"><i class="fas fa-info-circle"></i> Poniżej znajdują się Twoje dane CSV:</p>

                        <!-- Modal Statistics -->
                        <div id="modalStatistics" class="modal-statistics">
                            <div class="modal-stats-grid">
                                <div class="modal-stat-item">
                                    <div class="modal-stat-icon"><i class="fas fa-list-ol"></i></div>
                                    <div class="modal-stat-content">
                                        <div class="modal-stat-number" id="modalTotalRows">0</div>
                                        <div class="modal-stat-label">Wiersze danych</div>
                                    </div>
                                </div>
                                <div class="modal-stat-item">
                                    <div class="modal-stat-icon"><i class="fas fa-columns"></i></div>
                                    <div class="modal-stat-content">
                                        <div class="modal-stat-number" id="modalColumnsCount">0</div>
                                        <div class="modal-stat-label">Kolumny</div>
                                    </div>
                                </div>
                                <div class="modal-stat-item">
                                    <div class="modal-stat-icon"><i class="fas fa-file-alt"></i></div>
                                    <div class="modal-stat-content">
                                        <div class="modal-stat-number" id="modalDataSize">0 KB</div>
                                        <div class="modal-stat-label">Rozmiar</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="modal-table-container">
                            <div id="cleanDataTableOutput" class="clean-data-table"></div>
                        </div>
                        <textarea id="cleanDataOutput" class="clean-data-textarea" readonly style="display: none;"></textarea>
                    </div>
                    <div class="modal-footer">
                        <button id="copyCleanDataBtn" class="modal-ok-btn"><i class="fas fa-copy"></i> Skopiuj CSV</button>
                        <button id="downloadCleanDataBtn" class="modal-ok-btn"><i class="fas fa-download"></i> Pobierz CSV</button>
                        <button id="toggleViewBtn" class="modal-cancel-btn"><i class="fas fa-exchange-alt"></i> Pokaż jako tekst</button>
                        <button id="closeCleanDataBtn" class="modal-cancel-btn"><i class="fas fa-times"></i> Zamknij</button>
                    </div>
                </div>
            </div>
        `;
    }

    generateColumnSelectionModal() {
        return `
            <!-- Column Selection Modal -->
            <div id="columnModal" class="modal" role="dialog" aria-modal="true" aria-labelledby="columnModalTitle">
                <div class="modal-content column-modal-content">
                    <div class="modal-header">
                        <h3 id="columnModalTitle"><i class="fas fa-cog"></i> Wybierz kolumny do analizy duplikatów</h3>
                        <span class="close-button" id="closeColumnModalBtn" role="button" tabindex="0"
                            aria-label="Zamknij">&times;</span>
                    </div>
                    <div class="modal-body">
                        <div id="columnSelectionContainer" aria-live="polite">
                            <div id="columnCheckboxesWrapper" class="checkboxes-wrapper">
                                <p id="columnPlaceholder" class="placeholder">Wprowadź dane CSV, aby wyświetlić opcje kolumn.</p>
                                <!-- Checkboxes will be populated here by JavaScript -->
                            </div>
                            <div class="select-all-container">
                                <input type="checkbox" id="selectAllColumns">
                                <label for="selectAllColumns"><i class="fas fa-check-square"></i> Zaznacz/Odznacz wszystkie</label>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button id="confirmColumnSelection" class="modal-ok-btn"><i class="fas fa-check"></i> Potwierdź wybór</button>
                        <button id="cancelColumnSelection" class="modal-cancel-btn"><i class="fas fa-times"></i> Anuluj</button>
                    </div>
                </div>
            </div>
        `;
    }

    generateMessageModal() {
        return `
            <!-- Custom Modal for Messages -->
            <div id="messageModal" class="modal" role="alertdialog" aria-modal="true" aria-labelledby="modalMessage">
                <div class="modal-content">
                    <span class="close-button" id="closeModalBtn" role="button" tabindex="0" aria-label="Zamknij">&times;</span>
                    <div class="modal-body">
                        <div class="message-icon"><i class="fas fa-info-circle"></i></div>
                        <p id="modalMessage" class="modal-message"></p>
                    </div>
                    <div class="modal-footer">
                        <button id="modalOkBtn" class="modal-ok-btn">OK</button>
                    </div>
                </div>
            </div>
        `;
    }

    generateResetModal() {
        return `
            <!-- Reset Confirmation Modal -->
            <div id="resetModal" class="modal" role="alertdialog" aria-modal="true" aria-labelledby="resetModalTitle">
                <div class="modal-content reset-modal-content">
                    <div class="modal-header">
                        <h3 id="resetModalTitle"><i class="fas fa-exclamation-triangle"></i> Potwierdzenie resetu</h3>
                        <span class="close-button" id="closeResetModalBtn" role="button" tabindex="0"
                            aria-label="Zamknij">&times;</span>
                    </div>
                    <div class="modal-body">
                        <div class="reset-warning">
                            <div class="warning-icon"><i class="fas fa-exclamation-triangle"></i></div>
                            <div class="warning-content">
                                <h4>Czy na pewno chcesz zresetować aplikację?</h4>
                                <p>Ta operacja spowoduje:</p>
                                <ul class="warning-list">
                                    <li><i class="fas fa-times-circle"></i> Usunięcie wszystkich wprowadzonych danych CSV</li>
                                    <li><i class="fas fa-times-circle"></i> Wyczyszczenie wszystkich wyników analizy</li>
                                    <li><i class="fas fa-times-circle"></i> Reset ustawień kolumn</li>
                                    <li><i class="fas fa-times-circle"></i> Przywrócenie motywu jasnego</li>
                                </ul>
                                <p class="warning-note"><strong>Uwaga:</strong> Tej operacji nie można cofnąć!</p>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button id="confirmResetBtn" class="modal-danger-btn"><i class="fas fa-refresh"></i> Tak, resetuj aplikację</button>
                        <button id="cancelResetBtn" class="modal-cancel-btn"><i class="fas fa-times"></i> Anuluj</button>
                    </div>
                </div>
            </div>
        `;
    }

    // Generowanie sekcji statystyk
    generateStatisticsSection() {
        return `
            <div id="statisticsSection" class="statistics-section" style="display: none;">
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon"><i class="fas fa-list-ol"></i></div>
                        <div class="stat-number" id="totalRows">0</div>
                        <div class="stat-label">Łączne wiersze</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon"><i class="fas fa-copy"></i></div>
                        <div class="stat-number" id="duplicateCount">0</div>
                        <div class="stat-label">Duplikaty</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon"><i class="fas fa-check-circle"></i></div>
                        <div class="stat-number" id="uniqueCount">0</div>
                        <div class="stat-label">Unikalne</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon"><i class="fas fa-columns"></i></div>
                        <div class="stat-number" id="columnsCount">0</div>
                        <div class="stat-label">Kolumny</div>
                    </div>
                </div>
            </div>
        `;
    }

    // Generowanie sekcji wyników
    generateResultsSection() {
        return `
            <div id="results" class="results" aria-live="polite">
                <div id="output" class="output">
                    <div class="output-placeholder">
                        <div class="placeholder-icon"><i class="fas fa-clipboard-list"></i></div>
                        <p class="placeholder">Wklej dane CSV i kliknij "Analizuj CSV", aby zobaczyć wyniki.</p>
                    </div>
                </div>

                <!-- Results View Toggle -->
                <div id="resultsViewToggle" class="results-view-toggle" style="display: none;">
                    <div class="toggle-buttons">
                        <button id="tableViewBtn" class="toggle-btn active"><i class="fas fa-table"></i> Widok tabeli</button>
                        <button id="listViewBtn" class="toggle-btn"><i class="fas fa-list"></i> Lista duplikatów</button>
                    </div>
                </div>

                <div id="summary" class="summary" style="display: none;">
                    <!-- Summary of duplicates will be displayed here -->
                </div>
                <div class="results-actions">
                    <button id="showCleanDataBtn" class="show-clean-data-btn" style="display: none;">
                        <i class="fas fa-eye"></i> Podgląd i eksport danych
                    </button>
                </div>
            </div>
        `;
    }

    // Generowanie przycisków kontrolnych
    generateControlButtons() {
        return `
            <div class="button-container">
                <button class="btn-button ak" id="analyzeButton"><i class="fas fa-search"></i> Analizuj CSV</button>
                <button class="btn-button clean" id="clearDataBtn">Wyczyść dane</button>
                <button class="btn-button clean" id="resetAppBtn">Reset aplikacji</button>
            </div>
        `;
    }

    // Generowanie sekcji wyboru kolumn
    generateColumnSelectionSection() {
        return `
            <div class="column-selection-section">
                <button id="openColumnModal" class="column-selection-button">
                    <i class="fas fa-cog"></i> Wybierz kolumny do analizy
                </button>
                <p id="selectedColumnsInfo" class="selected-columns-info">
                    Wprowadź dane CSV, aby wybrać kolumny
                </p>
            </div>
        `;
    }

    // Generowanie przycisku przewijania
    generateScrollButton() {
        return `
            <button class="scroll-up-btn" id="scrollUpBtn" data-tooltip="Przewiń na górę">
                <i class="fas fa-arrow-up"></i>
            </button>
        `;
    }

    // Generowanie statusu zapisu lokalnego
    generateLocalSaveStatus() {
        return `
            <div id="localSaveStatus" class="local-save-status">
                <div class="save-status-content">
                    <div class="save-status-left">
                        <i id="saveStatusIcon" class="fas fa-save"></i>
                        <span id="saveStatusText">Wprowadź dane, aby włączyć auto-zapis</span>
                    </div>
                    <div class="save-status-right">
                        <span id="lastSaveTime" class="last-save-time"></span>
                        <button id="clearLocalBtn" class="clear-local-btn" style="display: none;" title="Wyczyść dane lokalne">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // Inicjalizacja dynamicznego HTML
    initializeDynamicHTML() {
        if (this.initialized) return;

        // Dodanie modalów do body
        const modalsContainer = this.generateModals();
        document.body.appendChild(modalsContainer);

        // Dodanie przycisku przewijania
        const scrollButton = document.createElement('div');
        scrollButton.innerHTML = this.generateScrollButton();
        document.body.appendChild(scrollButton.firstElementChild);

        // Wstawienie elementów do istniejących kontenerów
        this.insertDynamicElements();

        this.initialized = true;
    }

    // Wstawienie dynamicznych elementów do istniejących kontenerów
    insertDynamicElements() {
        // Wstawienie sekcji statystyk
        const rightPanel = document.querySelector('.right-panel .service-header');
        if (rightPanel && rightPanel.nextElementSibling) {
            rightPanel.insertAdjacentHTML('afterend', this.generateStatisticsSection());
        }

        // Wstawienie sekcji wyników (jeśli nie istnieje)
        const resultsContainer = document.getElementById('results');
        if (!resultsContainer) {
            const rightPanelContent = document.querySelector('.right-panel');
            if (rightPanelContent) {
                rightPanelContent.insertAdjacentHTML('beforeend', this.generateResultsSection());
            }
        }

        // Wstawienie sekcji wyboru kolumn
        const inputSection = document.querySelector('.input-section');
        if (inputSection) {
            inputSection.insertAdjacentHTML('afterend', this.generateLocalSaveStatus());
        }

        // Wstawienie sekcji wyboru kolumn
        const leftPanel = document.querySelector('.left-panel .main-content');
        if (leftPanel) {
            leftPanel.insertAdjacentHTML('afterend', this.generateColumnSelectionSection());
        }

        // Wstawienie przycisków kontrolnych
        const columnSelectionSection = document.querySelector('.column-selection-section');
        if (columnSelectionSection) {
            columnSelectionSection.insertAdjacentHTML('afterend', this.generateControlButtons());
        }
    }

    // Funkcja do dynamicznego tworzenia elementów na żądanie
    createElement(type, config = {}) {
        const element = document.createElement(type);

        if (config.id) element.id = config.id;
        if (config.className) element.className = config.className;
        if (config.innerHTML) element.innerHTML = config.innerHTML;
        if (config.attributes) {
            Object.entries(config.attributes).forEach(([key, value]) => {
                element.setAttribute(key, value);
            });
        }

        return element;
    }

    // Funkcja do dynamicznego dodawania event listenerów
    addEventListeners(elementId, eventType, handler) {
        const element = document.getElementById(elementId);
        if (element) {
            element.addEventListener(eventType, handler);
        }
    }

    // Funkcja do dynamicznego usuwania elementów
    removeElement(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.remove();
        }
    }

    // Funkcja do dynamicznego pokazywania/ukrywania elementów
    toggleElement(elementId, show = null) {
        const element = document.getElementById(elementId);
        if (element) {
            if (show === null) {
                element.style.display = element.style.display === 'none' ? 'block' : 'none';
            } else {
                element.style.display = show ? 'block' : 'none';
            }
        }
    }

    // Funkcja do dynamicznego aktualizowania zawartości
    updateContent(elementId, content) {
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = content;
        }
    }
}

// Eksport instancji klasy
window.HTMLGenerator = HTMLGenerator;
window.htmlGenerator = new HTMLGenerator();

// Automatyczne inicjalizowanie po załadowaniu DOM
document.addEventListener('DOMContentLoaded', function () {
    window.htmlGenerator.initializeDynamicHTML();
}); 