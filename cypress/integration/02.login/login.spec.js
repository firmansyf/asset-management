/* eslint-disable jest/valid-expect */
/* eslint-disable jest/valid-expect-in-promise */
describe('Testing registered user login', () => {
  it('Check Login Page', () => {
    cy.visit('auth/login')
    cy.get('img.h-45px').should('be.visible')
    cy.get('[data-cy=labelLoginEmail]').should('contain', 'Email')
    cy.get('[data-cy=labelLoginPassword]').should('contain', 'Password')
    cy.get('[data-cy=btnLinkForgotPassword]').should('contain', 'Forgot Password')
    // cy.get('.form-check-label').should('contain', 'Remember Me')
    cy.get('input[name="email"]').should('be.visible')
    cy.get('input[name="password"]').should('be.visible')
    // cy.get('input[name="remember"]').should('be.visible')
  })

  it('Check Login Validation', () => {
    cy.visit('auth/login')
    cy.get('input[name="email"]').clear({force: true}).blur({force: true})
    cy.get('div.fv-plugins-message-container > div.fv-help-block').should('contain', 'Email is required')
    cy.get('input[name="email"]').type('test@', {force: true}).blur({force: true})
    cy.get('div.fv-plugins-message-container > div.fv-help-block').should('contain', 'Wrong email format')
    cy.get('input[name="password"]').clear({force: true}).blur({force: true})
    cy.get('div.fv-plugins-message-container > div.fv-help-block').should('contain', 'Password is required')
    cy.get('input[name="password"]').type('Pas', {force: true}).blur({force: true})
    cy.get('div.fv-plugins-message-container > div.fv-help-block').should('contain', 'Minimum characters is 8')
  })

  it('Check Visible or Unvisible Password', () => {
    cy.visit('auth/login')
    cy.get('input[name="password"]').type('Password123567', {force: true}).blur({force: true})
    cy.get('[data-cy=btnVisibility]').click({force: true})
    cy.get('input[name="password"]').clear().type('PassWD9999').invoke('val')
    .then(val=>{
      const myVal = val;
      expect(myVal).to.equal('PassWD9999');
    })
  })

  it('Login and should success and redirect to dashaboard', () => {
    cy.visit('auth/login')
    cy.get('input[name="email"]').type('adila@assetdata.io', {force: true}).blur({force: true})
    cy.get('input[name="password"]').type('Test@123', {force: true}).blur({force: true})
    cy.get('button#kt_sign_in_submit').click({force: true})
    // cy.login('testingaccount@mailinator.com', 'Test@123')
  })

  it('[BUG-87][ASSET] login on edit asset direct to add asset', () => {
    /*
      1. access edit asset screen
      2. logout
      3. login
      4. link directing to Edit Asset without guid, page directing to Add Asset
    */
    cy.login()
    cy.visit('asset-management/all')
    cy.intercept('**/api/**').as('api')
    cy.wait('@api')
    cy.get('[data-cy="editTable"]:first').click({force: true})
    cy.wait('@api')
    cy.contains('Edit Asset').should('exist')
    cy.get('#kt_header_user_menu_toggle').click({force: true})
    cy.get('[data-cy=btnSignOut]').click({force: true})
    cy.wait('@api')
    cy.contains('Email').should('exist')
    cy.contains('Password').should('exist')
    cy.get('input[name="email"]').type('testingaccount@mailinator.com', {force: true}).blur({force: true})
    cy.get('input[name="password"]').type('Test@123', {force: true}).blur({force: true})
    cy.get('button#kt_sign_in_submit').click({force: true})
    cy.wait('@api')
    cy.contains('Edit Asset').should('exist')
  })

  // it("SEN-141 Cannot read properties of undefined (reading 'permissions')", () => {
  //   Cypress.session.clearAllSavedSessions()
  //   cy.login()
  //   cy.visit('dashboard')
  //   cy.intercept('**/api/**').as('api')
  //   cy.wait('@api')
  //   cy.get('#kt_header_user_menu_toggle').click({force: true})
  //   cy.get('[data-cy=btnSignOut]').click({force: true})
  //   expect(localStorage.getItem(Cypress.env('storageKey'))).to.be.null;
  // })
})
