/* eslint-disable no-undef */
describe('logging in',function () {
  beforeEach (function (){
    const user = {
      name:"Mekbib",
      username:"kazuma",
      password:"thePower"
    }
    cy.request('DELETE','http://localhost:3003/OdinBook/reset')
    cy.request('POST','http://localhost:3003/OdinBook/user',user)
  })
  it("succesfully logs in with correct credintials", function (){
   cy.visit('/')

   cy.get('#username').type("kazuma")
   cy.get('#password').type("thePower")
   cy.get('#login').click()
   
   cy.contains('kazuma is logged in')
  })
})