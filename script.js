const languageSelect = document.getElementById('language-select');
const statusMessage = document.getElementById('status-message');
const repoCard = document.getElementById('repo-card');
const refreshBtn = document.getElementById('refresh-btn');

const repoName = document.getElementById('repo-name');
const repoDescription = document.getElementById('repo-description');
const repoStars = document.getElementById('repo-stars');
const repoForks = document.getElementById('repo-forks');
const repoIssues = document.getElementById('repo-issues');
const repoLink = document.getElementById('repo-link');

// Cargar lenguajes
async function loadLanguages() {
  const res = await fetch('https://raw.githubusercontent.com/kamranahmedse/githunt/master/src/components/filters/language-filter/languages.json');
  const data = await res.json();
  data.forEach(lang => {
  const option = document.createElement('option');
  option.value = lang.value;         // Esto se usará para la API
  option.textContent = lang.title;   // Esto es lo que ve el usuario
  languageSelect.appendChild(option);
});

}

// Buscar y mostrar un repositorio aleatorio
async function fetchRepository(language) {
  showLoading();
  try {
    const res = await fetch(`https://api.github.com/search/repositories?q=language:${language}&sort=stars&order=desc&per_page=50`);
    if (!res.ok) throw new Error('Error fetching');

    const data = await res.json();
    const repos = data.items;
    if (repos.length === 0) throw new Error('No repositories found');

    const randomRepo = repos[Math.floor(Math.random() * repos.length)];
    displayRepository(randomRepo);
  } catch (error) {
    showError();
  }
}

function displayRepository(repo) {
  statusMessage.classList.add('hidden');
  repoCard.classList.remove('hidden');
  refreshBtn.classList.remove('hidden');

  repoName.textContent = repo.name;
  repoDescription.textContent = repo.description || 'No description available.';
  repoStars.textContent = repo.stargazers_count;
  repoForks.textContent = repo.forks_count;
  repoIssues.textContent = repo.open_issues_count;
  repoLink.href = repo.html_url;
}

function showLoading() {
  statusMessage.className = 'message';
  statusMessage.textContent = 'Loading, please wait..';
  statusMessage.classList.remove('hidden');
  repoCard.classList.add('hidden');
  refreshBtn.classList.add('hidden');
}

function showError() {
  statusMessage.className = 'message error';
  statusMessage.textContent = 'Error fetching repositories';
  statusMessage.classList.remove('hidden');
  repoCard.classList.add('hidden');
  refreshBtn.classList.remove('hidden');
}

// Eventos
languageSelect.addEventListener('change', () => {
  const selectedLang = languageSelect.value;
  if (selectedLang) {
    fetchRepository(selectedLang);
  } else {
    statusMessage.textContent = 'Please select a language';
    statusMessage.className = 'message';
    statusMessage.classList.remove('hidden');
    repoCard.classList.add('hidden');
    refreshBtn.classList.add('hidden');
  }
});

refreshBtn.addEventListener('click', () => {
  const selectedLang = languageSelect.value;
  if (selectedLang) {
    fetchRepository(selectedLang);
  }
});

// Inicializar
loadLanguages();
