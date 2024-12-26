/* eslint-disable cypress/no-unnecessary-waiting */
beforeEach(cy.login)

describe('Asset Management', () => {
    beforeEach( () => {
        cy.visit('asset-management/move')
        cy.get('[data-cy="table"]').as('assetMoveTable')
    })

    it('Check Asset Table', () => {
        cy.get('@assetMoveTable').find('tbody > tr').should('have.length.greaterThan', 0)
    })

    it('Check Action Table', () => {
        cy.get('@assetMoveTable').find('[data-cy=viewTable]').should('be.visible')
        cy.get('@assetMoveTable').find('[data-cy=checkbokBulk]').should('be.visible')
    })

    it('Check Move Asset Form', () => {
        cy.get(':nth-child(1) > .col-4 > .col-form-label').should('contain', 'Location')
        cy.get(':nth-child(2) > .col-4 > .col-form-label').should('contain', 'Sub Location')
        cy.get(':nth-child(3) > .col-4 > .col-form-label').should('contain', 'Company')
        cy.get(':nth-child(4) > .col-4 > .col-form-label').should('contain', 'Department')
        cy.get('.select-location-cy').should('be.visible')
        cy.get('.select-sublocation-cy').should('be.visible')
        cy.get('.select-company-cy').should('be.visible')
        cy.get('.select-department-cy').should('be.visible')
        cy.get('[data-cy=cancelButton]').should('contain', 'Cancel').and('be.visible')
        cy.get('[data-cy=moveButton]').should('contain', 'Move').and('be.visible')
    })
})

describe('Check Move Asset Validation', () => {
    beforeEach( () => {
        cy.visit('asset-management/move')
        cy.get('[data-cy="table"]').as('assetMoveTable')
    })

    it('Check validation without select asset', () => {
        cy.get('[data-cy=moveButton]').click({force: true})
        // cy.get('.Toastify').should('be.visible')
        // cy.get('.Toastify').should('contain', 'Please select at least one new value to move asset.')
    })

    it('Check validation without select location or company', () => {
        cy.get('[data-cy=checkbokBulkAll]').click({force: true})
        cy.get('[data-cy=moveButton]').click({force: true})
        // cy.get('.Toastify').should('be.visible')
        // cy.get('.Toastify__toast-body').should('contain', 'Please select at least one asset to continue.')
    })

    it('Check validation location without select sub location', () => {
        cy.get('[data-cy=checkbokBulkAll]').click({force: true})
        cy.get('.select-location-cy')
        .click({force:true})
        .find('input#selectLocation')
        .type('jakarta{enter}', {force: true})
        cy.get('[data-cy=moveButton]').click({force: true})
        cy.get('.fv-plugins-message-container').should('contain', 'Sub location is required')
    })

    it('Check validation company without select department', () => {
        cy.get('[data-cy=checkbokBulkAll]').click({force: true})
        cy.get('.select-company-cy')
        .click({force:true})
        .find('input#selectCompany')
        .type('test{enter}', {force: true})
        cy.get('[data-cy=moveButton]').click({force: true})
        cy.get('.fv-plugins-message-container').should('contain', 'Department is required')
    })
})

describe('Check Move Asset', () => {
    beforeEach( () => {
        cy.visit('asset-management/move')
        cy.get('[data-cy="table"]').as('assetMoveTable')
    })

    it('Check Move Asset Location & Sub Location', () => {
        cy.get('@assetMoveTable')
        .find('tbody > tr.align-middle').filter(':contains("ABC00001")')
        .find('[data-cy=checkbokBulk]:first').click({force: true})

        cy.get('.select-location-cy')
        .click({force:true})
        .find('input#selectLocation')
        .type('Jakarta{enter}', {force: true})
        cy.get('.select-sublocation-cy')
        .click({force:true})
        .find('input#selectSubLocation')
        .type('Test{enter}', {force: true})
        cy.get('[data-cy=moveButton]').click({force: true})
    })

    it('Check Move Asset Company & Department', () => {
        cy.get('@assetMoveTable')
        .find('tbody > tr.align-middle').filter(':contains("ABC00001")')
        .find('[data-cy=checkbokBulk]:first').click({force: true})

        cy.get('.select-company-cy')
        .click({force:true})
        .find('input#selectCompany')
        .type('test{enter}', {force: true})
        cy.get('.select-department-cy')
        .click({force:true})
        .find('input#selectDepartment')
        .type('Dep{enter}', {force: true})

        cy.get('[data-cy=moveButton]').click({force: true})
    })

    it('Check Complit Move Asset', () => {
        cy.get('@assetMoveTable')
        .find('tbody > tr.align-middle').filter(':contains("ABC00001")')
        .find('[data-cy=checkbokBulk]:first').click({force: true})

        cy.get('.select-location-cy')
        .click({force:true})
        .find('input#selectLocation')
        .type('Jakarta{enter}', {force: true})
        cy.get('.select-sublocation-cy')
        .click({force:true})
        .find('input#selectSubLocation')
        .type('test{enter}', {force: true})

        cy.get('.select-company-cy')
        .click({force:true})
        .find('input#selectCompany')
        .type('test{enter}', {force: true})  
        cy.get('.select-department-cy')
        .click({force:true})
        .find('input#selectDepartment')
        .type('dep{enter}', {force: true})

        cy.get('[data-cy=moveButton]').click({force: true})
    })
})
