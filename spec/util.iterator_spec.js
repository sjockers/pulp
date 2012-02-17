
describe("util.iterator", function() {

	var articles;
	var iterator;

	beforeEach(function() {
			
		articles  = [ 
			new pulp.Article ({ title : "Article 0", url : "/path/to/article0" }),
			new pulp.Article ({ title : "Article 1", url : "/path/to/article1" }),				
			new pulp.Article ({ title : "Article 2", url : "/path/to/article2" }),
			new pulp.Article ({ title : "Article 3", url : "/path/to/article3" }),
		];
		
		iterator = new pulp.util.Iterator();
	
	});

	describe("add", function() {

		it("should store instances of pulp.Article", function() {
			iterator.add( articles[0] );
			
			expect( iterator.current() ).toBe( articles[0] );			
		});
	
		it("should store arbitrary objects", function() {
		
			iterator.add( new pulp.Article() );
			iterator.add( "hello" );
			iterator.add( [3,7,1,5,3] );	
			
			expect( iterator.current() ).toEqual( jasmine.any(pulp.Article) );
			expect( iterator.next() ).toEqual( jasmine.any(String) );
			expect( iterator.next() ).toEqual( jasmine.any(Array) );
		});
	
	});

	describe("init", function() {

		it("should initialize with an array", function() {
			iterator.init( articles );
		
			expect( iterator.current() ).toBe( articles[0] );
			expect( iterator.next() ).toBe( articles[1] );
			expect( iterator.next() ).toBe( articles[2] );
			expect( iterator.next() ).toBe( articles[3] );
		});
		
	});

	describe("get", function() {
			
		it("should return the specified article for #get", function() {
			iterator.init( articles );	
						
			expect( iterator.get("url", articles[3].url) ).toBe( articles[3] );				
			expect( iterator.get("url", articles[2].url) ).toBe( articles[2] );				
			expect( iterator.get("url", articles[1].url) ).toBe( articles[1] );				
			expect( iterator.get("url", articles[0].url) ).toBe( articles[0] );
							
		});	
		
		it("should return null for #get if there is no item for that property/key combination", function() {
			iterator.init( articles );	
			
			expect( iterator.get("url", "bla bla bla" ) ).toBe( null );							
		});	
		
	});	

	describe("next", function() {
	
		it("should return the next item", function() {
			iterator.init( articles );	

			expect( iterator.next() ).toBe( articles[1] );
			expect( iterator.next() ).toBe( articles[2] );
		});
	
		it("should return null when are no articles left", function() {
			iterator.add( articles[0] );
			iterator.add( articles[1] );
			iterator.next();
		
			expect( iterator.next() ).toBe( null );
		});

	});

	describe("previous", function() {
	
		it("should return the previous item when #previous is called", function() {
			iterator.init( articles );	
			iterator.next();
			iterator.next();

			expect( iterator.previous() ).toBe( articles[1] );
			expect( iterator.previous() ).toBe( articles[0] );
		});
	
		it("should return null when #previous is called and there are no articles left", function() {
			iterator.add( articles[0] );
			iterator.previous();
		
			expect( iterator.previous() ).toBe( null );
		});
	
	});

	describe("rewind", function() {
		
		it("should jump back to the first item", function() {
			iterator.init( articles );	
							
			expect( iterator.current() ).toBe( articles[0] );
			iterator.next();				
		});

	})

	describe("current", function() {
		
		it("should return the current item", function() {
			iterator.init( articles );	
							
			expect( iterator.current() ).toBe( articles[0] );
			iterator.next();				
			expect( iterator.current() ).toBe( articles[1] );
		});
		
		it("should return null if empty", function() {
			expect( iterator.current() ).toBe( null );
		});
		
	})

});

