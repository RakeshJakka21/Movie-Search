// Custom trivia knowledge base (manual entries)
const triviaDB = {
  "The Shawshank Redemption (1994)": "Initially a box office flop, it gained a cult following through home video releases. Nominated for seven Academy Awards, including Best Picture.",
  "Pulp Fiction (1994)": "Known for its non-linear narrative and iconic dance scene. Won the Palme d'Or at Cannes and an Oscar for Best Original Screenplay.",
  "The Matrix (1999)": "Pioneered the 'bullet time' visual effect, revolutionizing action filmmaking. Grossed over $460 million worldwide.",
  "Spirited Away (2001)": "First anime film to win an Academy Award for Best Animated Feature. Produced by Studio Ghibli, it's Japan's highest-grossing film of its time.",
  "Jalsa (2008)": "A popular Telugu film directed by Trivikram Srinivas starring Pawan Kalyan, known for its music by Devi Sri Prasad."
};

async function searchMovie() {
  const input = document.getElementById("movieInput").value.trim();
  const detailsDiv = document.getElementById("movieDetails");

  if (!input) {
    detailsDiv.innerHTML = `<p style="color:red;">⚠️ Please enter a movie name with year (e.g., Jalsa(2008))</p>`;
    return;
  }

  // Extract title and year from "MovieName(Year)" format
  const match = input.match(/(.+)\((\d{4})\)$/);
  if (!match) {
    detailsDiv.innerHTML = `<p style="color:red;">⚠️ Please enter in correct format: MovieName(Year)</p>`;
    return;
  }

  const title = match[1].trim();
  const year = match[2];
  const key = `${title} (${year})`;

  const apiKey = "dbdbed90"; // 🔑 Replace with your OMDb API key
  const url = `https://www.omdbapi.com/?t=${encodeURIComponent(title)}&y=${year}&apikey=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.Response === "True") {
      // Pick trivia from DB, otherwise build from OMDb fields
      let triviaText = triviaDB[key] || buildTriviaFromOMDb(data);

      renderMovie(data, triviaText, detailsDiv);
    } else {
      detailsDiv.innerHTML = `<p style="color:red;">❌ Movie not found for "${title} (${year})"</p>`;
    }
  } catch (error) {
    detailsDiv.innerHTML = `<p style="color:red;">⚠️ Error fetching data. Check your internet or API key.</p>`;
    console.error(error);
  }
}

// Build fallback trivia if not in our custom DB
function buildTriviaFromOMDb(movie) {
  let triviaParts = [];
  if (movie.Awards && movie.Awards !== "N/A") triviaParts.push(movie.Awards);
  if (movie.BoxOffice && movie.BoxOffice !== "N/A") triviaParts.push(`It grossed ${movie.BoxOffice}.`);
  if (movie.Runtime && movie.Runtime !== "N/A") triviaParts.push(`Runtime is ${movie.Runtime}.`);
  if (movie.Language && movie.Language !== "N/A") triviaParts.push(`Available in ${movie.Language}.`);

  return triviaParts.length > 0
    ? triviaParts.join(" ")
    : "Trivia not available.";
}

function renderMovie(movie, trivia, container) {
  container.innerHTML = `
    <div class="movie-card">
      <div class="movie-poster">
        <img src="${movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/200"}" 
             alt="Poster">
      </div>
      <div class="movie-info">
        <h2>${movie.Title} (${movie.Year})</h2>
        <p><strong>Director:</strong> ${movie.Director}</p>
        <p><strong>Lead Actors:</strong> ${movie.Actors}</p>
        <p><strong>Release Year:</strong> ${movie.Year}</p>
        <p><strong>Genre:</strong> ${movie.Genre}</p>
        <p><strong>Trivia:</strong> ${trivia}</p>
      </div>
    </div>
  `;
}
// Listen for Enter key in input
document.getElementById("movieInput").addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault(); // prevent accidental form submission
    searchMovie();
  }
});
