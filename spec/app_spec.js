xdescribe("pulp.app", function() {

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


});