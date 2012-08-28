describe("pulp.ui.carousel", function() {

	var articles;

  beforeEach(function() {
		articles  = [ 
			new pulp.Article ({ title : "Article 0", url : "/path/to/article0", content : "Lorem Ipsum" }),
			new pulp.Article ({ title : "Article 1", url : "/path/to/article1", content : "Lorem Ipsum" }),				
			new pulp.Article ({ title : "Article 2", url : "/path/to/article2", content : "Lorem Ipsum" }),
			new pulp.Article ({ title : "Article 3", url : "/path/to/article3", content : "Lorem Ipsum" }),
		];
		
		$.each(articles, function(i, article) {
			sinon.stub(article, "fetch");			
		})

		pulp.ui.carousel.element = '<ul id="carousel">\
	  	<li class="article-container" id="container-0"></li>\
	  	<li class="article-container" id="container-1"></li>\
	    <li class="article-container" id="container-2"></li>\
	  </ul>'

		pulp.model.articles.init(articles);

		sinon.stub(pulp.util, "templating");
		sinon.stub(pulp.util, "Scroll", function(){
		  this.refresh = function(){};
		  this.center = function(){};
		  this.destroy = function(){};
		});

	  pulp.ui.carousel.slider = new pulp.util.Scroll();
	  pulp.ui.carousel.scroller = new pulp.util.Scroll();
	});

  afterEach(function() {
		pulp.model.articles.clear();
		pulp.ui.carousel.element = null;
    pulp.util.Scroll.restore();
		pulp.util.templating.restore();    
  });

  it("should find and display the current article", function() {
		pulp.ui.carousel.display("/path/to/article1");
		
		expect( articles[1].fetch ).toHaveBeenCalled();
  });

  it("should preload the previous and next aricles after the current article is loaded", function() {
		pulp.ui.carousel.display("/path/to/article1");
		articles[1].notify(pulp.events.CONTENT_LOADED);
		
		expect( articles[0].fetch ).toHaveBeenCalled();
		expect( articles[2].fetch ).toHaveBeenCalled();		
  });

	describe("rendering cycle", function() {

	  beforeEach(function() {
			pulp.ui.carousel.$element = $(pulp.ui.carousel.element);
			pulp.ui.carousel.element = null;

			sinon.stub(pulp.ui.carousel, "hideContent");
			sinon.stub(pulp.ui.carousel, "create");
			sinon.stub(pulp.ui.carousel, "render");
			  
	  });

	  afterEach(function() {
			pulp.ui.carousel.$element = null;
			pulp.ui.carousel.hideContent.restore();
			pulp.ui.carousel.create.restore();
			pulp.ui.carousel.render.restore();
	  });

	  it("should initialize the carousel UI", function() {		
      
      pulp.ui.carousel.display("/path/to/article1");    
      articles[1].notify(pulp.events.CONTENT_LOADED);			
			
			expect( pulp.ui.carousel.hideContent ).toHaveBeenCalled();		
	  });

	  it("should create the carousel control", function() {
			pulp.ui.carousel.display("/path/to/article1");
			articles[1].notify(pulp.events.CONTENT_LOADED);
			
			expect( pulp.ui.carousel.create ).toHaveBeenCalled();		
	  });

	  it("should render the carousel control", function() {
			pulp.ui.carousel.display("/path/to/article1");
			articles[1].notify(pulp.events.CONTENT_LOADED);
			
			expect( pulp.ui.carousel.render ).toHaveBeenCalled();		
	  });
  });

});