
describe("pulp.View", function() {

	var article;

  beforeEach(function() {
  	pulp.model.articles.clear();
		article = new pulp.Article({
			content :  "<div id='fixture'>Lorem Ipsum</div>",
			url :    "/lorem/ipsum/"		
		});		
		sinon.stub(article, "fetch");
	});

  afterEach(function() {
  	pulp.model.articles.clear();		
		article.fetch.restore();
	});
	
	it("should initialize by fetching the passed article's content", function(){		
  	var view = new pulp.View(article, "body");
		
		expect( article.fetch ).toHaveBeenCalled();
	})
	
  it("should add an article view to the DOM", function() {
  	var view = new pulp.View(article, "body");
		
		expect( $("body").find("#fixture").detach() ).toBeTruthy();
  });

})