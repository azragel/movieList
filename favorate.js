const baseUrl = 'https://movie-list.alphacamp.io'
const indexUrl = baseUrl + '/api/v1/movies/'
const poster=baseUrl+'/posters/'
const movie = JSON.parse(localStorage.getItem('favorateMovie'))||[]
const moviePanel=document.querySelector('#data-panel')

const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')

// 把資料丟入用template literal產出list
function renderMovieList(data){
  let listHTML=''
  data.forEach(film=>{
    listHTML+=`
    <div class="col-sm-3">
        <div class="mb-2">
          <div class="card">
            <img
              src=${poster+film.image}
              class="card-img-top" alt="Movie poster">
            <div class="card-body">
              <h5 class="card-title">${film.title}</h5>


            </div>

            <div class="card-footer ">
              <button class="btn btn-primary btn-show-detail" data-bs-toggle="modal"
                data-bs-target="#movie-modal" data-id=${film.id}>more</button>
              <button class="btn btn-danger btn-remove-favorate" data-id=${film.id}>x</button>
            </div>

          </div>

        </div>


      </div>
    `
  })

 moviePanel.innerHTML=listHTML
}

// 串接電影資料API，並放入陣列movie


function showMovieModal(id){
  const modalTitle = document.querySelector('#movie-modal-title')
  const modalPoster = document.querySelector('#movie-modal-image')
  const modalDate = document.querySelector('#movie-modal-date')
  const modalDescription = document.querySelector('#movie-modal-description')

  axios.get(indexUrl+id).then((response)=>{
    const film=response.data.results
    modalTitle.textContent=film.title
    modalPoster.innerHTML =`<img src=${poster+film.image} alt="movie-poster" class="img-fluid">`
    modalDate.textContent = 'Release date:'+film.release_date
    modalDescription.textContent=film.description

  })

}

function removeFavorate(id){
  if (!movie || !movie.length) return
  

  const movieIndex=movie.findIndex(item=>item.id===id)
  if (movieIndex === -1) return

  movie.splice(movieIndex,1)

  localStorage.setItem('favorateMovie',JSON.stringify(movie))
  renderMovieList(movie)


}




// 監聽data panel
moviePanel.addEventListener('click',function showMore(event){
  if(event.target.matches('.btn-show-detail')){
    showMovieModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-remove-favorate')){
    removeFavorate(Number(event.target.dataset.id))
  }

})


renderMovieList(movie)
