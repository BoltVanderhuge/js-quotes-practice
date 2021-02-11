const url = "http://localhost:3000/quotes?_embed=likes"
const quoteList = document.querySelector("ul#quote-list")
const newQuoteForm = document.querySelector("form#new-quote-form")

function fetchQuotes(){
  fetch(url)
  .then(response => response.json())
  .then(quotes => renderAllQuotes(quotes));
  
}

function renderAllQuotes(quotes){
  quoteList.innerHTML = ""
  quotes.forEach(quote => renderAQuote(quote));
}

function renderAQuote(quote){
  
  li = document.createElement("li")
  li.className = 'quote-card'
  li.dataset.id = quote.id
  li.innerHTML = `
  <blockquote class="blockquote">
  <p class="mb-0">${quote.quote}</p>
  <footer class="blockquote-footer">${quote.author}</footer>
  <br>
  <button class='btn-success'>Likes: <span>${quote.likes.length}</span></button>
  <button class='btn-danger'>Delete</button>
  </blockquote>
  
  `
  quoteList.append(li)
}

quoteList.addEventListener("click", handleDelete)
newQuoteForm.addEventListener("submit",handleSubmit)

function handleSubmit(e){
  e.preventDefault()
  quote = e.target[0].value
  author = e.target[1].value
  likes = []
  quoteObj = {quote, author, likes}
  postNewQuote(quoteObj)
}

function postNewQuote(quoteObj){
  fetch('http://localhost:3000/quotes', {
    method: 'POST', 
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(quoteObj),
  })
  .then(response => response.json())
  .then(data => renderAQuote(data))
  .catch((error) => {
  console.error('Error:', error);
});
}

function handleDelete(e){
  
  if(e.target.className === "btn-danger"){
    const toDelete = e.target.closest("li.quote-card")
    const htmlID = toDelete.dataset.id

    fetch(`http://localhost:3000/quotes/${htmlID}`, {
    method: 'DELETE', 
    headers: {
      'Content-Type': 'application/json',
      }
    })
    toDelete.remove()
  } else if (e.target.className === "btn-success") {
    // const toPost = e.target.closest("li.quote-card")
    const toPost = e.target.parentElement.parentElement
    const htmlID = parseInt(toPost.dataset.id)


    fetch(`http://localhost:3000/likes`, {
    method: 'POST', 
    headers: {
      'Content-Type': 'application/json',
      },
      body: JSON.stringify({ quoteId: htmlID, createdAt: Date.now() }),
    })
      .then(fetchQuotes())
    .catch((error) => {
    console.error('Error:', error);
  });
  }
}

fetchQuotes()