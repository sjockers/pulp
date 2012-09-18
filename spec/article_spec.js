describe("pulp.core.Article", function() {

  var article;

  beforeEach(function() {

    article = new pulp.core.Article ({
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
    var server;
    var successCallback;
    
    beforeEach(function() {
      server = sinon.fakeServer.create();
      server.respondWith("GET", "./article.html", ArticlesResponse.success);      
      successCallback = sinon.spy();      
    });
    
    afterEach(function() {
      server.restore();
    });
    
    it("should store the content string after it's fetched from the server", function() { 
      article.fetch(successCallback);     
      server.respond();

      expect( article.content ).toEqual( successCallback.args[0][0] );      
    });
  
    it("should notify observers once the content was downloaded", function() {  
      
      article.observe( pulp.events.CONTENT_LOADED, successCallback );
      article.fetch();      
      server.respond();

      expect( successCallback ).toHaveBeenCalled();     
    });
  
  });
});