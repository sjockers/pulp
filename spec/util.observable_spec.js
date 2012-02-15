describe("pulp.util.observer", function() {

	  beforeEach(function () {
			this.observable = Object.create(pulp.util.observable);
		});		

		describe("adding observers", function() {
			
			it("should store callback functions", function() {
				var callbacks = [function() {}, function() {}];
						
				this.observable.observe("event", callbacks[0]);
				this.observable.observe("event", callbacks[1]);
		 	
				expect(this.observable.hasObserver("event", callbacks[0])).toBeTruthy();
				expect(this.observable.hasObserver("event", callbacks[1])).toBeTruthy();

			});
		
			it("should return true when observer was registered", function() {
				var callback = function() {};
				
				this.observable.observe("event", callback);
				
				expect(this.observable.hasObserver("event", callback)).toBeTruthy();
			});
			
			it("should return false when observer was not registered", function() {				
				expect(this.observable.hasObserver("event", function() {})).toBeFalsy();
			});
			
		});
		
		describe("notifying observers", function() {
		
			it("should call all observers", function() {
				var observer1 = function() { observer1.called = true };
				var observer2 = function() { observer2.called = true };

				this.observable.observe("event", observer1);
				this.observable.observe("event", observer2);
				this.observable.notify("event");
		 	
				expect(observer1.called).toBeTruthy();
				expect(observer2.called).toBeTruthy();
			});
			
			it("should pass arguments through to the observers", function() {
				var passedArguments;
				
				this.observable.observe("event", function() {
					passedArguments = arguments;
				});			
				this.observable.notify("event", "String", 43, 3.14159265 );
				
				expect(passedArguments).toEqual(["String", 43, 3.14159265]);	
			});
			
			it("should not fail if no observers are present", function() {
				expect(this.observable.notify).not.toThrow();				
			});
			
			it("should notify relevant observers only", function() {
				var calls = [];
				
				this.observable.observe("oneEvent", function() {
					calls.push("oneEvent");
				});
				
				this.observable.observe("anotherEvent", function() {
					calls.push("anotherEvent");
				});
				
				this.observable.notify("anotherEvent");
				expect(calls).toEqual(["anotherEvent"]);
			})
			
		});
		
		describe("Call Order", function() {
			
			it ("should call the observers in the order they were added", function() {				
				var calls = [];
				var observer1 = function() { calls.push(observer1) };
				var observer2 = function() { calls.push(observer2) };
				
				this.observable.observe("event", observer1);
				this.observable.observe("event", observer2);
				this.observable.notify("event");

				expect(observer1).toEqual(calls[0]);
				expect(observer2).toEqual(calls[1]);

			})
			
		});
		
		describe("Error Handling", function() {
		
			it("should throw TypeError when uncallable observer is added", function() {
				var invalidTestFn = function(test) {
					Object.create(pulp.util.observable).observe("event", {});
				};
				
				expect(invalidTestFn).toThrow(new TypeError("not a function"));
			});
			
			it("should notify all even when some observers fail", function() {
				var observer1 = function() { throw new Error("Whut!?"); };
				var observer2 = function() { observer2.called = true };				

				this.observable.observe("event", observer1);
				this.observable.observe("event", observer2);
				this.observable.notify("event");

				expect(observer2.called).toBeTruthy();
			});
			
		});
		
});