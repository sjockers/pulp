describe("pulp.app", function() {

	var tocReference = $("<link rel='toc' href='/toc.html' />");

  beforeEach(function() {
		tocReference.appendTo("head");		
  	sinon.stub(pulp.model, "getToc");
	});

  afterEach(function() {
		tocReference.detach();
		pulp.model.getToc.restore();		
  });

  it("should initialize the model with the table of content", function() {
		pulp.app.init();
		expect( pulp.model.getToc ).toHaveBeenCalledWith( tocReference.attr("href") );
  });

  it("should add an article view to the current page", function() {
		pulp.app.init();
		pulp.model.articles.add(new pulp.Article({
			title :  "Lorem Ipsum",
			url :    "./lorem/ipsum/"		
		}))
		pulp.app.showArticle("./lorem/ipsum/");
		
		expect( pulp.model.articles.current().url ).toEqual( "./lorem/ipsum/")
		expect( $("body").find("Lorem Ipsum") ).toBeTruthy();
  });

});