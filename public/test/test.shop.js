describe("Kate's Cupcake Shop LLC. A Delaware Company", function(){

  describe("cupcakeShop.addFlavor", function(){

    it("exists", function(){
      expect(cupcakeShop.addFlavor).to.be.a("function");
    });

    it("can create new flavors", function(){
      resetShop();

      cupcakeShop.addFlavor("chocolate");
      expect(cupcakeShop.inventory).to.have.keys("chocolate");
      cupcakeShop.addFlavor("vanilla");
      expect(cupcakeShop.inventory).to.have.keys("vanilla", "chocolate");
      cupcakeShop.addFlavor("strawberry");
      expect(cupcakeShop.inventory).to.have.keys("vanilla", "chocolate", "strawberry");

      expect(cupcakeShop.inventory).to.deep.equal({
        chocolate: 0,
        vanilla: 0,
        strawberry: 0
      })

    });

    it("doesn't overwrite existing flavors", function(){
      resetShop();

      cupcakeShop.addFlavor("chocolate");
      cupcakeShop.inventory.chocolate = 10;

      cupcakeShop.addFlavor("chocolate");

      expect(cupcakeShop.inventory).to.have.keys("chocolate");
      expect(cupcakeShop.inventory.chocolate).to.equal(10);
    });

  });

  describe("cupcakeShop.removeFlavor", function(){

    it("exists", function(){
      expect(cupcakeShop.removeFlavor).to.be.a("function");
    });

    it("removes flavors and adds to retired list", function(){
      resetShop();

      cupcakeShop.inventory = {
        chocolate: 10,
        vanilla: 5,
        "red velvet": 15
      }

      cupcakeShop.removeFlavor("red velvet"); // so gross

      expect(cupcakeShop.inventory).to.have.keys("chocolate", "vanilla");
      expect(cupcakeShop.inventory).to.not.have.keys("red velvet");
      expect(cupcakeShop.retiredFlavors[cupcakeShop.retiredFlavors.length - 1]).to.equal("red velvet");
    });

  });

  describe("cupcakeShop.listFlavors", function(){

    it("exists", function(){
      expect(cupcakeShop.listFlavors).to.be.a("function");
    });

    it("returns empty array if there's no inventory", function(){
      resetShop();

      expect(cupcakeShop.listFlavors()).to.deep.equal([]);
    });

    it("lists cupcake flavors", function(){
      resetShop();

      cupcakeShop.inventory = {
        chocolate: 10,
        vanilla: 5,
        strawberry: 14,
        "red velvet": 0
      }

      expect(cupcakeShop.listFlavors()).to.be.same.members([
        "chocolate",
        "vanilla",
        "strawberry",
        "red velvet"
      ]);
    });

  });


  describe("cupcakeShop.showStock", function(){

    it("exists", function(){
      expect(cupcakeShop.showStock).to.be.a("function");
    });

    it("shows stock of existing flavors", function(){
      resetShop();

      cupcakeShop.inventory = {
        vanilla: 20,
        chocolate: 0
      }

      expect(cupcakeShop.showStock("vanilla")).to.equal(20)
      expect(cupcakeShop.showStock("chocolate")).to.equal(0)
    })

    it("returns 0 for non-existent flavors", function(){
      resetShop();

      cupcakeShop.inventory = {
        vanilla: 20
      }

      expect(cupcakeShop.showStock("strawberry")).to.equal(0)
    })

  });

  describe("cupcakeShop.restock", function(){

    it("exists", function(){
      expect(cupcakeShop.restock).to.be.a("function");
    });

    it("adds to stock of existing flavors", function(){
      resetShop();

      cupcakeShop.inventory = {
        chocolate: 8,
        vanilla: 4,
        strawberry: 0
      }

      cupcakeShop.restock("vanilla", 10)
      cupcakeShop.restock("strawberry", 3)
      
      expect(cupcakeShop.inventory).to.deep.equal({
        chocolate: 8,
        vanilla: 14,
        strawberry: 3
      })
    });

    it("doesn't add to stock of existing flavors", function(){
      resetShop();

      cupcakeShop.inventory = {
        chocolate: 8,
        vanilla: 4
      }

      cupcakeShop.restock("rhubarb", 6)
      
      expect(cupcakeShop.inventory).to.deep.equal({
        chocolate: 8,
        vanilla: 4
      })
    });

  });

  describe("cupcakeShop.makeSale", function(){

    it("exists", function(){
      expect(cupcakeShop.makeSale).to.be.a("function");
    });

    it("should make a sale", function(){
      resetShop();

      cupcakeShop.inventory = {
        chocolate: 5,
        strawberry: 3
      }

      var saleResult = cupcakeShop.makeSale("chocolate");

      expect(saleResult).to.equal(true);
      expect(cupcakeShop.register).to.equal(3);
      expect(cupcakeShop.inventory).to.deep.equal({
        chocolate: 4,
        strawberry: 3
      })
    });

    it("should not sell an out of stock cupcake", function(){
      resetShop();

      cupcakeShop.inventory = {
        chocolate: 5,
        strawberry: 0
      }

      var saleResult = cupcakeShop.makeSale("strawberry");

      expect(saleResult).to.equal(false);
      expect(cupcakeShop.register).to.equal(0);
      expect(cupcakeShop.inventory).to.deep.equal({
        chocolate: 5,
        strawberry: 0
      })

    });

    it("should not sell an non-existent flavor", function(){
      resetShop();

      cupcakeShop.inventory = {
        chocolate: 5,
        strawberry: 3
      }

      var saleResult = cupcakeShop.makeSale("vanilla");

      expect(saleResult).to.equal(false);
      expect(cupcakeShop.register).to.equal(0);
      expect(cupcakeShop.inventory).to.deep.equal({
        chocolate: 5,
        strawberry: 3
      })
    });

  });

  describe("cupcakeShop.reconcile", function(){

    it("exists", function(){
      expect(cupcakeShop.reconcile).to.be.a("function");
    });

    it("should deposit the register take in the bank account", function(){
      resetShop();

      cupcakeShop.register = 100;
      cupcakeShop.reconcile()

      expect(cupcakeShop.register).to.equal(0);
      expect(cupcakeShop.bank).to.equal(100);

      cupcakeShop.register = 150;
      cupcakeShop.reconcile()

      expect(cupcakeShop.register).to.equal(0);
      expect(cupcakeShop.bank).to.equal(250);
    });

  });

  describe("cupcakeShop.sellsCookies", function(){

    it("exists", function(){
      expect(cupcakeShop.sellsCookies).to.be.a("function");
    });

    it("returns whether or not the store sells cookies", function(){
      expect(cupcakeShop.sellsCookies()).to.equal(false);
    });

  });

});

