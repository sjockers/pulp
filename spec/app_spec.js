describe("pulp.app", function() {

	var server;

  beforeEach(function() {
  	sinon.stub(pulp.model, "getToc");
		server = sinon.fakeServer.create();
		server.respondWith("GET", "../templates/ui.html", TocResponse.success);
	});

  afterEach(function() {
		server.restore();
		pulp.model.getToc.restore();		
  });

  it("should initialize the model with the table of content", function() {
		var tocUrl = "/static/toc.html";
		var templateUrl = "../templates/ui.html"
		pulp.app.init( tocUrl, templateUrl );
		server.respond();
		expect( pulp.model.getToc ).toHaveBeenCalledWith( tocUrl );
  });

	describe("when the TOC is loaded", function() {
	
		it("should setup the application", function(){
			sinon.spy(pulp.app, "setup");
			var tocUrl = "/static/toc.html";
			var templateUrl = "../templates/ui.html"
			pulp.app.init( tocUrl, templateUrl );
			server.respond();
			pulp.model.notify(pulp.events.TOC_LOADED);
			expect( pulp.app.setup ).toHaveBeenCalled();
		})

	})


});