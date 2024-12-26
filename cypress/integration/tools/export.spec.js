/* eslint-disable cypress/no-unnecessary-waiting */
// beforeEach(cy.login)

describe('Tools > Export', () => {
    beforeEach( () => {
        cy.visit('/tools/export')
        cy.wait(30000)
    })

    it('Check Export Page', () => {
        // cy.title().should('contain', 'Export')
        // cy.get('.page-title > .d-flex > div').should('contain', 'Export')
        // cy.get('.card-label').should('contain', 'Export File')
        // cy.get('.p-4').should('contain', 'Export your data by downloading it in PDF or Excel format')
    })

    it('Check Export Assets', () => {
        // cy.title().should('contain', 'Export')
        // cy.get('div.css-b62m3t-container > div.css-1s2u09g-control').click({force: true}).type("Assets{enter}", {force: true})
       //  cy.get('[type="radio"].form-check-input').first().check()
        // cy.get('button.btn.btn-sm.btn-primary').contains('Download').click({force: true})
    })

    it('Check Export Asset Status', () => {
        // cy.title().should('contain', 'Export')
        // cy.get('div.css-b62m3t-container > div.css-1s2u09g-control').click({force: true}).type("Asset Status{enter}", {force: true})
       //  cy.get('[type="radio"].form-check-input').first().check()
        // cy.get('button.btn.btn-sm.btn-primary').contains('Download').click({force: true})
    })

    it('Check Export Brands', () => {
        // cy.title().should('contain', 'Export')
        // cy.get('div.css-b62m3t-container > div.css-1s2u09g-control').click({force: true}).type("Brands{enter}", {force: true})
       //  cy.get('[type="radio"].form-check-input').first().check()
        // cy.get('button.btn.btn-sm.btn-primary').contains('Download').click({force: true})
    })

    it('Check Export Categories', () => {
        // cy.title().should('contain', 'Export')
        // cy.get('div.css-b62m3t-container > div.css-1s2u09g-control').click({force: true}).type("Categories{enter}", {force: true})
       //  cy.get('[type="radio"].form-check-input').first().check()
        // cy.get('button.btn.btn-sm.btn-primary').contains('Download').click({force: true})
    })

    it('Check Export Companies', () => {
        // cy.title().should('contain', 'Export')
        // cy.get('div.css-b62m3t-container > div.css-1s2u09g-control').click({force: true}).type("Companies{enter}", {force: true})
       //  cy.get('[type="radio"].form-check-input').first().check()
        // cy.get('button.btn.btn-sm.btn-primary').contains('Download').click({force: true})
    })

    it('Check Export Departments', () => {
        // cy.title().should('contain', 'Export')
        // cy.get('div.css-b62m3t-container > div.css-1s2u09g-control').click({force: true}).type("Departments{enter}", {force: true})
       //  cy.get('[type="radio"].form-check-input').first().check()
        // cy.get('button.btn.btn-sm.btn-primary').contains('Download').click({force: true})
    })

    it('Check Export Employees', () => {
        // cy.title().should('contain', 'Export')
        // cy.get('div.css-b62m3t-container > div.css-1s2u09g-control').click({force: true}).type("Employees{enter}", {force: true})
       //  cy.get('[type="radio"].form-check-input').first().check()
        // cy.get('button.btn.btn-sm.btn-primary').contains('Download').click({force: true})
    })

    it('Check Export Insurance Policies', () => {
        // cy.title().should('contain', 'Export')
        // cy.get('div.css-b62m3t-container > div.css-1s2u09g-control').click({force: true}).type("Insurance Policies{enter}", {force: true})
       //  cy.get('[type="radio"].form-check-input').first().check()
        // cy.get('button.btn.btn-sm.btn-primary').contains('Download').click({force: true})
    })

    it('Check Export Locations', () => {
        // cy.title().should('contain', 'Export')
        // cy.get('div.css-b62m3t-container > div.css-1s2u09g-control').click({force: true}).type("Locations{enter}", {force: true})
       //  cy.get('[type="radio"].form-check-input').first().check()
        // cy.get('button.btn.btn-sm.btn-primary').contains('Download').click({force: true})
    })

    it('Check Export Manufacturers', () => {
        // cy.title().should('contain', 'Export')
        // cy.get('div.css-b62m3t-container > div.css-1s2u09g-control').click({force: true}).type("Manufacturers{enter}", {force: true})
       //  cy.get('[type="radio"].form-check-input').first().check()
        // cy.get('button.btn.btn-sm.btn-primary').contains('Download').click({force: true})
    })

    it('Check Export Models', () => {
        // cy.title().should('contain', 'Export')
        // cy.get('div.css-b62m3t-container > div.css-1s2u09g-control').click({force: true}).type("Models{enter}", {force: true})
       //  cy.get('[type="radio"].form-check-input').first().check()
        // cy.get('button.btn.btn-sm.btn-primary').contains('Download').click({force: true})
    })

    it('Check Export My Asset', () => {
        // cy.title().should('contain', 'Export')
        // cy.get('div.css-b62m3t-container > div.css-1s2u09g-control').click({force: true}).type("My Asset{enter}", {force: true})
       //  cy.get('[type="radio"].form-check-input').first().check()
        // cy.get('button.btn.btn-sm.btn-primary').contains('Download').click({force: true})
    })

    it('Check Export Sub Locations', () => {
        // cy.title().should('contain', 'Export')
        // cy.get('div.css-b62m3t-container > div.css-1s2u09g-control').click({force: true}).type("Sub Locations{enter}", {force: true})
       //  cy.get('[type="radio"].form-check-input').first().check()
        // cy.get('button.btn.btn-sm.btn-primary').contains('Download').click({force: true})
    })

    it('Check Export Supplier', () => {
        // cy.title().should('contain', 'Export')
        // cy.get('div.css-b62m3t-container > div.css-1s2u09g-control').click({force: true}).type("Supplier{enter}", {force: true})
       //  cy.get('[type="radio"].form-check-input').first().check()
        // cy.get('button.btn.btn-sm.btn-primary').contains('Download').click({force: true})
    })

    it('Check Export Types', () => {
        // cy.title().should('contain', 'Export')
        // cy.get('div.css-b62m3t-container > div.css-1s2u09g-control').click({force: true}).type("Supplier{enter}", {force: true})
       //  cy.get('[type="radio"].form-check-input').first().check()
        // cy.get('button.btn.btn-sm.btn-primary').contains('Download').click({force: true})
    })

    it('Check Export Users', () => {
        // cy.title().should('contain', 'Export')
        // cy.get('div.css-b62m3t-container > div.css-1s2u09g-control').click({force: true}).type("Users{enter}", {force: true})
       //  cy.get('[type="radio"].form-check-input').first().check()
        // cy.get('button.btn.btn-sm.btn-primary').contains('Download').click({force: true})
    })

    it('Check Export Warranties', () => {
        // cy.title().should('contain', 'Export')
        // cy.get('div.css-b62m3t-container > div.css-1s2u09g-control').click({force: true}).type("Warranties{enter}", {force: true})
       //  cy.get('[type="radio"].form-check-input').first().check()
        // cy.get('button.btn.btn-sm.btn-primary').contains('Download').click({force: true})
    })

})    