describe("pulp.Article", function() {

	var article;

  beforeEach(function() {

		article = new pulp.Article ({
			url : "./article.html",
			thumbnail : "./thumbnail.png",
			title : "This is the Title",
			byline : "This is the Byline"
		});
  });

	describe("constructor", function() {

	  it("should store the byline", function() {
	    expect(article.byline).toEqual("This is the Byline");
	  });

	  it("should store the thumbnail path", function() {
	    expect(article.thumbnail).toEqual("./thumbnail.png");
	  });

	  it("should store the url", function() {
	    expect(article.url).toEqual("./article.html");
	  });

	  it("should store the title", function() {
	    expect(article.title).toEqual("This is the Title");
	  });

	});


	describe("fetch article content", function() {

  	var request;
  	var successArgs;
	  var onSuccess, onFailure;
		
		beforeEach(function() {

	    jasmine.Ajax.useMock();

	    onSuccess = jasmine.createSpy('onSuccess');
	    onFailure = jasmine.createSpy('onFailure');

	    article.fetch({
	      onSuccess: onSuccess,
				onFailure: onFailure
	    });

	    request = mostRecentAjaxRequest();
	    request.response(TOCResponse.success);
	    successArgs = onSuccess.mostRecentCall.args[0];

	  });

	  it("should return a content string", function() {	
			expect(onSuccess).toHaveBeenCalledWith(jasmine.any(String));
		});
		
	  it("should store the content string after it's fetched from the server", function() {	
			expect(successArgs).toEqual(article.content);
		});
	
	});
});