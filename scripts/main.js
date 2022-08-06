class stats { 
    constructor() { 
      this.data= [];
      this.currentpage=1;
      this.numberofpages=0;
      this.cacheElements();
      this.bindData();
    } 
    cacheElements(){
    this.$stats = $("#stats-module");
    this.statstemplate=$("#stats-template").html();
    }
    bindData(){
      e.on("change.page",this.fetchdata.bind(this));
      
    }
    
    fetchdata(){
      e.emit("show.loader","")
      var url="https://api.themoviedb.org/3/movie/top_rated?api_key=3ee73a98ed9f87efa97e631e48a105b7&page="+this.currentpage;
        fetch(url)
        .then(response => response.json())
        .then(response => {
          this.data=response;
          this.currentpage=response.page;
          this.numberofpages=response.total_pages;
          console.log(this.data);
          this.render();
          e.emit("movies.show", this.data);
          if(this.currentpage==1){
           e.emit("deactivate.previous","");
          }
          if(this.currentpage==500){
            e.emit("deactivate.next","")
          }
        }
          )
        .catch(err => console.error(err));
       this.render();
    }
    render(){
        this.$stats.html(Mustache.render(this.statstemplate, { stats:this.data }));
        e.emit("hide.loader","")
    }
    getcurrentpage(){
      return this.currentpage;
    }
    getnumberofpages(){
      return this.numberofpages;
    }
    setcurrentpage(currentpage){
       this.currentpage=currentpage;
    }
    setnumberofpages(numberofpages){
       this.numberofpages=numberofpages;
    }
 }

 class movies{
    constructor(){
      this.movies=[];
      this.cacheElements();
      this.bindEvents();
    }
    
    cacheElements(){
        this.$movies = $("#movies-module");
        this.moviestemplate=$("#movies-template").html();
    }
    bindEvents(){
        e.on("movies.show", this.showmovies.bind(this));
        this.$movies.on("click", "div.moviebox", this.showmovie.bind(this));
    }
    
    showmovies(data){
        this.movies=data.results;
        this.$movies.html(Mustache.render(this.moviestemplate, { movies:this.movies }));
        
    }
    showmovie(event){
      var id=event.currentTarget.id;
      e.emit("movie.show", id);
      
    }

 }

 class modal{
    constructor(){
      this.movie="";
        this.cacheElements();
        this.bindEvents();
    }
    
    cacheElements(){
        this.$modal = $("#mymodelcontent");
        this.modaltemplate=$("#modal-template").html();
    }
    bindEvents(){
        e.on("movie.show", this.fetchmovie.bind(this));
    }
    fetchmovie(id){
      e.emit("show.loader","");
      var url=`https://api.themoviedb.org/3/movie/${id}?api_key=3ee73a98ed9f87efa97e631e48a105b7`
      fetch(url)
      .then(response => response.json())
      .then(response => {
        console.log(response);
        this.movie=response;
        this.render();
        
      }
        )
      .catch(err => console.error(err));
    }
    render(){ 
        this.$modal.html(Mustache.render(this.modaltemplate, { movie:this.movie  }));
        e.emit("hide.loader","");
    }
 }

 class paging{
  constructor(){
    this.cacheElements();
    this.bindEvents();
  }
  cacheElements(){
    this.$pages = $("#page_module");
    this.pagestemplate=$("#paging-template").html();
  }
  bindEvents(){
    e.on("movies.show", this.showpages.bind(this));
    this.$pages.on("click", "li.liprevious", this.previous.bind(this));
    this.$pages.on("click", "li.linext", this.next.bind(this));
    e.on("deactivate.previous", this.deactivateprevious.bind(this));
    e.on("deactivate.next", this.deactivatenext.bind(this));
  }
  showpages(){
    this.$pages.html(Mustache.render(this.pagestemplate, {}));
  }
  previous(){
    var currentpage=s.getcurrentpage();
    if(currentpage == 1){
      this.deactivateprevious();
    }
    else{
    s.setcurrentpage(currentpage-1);
    e.emit("change.page","");
    }
  }
  next(){
    var currentpage=s.getcurrentpage();
    var numberofpages=s.getnumberofpages();
    if(currentpage==500){
      this.deactivatenext();
    }
    else{
    s.setcurrentpage(currentpage+1);
    e.emit("change.page","");
  }}
  deactivateprevious(){
    this.$pages.find("li.liprevious").addClass("disabled");
    this.$pages.find("a.aprevious").attr('tabindex', '-1');
  }
  deactivatenext(){
    this.$pages.find("li.linext").addClass("disabled");
    this.$pages.find("a.anext").attr('tabindex', '-1');
  }

 }
 
 class loader{
  constructor(){
    this.cacheElements();
    this.bindEvents();
  }
  cacheElements(){
    this.$loader=$("#loader");
  }
  bindEvents(){
    e.on("show.loader",this.showloader.bind(this));
    e.on("hide.loader",this.hideloader.bind(this));
  }
  showloader(){
   
    this.$loader.addClass("display");
    
  }
  hideloader(){
    
    this.$loader.removeClass("display");
  }
 }

 class eventsmediator{
    constructor(){
        this.events=[];
    }
    on(eventName, callbackfn){
        this.events[eventName] = this.events[eventName]
      ? this.events[eventName]
      : [];
    this.events[eventName].push(callbackfn);
    

    }
    emit(eventName, data){
        
        if (this.events[eventName]) {
            this.events[eventName].forEach(function (callBackfn) {
              callBackfn(data);
            });
          }
    }
 }
 let e=new eventsmediator();
 let s=new stats();
 let m=new movies();
 let m1=new modal();
 let p=new paging();
 let l=new loader();


 s.fetchdata();