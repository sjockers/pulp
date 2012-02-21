describe("pulp.carousel", function() {

	var articles;

  beforeEach(function() {
		articles  = [ 
			new pulp.Article ({ title : "Article 0", url : "/path/to/article0" }),
			new pulp.Article ({ title : "Article 1", url : "/path/to/article1" }),				
			new pulp.Article ({ title : "Article 2", url : "/path/to/article2" }),
			new pulp.Article ({ title : "Article 3", url : "/path/to/article3" }),
		];
		
		$.each(articles, function(i, article) {
			  	sinon.stub(article, "fetch");			
		})

		pulp.model.articles.init(articles);
		
	});

  afterEach(function() {
		pulp.model.articles.clear();
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
});