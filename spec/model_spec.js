describe("pulp.model", function() { 
  
  describe("fetching the table of contents", function() {

    var pathToToc = "toc.html";
    var server;
  
    beforeEach(function() {
      server = sinon.fakeServer.create();
    });
      
    afterEach(function() {
      server.restore();
    }); 

    it("should initialize pulp.model.articles when XHR was successful", function() {
      pulp.model.getToc(pathToToc);
  
      server.respondWith("GET", pathToToc, TocResponse.success );     
      server.respond(); 
  
      expect(pulp.model.articles.hasItems()).toEqual(true);     
      expect(pulp.model.articles.current()).toEqual(jasmine.any(pulp.core.Article));
    });
        
    it("should notify observers once pulp.model.articles was initialized", function() {
      var observer = sinon.spy();
      
      pulp.model.observe( pulp.events.TOC_LOADED, observer );
      pulp.model.getToc(pathToToc);
  
      server.respondWith("GET", pathToToc, TocResponse.success);      
      server.respond(); 
  
      expect(observer).toHaveBeenCalled();      
    });
  });
  
  describe("articles", function() {
    
    it("should contain instances of pulp.core.Article", function() {
      expect( pulp.model.articles.current() ).toEqual( jasmine.any(pulp.core.Article) );
    });
    
  }); 
  
});
