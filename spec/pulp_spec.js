describe("pulp.observer", function() {

	beforeEach(function () {
		pulp.observer.callbacks = [];
	});

	it("should be present in the global name space", function() {
		expect(pulp.observer).toBeDefined();
	});
	
	it("should be able to register a callback function", function() {
		function callback() { return null; }
		pulp.observer.register(callback);
		var callbacks = pulp.observer.getCallbacks();
		expect(callbacks.length).toBe(1);
	 	expect(callbacks[0]).toBe(callback);		
	});
	
	it("should be able to register multiple callback functions", function() {
		function callback1() { return null; }
		function callback2() { return null; }
		function callback3() { return null; }		
		pulp.observer.register(callback1);		
		pulp.observer.register(callback2);		
		pulp.observer.register(callback3);
		var callbacks = pulp.observer.getCallbacks();
		expect(callbacks.length).toBe(3);
	 	expect(callbacks[0]).toBe(callback1);
	 	expect(callbacks[1]).toBe(callback2);
	 	expect(callbacks[2]).toBe(callback3);		
	});

	it("should provide an update method to execute all callbacks", function() {
		window.callback1 = function() { return null; }
		window.callback2 = function() { return null; }
		spyOn(window, "callback1");
		spyOn(window, "callback2");
	 	pulp.observer.register(window.callback1);		
		pulp.observer.register(window.callback2);		
		var someData = "some data string";
		pulp.observer.update(someData);
		expect(window.callback1).toHaveBeenCalledWith(someData);
		expect(window.callback2).toHaveBeenCalledWith(someData);
	});

}); 