
describe("util.iterator", function() {

	var articles;

	beforeEach(function() {
			
		articles  = [ 
			new pulp.Article ({ title : "Article 0", url : "/path/to/article0" }),
			new pulp.Article ({ title : "Article 1", url : "/path/to/article1" }),				
			new pulp.Article ({ title : "Article 2", url : "/path/to/article2" }),
			new pulp.Article ({ title : "Article 3", url : "/path/to/article3" }),
		];
		
		pulp.model.articles.clear();
	
	});

	describe("add", function() {

		it("should store instances of pulp.Article", function() {
			pulp.model.articles.add( articles[0] );
			
			expect( pulp.model.articles.current() ).toBe( articles[0] );			
		});
	
		it("should store arbitrary objects", function() {
			pulp.model.articles.add( new pulp.Article() );
			pulp.model.articles.add( "hello" );
			pulp.model.articles.add( [3,7,1,5,3] );
		
			expect( pulp.model.articles.current() ).toEqual( jasmine.any(pulp.Article) );
			expect( pulp.model.articles.next() ).toEqual( jasmine.any(String) );
			expect( pulp.model.articles.next() ).toEqual( jasmine.any(Array) );
		});
	
	});

	describe("init", function() {

		it("should initialize with an array", function() {
			pulp.model.articles.init( articles );
		
			expect( pulp.model.articles.current() ).toBe( articles[0] );
			expect( pulp.model.articles.next() ).toBe( articles[1] );
			expect( pulp.model.articles.next() ).toBe( articles[2] );
			expect( pulp.model.articles.next() ).toBe( articles[3] );
		});
		
	});

	describe("get", function() {
			
		it("should return the specified article for #get", function() {
			pulp.model.articles.init( articles );	
						
			expect( pulp.model.articles.get("url", articles[3].url) ).toBe( articles[3] );				
			expect( pulp.model.articles.get("url", articles[2].url) ).toBe( articles[2] );				
			expect( pulp.model.articles.get("url", articles[1].url) ).toBe( articles[1] );				
			expect( pulp.model.articles.get("url", articles[0].url) ).toBe( articles[0] );
							
		});	
		
		it("should return null for #get if there is no item for that property/key combination", function() {
			pulp.model.articles.init( articles );	
			
			expect( pulp.model.articles.get("url", "bla bla bla" ) ).toBe( null );							
		});	
		
	});	

	describe("next", function() {
	
		it("should return the next item", function() {
			pulp.model.articles.init( articles );	

			expect( pulp.model.articles.next() ).toBe( articles[1] );
			expect( pulp.model.articles.next() ).toBe( articles[2] );
		});
	
		it("should return null when are no articles left", function() {
			pulp.model.articles.add( articles[0] );
			pulp.model.articles.add( articles[1] );
			pulp.model.articles.next();
		
			expect( pulp.model.articles.next() ).toBe( null );
		});

	});

	describe("previous", function() {
	
		it("should return the previous item when #previous is called", function() {
			pulp.model.articles.init( articles );	
			pulp.model.articles.next();
			pulp.model.articles.next();

			expect( pulp.model.articles.previous() ).toBe( articles[1] );
			expect( pulp.model.articles.previous() ).toBe( articles[0] );
		});
	
		it("should return null when #previous is called and there are no articles left", function() {
			pulp.model.articles.add( articles[0] );
			pulp.model.articles.previous();
		
			expect( pulp.model.articles.previous() ).toBe( null );
		});
	
	});

	describe("rewind", function() {
		
		it("should jump back to the first item", function() {
			pulp.model.articles.init( articles );	
							
			expect( pulp.model.articles.current() ).toBe( articles[0] );
			pulp.model.articles.next();				
		});

	})

	describe("current", function() {
		
		it("should return the current item", function() {
			pulp.model.articles.init( articles );	
							
			expect( pulp.model.articles.current() ).toBe( articles[0] );
			pulp.model.articles.next();				
			expect( pulp.model.articles.current() ).toBe( articles[1] );
		});
		
		it("should return null if empty", function() {
			expect( pulp.model.articles.current() ).toBe( null );
		});
		
	})

});

