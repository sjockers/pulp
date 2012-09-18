describe("pulp.core.model", function() { 
  
  describe("fetching the table of contents", function() {

    var pathToToc = "toc.html";
    var server;
  
    beforeEach(function() {
      server = sinon.fakeServer.create();
    });
      
    afterEach(function() {
      server.restore();
    }); 

    it("should initialize pulp.core.model.articles when XHR was successful", function() {
      pulp.core.model.getToc(pathToToc);
  
      server.respondWith("GET", pathToToc, TocResponse.success );     
      server.respond(); 
  
      expect(pulp.core.model.articles.hasItems()).toEqual(true);     
      expect(pulp.core.model.articles.current()).toEqual(jasmine.any(pulp.core.Article));
    });
        
    it("should notify observers once pulp.core.model.articles was initialized", function() {
      var observer = sinon.spy();
      
      pulp.core.model.observe( pulp.core.events.TOC_LOADED, observer );
      pulp.core.model.getToc(pathToToc);
  
      server.respondWith("GET", pathToToc, TocResponse.success);      
      server.respond(); 
  
      expect(observer).toHaveBeenCalled();      
    });
  });
  
  describe("articles", function() {
    
    it("should contain instances of pulp.core.Article", function() {
      expect( pulp.core.model.articles.current() ).toEqual( jasmine.any(pulp.core.Article) );
    });
    
  }); 
  
});
