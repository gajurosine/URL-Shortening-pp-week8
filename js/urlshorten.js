
async function shortenURL(url) {
    const apiKey = 'YOUR_API_KEY';
    const apiUrl = `https://api.shrtco.de/v2/shorten?url=${encodeURIComponent(url)}&apiKey=${apiKey}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data.result;
    } catch (error) {
        console.error('Error occurs:', error);
        return null;
    }
}


function displayShortenedLink(shortenedLinks) {
    const shortenedLinksElement = document.getElementById('shortenedLinks');
    const html = shortenedLinks.map(link => `
        <div class="shortened-link">
            <p>${link.original_link}</p>
            <a href="${link.full_short_link}" target="_blank">${link.full_short_link}</a>
            <button class="copy-button" data-clipboard-text="${link.full_short_link}">Copy</button>
        </div>
    `).join('');
    shortenedLinksElement.innerHTML = html;



    const copyButtons = document.querySelectorAll('.copy-button');
    copyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const clipboardText = button.getAttribute('data-clipboard-text');
            copyToClipboard(clipboardText);
            button.textContent = 'Copied!';
        });
    });
}


function copyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
}

document.getElementById('urlForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const urlInput = document.getElementById('urlInput');
    const url = urlInput.value.trim();

    if (!url) {
        console.error('Please enter URL.');
        return;
    }

    const shortenedLink = await shortenURL(url);
    if (shortenedLink) {
        const shortenedLinks = JSON.parse(localStorage.getItem('shortenedLinks') || '[]');
        shortenedLinks.unshift(shortenedLink);
        localStorage.setItem('shortenedLinks', JSON.stringify(shortenedLinks));
        displayShortenedLink(shortenedLinks);
    }
    urlInput.value = '';
});


document.addEventListener('DOMContentLoaded', () => {
    const shortenedLinks = JSON.parse(localStorage.getItem('shortenedLinks') || '[]');
    displayShortenedLink(shortenedLinks);
});
