
describe("pulp.namespace", function() {
  
  it("should initialize a new Object as a property of the pulp Object", function(){    
    pulp.namespace("someObject");
    
    expect( pulp.someObject ).toBeTruthy();
  })

  it("should initialize a chain of Objects from a passed String", function(){    
    pulp.namespace("someNamespace.someSubNamespace.someOtherSubNamespace");
    
    expect( pulp.someNamespace.someSubNamespace.someOtherSubNamespace ).toBeTruthy();
  })

  it("should not overwrite existing namespaces when creating new ones", function(){    
    pulp.subNamespace = {};
    pulp.subNamespace.subSubNamespace1 = {};
    
    pulp.namespace("subnameSpace.subSubNamespace2");
    
    expect( pulp.subNamespace.subSubNamespace1 ).toEqual({});
  })

})