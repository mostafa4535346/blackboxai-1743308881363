// Search Engine Implementation for EgyPlaces
let placesData = [];
let searchIndex = [];

// Initialize search engine
async function initSearchEngine() {
  try {
    // Load places data
    const response = await fetch('./data/places.json');
    placesData = await response.json();
    
    // Build search index
    buildSearchIndex();
    
    // Setup search input behavior
    setupSearchInput();
  } catch (error) {
    console.error('Error initializing search engine:', error);
  }
}

// Create search index with all searchable text
function buildSearchIndex() {
  searchIndex = placesData.map(place => ({
    id: place.id,
    searchText: `${place.name} ${place.name_ar} ${place.category} ${place.governorate} ${place.city} ${place.address}`.toLowerCase()
  }));
}

// Configure search input behavior
function setupSearchInput() {
  const searchInput = document.querySelector('input[type="text"]');
  const instantResults = document.getElementById('instant-results');
  
  // Show suggestions as user types
  searchInput.addEventListener('input', handleSearchInput);
  
  // Hide suggestions when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#instant-results') && e.target !== searchInput) {
      instantResults.classList.add('hidden');
    }
  });
}

// Handle search input changes
function handleSearchInput(e) {
  const query = e.target.value.trim().toLowerCase();
  const instantResults = document.getElementById('instant-results');
  
  if (query.length > 0) {
    const results = searchPlaces(query);
    displayInstantResults(results);
    instantResults.classList.remove('hidden');
  } else {
    clearInstantResults();
    instantResults.classList.add('hidden');
  }
}

// Search across all fields with relevance scoring
function searchPlaces(query) {
  return searchIndex
    .map(item => {
      const relevance = calculateRelevance(item.searchText, query);
      return { ...item, relevance };
    })
    .filter(item => item.relevance > 0)
    .sort((a, b) => b.relevance - a.relevance)
    .map(item => placesData.find(p => p.id === item.id));
}

// Calculate relevance score for search results
function calculateRelevance(text, query) {
  const words = query.split(' ');
  let score = 0;
  
  words.forEach(word => {
    if (text.includes(word)) {
      score += word.length; // Longer matches get more weight
      if (text.startsWith(word)) score += 5; // Beginning matches get bonus
    }
  });
  
  return score;
}

// Display instant search results
function displayInstantResults(results) {
  const container = document.getElementById('instant-results');
  if (!container) return;
  
  container.innerHTML = results.slice(0, 5).map(place => `
    <div class="p-2 border-b hover:bg-gray-100 cursor-pointer" 
         onclick="selectSearchResult(${place.id})">
      <div class="font-medium">${place.name}</div>
      <div class="text-sm text-gray-600">${place.city} • ${place.category}</div>
    </div>
  `).join('');
}

// Clear instant results
function clearInstantResults() {
  const container = document.getElementById('instant-results');
  if (container) container.innerHTML = '';
}

// Handle selection of a search result
function selectSearchResult(id) {
  const place = placesData.find(p => p.id === id);
  if (place) {
    sessionStorage.setItem('searchResults', JSON.stringify([place]));
    window.location.href = 'place-details.html?id=' + id;
  }
}

// Main search function
function performMainSearch() {
  const query = document.querySelector('input[type="text"]').value.toLowerCase();
  const category = document.querySelector('select[name="category"]').value;
  const governorate = document.querySelector('select[name="governorate"]').value;

  const results = searchPlaces(query).filter(place => {
    return (category === 'all' || place.category === category) &&
           (governorate === 'all' || place.governorate.toLowerCase() === governorate);
  });

  sessionStorage.setItem('searchResults', JSON.stringify(results));
  window.location.href = 'search-results.html';
}

// Initialize search engine on page load
window.addEventListener('DOMContentLoaded', initSearchEngine);

// Expose functions to global scope
window.selectSearchResult = selectSearchResult;
window.performMainSearch = performMainSearch;
