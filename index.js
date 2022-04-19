const baseUrl = 'https://movie-list.alphacamp.io'
const indexUrl = baseUrl + '/api/v1/movies/'
const poster=baseUrl+'/posters/'
const movie=[]
const moviePanel=document.querySelector('#data-panel')

const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')

const numberPerPage = 12
const pagenator = document.querySelector('#paginator')

let filterMovie = []

// 每個分頁取出的電影資料
function moviesPerPage(page){
  const startIndex = (page-1)*numberPerPage
  const data=filterMovie.length?filterMovie:movie
  return data.slice(startIndex,startIndex+numberPerPage)

}

// 生成pagenator分頁
function pagenatorGenerate(amount){
  const numberOfPage=Math.ceil(amount.length/numberPerPage)
  let rawHTML=''
  for(let i=1;i<=numberOfPage;i++){
    rawHTML+=`
    <li class="page-item"><a class="page-link" href="#" data-page='${i}'>${i}</a></li>
    `
  }
  pagenator.innerHTML=rawHTML


}

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
              <button class="btn btn-info btn-add-favorate" data-id=${film.id}>+</button>
            </div>

          </div>

        </div>


      </div>
    `
  })

 moviePanel.innerHTML=listHTML
}

// 串接電影資料API，並放入陣列movie
axios.get(indexUrl).then((response)=>{
  movie.push(...response.data.results)
  pagenatorGenerate(movie)
  renderMovieList(moviesPerPage(1))
  console.log(movie)
  

}).catch((err)=>{console.log(err)})

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

// 加入最愛清單
function addToFavorate(id){
  const list=JSON.parse(localStorage.getItem('favorateMovie')) || []
  const favorMovie= movie.find((item)=>item.id===id)

  if(list.some((item)=>item.id===id)){
    return alert('電影已在最愛清單')
  }
  
  list.push(favorMovie)
  console.log(list)
  localStorage.setItem('favorateMovie',JSON.stringify(list))


  console.log(id)

}


// 監聽data panel
moviePanel.addEventListener('click',function showMore(event){
  if(event.target.matches('.btn-show-detail')){
    showMovieModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-add-favorate')){
    addToFavorate(Number(event.target.dataset.id))
  }

})

// 監聽search form
searchForm.addEventListener('submit', function whenSearch(event){
  event.preventDefault()
  const keyword=searchInput.value.trim().toLowerCase()
  console.log(keyword)
  
  filterMovie=movie.filter(input=>input.title.toLowerCase().includes(keyword))

  if(filterMovie.length===0){
    return alert(`沒有符合${keyword}內容的電影`)

  }

  pagenatorGenerate(filterMovie)
  renderMovieList(moviesPerPage(1))

})

// 監聽pagenator
pagenator.addEventListener('click', function onPageClick(event){
  if(event.target.tagName!=='A') return
  let pageNumber=(Number(event.target.dataset.page))
  renderMovieList(moviesPerPage(pageNumber))
})

