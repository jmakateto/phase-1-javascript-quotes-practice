document.addEventListener('DOMContentLoaded', () => {
    const quoteList = document.getElementById('quote-list');
    const newQuoteForm = document.getElementById('new-quote-form');
  
    // Function to create a quote card element
    const createQuoteCard = (quote) => {
      const quoteCard = document.createElement('li');
      quoteCard.classList.add('quote-card');
      quoteCard.dataset.id = quote.id;
  
      const blockquote = document.createElement('blockquote');
      blockquote.classList.add('blockquote');
  
      const quoteText = document.createElement('p');
      quoteText.classList.add('mb-0');
      quoteText.textContent = quote.quote;
  
      const author = document.createElement('footer');
      author.classList.add('blockquote-footer');
      author.textContent = quote.author;
  
      const likeButton = document.createElement('button');
      likeButton.classList.add('btn', 'btn-success');
      likeButton.textContent = `Likes: ${quote.likes.length}`;
  
      const deleteButton = document.createElement('button');
      deleteButton.classList.add('btn', 'btn-danger');
      deleteButton.textContent = 'Delete';
  
      blockquote.appendChild(quoteText);
      blockquote.appendChild(author);
      blockquote.appendChild(document.createElement('br'));
      blockquote.appendChild(likeButton);
      blockquote.appendChild(deleteButton);
  
      quoteCard.appendChild(blockquote);
  
      return quoteCard;
    };
  
    // Function to populate quotes from the server
    const populateQuotes = () => {
      fetch('http://localhost:3000/quotes?_embed=likes')
        .then(response => response.json())
        .then(quotes => {
          quoteList.innerHTML = '';
          quotes.forEach(quote => {
            const quoteCard = createQuoteCard(quote);
            quoteList.appendChild(quoteCard);
          });
        });
    };
  
    // Fetch and populate quotes on page load
    populateQuotes();
  
    // Event listener for form submission
    newQuoteForm.addEventListener('submit', event => {
      event.preventDefault();
  
      const quoteInput = document.getElementById('new-quote');
      const authorInput = document.getElementById('author');
  
      const data = {
        quote: quoteInput.value,
        author: authorInput.value
      };
  
      fetch('http://localhost:3000/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
        .then(response => response.json())
        .then(newQuote => {
          const quoteCard = createQuoteCard(newQuote);
          quoteList.appendChild(quoteCard);
          quoteInput.value = '';
          authorInput.value = '';
        });
    });
  
    // Event delegation for quote card buttons
    quoteList.addEventListener('click', event => {
      if (event.target.classList.contains('btn-danger')) {
        const quoteCard = event.target.closest('.quote-card');
        const quoteId = quoteCard.dataset.id;
  
        fetch(`http://localhost:3000/quotes/${quoteId}`, {
          method: 'DELETE'
        })
          .then(() => {
            quoteCard.remove();
          });
      } else if (event.target.classList.contains('btn-success')) {
        const quoteCard = event.target.closest('.quote-card');
        const quoteId = quoteCard.dataset.id;
  
        const data = {
          quoteId: parseInt(quoteId)
        };
  
        fetch('http://localhost:3000/likes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        })
          .then(response => response.json())
          .then(newLike => {
            const likeButton = quoteCard.querySelector('.btn-success');
            const likeCount = likeButton.querySelector('span');
            const currentLikes = parseInt(likeCount.textContent);
            likeCount.textContent = currentLikes + 1;
          });
      }
    });
  
    // Function to sort quotes by ID
    const sortById = () => {
      const quoteCards = Array.from(quoteList.children);
  
      quoteCards.sort((a, b) => {
        const idA = parseInt(a.dataset.id);
        const idB = parseInt(b.dataset.id);
  
        return idA - idB;
      });
  
      quoteCards.forEach(card => {
        quoteList.appendChild(card);
      });
    };
  
    let isSorted = false;
  
    // Event listener for sort button
    const sortButton = document.createElement('button');
    sortButton.textContent = 'Sort';
    sortButton.addEventListener('click', () => {
      if (isSorted) {
        sortById();
        isSorted = false;
      } else {
        populateQuotes();
        isSorted = true;
      }
    });
  
    document.body.appendChild(sortButton);
  });
  