describe("cupcakeShop.discountSale", function(){

    it("exists", function(){
      expect(cupcakeShop.discountSale).to.be.a("function");
    });

    it("should make a sale, applying the discount", function(){
      resetShop();

      cupcakeShop.inventory = {
        chocolate: 5,
        strawberry: 3
      }

      var saleResult = cupcakeShop.discountSale("chocolate", .5);

      expect(saleResult).to.equal(true);
      expect(cupcakeShop.register).to.equal(1.5);
      expect(cupcakeShop.inventory).to.deep.equal({
        chocolate: 4,
        strawberry: 3
      })
    });

    it("should not sell an out of stock cupcake", function(){
      resetShop();

      cupcakeShop.inventory = {
        chocolate: 5,
        strawberry: 0
      }

      var saleResult = cupcakeShop.discountSale("strawberry");

      expect(saleResult).to.equal(false);
      expect(cupcakeShop.register).to.equal(0);
      expect(cupcakeShop.inventory).to.deep.equal({
        chocolate: 5,
        strawberry: 0
      })

    });

    it("should not sell an non-existent flavor", function(){
      resetShop();

      cupcakeShop.inventory = {
        chocolate: 5,
        strawberry: 3
      }

      var saleResult = cupcakeShop.discountSale("vanilla");

      expect(saleResult).to.equal(false);
      expect(cupcakeShop.register).to.equal(0);
      expect(cupcakeShop.inventory).to.deep.equal({
        chocolate: 5,
        strawberry: 3
      })
    });

  });

 describe("cupcakeShop.bulkRestock", function(){

    it("exists", function(){
      expect(cupcakeShop.bulkRestock).to.be.a("function");
    });

    it("adds number specified to stock of all existing flavors", function(){
      resetShop();

      cupcakeShop.inventory = {
        chocolate: 8,
        vanilla: 4,
        strawberry: 0
      }

      cupcakeShop.bulkRestock(10)
      
      
      expect(cupcakeShop.inventory).to.deep.equal({
        chocolate: 18,
        vanilla: 14,
        strawberry: 10
      })
    });

  });


