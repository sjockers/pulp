
describe("util.collection", function() {

	var articles;
	var collection;

	beforeEach(function() {
			
		articles  = [ 
			new pulp.Article ({ title : "Article 0", url : "/path/to/article0" }),
			new pulp.Article ({ title : "Article 1", url : "/path/to/article1" }),				
			new pulp.Article ({ title : "Article 2", url : "/path/to/article2" }),
			new pulp.Article ({ title : "Article 3", url : "/path/to/article3" }),
		];
		
		collection = new pulp.util.Collection();
	
	});

	describe("add", function() {

		it("should store instances of pulp.Article", function() {
			collection.add( articles[0] );
			
			expect( collection.current() ).toBe( articles[0] );			
		});
	
		it("should store arbitrary objects", function() {
		
			collection.add( new pulp.Article() );
			collection.add( "hello" );
			collection.add( [3,7,1,5,3] );	
			
			expect( collection.current() ).toEqual( jasmine.any(pulp.Article) );
			expect( collection.next() ).toEqual( jasmine.any(String) );
			expect( collection.next() ).toEqual( jasmine.any(Array) );
		});
	
	});

	describe("init", function() {

		it("should initialize with an array", function() {
			collection.init( articles );
		
			expect( collection.current() ).toBe( articles[0] );
			expect( collection.next() ).toBe( articles[1] );
			expect( collection.next() ).toBe( articles[2] );
			expect( collection.next() ).toBe( articles[3] );
		});
		
	});

	describe("get", function() {
			
		it("should return the specified article for #get", function() {
			collection.init( articles );	
						
			expect( collection.get("url", articles[3].url) ).toBe( articles[3] );				
			expect( collection.get("url", articles[2].url) ).toBe( articles[2] );				
			expect( collection.get("url", articles[1].url) ).toBe( articles[1] );				
			expect( collection.get("url", articles[0].url) ).toBe( articles[0] );
							
		});	
		
		it("should return null for #get if there is no item for that property/key combination", function() {
			collection.init( articles );	
			
			expect( collection.get("url", "bla bla bla" ) ).toBe( null );							
		});	
		
	});	

	describe("next", function() {
	
		it("should return the next item", function() {
			collection.init( articles );	

			expect( collection.next() ).toBe( articles[1] );
			expect( collection.next() ).toBe( articles[2] );
		});
	
		it("should return null when are no articles left", function() {
			collection.add( articles[0] );
			collection.add( articles[1] );
			collection.next();
		
			expect( collection.next() ).toBe( null );
		});

	});

	describe("previous", function() {
	
		it("should return the previous item when #previous is called", function() {
			collection.init( articles );	
			collection.next();
			collection.next();

			expect( collection.previous() ).toBe( articles[1] );
			expect( collection.previous() ).toBe( articles[0] );
		});
	
		it("should return null when #previous is called and there are no articles left", function() {
			collection.add( articles[0] );
			collection.previous();
		
			expect( collection.previous() ).toBe( null );
		});
	
	});

	describe("rewind", function() {
		
		it("should jump back to the first item", function() {
			collection.init( articles );	
							
			expect( collection.current() ).toBe( articles[0] );
			collection.next();				
		});

	})

	describe("current", function() {
		
		it("should return the current item", function() {
			collection.init( articles );	
							
			expect( collection.current() ).toBe( articles[0] );
			collection.next();				
			expect( collection.current() ).toBe( articles[1] );
		});
		
		it("should return null if empty", function() {
			expect( collection.current() ).toBe( null );
		});
		
	})

});
