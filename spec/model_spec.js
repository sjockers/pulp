describe("pulp.model", function() {	
	
	describe("Table of Contents", function() {

	  var request;
	  var onSuccess, onFailure;
		var successArgs;

		beforeEach(function() {

	    jasmine.Ajax.useMock();

	    onSuccess = jasmine.createSpy('onSuccess');
	    onFailure = jasmine.createSpy('onFailure');

	    pulp.model.fetchTOC( {
	      onSuccess: onSuccess,
				onFailure: onFailure
	    });

	    request = mostRecentAjaxRequest();
	    request.response(TOCResponse.success);
	    successArgs = onSuccess.mostRecentCall.args[0];

	  });
	
    it("should call onSuccess with an array", function() {
      expect(onSuccess).toHaveBeenCalledWith(jasmine.any(Array));
    });

    it("should contain instances of pulp.Article", function() {
     	expect(successArgs[0]).toEqual(jasmine.any(pulp.Article));
    });

	});	
	
});
