describe("pulp.carousel", function() {

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

		console.log("pulp.carousel? " + pulp.carousel);

		pulp.carousel.element = '<ul id="carousel">\
	  	<li class="article-container" id="container-0"></li>\
	  	<li class="article-container" id="container-1"></li>\
	    <li class="article-container" id="container-2"></li>\
	  </ul>'

		pulp.model.articles.init(articles);
		
	});

  afterEach(function() {
		pulp.model.articles.clear();
		pulp.carousel.element = null;
  });

  it("should find and display the current article", function() {
		pulp.carousel.display("/path/to/article1");
		
		expect( articles[1].fetch ).toHaveBeenCalled();
  });

  it("should preload the previous and next aricles after the current article is loaded", function() {
		pulp.carousel.display("/path/to/article1");
		articles[1].notify(pulp.events.CONTENT_LOADED);
		
		expect( articles[0].fetch ).toHaveBeenCalled();
		expect( articles[2].fetch ).toHaveBeenCalled();		
  });

	describe("rendering cycle", function() {

	  beforeEach(function() {
			pulp.carousel.$element = $(pulp.carousel.element);
			pulp.carousel.element = null;

			sinon.stub(pulp.carousel, "hideContent");
			sinon.stub(pulp.carousel, "create");
			sinon.stub(pulp.carousel, "render");
	  });

	  afterEach(function() {
			pulp.carousel.$element = null;
			pulp.carousel.hideContent.restore();
			pulp.carousel.create.restore();
			pulp.carousel.render.restore();
	  });

	  it("should hide the initial body content", function() {		
			pulp.carousel.display("/path/to/article1");
			articles[1].notify(pulp.events.CONTENT_LOADED);
			
			expect( pulp.carousel.hideContent ).toHaveBeenCalled();		
	  });

	  it("should create the carousel control", function() {
			pulp.carousel.display("/path/to/article1");
			articles[1].notify(pulp.events.CONTENT_LOADED);
			
			expect( pulp.carousel.create ).toHaveBeenCalled();		
	  });

	  it("should render the carousel control", function() {
			pulp.carousel.display("/path/to/article1");
			articles[1].notify(pulp.events.CONTENT_LOADED);
			
			expect( pulp.carousel.render ).toHaveBeenCalled();		
	  });
  });

});