describe("pulp.controller", function() {

  beforeEach(function() {
  	sinon.stub(pulp.model, "getToc");
	});

  afterEach(function() {
		pulp.model.getToc.restore();		
  });

  it("should initialize the model with the table of content", function() {
		var tocUrl = "/static/toc.html";
		pulp.controller.init( tocUrl );
		expect( pulp.model.getToc ).toHaveBeenCalledWith( tocUrl );
  });

	describe("when the TOC is loaded", function() {
	
		it("should setup the application", function(){
			sinon.spy(pulp.controller, "setup");
			pulp.controller.init("/static/toc.html");
			pulp.model.notify(pulp.events.TOC_LOADED);
			expect( pulp.controller.setup ).toHaveBeenCalled();
		})

	})


});